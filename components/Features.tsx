"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Volume2, ShieldAlert, Infinity, Smartphone, Lock } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const features: Feature[] = [
  {
    title: "Lightning Fast",
    description: "Convert and extract audio files from YouTube in seconds. No waiting queues.",
    icon: Zap,
    color: "from-amber-400 to-orange-500",
  },
  {
    title: "High Quality",
    description: "Choose your audio quality up to 320 kbps in MP3 or native AAC M4A format.",
    icon: Volume2,
    color: "from-emerald-400 to-green-600",
  },
  {
    title: "No Ads",
    description: "Enjoy a clean, premium, advertisement-free experience. Zero interruptions.",
    icon: ShieldAlert,
    color: "from-blue-400 to-indigo-600",
  },
  {
    title: "Unlimited Downloads",
    description: "Download as many audio files as you want. Absolutely no caps or restrictions.",
    icon: Infinity,
    color: "from-fuchsia-400 to-pink-600",
  },
  {
    title: "Fully Responsive",
    description: "Flawless performance across all mobile, tablet, and desktop devices.",
    icon: Smartphone,
    color: "from-cyan-400 to-blue-500",
  },
  {
    title: "Privacy Focused",
    description: "We do not store your downloads. Files are deleted from our servers instantly.",
    icon: Lock,
    color: "from-red-400 to-rose-600",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Features() {
  return (
    <section id="features" className="relative py-24 scroll-mt-16">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-1/4 h-[400px] w-[400px] rounded-full bg-green-500/5 blur-[120px]" />
        <div className="absolute top-60 left-1/3 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-base font-semibold tracking-wider text-green-500 uppercase"
          >
            Why Choose YT Audio
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Premium Features. Zero Cost.
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-zinc-400"
          >
            Experience a clean, ad-free YouTube downloder tool designed with a focus on speed, quality, and user privacy.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative overflow-hidden rounded-[18px] border border-white/[0.04] bg-zinc-900/40 p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.08] hover:bg-zinc-900/60"
              >
                {/* Glow behind icon */}
                <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-green-500/5 blur-xl group-hover:bg-green-500/10 transition-all duration-300" />
                
                {/* Icon Container */}
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg shadow-black/30 text-white mb-6`}>
                  <Icon className="h-6 w-6" />
                </div>

                <h4 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
                  {feature.title}
                </h4>
                
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
