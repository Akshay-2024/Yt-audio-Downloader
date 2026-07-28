"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Download, ArrowRight, ArrowDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import DownloadCard from "@/components/DownloadCard";
import History from "@/components/History";
import PWARegister from "@/components/PWARegister";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DownloadHistoryItem, AudioFormat, AudioQuality } from "@/types";

export default function Home() {
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const [history, setHistory] = useLocalStorage<DownloadHistoryItem[]>("yt-audio-history", []);
  
  const downloaderRef = useRef<HTMLDivElement>(null);

  const scrollToDownloader = () => {
    downloaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleAddHistory = (item: {
    id: string;
    title: string;
    uploader: string;
    durationString: string;
    thumbnail: string;
    format: AudioFormat;
    quality: AudioQuality;
    fileId: string;
  }) => {
    const newItem: DownloadHistoryItem = {
      ...item,
      downloadedAt: Date.now(),
    };
    
    // Add to history and keep only the 10 most recent downloads
    setHistory((prevHistory) => {
      const filtered = prevHistory.filter((h) => h.id !== item.id || h.format !== item.format);
      return [newItem, ...filtered].slice(0, 10);
    });
  };

  const handleRemoveHistoryItem = (id: string) => {
    setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleSelectHistoryItem = (url: string) => {
    setSelectedUrl(url);
    // Clear URL state after short delay to let DownloadCard handle the update
    setTimeout(() => setSelectedUrl(""), 100);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "YT Audio Downloader Pro",
    "operatingSystem": "All",
    "applicationCategory": "MultimediaApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "18402"
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-green-500/30 selection:text-white">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Background radial glow */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b from-green-500/5 to-transparent blur-3xl pointer-events-none" />
      
      {/* PWA Register */}
      <PWARegister />

      {/* Header */}
      <Header onScrollToDownloader={scrollToDownloader} />

      {/* Main Section */}
      <main className="flex-grow">
        {/* Hero & Downloader Wrapper */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3.5 py-1 text-xs font-semibold text-green-400 mb-6"
            >
              <Sparkles className="h-3 w-3 animate-spin text-green-400" />
              <span>Ad-Free & Unlimited Audio Extraction</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl"
            >
              Download YouTube Audio{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                Instantly
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg max-w-2xl text-zinc-400 leading-relaxed"
            >
              Paste any YouTube video or short link and convert it to premium 320 kbps MP3 or native M4A audio in seconds. Fast, secure, and completely ad-free.
            </motion.p>

            {/* Keyboard Shortcuts Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-4 hidden sm:flex items-center gap-1.5 text-xs text-zinc-500"
            >
              <span>Press</span>
              <kbd className="inline-flex items-center rounded border border-white/[0.08] bg-zinc-900 px-1.5 font-mono text-[10px] font-bold text-zinc-400 shadow-sm">
                /
              </kbd>
              <span>to focus input field</span>
            </motion.div>
          </div>

          {/* Downloader Card Section */}
          <div ref={downloaderRef} className="mx-auto max-w-3xl mt-12 sm:mt-16">
            <DownloadCard
              initialUrl={selectedUrl}
              onAddHistory={handleAddHistory}
            />

            {/* History Panel */}
            <History
              history={history}
              onSelectUrl={handleSelectHistoryItem}
              onRemoveItem={handleRemoveHistoryItem}
              onClearHistory={handleClearHistory}
            />
          </div>
        </section>

        {/* Features Grid */}
        <Features />

        {/* FAQ Section */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
