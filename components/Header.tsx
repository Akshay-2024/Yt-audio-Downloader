"use client";

import React from "react";
import { Music, Video, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

interface HeaderProps {
  onScrollToDownloader: () => void;
  activeTab?: "audio" | "video";
}

export default function Header({ onScrollToDownloader, activeTab = "audio" }: HeaderProps) {
  const toggleTheme = () => {
    toast.success("Premium dark mode is active by default!", {
      icon: "🌙",
      style: {
        background: "#18181B",
        color: "#FAFAFA",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
      },
    });
  };

  const isVideo = activeTab === "video";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#09090B]/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={isVideo ? "/video" : "/"} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${
            isVideo 
              ? "from-red-500 to-rose-600 shadow-red-500/20" 
              : "from-emerald-400 to-green-600 shadow-green-500/20"
          }`}>
            {isVideo ? (
              <Video className="h-5 w-5 text-white animate-pulse" />
            ) : (
              <Music className="h-5 w-5 text-white animate-pulse" />
            )}
          </div>
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
            {isVideo ? "YT Video" : "YT Audio"}
          </span>
          <span className={`hidden sm:inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${
            isVideo 
              ? "border-red-500/30 bg-red-500/10 text-red-400" 
              : "border-green-500/30 bg-green-500/10 text-green-400"
          }`}>
            Pro
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              !isVideo ? "text-green-400" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Music className="h-4 w-4" />
            Audio Downloader
          </Link>
          <Link
            href="/video"
            className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              isVideo ? "text-red-400" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Video className="h-4 w-4" />
            Video Downloader
          </Link>
          <a
            href="#features"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Features
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            FAQ
          </a>
        </nav>

        {/* Right Section / CTA */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.05] bg-zinc-900 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[#09090B]"
            aria-label="Toggle dark mode"
          >
            <Moon className="h-4 w-4" />
          </button>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.05] bg-zinc-900 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white"
            aria-label="GitHub repository"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onScrollToDownloader}
            className={`flex h-9 items-center justify-center rounded-xl bg-gradient-to-r px-4 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#09090B] ${
              isVideo
                ? "from-red-500 to-rose-600 shadow-red-500/20 focus:ring-red-500"
                : "from-emerald-500 to-green-600 shadow-green-500/20 focus:ring-green-500"
            }`}
          >
            Download Now
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
