"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQItem } from "../types";

const faqs: FAQItem[] = [
  {
    question: "Is this service free to use?",
    answer:
      "Yes, YT Audio Downloader is 100% free. We do not require registration, credit cards, or subscriptions. Enjoy unlimited, high-quality audio downloads without any hidden fees.",
  },
  {
    question: "Is it safe to download audio from this website?",
    answer:
      "Absolutely. Our platform is completely ad-free, which means no malicious redirects, pop-ups, or spammy scripts. We process your conversion request on our server and stream the file directly to your browser.",
  },
  {
    question: "Which formats and qualities are supported?",
    answer:
      "We support MP3 and M4A audio formats. For MP3, you can choose from 128 kbps (standard), 192 kbps (medium), 256 kbps (high), and 320 kbps (ultra-premium / CD quality). For M4A, we stream the native high-fidelity AAC audio from YouTube.",
  },
  {
    question: "Do you store the downloaded audio files or video links?",
    answer:
      "No. Privacy is one of our core values. We do not log download history on our servers, nor do we keep files permanently. Downloaded files are saved temporarily to process your download and are deleted immediately after the file has finished downloading or if the connection closes.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleAccordion(index);
    }
  };

  return (
    <section id="faq" className="relative py-24 border-t border-white/[0.03] scroll-mt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-base font-semibold tracking-wider text-green-500 uppercase"
          >
            Got Questions?
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Frequently Asked Questions
          </motion.h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="overflow-hidden rounded-[18px] border border-white/[0.04] bg-zinc-900/30 backdrop-blur-sm transition-colors hover:border-white/[0.08]"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="flex w-full items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-btn-${index}`}
                >
                  <span className="text-base font-semibold text-white transition-colors group-hover:text-green-400 sm:text-lg">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-white/[0.05] text-zinc-400 group-hover:text-white"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-btn-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="border-t border-white/[0.03] p-6 text-sm leading-relaxed text-zinc-400 sm:text-base">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
