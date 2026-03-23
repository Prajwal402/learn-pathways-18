import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  // Handle various YouTube URL formats or plain video IDs
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|.*&v=))([^?&"'>]+)/);
  return match ? match[1] : (url.length === 11 ? url : null);
}

export function getThumbnailUrl(thumbnailUrl: string | null): string | null {
  if (!thumbnailUrl) return null;
  
  const ytId = extractYouTubeId(thumbnailUrl);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  
  return thumbnailUrl;
}
