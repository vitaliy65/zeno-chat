
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(createdAt?: string) {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatTimeFullData(createdAt?: string) {
  if (!createdAt) return "";
  const date = new Date(createdAt);

  // example: "Apr 23, 2024, 08:45 AM"
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

import type { MessageType } from "@/types/message";

export function convertToPlainType(filetype: string): MessageType {
  if (!filetype) return "file";
  if (filetype.startsWith("image/")) return "image";
  if (filetype.startsWith("video/")) return "video";
  if (filetype.startsWith("audio/")) return "audio";
  return "file";
}
