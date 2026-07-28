# 🎵 YT Audio Downloader Pro

A premium, high-fidelity, and ad-free YouTube Audio Downloader built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **TypeScript**, and powered by **yt-dlp** and **FFmpeg**. 

This application supports Progressive Web App (PWA) installation, download history tracking, custom audio format selections, and dynamic dark mode styling.

---

## ✨ Features

- 🎧 **Premium Audio Formats**: Download as high-quality **MP3 (up to 320kbps)** or native **M4A**.
- 🚫 **100% Ad-Free**: Enjoy clean, uninterrupted audio conversion with no popups or advertisements.
- 📱 **PWA Support**: Install the app directly onto your mobile home screen or desktop application list.
- ⏳ **Anti-Hang Safekeeping**: Smart server-side process timeouts prevent backend locks and resource leaks.
- 📝 **Download History**: Keep track of your past conversions locally in your browser storage.
- 🛡️ **Container Ready**: Equipped with a custom `Dockerfile` to deploy seamlessly to any container hosting provider.

---

## 🚀 Running Locally (Recommended)

Running the application on your local machine is the **easiest and most reliable way** to download music. Since you are using your home residential IP address, YouTube will not block your requests.

### 📋 Prerequisites

Ensure you have the following installed on your system:

1. **Node.js** (v18.x or newer)
2. **Python 3** (Required by `yt-dlp`)
3. **FFmpeg** (Required for audio transcoding)

#### How to install FFmpeg:
- **Windows**: Install via scoop (`scoop install ffmpeg`) or download from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) and add the `bin` folder to your system `PATH`.
- **macOS**: Install via Homebrew (`brew install ffmpeg`).
- **Linux**: Install via apt (`sudo apt install ffmpeg`).

### ⚙️ Installation & Startup

1. Clone your repository:
   ```bash
   git clone https://github.com/Akshay-2024/Yt-audio-Downloader.git
   cd Yt-audio-Downloader
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   👉 **`http://localhost:3000`**

---

## ☁️ Deployment (Cloud Hosting)

This application is fully containerized and ready to deploy on free cloud servers like **Render.com** or **Koyeb.com**.

### 🐳 Deploying via Docker (Render / Koyeb)

Both Render and Koyeb will automatically read the included `Dockerfile` and configure your environment.

1. Connect your GitHub repository to **Render.com** or **Koyeb.com**.
2. Create a new **Web Service**.
3. Select **Docker** as your runtime/builder.
4. Choose the **Free** instance tier.
5. Click **Deploy**.

---

## 🛡️ Bypassing YouTube Datacenter Blocks (Proxies)

When hosting this app on a cloud server, YouTube will block requests with a *"Sign in to confirm you are not a bot"* challenge because it originates from a cloud data-center IP.

To bypass this restriction on your public site:

1. Register a proxy account (e.g., from [Webshare.io](https://www.webshare.io/) or another provider).
2. Get your residential proxy URL in this format:
   `http://username:password@proxy-host:port`
3. Add it as an environment variable in your host dashboard:
   - **Key**: `PROXY_URL`
   - **Value**: `http://username:password@proxy-host:port`
4. Save changes and redeploy. The app will automatically route all YouTube traffic through the proxy, eliminating all blocks!

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + Glassmorphism details
- **Language**: TypeScript
- **Binary Utilities**: `yt-dlp` (Core Audio Extractor) + `FFmpeg` (Transcoder)
- **Deployment**: Docker containerization

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
