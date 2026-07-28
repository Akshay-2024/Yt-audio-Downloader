import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://yt-audio-downloader.com"),
  title: "YT Audio Downloader Pro - Fast, Ad-Free YouTube MP3 Converter",
  description: "Convert YouTube videos and shorts to premium high-quality 320kbps MP3 or native M4A audio instantly. Safe, fast, secure, and completely advertisement-free.",
  keywords: [
    "youtube downloader",
    "youtube audio downloader",
    "youtube to mp3",
    "youtube mp3",
    "ad-free youtube downloader",
    "youtube shorts mp3",
    "m4a converter",
    "download music from youtube"
  ],
  manifest: "/manifest.json",
  authors: [{ name: "YT Audio Team" }],
  openGraph: {
    title: "YT Audio Downloader Pro - Premium YouTube to MP3 Converter",
    description: "Convert YouTube links to high-quality audio in seconds. Fast, secure, and ad-free.",
    type: "website",
    locale: "en_US",
    url: "https://yt-audio-downloader.com",
    siteName: "YT Audio Downloader Pro",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "YT Audio Downloader Pro Logo",
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "YT Audio Downloader Pro",
    description: "Convert YouTube videos to high-quality MP3/M4A audio. Ad-free & unlimited.",
    images: ["/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#09090B] text-[#FAFAFA]">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#18181B",
              color: "#FAFAFA",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
