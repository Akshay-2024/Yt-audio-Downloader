import { NextResponse } from "next/server";
import { getVideoInfo, validateYoutubeUrl } from "@/lib/yt-dlp";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    // Get client IP and check rate limit
    const ip = getClientIp(req);
    const limiter = rateLimit(ip, 20, 60 * 1000); // 20 requests per minute

    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    if (!url) {
      return NextResponse.json(
        { error: "URL query parameter is required." },
        { status: 400 }
      );
    }

    if (!validateYoutubeUrl(url)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL. Please paste a valid YouTube video or short link." },
        { status: 400 }
      );
    }

    const info = await getVideoInfo(url);
    return NextResponse.json(info);
  } catch (error: any) {
    console.error("Error in /api/info:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve video information." },
      { status: 500 }
    );
  }
}
