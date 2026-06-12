import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const getAvatarInitials = (name: string) => {
  if (!name) return "";
  const chars = name.trim().split(/\s+/);
  if (chars.length === 1) return chars[0].slice(0, 2);
  return chars[0][0] + chars[chars.length - 1][0];
};

export const getAvatarColor = (seed: string) => {
  const colors = [
    "from-primary-400 to-primary-600",
    "from-success-400 to-success-600",
    "from-warning-400 to-warning-600",
    "from-pink-400 to-pink-600",
    "from-purple-400 to-purple-600",
    "from-indigo-400 to-indigo-600",
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
