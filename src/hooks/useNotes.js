import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  fetchNotes as fetchNotesAPI,
  deleteNote as deleteNoteAPI,
} from "../services/noteService";
import { getCachedNotes, setCachedNotes } from "../utils/storage";

const useNotes = () => {
  const [notes, setNotes] = useState(() => getCachedNotes());
  const [loading, setLoading] = useState(true);

  // ── Load notes: show cache immediately, then sync from server ─────────────
  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const fresh = await fetchNotesAPI();
      if (Array.isArray(fresh)) {
        setNotes(fresh);
        setCachedNotes(fresh);
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      // Cache already in state — user still sees their last notes
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // ── Optimistic delete: remove from UI instantly, revert on failure ────────
  const deleteNote = useCallback(async (noteId) => {
    const previous = [...notes];
    const updated = notes.filter((n) => n.id !== noteId);

    // Optimistic update
    setNotes(updated);
    setCachedNotes(updated);

    try {
      await deleteNoteAPI(noteId);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete note. Restoring...");
      // Revert
      setNotes(previous);
      setCachedNotes(previous);
    }
  }, [notes]);

  return { notes, loading, loadNotes, deleteNote };
};

export default useNotes;