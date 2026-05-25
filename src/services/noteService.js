import api from "./api";

// ── Fetch all notes for the logged-in user ────────────────────────────────
export const fetchNotes = async () => {
  const { data } = await api.get("/notes/");
  return data; // array of note objects
};

// ── Fetch a single note by ID ─────────────────────────────────────────────
export const fetchNoteById = async (id) => {
  const { data } = await api.get(`/notes/${id}/`);
  return data;
};

// ── Create a new note ─────────────────────────────────────────────────────
export const createNote = async ({ title, body }) => {
  const { data } = await api.post("/notes/", { title, body });
  return data;
};

// ── Update an existing note ───────────────────────────────────────────────
export const updateNote = async (id, { title, body }) => {
  const { data } = await api.put(`/notes/${id}/`, { title, body });
  return data;
};

// ── Delete a note by ID ───────────────────────────────────────────────────
export const deleteNote = async (id) => {
  await api.delete(`/notes/${id}/`);
};