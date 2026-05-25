import { useNavigate, useParams } from "react-router-dom";
import "./NewNote.css";
import { useState, useRef, useEffect, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import back from "../assets/back.png";
import white_back from "../assets/white-back.png";
import black_save from "../assets/black-save.png";
import white_save from "../assets/white-save.png";
import more from "../assets/more.png";
import white_more from "../assets/white-more.png";
import { ThemeContext } from "../theme/ThemeContext";
import {
  fetchNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";
import { getCachedNotes, setCachedNotes } from "../utils/storage";
import { formatNoteDate } from "../utils/formatDate";

const NewNote = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 450);
  const menuRef = useRef(null);

  // ── Detect mobile for toast position ─────────────────────────────────────
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 450);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Track original content to detect unsaved changes ─────────────────────
  const originalTitle = useRef("");
  const originalBody = useRef("");
  const isSaved = useRef(false);

  const hasUnsavedChanges = () => {
    // New note: discard silently if completely empty
    if (!id && !title.trim() && !body.trim()) return false;
    // New note with content: warn
    if (!id && (title.trim() || body.trim())) return true;
    // Existing note: warn only if content changed
    return title !== originalTitle.current || body !== originalBody.current;
  };

  // ── Safe back navigation with unsaved changes check ───────────────────────
  const handleBack = () => {
    if (!isSaved.current && hasUnsavedChanges()) {
      toast(
        ({ closeToast }) => (
          <div>
            <p>You have unsaved changes. Leave without saving?</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button
                onClick={() => { closeToast(); navigate("/"); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: "6px 10px" }}
              >
                ✅ Leave
              </button>
              <button
                onClick={closeToast}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: "6px 10px" }}
              >
                ❌ Stay
              </button>
            </div>
          </div>
        ),
        { autoClose: false }
      );
      return;
    }
    navigate("/");
  };

  // ── Load note from cache first, then sync from server ────────────────────
  useEffect(() => {
    if (!id) return;

    const cached = getCachedNotes().find((n) => n.id === parseInt(id));
    if (cached) {
      setTitle(cached.title);
      setBody(cached.body);
      originalTitle.current = cached.title;
      originalBody.current = cached.body;
    }

    const loadFromServer = async () => {
      try {
        const data = await fetchNoteById(id);
        setTitle((prev) => prev || data.title);
        setBody((prev) => prev || data.body);
        originalTitle.current = data.title;
        originalBody.current = data.body;

        // Update cache
        const notes = getCachedNotes();
        const updated = notes.some((n) => n.id === data.id)
          ? notes.map((n) => (n.id === data.id ? data : n))
          : [...notes, data];
        setCachedNotes(updated);
      } catch (err) {
        console.error("Failed to fetch note:", err);
      }
    };

    loadFromServer();
  }, [id]);

  // ── Save (create or update) ───────────────────────────────────────────────
  const handleSave = async () => {
    if (!title.trim() && !body.trim()) {
      toast.error("Cannot save an empty note!");
      return;
    }

    try {
      const data = id
        ? await updateNote(id, { title, body })
        : await createNote({ title, body });

      // Update cache
      const notes = getCachedNotes();
      const updated = notes.some((n) => n.id === data.id)
        ? notes.map((n) => (n.id === data.id ? data : n))
        : [...notes, data];
      setCachedNotes(updated);

      isSaved.current = true;
      toast.success(id ? "Note updated!" : "Note saved!");
      navigate("/");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save note. Please try again.");
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this note?</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button
              onClick={async () => {
                if (!id) {
                  toast.error("This note hasn't been saved yet!");
                  closeToast();
                  return;
                }
                try {
                  await deleteNote(id);
                  const updated = getCachedNotes().filter(
                    (n) => n.id !== parseInt(id)
                  );
                  setCachedNotes(updated);
                  toast.success("Note deleted!");
                  navigate("/");
                } catch (err) {
                  toast.error("Failed to delete note.");
                }
                closeToast();
              }}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px 10px",
              }}
            >
              ✅
            </button>
            <button
              onClick={closeToast}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px 10px",
              }}
            >
              ❌
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  // ── Close menu on outside click ───────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  // ── Ctrl+S shortcut ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [title, body]);

  // ── Word & char count ─────────────────────────────────────────────────────
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const charCount = body.length;

  return (
    <div className="editor-container">

      {/* ── Header ── */}
      <div className="editor-header">
        <button title="Back" onClick={handleBack}>
          <img src={theme === "dark-theme" ? white_back : back} alt="Back" />
        </button>

        <div className="note-right-header">
          {body.trim().length > 0 && (
            <button title="Save (Ctrl+S)" onClick={handleSave}>
              <img
                src={theme === "light-theme" ? black_save : white_save}
                alt="Save"
              />
            </button>
          )}

          <div className="menu-wrapper">
            <button onClick={() => setShowMenu((v) => !v)}>
              <img
                src={theme === "light-theme" ? more : white_more}
                className="menu"
                alt="More options"
              />
            </button>

            {showMenu && (
              <div className="dropdown-menu" ref={menuRef}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${title}\n\n${body}`);
                    toast.success("Copied to clipboard!");
                    setShowMenu(false);
                  }}
                >
                  Share as Text
                </button>
                <button onClick={handleDelete}>Delete Note</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="editor-toolbar">
        <button
          onClick={() => setBold((v) => !v)}
          style={{ fontWeight: bold ? "bold" : "normal" }}
          title="Bold"
        >
          B
        </button>
        <button
          onClick={() => setItalic((v) => !v)}
          style={{ fontStyle: italic ? "italic" : "normal" }}
          title="Italic"
        >
          I
        </button>
        <button
          onClick={() => setUnderline((v) => !v)}
          style={{ textDecoration: underline ? "underline" : "none" }}
          title="Underline"
        >
          U
        </button>
      </div>

      {/* ── Editor ── */}
      <input
        type="text"
        className="editor-title"
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="note-date">{formatNoteDate(new Date())}</div>

      <div className="body-full">
        <textarea
          className="editor-body"
          placeholder="Start writing..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{
            fontWeight: bold ? "bold" : "normal",
            fontStyle: italic ? "italic" : "normal",
            textDecoration: underline ? "underline" : "none",
          }}
        />
      </div>

      {/* ── Word & char count ── */}
      <div className="editor-footer">
        <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
        <span>{charCount} {charCount === 1 ? "character" : "characters"}</span>
      </div>

      <ToastContainer
        position={isMobile ? "bottom-center" : "top-right"}
        style={isMobile ? { bottom: "74px" } : {}}
      />
    </div>
  );
};

export default NewNote;