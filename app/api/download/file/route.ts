import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { tempDir } from "@/lib/yt-dlp";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const title = searchParams.get("title") || "audio";

    if (!id) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }

    // Security check: ensure id is a valid UUID to prevent directory traversal
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid File ID" }, { status: 400 });
    }

    // Find the file in temp-downloads
    const files = fs.readdirSync(tempDir);
    const fileName = files.find(f => f.startsWith(id));

    if (!fileName) {
      return NextResponse.json({ error: "File not found or expired." }, { status: 404 });
    }

    const filePath = path.join(tempDir, fileName);
    const ext = path.extname(fileName); // e.g. .mp3 or .m4a

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    const stats = fs.statSync(filePath);
    const fileStream = fs.createReadStream(filePath);

    // Sanitize filename for content-disposition header
    const sanitizedTitle = title
      .replace(/[\\/:*?"<>|]/g, "") // remove characters forbidden in Windows filenames
      .trim() || "audio";

    // Set correct Content-Type
    const contentType = ext === ".mp3" ? "audio/mpeg" : "audio/mp4";

    // Standard way to handle unicode characters in content-disposition
    const encodedFilename = encodeURIComponent(sanitizedTitle + ext);
    const contentDisposition = `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`;

    // Convert node read stream to readable web stream
    const webStream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });

        fileStream.on("end", () => {
          controller.close();
          // Proactively delete file after download completes
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Failed to delete temp file ${filePath}:`, err);
            } else {
              console.log(`Successfully deleted temp file: ${filePath}`);
            }
          });
        });

        fileStream.on("error", (err) => {
          console.error(`Stream error for file ${filePath}:`, err);
          controller.error(err);
          // Delete file on error
          fs.unlink(filePath, () => {});
        });
      },
      cancel() {
        fileStream.destroy();
        // Delete file if user cancels download
        fs.unlink(filePath, () => {});
      }
    });

    return new Response(webStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": stats.size.toString(),
        "Content-Disposition": contentDisposition,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Error in /api/download/file:", error);
    return NextResponse.json({ error: error.message || "Failed to download file" }, { status: 500 });
  }
}
