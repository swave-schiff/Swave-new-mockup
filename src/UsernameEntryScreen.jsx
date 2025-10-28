// src/UsernameEntryScreen.jsx
import React, { useState } from "react";
import "./styles.css";

export default function UsernameEntryScreen({ onBack }) {
  const [username, setUsername] = useState("");

  return (
    <div className="username-screen">
      {/* Top-left chevron back */}
      <div className="top-actions">
        <button className="chevron-btn" onClick={onBack} aria-label="Back">
          <svg className="chevron-svg" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 6L9 12L15 18"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <p className="username-instructions">
        In order to link to someone by entering their username, the other party
        must have “Linking by Username” enabled which is turned off by default.
      </p>

      <input
        className="username-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Updated glass button — iOS-26 look with feathered rim */}
      <button
        className="glass-btn tile glass-btn--tint edge-feather btn-link-size"
        disabled={!username.trim()}
        onClick={() => console.log("Linking username:", username)}
      >
        Link
      </button>

      {/* Old bottom Back button removed */}
    </div>
  );
}
