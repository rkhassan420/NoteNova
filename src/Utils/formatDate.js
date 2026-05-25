// ── Human-readable note date ───────────────────────────────────────────────
// e.g. "24 May, 3:45 PM"
export const formatNoteDate = (date) =>
  new Date(date).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

// ── Short date for note cards ─────────────────────────────────────────────
// e.g. "May 24, 2026"
export const formatShortDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// ── Relative time: "Edited 2 hours ago" ──────────────────────────────────
export const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60)           return "Edited just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)           return `Edited ${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)             return `Edited ${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7)               return `Edited ${days} ${days === 1 ? "day" : "days"} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5)              return `Edited ${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12)            return `Edited ${months} ${months === 1 ? "month" : "months"} ago`;
  const years = Math.floor(days / 365);
  return `Edited ${years} ${years === 1 ? "year" : "years"} ago`;
};