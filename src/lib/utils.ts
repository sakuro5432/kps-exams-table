import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uniqueBy<T>(arr: T[], keyFn: (item: T) => any): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function checkRequestCooldown(lastRequestAt: Date | null): {
  disabled: boolean;
  message: string;
} {
  const cooldownSeconds = 300; // 5 นาที = 300 วินาที
  if (!lastRequestAt) {
    // ถ้าไม่เคยกดเลย ให้กดได้เลย
    return { disabled: false, message: "พร้อมใช้งาน" };
  }

  const now = new Date();
  const diffSeconds = (now.getTime() - lastRequestAt.getTime()) / 1000;

  if (diffSeconds >= cooldownSeconds) {
    return { disabled: false, message: "พร้อมใช้งาน" };
  } else {
    const remainSeconds = Math.ceil(cooldownSeconds - diffSeconds);
    return {
      disabled: true,
      message: `${remainSeconds}s`,
    };
  }
}
