import { NextResponse } from "next/server";
import { downloadAudio, validateYoutubeUrl } from "@/lib/yt-dlp";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const format = searchParams.get("format") || "mp3";
    const quality = searchParams.get("quality") || "320";

    // Validate parameters
    if (!url || !validateYoutubeUrl(url)) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    if (format !== "mp3" && format !== "m4a") {
      return NextResponse.json({ error: "Invalid format. Supported formats: mp3, m4a" }, { status: 400 });
    }

    if (!["128", "192", "256", "320"].includes(quality)) {
      return NextResponse.json({ error: "Invalid quality selection" }, { status: 400 });
    }

    // Rate limiting
    const ip = getClientIp(req);
    const limiter = rateLimit(ip, 30, 60 * 60 * 1000); // 30 downloads per hour per IP

    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many downloads. Limit is 30 downloads per hour." },
        { status: 429 }
      );
    }

    const fileId = crypto.randomUUID();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: any) => {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          } catch (e) {
            // Controller might be closed
          }
        };

        // Send initial heartbeat
        send({ percent: 5, step: "metadata", message: "Initializing download..." });

        try {
          await downloadAudio(
            url,
            format as any,
            quality as any,
            fileId,
            (percent, stepMessage) => {
              let stepType: any = "downloading";
              if (percent >= 85) stepType = "converting";
              if (percent >= 95) stepType = "preparing";
              if (percent === 100) stepType = "finished";

              send({
                percent,
                step: stepType,
                message: stepMessage,
              });
            }
          );

          // Finished successfully
          send({
            percent: 100,
            step: "finished",
            message: "Download Ready",
            fileId,
          });
        } catch (err: any) {
          console.error(`Download process failed for ${url}:`, err);
          send({
            percent: 0,
            step: "error",
            message: err.message || "Failed to download and convert video audio.",
            error: err.message || "Unknown error",
          });
        } finally {
          try {
            controller.close();
          } catch (e) {
            // Already closed
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Error in /api/download:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
