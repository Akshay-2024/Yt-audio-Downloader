"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  Download,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Clipboard,
  X,
  RefreshCw,
  Video,
  Clock,
  Eye,
  Calendar,
  Share2,
  Play,
} from "lucide-react";
import toast from "react-hot-toast";
import { VideoInfo, VideoFormat, VideoQuality, DownloadStep, DownloadProgress } from "../types";
import { validateYoutubeUrl } from "@/lib/validation";

interface VideoDownloadCardProps {
  initialUrl?: string;
  onAddHistory: (item: {
    id: string;
    title: string;
    uploader: string;
    durationString: string;
    thumbnail: string;
    format: VideoFormat;
    quality: VideoQuality;
    fileId: string;
    type: "audio" | "video";
  }) => void;
}

export default function VideoDownloadCard({ initialUrl = "", onAddHistory }: VideoDownloadCardProps) {
  const [url, setUrl] = useState(initialUrl);
  const [step, setStep] = useState<DownloadStep>("idle");
  const [metadata, setMetadata] = useState<VideoInfo | null>(null);
  
  // Downloader Settings
  const [format, setFormat] = useState<VideoFormat>("mp4");
  const [quality, setQuality] = useState<VideoQuality>("720");
  
  // Progress and errors
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [fileId, setFileId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // References
  const eventSourceRef = useRef<EventSource | null>(null);

  // Sync initial URL if updated from parent
  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
      handleFetch(initialUrl);
      const element = document.getElementById("downloader-card");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [initialUrl]);

  // Clean up SSE connections on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        document.getElementById("yt-url")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleClear = () => {
    setUrl("");
    setStep("idle");
    setMetadata(null);
    setErrorMessage("");
    setProgress(0);
    setProgressMessage("");
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text);
          toast.success("Pasted from clipboard!");
          if (validateYoutubeUrl(text)) {
            handleFetch(text);
          }
        }
      } else {
        toast.error("Clipboard reading not supported in this browser. Use Ctrl+V.");
      }
    } catch (err) {
      toast.error("Could not paste clipboard. Please copy a link and use Ctrl+V.");
    }
  };

  const handleFetch = async (targetUrl = url) => {
    const trimmedUrl = targetUrl.trim();
    if (!trimmedUrl) {
      toast.error("Please paste a YouTube URL first!");
      return;
    }

    if (!validateYoutubeUrl(trimmedUrl)) {
      toast.error("Invalid YouTube URL. Please check your link.");
      setStep("error");
      setErrorMessage("Invalid YouTube URL. Make sure it is a valid video or shorts link.");
      return;
    }

    setStep("validate");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/info?url=${encodeURIComponent(trimmedUrl)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to retrieve video metadata");
      }

      setMetadata(data);
      setStep("metadata");
      toast.success("Video info retrieved successfully!");
    } catch (err: any) {
      console.error("Fetch error:", err);
      setStep("error");
      setErrorMessage(err.message || "Failed to load video metadata. The video might be private, deleted, or region-restricted.");
      toast.error("Failed to load video details.");
    }
  };

  const startDownload = async () => {
    if (!metadata) return;
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setStep("downloading");
    setProgress(0);
    setProgressMessage("Connecting to video downloader server...");

    const downloadUrl = `/api/download/video?url=${encodeURIComponent(metadata.url)}&format=${format}&quality=${quality}`;
    
    const eventSource = new EventSource(downloadUrl);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data: DownloadProgress = JSON.parse(event.data);
        
        if (data.step === "error") {
          eventSource.close();
          setStep("error");
          setErrorMessage(data.error || "Video processing failed on the server.");
          toast.error("Download failed.");
          return;
        }

        setProgress(data.percent);
        setProgressMessage(data.message);

        if (data.step === "finished" && data.fileId) {
          eventSource.close();
          setFileId(data.fileId);
          setStep("finished");
          toast.success("Video download completed! Your file is ready.");
          
          onAddHistory({
            id: metadata.id,
            title: metadata.title,
            uploader: metadata.uploader,
            durationString: metadata.durationString,
            thumbnail: metadata.thumbnail,
            format,
            quality,
            fileId: data.fileId,
            type: "video",
          });
        }
      } catch (err) {
        console.error("SSE message parsing error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource error:", err);
      eventSource.close();
      setStep("error");
      setErrorMessage("Network connection to downloader lost. Please retry.");
      toast.error("Download stream disconnected.");
    };
  };

  const triggerSaveFile = () => {
    if (!fileId || !metadata) return;
    
    const downloadLink = `/api/download/file?id=${fileId}&title=${encodeURIComponent(metadata.title)}`;
    
    const a = document.createElement("a");
    a.href = downloadLink;
    a.download = `${metadata.title}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Saving video to your device!");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const text = e.dataTransfer.getData("text");
    if (text) {
      setUrl(text);
      if (validateYoutubeUrl(text)) {
        handleFetch(text);
      } else {
        toast.error("Dropped text is not a valid YouTube URL");
      }
    }
  };

  const shareLink = () => {
    if (navigator.share && metadata) {
      navigator
        .share({
          title: metadata.title,
          text: `Download video "${metadata.title}" by ${metadata.uploader} instantly!`,
          url: window.location.href,
        })
        .then(() => toast.success("Shared successfully!"))
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("YT Video URL copied to clipboard!");
    }
  };

  return (
    <div
      id="downloader-card"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full rounded-[18px] border transition-all duration-300 ${
        isDragging
          ? "border-red-500 bg-red-500/5 shadow-2xl shadow-red-500/10 scale-[1.01]"
          : "border-white/[0.04] bg-[#18181B] shadow-2xl shadow-black/50"
      } p-6 sm:p-8`}
    >
      {/* Drag & Drop Overlay Hint */}
      {isDragging && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-[18px] bg-[#18181B]/95 pointer-events-none border-2 border-dashed border-red-500">
          <Download className="h-12 w-12 text-red-500 animate-bounce mb-3" />
          <h3 className="text-xl font-bold text-white">Drop YouTube Link Here</h3>
          <p className="text-sm text-zinc-500 mt-1">Release to auto-fetch video details</p>
        </div>
      )}

      {/* Input Section */}
      <div className="flex flex-col gap-4">
        <label htmlFor="yt-url" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Enter YouTube Video Link
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-4 text-zinc-500">
            <Link2 className="h-5 w-5" />
          </div>
          
          <input
            id="yt-url"
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="Paste YouTube URL... (e.g. https://www.youtube.com/watch?v=...)"
            disabled={step === "validate" || step === "downloading"}
            className="w-full rounded-xl border border-white/[0.05] bg-zinc-900/60 py-3.5 pl-12 pr-28 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-red-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-red-500/20 disabled:opacity-60"
            onKeyDown={(e) => {
              if (e.key === "Enter" && step !== "validate" && step !== "downloading") {
                handleFetch();
              }
            }}
          />

          {/* Quick Actions (Paste/Clear) Inside Input */}
          <div className="absolute right-3 flex items-center gap-1.5">
            {url && (
              <button
                type="button"
                onClick={handleClear}
                disabled={step === "validate" || step === "downloading"}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
                title="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handlePaste}
              disabled={step === "validate" || step === "downloading"}
              className="flex items-center gap-1 rounded-lg border border-white/[0.03] bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
              title="Paste from clipboard"
            >
              <Clipboard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Paste</span>
            </button>
          </div>
        </div>

        {/* Action Button */}
        {step === "idle" || step === "error" || step === "validate" ? (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleFetch()}
            disabled={step === "validate" || !url.trim()}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none"
          >
            {step === "validate" ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Validating Link...
              </>
            ) : (
              <>
                <Video className="h-4 w-4" />
                Fetch Video Details
              </>
            )}
          </motion.button>
        ) : null}
      </div>

      {/* Dynamic Content Panel */}
      <AnimatePresence mode="wait">
        {/* SKELETON LOADER FOR FETCHING METADATA */}
        {step === "validate" && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mt-8 space-y-6"
          >
            <div className="flex flex-col gap-6 sm:flex-row">
              {/* Thumbnail Skeleton */}
              <div className="h-32 w-full rounded-xl animate-shimmer sm:w-48 shrink-0" />
              {/* Details Skeleton */}
              <div className="flex-1 space-y-3.5">
                <div className="h-5 w-3/4 rounded-md animate-shimmer" />
                <div className="h-4 w-1/2 rounded-md animate-shimmer" />
                <div className="flex gap-4 pt-2">
                  <div className="h-4 w-20 rounded-md animate-shimmer" />
                  <div className="h-4 w-20 rounded-md animate-shimmer" />
                </div>
              </div>
            </div>
            {/* Setting Skeleton */}
            <div className="h-28 w-full rounded-xl animate-shimmer" />
          </motion.div>
        )}

        {/* METADATA PANEL & OPTIONS */}
        {step === "metadata" && metadata && (
          <motion.div
            key="metadata-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mt-8 space-y-6"
          >
            {/* Video Meta Info */}
            <div className="flex flex-col gap-5 sm:flex-row">
              {/* Thumbnail Container */}
              <div className="relative w-full rounded-xl overflow-hidden aspect-video sm:w-48 sm:h-28 bg-zinc-950 border border-white/[0.05] shrink-0">
                <img
                  src={metadata.thumbnail}
                  alt={metadata.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 text-xs font-mono font-bold text-white flex items-center gap-1 shadow-md">
                  <Clock className="h-3.5 w-3.5 text-red-500" />
                  {metadata.durationString}
                </div>
              </div>

              {/* Title & Metadata details */}
              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2 hover:line-clamp-none transition-all">
                    {metadata.title}
                  </h3>
                  <p className="text-sm font-semibold text-red-500 mt-1 sm:mt-0.5">
                    {metadata.uploader}
                  </p>
                </div>
                
                {/* Meta details list */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 sm:mt-0 text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-zinc-600" />
                    {new Intl.NumberFormat().format(metadata.viewCount)} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-zinc-600" />
                    Published {metadata.uploadDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Downloader Settings Config Panel */}
            <div className="rounded-[14px] bg-[#18181B]/80 border border-white/[0.03] p-4 space-y-4">
              {/* Format Toggle */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Select Video Format
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormat("mp4")}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${
                      format === "mp4"
                        ? "bg-zinc-900 border-red-500/40 text-red-400 shadow-md shadow-red-500/5"
                        : "bg-zinc-950/40 border-white/[0.03] text-zinc-400 hover:bg-zinc-900/60"
                    }`}
                  >
                    MP4 (Highly Compatible)
                  </button>
                  <button
                    onClick={() => setFormat("webm")}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${
                      format === "webm"
                        ? "bg-zinc-900 border-red-500/40 text-red-400 shadow-md shadow-red-500/5"
                        : "bg-zinc-950/40 border-white/[0.03] text-zinc-400 hover:bg-zinc-900/60"
                    }`}
                  >
                    WebM (Modern & Optimized)
                  </button>
                </div>
              </div>

              {/* Quality Settings Grid */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
                  <span>Select Quality / Resolution</span>
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(["360", "480", "720", "1080"] as VideoQuality[]).map((q) => {
                    const qualityLabels: Record<string, string> = {
                      "360": "LQ / 360p",
                      "480": "SD / 480p",
                      "720": "HD / 720p",
                      "1080": "Full HD / 1080p",
                    };
                    const isSelected = quality === q;
                    return (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg border transition-all ${
                          isSelected
                            ? "bg-zinc-900 border-red-500/40 text-red-400 shadow-md"
                            : "bg-zinc-950/40 border-white/[0.03] text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-300"
                        }`}
                      >
                        <span className="text-sm font-extrabold">{q}p</span>
                        <span className="text-[9px] mt-0.5 opacity-80">{qualityLabels[q]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Execute Download Button */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={startDownload}
                className="flex-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 font-bold text-white shadow-lg shadow-red-500/25 transition-all hover:brightness-110"
              >
                <Download className="h-4.5 w-4.5" />
                Merge & Download {format.toUpperCase()}
              </motion.button>
              
              <button
                onClick={shareLink}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.05] bg-zinc-900 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                title="Share this tool"
              >
                <Share2 className="h-4.5 w-4.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* PROGRESS LOADER VIEW */}
        {step === "downloading" && (
          <motion.div
            key="progress-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 rounded-xl bg-zinc-900/60 border border-white/[0.03] p-6 space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                <Play className="h-5 w-5 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-white truncate">
                  Processing Video Stream
                </h4>
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  {metadata?.title}
                </p>
              </div>
            </div>

            {/* Progress Bar & Percentage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-red-500 animate-pulse">{progressMessage}</span>
                <span className="text-white font-mono">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden border border-white/[0.02]">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                  className="h-full bg-gradient-to-r from-red-400 to-rose-500 rounded-full"
                />
              </div>
            </div>

            <p className="text-center text-[10px] text-zinc-500">
              Please keep this page open. Merging audio and high-resolution video streams can take a minute.
            </p>
          </motion.div>
        )}

        {/* SUCCESS PANEL */}
        {step === "finished" && metadata && (
          <motion.div
            key="success-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 rounded-xl bg-red-500/5 border border-red-500/25 p-6 text-center space-y-6"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5 mb-3">
                <CheckCircle2 className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Video Download Ready</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto truncate">
                {metadata.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="rounded bg-red-500/10 border border-red-500/30 px-1.5 py-0.5 text-[10px] font-extrabold text-red-400">
                  {format.toUpperCase()}
                </span>
                <span className="text-[10px] text-zinc-500 font-semibold">
                  {quality}p Quality
                </span>
              </div>
            </div>

            {/* Save Buttons & Action */}
            <div className="flex gap-2 max-w-md mx-auto">
              <button
                onClick={triggerSaveFile}
                className="flex-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:brightness-110"
              >
                <Download className="h-4.5 w-4.5" />
                Save {format.toUpperCase()} Video
              </button>
              
              <button
                onClick={() => setStep("metadata")}
                className="h-12 px-5 rounded-xl border border-white/[0.05] bg-zinc-900 text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Back
              </button>
            </div>
          </motion.div>
        )}

        {/* ERROR STATE */}
        {step === "error" && (
          <motion.div
            key="error-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 rounded-xl bg-red-500/5 border border-red-500/25 p-6 space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white">Download Error</h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>

            {/* Retry Button */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleClear}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-900 border border-white/[0.04] text-zinc-400 hover:text-white transition-colors"
              >
                Clear Link
              </button>
              <button
                onClick={() => (metadata ? startDownload() : handleFetch())}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry Process
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
