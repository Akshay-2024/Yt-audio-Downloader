// Regex to validate YouTube URLs and extract video ID
export const YT_REGEX =
  /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((?:\w|-){11})(?:\S+)?$/;

export function validateYoutubeUrl(url: string): boolean {
  if (!url) return false;
  return YT_REGEX.test(url.trim());
}

export function extractVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.trim().match(YT_REGEX);
  return match ? match[1] : null;
}
