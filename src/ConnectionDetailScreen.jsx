// src/ConnectionDetailScreen.jsx
import React, { useMemo, useState } from "react";
import "./styles.css";

/** Circular avatar (initials for now; swap to <img> later if you have photos) */
function Avatar({ name, size = 96 }) {
  const initials = useMemo(() => {
    const p = String(name).trim().split(/\s+/);
    return ((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase();
  }, [name]);

  return (
    <div
      className="card glass"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        fontWeight: 700,
        color: "#e9eef9",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.25), 0 10px 28px rgba(0,0,0,0.45)",
      }}
      aria-label={`${name} profile`}
    >
      {initials || "U"}
    </div>
  );
}

export default function ConnectionDetailScreen({
  connection = { id: "", name: "Username" },
  onBack = () => {},
  onOpenMessages = () => {},
  onDeleteOrBlock = () => alert("Delete/Block (placeholder)"),
}) {
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState("");

  const saveNotes = () => {
    setSavedNotes(notes);
    // TODO: persist to API/localStorage
  };

  return (
    <main className="connection-detail">
      {/* Glass top bar with perfectly centered header */}
      <div className="conn-topbar">
        <div className="top-actions">
          <button className="chevron-btn" aria-label="Back" onClick={onBack}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="chevron-svg"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        <div className="conn-header-center">
          <Avatar name={connection.name} />
          <div className="conn-username">{connection.name}</div>
        </div>

        {/* right spacer mirrors the left chevron to keep center perfectly centered */}
        <div className="top-actions" style={{ visibility: "hidden" }}>
          <button className="chevron-btn" aria-hidden="true" tabIndex={-1}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="chevron-svg"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="conn-body">
        {/* Messages pill ~75% width, centered */}
        <button
          className="glass-btn pill primary conn-msg-btn"
          onClick={() => onOpenMessages(connection)}
        >
          Messages
        </button>

        {/* Notes */}
        <div className="conn-section">
          <div className="conn-label">Notes</div>
          <textarea
            className="conn-notes"
            placeholder="Enter notes here that will remind you of where and when you met them, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
          />
          <div
            className="conn-actions"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button
              className="glass-btn tile glass-btn--hollow edge-feather btn-sm"
              onClick={saveNotes}
              disabled={notes === savedNotes}
              aria-disabled={notes === savedNotes}
            >
              Save
            </button>
          </div>
        </div>

        {/* Red glass Delete / Block button */}
        <button
          className="glass-btn tile glass-btn--danger edge-feather conn-danger-btn"
          onClick={() => onDeleteOrBlock(connection)}
        >
          Delete / Block User
        </button>
      </div>
    </main>
  );
}
