import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "TBD";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function formatTime(timeStr?: string | null): string {
  if (!timeStr) return "";
  const t = timeStr.slice(0, 5);
  return t === "00:00" ? "" : t;
}

export function getMatchStatus(event: {
  strStatus?: string;
  dateEvent?: string;
  strTime?: string;
  intHomeScore?: string | null;
  intAwayScore?: string | null;
}): "live" | "finished" | "upcoming" | "postponed" {
  const status = (event.strStatus || "").toLowerCase();
  if (status.includes("postponed")) return "postponed";
  if (
    status.includes("live") ||
    status.includes("1h") ||
    status.includes("2h") ||
    status.includes("ht")
  )
    return "live";
  if (
    status.includes("finished") ||
    status.includes("ft") ||
    status.includes("aet") ||
    status.includes("pen")
  )
    return "finished";

  if (event.intHomeScore != null && event.intAwayScore != null) {
    const hs = String(event.intHomeScore);
    const as = String(event.intAwayScore);
    if (hs !== "" && as !== "") return "finished";
  }

  if (event.dateEvent) {
    const eventDate = new Date(`${event.dateEvent}T${event.strTime || "00:00:00"}`);
    if (eventDate < new Date()) return "finished";
  }

  return "upcoming";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getCountdown(targetDate: string, targetTime?: string): string {
  const target = new Date(`${targetDate}T${targetTime || "00:00:00"}`);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return "Started";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.reject(new Error("Clipboard not available"));
}

export function calculateAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function shareUrl(url: string, title: string): void {
  if (typeof navigator !== "undefined" && "share" in navigator) {
    navigator.share({ title, url }).catch(() => {});
  } else {
    copyToClipboard(url);
  }
}
