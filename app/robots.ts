import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://yt-audio-downloader.com"; // Replace with your production domain
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/temp-downloads/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
