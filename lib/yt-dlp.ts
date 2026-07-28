import { spawn, exec } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import { VideoInfo, AudioFormat, AudioQuality } from "../types";

export const tempDir = path.join(os.tmpdir(), "yt-audio-downloads");

// Ensure the temporary directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

import { validateYoutubeUrl, extractVideoId } from "./validation";
export { validateYoutubeUrl, extractVideoId };

function formatDate(dateStr?: string): string {
  if (!dateStr || dateStr.length !== 8) return "Unknown date";
  const year = dateStr.substring(0, 4);
  const monthIdx = parseInt(dateStr.substring(4, 6), 10) - 1;
  const day = parseInt(dateStr.substring(6, 8), 10);
  
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  return `${months[monthIdx] || "Jan"} ${day}, ${year}`;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  const parts = [];
  if (h > 0) parts.push(h);
  parts.push(h > 0 ? String(m).padStart(2, "0") : m);
  parts.push(String(s).padStart(2, "0"));
  
  return parts.join(":");
}

function getSpawnEnv(): NodeJS.ProcessEnv {
  const spawnEnv = { ...process.env };
  const pathKey = Object.keys(spawnEnv).find(k => k.toLowerCase() === "path") || "PATH";
  let currentPath = spawnEnv[pathKey] || "";

  // Add custom FFmpeg path if it exists
  const customFfmpegPath = "C:\\ffmpeg-8.0.1-essentials_build\\bin";
  if (fs.existsSync(customFfmpegPath) && !currentPath.includes(customFfmpegPath)) {
    currentPath = `${customFfmpegPath};${currentPath}`;
  }

  // Add custom Python Scripts path (where yt-dlp is located) if it exists
  const customPythonScriptsPath = "C:\\Users\\1aksh\\AppData\\Local\\Programs\\Python\\Python313\\Scripts";
  if (fs.existsSync(customPythonScriptsPath) && !currentPath.includes(customPythonScriptsPath)) {
    currentPath = `${customPythonScriptsPath};${currentPath}`;
  }

  // Add standard fallback paths where Python scripts might be installed for 1aksh
  const fallbackPythonPath = "C:\\Users\\1aksh\\AppData\\Roaming\\Python\\Python313\\Scripts";
  if (fs.existsSync(fallbackPythonPath) && !currentPath.includes(fallbackPythonPath)) {
    currentPath = `${fallbackPythonPath};${currentPath}`;
  }

  spawnEnv[pathKey] = currentPath;
  return spawnEnv;
}

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  return new Promise((resolve, reject) => {
    if (!validateYoutubeUrl(url)) {
      return reject(new Error("Invalid YouTube URL"));
    }

    const args = ["--dump-json", "--no-playlist", "--impersonate", "chrome", url];
    if (process.env.PROXY_URL) {
      args.push("--proxy", process.env.PROXY_URL);
    }

    const ytDlp = spawn("yt-dlp", args, { env: getSpawnEnv() });
    
    // Set a 45-second timeout to prevent the process from hanging indefinitely
    const timeout = setTimeout(() => {
      ytDlp.kill("SIGKILL");
      reject(new Error("Video retrieval timed out. YouTube took too long to respond."));
    }, 45000);
    
    let stdout = "";
    let stderr = "";

    ytDlp.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    ytDlp.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    ytDlp.on("error", (err) => {
      clearTimeout(timeout);
      console.error("Failed to start yt-dlp process:", err);
      reject(new Error("yt-dlp executable not found on the server. Please ensure yt-dlp is installed and in the system path."));
    });

    ytDlp.on("close", (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        console.error(`yt-dlp metadata failed with exit code ${code}. Stderr: ${stderr}`);
        
        // Parse friendly errors from stderr
        const errLower = stderr.toLowerCase();
        if (errLower.includes("private video")) {
          reject(new Error("This video is private and cannot be downloaded."));
        } else if (errLower.includes("unavailable") || errLower.includes("deleted")) {
          reject(new Error("This video is unavailable or has been deleted."));
        } else if (errLower.includes("confirm your age") || errLower.includes("sign in") || errLower.includes("age-restricted")) {
          reject(new Error("This video is age-restricted or requires authentication."));
        } else if (errLower.includes("unsupported url")) {
          reject(new Error("This URL is not supported by yt-dlp."));
        } else if (errLower.includes("network") || errLower.includes("connection")) {
          reject(new Error("Network error while reaching YouTube. Please try again."));
        } else if (errLower.includes("403") || errLower.includes("forbidden") || errLower.includes("captcha") || errLower.includes("robot") || errLower.includes("block")) {
          reject(new Error("Access blocked by YouTube. The hosted server's IP address is blocked. Please run the application locally or configure a proxy."));
        } else {
          reject(new Error("Failed to retrieve video information. Please check the URL and try again."));
        }
        return;
      }

      try {
        const data = JSON.parse(stdout);
        
        // Find best thumbnail
        let thumbnail = data.thumbnail || "";
        if (data.thumbnails && data.thumbnails.length > 0) {
          // Sort or pick the last one (usually highest quality)
          thumbnail = data.thumbnails[data.thumbnails.length - 1].url;
        }

        resolve({
          id: data.id,
          title: data.title || "Unknown Title",
          uploader: data.uploader || data.channel || "Unknown Channel",
          duration: data.duration || 0,
          durationString: formatDuration(data.duration),
          viewCount: data.view_count || 0,
          uploadDate: formatDate(data.upload_date),
          thumbnail: thumbnail,
          url: url,
        });
      } catch (err) {
        console.error("Failed to parse yt-dlp metadata JSON:", err);
        reject(new Error("Failed to parse video metadata."));
      }
    });
  });
}

