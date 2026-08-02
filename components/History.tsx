"use client";

import React from "react";
import { Clock, Trash2, ArrowUpRight, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DownloadHistoryItem } from "../types";
import toast from "react-hot-toast";

interface HistoryProps {
  history: DownloadHistoryItem[];
  onSelectUrl: (url: string) => void;
  onRemoveItem: (id: string) => void;
  onClearHistory: () => void;
}

export default function History({
  history,
  onSelectUrl,
  onRemoveItem,
  onClearHistory,
}: HistoryProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("YouTube URL copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (history.length === 0) return null;

  return (
    <div className="mt-16 w-full rounded-[18px] border border-white/[0.04] bg-zinc-900/20 p-6 backdrop-blur-sm sm:p-8">
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-white">Recent Downloads</h3>
        </div>
        <button
          onClick={onClearHistory}
          className="text-xs font-semibold text-zinc-500 transition-colors hover:text-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
        >
          Clear All
        </button>
      </div>

      <div className="max-h-[380px] overflow-y-auto pr-1 space-y-3">
        <AnimatePresence initial={false}>
          {history.map((item) => (
            <motion.div
              key={item.id + item.downloadedAt}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/[0.04] bg-[#18181B]/40 p-4 transition-all hover:border-white/[0.08] hover:bg-[#18181B]/80 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Left Side: Thumbnail & Title */}
              <div className="flex items-start gap-3 sm:items-center min-w-0 flex-1">
                {/* Thumbnail */}
                <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-800 border border-white/[0.05]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[9px] font-mono font-medium text-white">
                    {item.durationString}
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors duration-150">
                    {item.title}
                  </h4>
                  <p className="truncate text-xs text-zinc-500 mt-0.5">
                    {item.uploader}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400 border border-white/[0.03]">
                      {item.type === "video" ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                          Video
                        </>
                      ) : (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Audio
                        </>
                      )}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 border border-white/[0.03]">
                      {item.format.toUpperCase()}
                    </span>
                    {item.type === "video" ? (
                      <span className="inline-flex items-center rounded-md bg-zinc-850 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 border border-white/[0.03]">
                        {item.quality}p
                      </span>
                    ) : (
                      item.format === "mp3" && (
                        <span className="inline-flex items-center rounded-md bg-zinc-850 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 border border-white/[0.03]">
                          {item.quality} kbps
                        </span>
                      )
                    )}
                    <span className="text-[10px] text-zinc-500">
                      {formatDate(item.downloadedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Actions */}
              <div className="flex items-center justify-end gap-2 shrink-0 self-end sm:self-center border-t border-white/[0.03] pt-3 sm:border-t-0 sm:pt-0">
                <button
                  onClick={() => copyToClipboard(`https://youtube.com/watch?v=${item.id}`, item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.03] bg-zinc-900/60 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                  title="Copy Video URL"
                >
                  {copiedId === item.id ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>

                <button
                  onClick={() => onSelectUrl(`https://youtube.com/watch?v=${item.id}`)}
                  className="flex h-8 items-center gap-1 rounded-lg border border-white/[0.03] bg-zinc-900/60 px-3 text-xs font-semibold text-green-400 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  Redownload <ArrowUpRight className="h-3 w-3" />
                </button>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.03] bg-zinc-900/60 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-red-400"
                  title="Remove from history"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
