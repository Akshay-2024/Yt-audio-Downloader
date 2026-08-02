# 🎵🎬 YT Audio/Video Downloader Pro

<div align="center">
  <img src="public/icon-512.png" alt="YT Audio Downloader Pro Logo" width="128" height="128" style="border-radius: 20%; box-shadow: 0 10px 25px rgba(0,0,0,0.3);" />
  
  <h3>An ultra-premium, ad-free, high-fidelity YouTube Audio & Video Downloader</h3>

  [![Next.js](https://img.shields.io/badge/Next.js-16.2.12-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
</div>

---

## ✨ Features

- 🎧 **Premium Audio Formats**: Extract and download audio files in ultra-premium **MP3 (up to 320kbps)** or native high-fidelity **M4A (AAC)** formats.
- 📹 **Video Downloader**: Download MP4/WebM videos in crisp HD resolutions (up to 1080p) with seamless server-side audio merging.
- 🚫 **100% Ad-Free**: No redirects, pop-ups, or spammy scripts—enjoy a clean, uninterrupted media-downloading experience.
- 🌓 **Dynamic Theme Selector**: Switch seamlessly between a sleek glassmorphism **Dark Theme** and a clean, high-contrast **Light Theme** with persistent preferences.
- 📱 **Progressive Web App (PWA)**: Fully installable as an app on your mobile home screen or desktop application launcher.
- ⏳ **Timeout Prevention & Proactive Cleanup**: Handles connections safely without hanging server processes, automatically deleting temporary files to keep server resources clean.
- 📝 **Local Download History**: Keep track of your last 10 conversions locally in your browser session storage.

---

## 🚀 Running Locally (Recommended)

Running the downloader on your local machine is the **most stable, speed-unlimited, and reliable method**. Since it routes requests through your residential connection, it completely bypasses YouTube's datacenter IP blocks.

### 📋 Prerequisites

Ensure you have the following installed on your system:

1. **Node.js** (v18.x or newer)
2. **Python 3** (Required by `yt-dlp` to run download scripts)
3. **FFmpeg** (Required for converting and stitching video/audio tracks)

#### How to install FFmpeg:
- **Windows**: Install via scoop (`scoop install ffmpeg`) or download the builds from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) and append the `bin` folder path to your environment's `PATH`.
- **macOS**: Install via Homebrew: `brew install ffmpeg`
- **Linux**: Install via package manager: `sudo apt install ffmpeg`

### ⚙️ Installation & Development Startup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Akshay-2024/Yt-audio-Downloader.git
   cd Yt-audio-Downloader
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Launch the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser to: **`http://localhost:3000`**

---

## 🐳 Cloud Deployment (Docker)

This repository comes pre-packaged with a production-grade `Dockerfile`. You can deploy this easily to containerized hosting platforms such as **Koyeb** or **Render**.

### 🛠️ Container Configuration
- **Port**: Exposes port `3000`
- **Base Image**: Uses a slim Node environment, installing Python and compiling the latest stable release of `FFmpeg` automatically during deployment.

---

## 🛡️ Bypassing YouTube Datacenter Blocks (Proxy Setup)

When deploying this application on hosting platforms (like Render or Koyeb), YouTube might restrict downloads with a bot challenge (e.g., *"Sign in to confirm you are not a bot"*).

To fix this on public servers:

1. Obtain residential or datacenter proxies (e.g. from [Webshare](https://www.webshare.io/) or other providers).
2. Configure the proxy URL using the environment variable:
   - **Key**: `PROXY_URL`
   - **Value**: `http://username:password@proxy-host:port`
3. The server-side downloader will automatically detect the variable and route traffic securely through your proxy.

---

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 & Glassmorphism Design
- **Animations**: Framer Motion
- **Core Downloader**: `yt-dlp`
- **Transcoding & Merging**: `FFmpeg`
- **Language**: TypeScript

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
