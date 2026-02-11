import React, { useState } from "react";
import "./styles.css";

export default function LinkByUsernameScreen({
  onBack = () => {},
  onLink = () => {},
}) {
  const [username, setUsername] = useState("");
  const [touched, setTouched] = useState(false);

  const raw = username;
  const trimmed = raw.trim();
  const hasInvalidChars = /[^A-Za-z0-9]/.test(trimmed);
  const canLink = trimmed.length > 0 && !hasInvalidChars;
  const showError = touched && trimmed.length > 0 && hasInvalidChars;

  function submit() {
    if (!canLink) return;
    onLink(trimmed);
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

      <section className="linkby-content">
        <h1 className="linkby-title">Link with Username</h1>

        <p className="linkby-copy">
          To link to someone using their username, they must enable Allow Username Linking.
          This feature is turned off by default
        </p>

        <div className="phone-input-wrap linkby-input-wrap">
          <input
            className="phone-input"
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Enter username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setTouched(true);
            }}
            aria-label="Enter username"
          />
        </div>

        {showError && (
          <div className="auth-subtext error linkby-error">
            <p>
              Usernames are only allowed to contain letters and numbers without any spaces or special characters
            </p>
          </div>
        )}

        <div className="linkby-actions">
          <button
            type="button"
            className="glass-btn glass-btn--tint btn-one-line linkby-link-btn"
            onClick={submit}
            disabled={!canLink}
            aria-disabled={!canLink}
          >
            Link
          </button>
        </div>
      </section>
    </main>
  );
}
