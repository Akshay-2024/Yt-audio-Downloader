export interface VideoInfo {
  id: string;
  title: string;
  uploader: string;
  duration: number; // in seconds
  durationString: string; // e.g. "3:33"
  viewCount: number;
  uploadDate: string; // formatted e.g. "Oct 25, 2009"
  thumbnail: string;
  url: string;
}

export type AudioQuality = "128" | "192" | "256" | "320";

export type AudioFormat = "mp3" | "m4a";

export type DownloadStep =
  | "idle"
  | "validate"
  | "metadata"
  | "downloading"
  | "converting"
  | "preparing"
  | "finished"
  | "error";

export interface DownloadProgress {
  step: DownloadStep;
  percent: number;
  message: string;
  fileId?: string;
  error?: string;
}

export interface DownloadHistoryItem {
  id: string;
  title: string;
  uploader: string;
  durationString: string;
  thumbnail: string;
  downloadedAt: number; // timestamp
  format: AudioFormat;
  quality: AudioQuality;
  fileId: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}
