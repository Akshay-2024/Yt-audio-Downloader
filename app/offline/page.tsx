"use client";

import React from "react";
import { WifiOff, RefreshCw, Music } from "lucide-react";
import { motion } from "framer-motion";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090B] px-4 text-center">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-[18px] border border-white/[0.04] bg-[#18181B] p-8 shadow-2xl shadow-black/50"
      >
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
            <WifiOff className="h-8 w-8" />
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Connection Lost
        </h1>
        
        <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
          It looks like you are offline. YT Audio Downloader requires an active internet connection to validate YouTube links and convert audio streams.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleRetry}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:brightness-110"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          
          <a
            href="/"
            className="flex h-12 w-full items-center justify-center rounded-xl border border-white/[0.05] bg-zinc-900 text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
          >
            Go Home
          </a>
        </div>
      </motion.div>

      <div className="mt-8 flex items-center gap-2 text-zinc-600 text-xs">
        <Music className="h-4 w-4" />
        <span>YT Audio Downloader Pro</span>
      </div>
    </div>
  );
}
