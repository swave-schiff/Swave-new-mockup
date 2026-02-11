import React, { useState } from "react";
import "./styles.css";

export default function LinkByUsernameScreen({
  onBack = () => {},
  onLink = () => {},
}) {
  const [username, setUsername] = useState("");

  const canLink = username.trim().length > 0;

  function submit() {
    if (!canLink) return;
    onLink(username.trim());
  }

  return (
    <main className="auth-page linkby-page">
      <div className="top-actions">
        <button className="chevron-btn" onClick={onBack} aria-label="Back">
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

      <section className="auth-shell linkby-shell">
        <div className="card glass gradient-vertical linkby-card">
          <h2 className="linkby-title">Link with Username</h2>

          <p className="linkby-copy">
            To link to someone using their username, they must enable Allow Username
            Linking. This feature is turned off by default
          </p>

          <div className="field linkby-field">
            <span className="field-label">Username</span>
            <div className="input glass">
              <input
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-label="Username"
              />
            </div>
          </div>

          <div className="linkby-actions">
            <button
              type="button"
              className="glass-btn glass-btn--tint btn-one-line"
              onClick={submit}
              disabled={!canLink}
              aria-disabled={!canLink}
            >
              Link
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
