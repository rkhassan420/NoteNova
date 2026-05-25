// ── Auth ───────────────────────────────────────────────────────────────────
export const saveAuth = ({ access, refresh, user }) => {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("cachedNotes");
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ── Notes cache ────────────────────────────────────────────────────────────
export const getCachedNotes = () => {
  try {
    const raw = localStorage.getItem("cachedNotes");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const setCachedNotes = (notes) => {
  localStorage.setItem("cachedNotes", JSON.stringify(notes));
};

export const getViewMode = () =>
  localStorage.getItem("viewMode") || "list";

export const setViewMode = (mode) =>
  localStorage.setItem("viewMode", mode);

// ── Pinned notes ───────────────────────────────────────────────────────────
export const getPinnedNotes = () => {
  try {
    return JSON.parse(localStorage.getItem("pinnedNotes") || "[]");
  } catch { return []; }
};

export const togglePinnedNote = (noteId) => {
  const pinned = getPinnedNotes();
  const updated = pinned.includes(noteId)
    ? pinned.filter((id) => id !== noteId)
    : [...pinned, noteId];
  localStorage.setItem("pinnedNotes", JSON.stringify(updated));
  return updated;
};

// ── Note colors ────────────────────────────────────────────────────────────
export const getNoteColors = () => {
  try {
    return JSON.parse(localStorage.getItem("noteColors") || "{}");
  } catch { return {}; }
};

export const setNoteColor = (noteId, color) => {
  const colors = getNoteColors();
  colors[noteId] = color;
  localStorage.setItem("noteColors", JSON.stringify(colors));
};