export function downloadAudio(
  url: string,
  format: AudioFormat,
  quality: AudioQuality,
  fileId: string,
  onProgress: (percent: number, step: string) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Select best audio stream, extract audio, convert to specified format and quality
    const args = [
      "-f", format === "m4a" ? "ba[ext=m4a]/bestaudio" : "bestaudio",
      "-x",
      "--audio-format", format,
      "--impersonate", "chrome",
    ];

    if (format === "mp3") {
      args.push("--audio-quality", `${quality}k`);
    }

    // Set output template. We'll use fileId as the base name.
    const outputPath = path.join(tempDir, `${fileId}.%(ext)s`);
    args.push("-o", outputPath);

    // Add proxy if configured
    if (process.env.PROXY_URL) {
      args.push("--proxy", process.env.PROXY_URL);
    }
    
    // Add URL
    args.push(url);

    console.log(`Spawning: yt-dlp ${args.join(" ")}`);
    const proc = spawn("yt-dlp", args, { env: getSpawnEnv() });

    // Set a 3-minute timeout to prevent downloading/transcoding from hanging forever
    const timeout = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new Error("Audio download/conversion timed out. The process took too long."));
    }, 180000);

    let progressPercent = 0;
    let currentStep = "Fetching metadata...";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      const line = data.toString();
      
      // Parse progress percent from download log
      // Format: [download]  12.3% of 10.00MiB...
      const downloadMatch = line.match(/\[download\]\s+(\d+(?:\.\d+)?)%/);
      if (downloadMatch) {
        progressPercent = parseFloat(downloadMatch[1]);
        // Map 0-100% of download to 0-80% of our visual progress bar
        const scaledPercent = Math.round(progressPercent * 0.8);
        currentStep = `Downloading audio... (${progressPercent.toFixed(1)}%)`;
        onProgress(scaledPercent, currentStep);
      }

      // Detect audio extraction/conversion step
      if (line.includes("[ExtractAudio]") || line.includes("[ffmpeg]")) {
        currentStep = "Converting audio to " + format.toUpperCase() + "...";
        onProgress(85, currentStep);
      }

      if (line.includes("Destination:") && line.includes(format)) {
        onProgress(90, "Finishing conversion...");
      }
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("error", (err) => {
      clearTimeout(timeout);
      console.error("Failed to start yt-dlp process:", err);
      reject(new Error("yt-dlp executable not found on the server. Please ensure yt-dlp is installed and in the system path."));
    });

    proc.on("close", (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        console.error(`yt-dlp download failed: code ${code}, stderr: ${stderr}`);
        reject(new Error("Audio extraction or conversion failed."));
        return;
      }

      // Check if file exists in tempDir with the expected extension
      const finalFilePath = path.join(tempDir, `${fileId}.${format}`);
      if (fs.existsSync(finalFilePath)) {
        onProgress(100, "Finished");
        resolve(`${fileId}.${format}`);
      } else {
        // Sometimes yt-dlp might output to a slightly different name or fail silently
        // Let's check files matching the fileId in the tempDir
        const files = fs.readdirSync(tempDir);
        const matchingFile = files.find(f => f.startsWith(fileId));
        if (matchingFile) {
          onProgress(100, "Finished");
          resolve(matchingFile);
        } else {
          reject(new Error("Output file could not be found."));
        }
      }
    });
  });
}
