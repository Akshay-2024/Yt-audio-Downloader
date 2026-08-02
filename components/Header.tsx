"use client";

import React, { useState, useEffect } from "react";
import { Music, Video, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

interface HeaderProps {
  onScrollToDownloader: () => void;
  activeTab?: "audio" | "video";
}

export default function Header({ onScrollToDownloader, activeTab = "audio" }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    window.localStorage.setItem("theme", newTheme);
    
    if (newTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      toast.success("Light theme activated!", {
        icon: "☀️",
        style: {
          background: "#FFFFFF",
          color: "#09090B",
          border: "1px solid rgba(9, 9, 11, 0.08)",
          borderRadius: "12px",
        },
      });
    } else {
      document.documentElement.removeAttribute("data-theme");
      toast.success("Premium dark theme activated!", {
        icon: "🌙",
        style: {
          background: "#18181B",
          color: "#FAFAFA",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
        },
      });
    }
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
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 text-zinc-400" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
          </button>

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
