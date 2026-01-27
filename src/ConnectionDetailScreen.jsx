// src/ConnectionDetailScreen.jsx
import React, { useMemo, useState, useEffect } from "react";
import "./styles.css";

/** Circular avatar (initials for now; swap to <img> later if you have photos) */
function Avatar({ name, size = 96 }) {
  const initials = useMemo(() => {
    const p = String(name).trim().split(/\s+/);
    return ((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase();
  }, [name]);

  return (
    <div
      className="card glass conn-avatar"
      style={{ "--avatar-size": `${size}px` }}
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
  const [showDangerConfirm, setShowDangerConfirm] = useState(false);

  useEffect(() => {
    if (!showDangerConfirm) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShowDangerConfirm(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showDangerConfirm]);

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
        <div className="top-actions conn-topbar-spacer">
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
          <div className="conn-actions">
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
          onClick={() => setShowDangerConfirm(true)}
        >
          Delete / Block User
        </button>
      </div>

      {showDangerConfirm && (
        <div
          className="confirm-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowDangerConfirm(false)}
          tabIndex={-1}
        >
          <div
            className="card confirm-sheet confirm-sheet--opaque"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-title">Delete / Block User</div>
            <div className="confirm-body">
              <p>
                Once you break the link with this person, you will not be able
                to contact each other through swave anymore without creating a
                new swave link
              </p>
            </div>
            <div className="confirm-actions-vertical">
              <button
                className="glass-btn tile glass-btn--tint edge-feather btn-sm confirm-choice-btn"
                onClick={() => {
                  setShowDangerConfirm(false);
                  onDeleteOrBlock(connection);
                }}
              >
                Confirm
              </button>
              <button
                className="glass-btn tile glass-btn--hollow edge-feather btn-sm cancel-btn"
                onClick={() => setShowDangerConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
