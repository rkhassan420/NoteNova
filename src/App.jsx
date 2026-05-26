import { lazy, useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import useNotes from "./hooks/useNotes";
import { timeAgo } from "./utils/formatDate";
import {
  getViewMode,
  getPinnedNotes,
  togglePinnedNote,
  getNoteColors,
  setNoteColor,
} from "./utils/storage";

const Header = lazy(() => import("./page/header"));

// ── Note color palette ─────────────────────────────────────────────────────
const NOTE_COLORS = [
  { label: "Default", value: "" },
  { label: "Red",     value: "#ffb3b3" },
  { label: "Orange",  value: "#ffd9b3" },
  { label: "Yellow",  value: "#fff3b3" },
  { label: "Green",   value: "#b3f0c2" },
  { label: "Teal",    value: "#b3e8f0" },
  { label: "Blue",    value: "#b3c8f0" },
  { label: "Purple",  value: "#d9b3f0" },
  { label: "Pink",    value: "#f0b3d9" },
];

const EmptyState = ({ filtered }) => (
  <div className="empty-state">
    <svg className="empty-svg" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="28" y="20" width="104" height="124" rx="10"
        fill="var(--surface)" stroke="var(--txt)" strokeOpacity="0.1" strokeWidth="1.5" />
      <rect x="28" y="20" width="16" height="124" rx="10"
        fill="var(--txt)" fillOpacity="0.05" />
      {[38, 56, 74, 92, 110].map((y) => (
        <circle key={y} cx="36" cy={y} r="4"
          fill="var(--bg)" stroke="var(--txt)" strokeOpacity="0.15" strokeWidth="1.2" />
      ))}
      {filtered ? (
        <>
          <rect x="54" y="52" width="62" height="7" rx="3.5" fill="var(--txt)" fillOpacity="0.09" />
          <rect x="54" y="67" width="44" height="7" rx="3.5" fill="var(--txt)" fillOpacity="0.06" />
          <rect x="54" y="82" width="52" height="7" rx="3.5" fill="var(--txt)" fillOpacity="0.06" />
          <circle cx="104" cy="112" r="14" fill="var(--bg)" stroke="#E3963E" strokeWidth="2.5" strokeOpacity="0.75" />
          <line x1="114" y1="122" x2="122" y2="130" stroke="#E3963E" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.75" />
        </>
      ) : (
        <>
          <rect x="54" y="52" width="62" height="7" rx="3.5" fill="var(--txt)" fillOpacity="0.09" />
          <rect x="54" y="67" width="44" height="7" rx="3.5" fill="var(--txt)" fillOpacity="0.06" />
          <rect x="54" y="82" width="52" height="7" rx="3.5" fill="var(--txt)" fillOpacity="0.06" />
          <rect x="54" y="97" width="34" height="7" rx="3.5" fill="var(--txt)" fillOpacity="0.04" />
          <circle cx="114" cy="118" r="18" fill="#E3963E" fillOpacity="0.12" />
          <circle cx="114" cy="118" r="14" fill="#E3963E" fillOpacity="0.88" />
          <line x1="114" y1="112" x2="114" y2="124" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="108" y1="118" x2="120" y2="118" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </svg>
    <p className="empty-title">{filtered ? "No matching notes" : "No notes yet"}</p>
    <p className="empty-subtitle">
      {filtered ? "Try a different search term" : "Tap + to write your first note"}
    </p>
  </div>
);

function App() {
  const { notes, loading, deleteNote } = useNotes();
  const [viewMode, setViewMode]           = useState(() => getViewMode());
  const [longPressedId, setLongPressedId] = useState(null);
  const [isLongPress, setIsLongPress]     = useState(false);
  const [searchTerm, setSearchTerm]       = useState("");
  const [sortOrder, setSortOrder]         = useState("newest");
  const [pinnedIds, setPinnedIds]         = useState(() => getPinnedNotes());
  const [noteColors, setNoteColors]       = useState(() => getNoteColors());
  const [colorPickerNoteId, setColorPickerNoteId] = useState(null);
  const [deletingId, setDeletingId]       = useState(null);
  const [isMobile, setIsMobile]           = useState(() => window.innerWidth <= 450);
  const pressTimer = useRef(null);
  const navigate = useNavigate();

  // ── Detect mobile for toast position ─────────────────────────────────────
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 450);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Sync viewMode from settings ───────────────────────────────────────────
  useEffect(() => {
    const onStorage = () => setViewMode(getViewMode());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ── Dismiss overlays on outside click ────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".note-card")) {
        setLongPressedId(null);
        setColorPickerNoteId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ── Long press ────────────────────────────────────────────────────────────
  const handlePressStart = (noteId) => {
    pressTimer.current = setTimeout(() => {
      setLongPressedId(noteId);
      setIsLongPress(true);
    }, 800);
  };

  const handlePressEnd = () => clearTimeout(pressTimer.current);

  const handleCardClick = (noteId) => {
    if (isLongPress) { setIsLongPress(false); return; }
    navigate(`/notes/${noteId}/edit`);
  };

  // ── Pin ───────────────────────────────────────────────────────────────────
  const handlePin = (e, noteId) => {
    e.stopPropagation();
    const updated = togglePinnedNote(noteId);
    setPinnedIds(updated);
    setLongPressedId(null);
  };

  // ── Color ─────────────────────────────────────────────────────────────────
  const handleColorClick = (e, noteId) => {
    e.stopPropagation();
    setColorPickerNoteId((prev) => (prev === noteId ? null : noteId));
    setLongPressedId(null);
  };

  const handleColorSelect = (e, noteId, color) => {
    e.stopPropagation();
    setNoteColor(noteId, color);
    setNoteColors((prev) => ({ ...prev, [noteId]: color }));
    setColorPickerNoteId(null);
  };

  // ── #9 Animated delete: exit animation → then remove from state ───────────
  const handleAnimatedDelete = useCallback((noteId) => {
    setDeletingId(noteId);
    setLongPressedId(null);
    setTimeout(() => {
      deleteNote(noteId);
      setDeletingId(null);
    }, 320);
  }, [deleteNote]);

  // ── Search + Sort + Pin pipeline ──────────────────────────────────────────
  const processedNotes = (() => {
    let result = searchTerm
      ? notes.filter((n) =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.body.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [...notes];

    result.sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.date) - new Date(a.date);
      if (sortOrder === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortOrder === "az")     return a.title.localeCompare(b.title);
      if (sortOrder === "za")     return b.title.localeCompare(a.title);
      return 0;
    });

    const pinned   = result.filter((n) => pinnedIds.includes(n.id));
    const unpinned = result.filter((n) => !pinnedIds.includes(n.id));
    return [...pinned, ...unpinned];
  })();

  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ToastContainer
        position={isMobile ? "bottom-center" : "top-right"}
        autoClose={3000}
        style={isMobile ? { bottom: "74px" } : {}}
      />

      {/* ── Desktop FAB: only on home page ── */}
      <Link to="/New-Note" className="create-btn-link desktop-fab">
        <button className="create-btn-float">+</button>
      </Link>

      <div className="title-container">

        {/* ── Toolbar ── */}
        <div className="notes-toolbar">
          <h2>Notes</h2>
          <select
            className="sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>
        </div>

        <div className={`notes-container ${viewMode}`}>

          {/* ── Empty states ── */}
          {!loading && notes.length === 0 && (
            <EmptyState filtered={false} />
          )}
          {!loading && notes.length > 0 && processedNotes.length === 0 && (
            <EmptyState filtered={true} />
          )}

          {/* ── #9 Note cards with enter + exit animations ── */}
          {processedNotes.map((note, index) => (
            <div
              key={note.id}
              className={`note-card ${viewMode}
                ${pinnedIds.includes(note.id) ? "pinned" : ""}
                ${deletingId === note.id ? "note-exit" : "note-enter"}
              `.trim()}
              style={{
                backgroundColor: noteColors[note.id] || "",
                animationDelay: `${index * 40}ms`,
              }}
              onMouseDown={() => handlePressStart(note.id)}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={() => handlePressStart(note.id)}
              onTouchEnd={handlePressEnd}
              onClick={() => handleCardClick(note.id)}
            >
              {pinnedIds.includes(note.id) && (
                <span className="pin-badge" title="Pinned">📌</span>
              )}

              <h3>{note.title}</h3>
              <p className="note-body-preview">{note.body}</p>
              <small className="note-time-ago">{timeAgo(note.date)}</small>

              {/* Long-press action bar */}
              {longPressedId === note.id && (
                <div className="note-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    title={pinnedIds.includes(note.id) ? "Unpin" : "Pin"}
                    onClick={(e) => handlePin(e, note.id)}
                    className="action-btn"
                  >
                    {pinnedIds.includes(note.id) ? "📍" : "📌"}
                  </button>
                  <button
                    title="Color"
                    onClick={(e) => handleColorClick(e, note.id)}
                    className="action-btn"
                  >
                    🎨
                  </button>
                  <button
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnimatedDelete(note.id);
                    }}
                    className="action-btn"
                  >
                    🗑️
                  </button>
                </div>
              )}

              {/* Color picker */}
              {colorPickerNoteId === note.id && (
                <div className="color-picker" onClick={(e) => e.stopPropagation()}>
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c.value}
                      title={c.label}
                      className={`color-dot ${noteColors[note.id] === c.value ? "active" : ""}`}
                      style={{
                        backgroundColor: c.value || "transparent",
                        border: c.value ? "2px solid rgba(0,0,0,0.15)" : "2px dashed #aaa",
                      }}
                      onClick={(e) => handleColorSelect(e, note.id, c.value)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;