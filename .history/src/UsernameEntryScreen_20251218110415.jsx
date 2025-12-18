// src/UsernameEntryScreen.jsx
import React, { useMemo, useState } from "react";
import "./styles.css";

const RESERVED_PHONE = "5551234567";
const RESERVED_USERNAME = "Test1234";

export default function UsernameEntryScreen({
  phone,
  onBack = () => {},
  onComplete = () => {},
}) {
  const [username, setUsername] = useState("");

  const normalizedPhone = useMemo(() => normalizePhoneDigits(phone), [phone]);
  const reservedPhone = normalizedPhone === RESERVED_PHONE;

  const normalized = username.trim();
  const alnum = normalized ? /^[A-Za-z0-9]+$/.test(normalized) : false;
  const longEnough = normalized.length >= 8;
  const taken =
    normalized && normalized.toLowerCase() === RESERVED_USERNAME.toLowerCase();

  const error = taken
    ? "Already taken. Please try something else"
    : normalized && !alnum
    ? "Letters and numbers only"
    : normalized && !longEnough
    ? "Use at least 8 characters"
    : "";

  const canSubmit = alnum && longEnough && !taken;

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onComplete(normalized);
  };

  const continueReserved = () => {
    setUsername(RESERVED_USERNAME);
    onComplete(RESERVED_USERNAME);
  };

  return (
    <main className="auth-page">
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

      <section className="auth-shell">
        <div className="auth-card card glass">
          <div className="auth-copy">
            <h1 className="screen-title">Choose a Username</h1>
            <div className="auth-subtext">
              <p>This is what will b</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={submit} noValidate>
            <label className="auth-field">
              <div className="label-stack">
                <div className="auth-field-label">Username</div>
                <div className="microtext">Use 8+ letters or numbers.</div>
              </div>
              <div className="phone-input-wrap">
                <input
                  type="text"
                  className="phone-input"
                  placeholder="8+ characters"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-label="Username"
                  autoCapitalize="none"
                  autoComplete="username"
                />
              </div>
            </label>

            {error && <div className="microtext">{error}</div>}

            <button
              type="submit"
              className="glass-btn glass-btn--tint auth-continue"
              disabled={!canSubmit}
              aria-disabled={!canSubmit}
            >
              Continue
            </button>

            {reservedPhone && (
              <button
                type="button"
                className="glass-btn tile glass-btn--hollow auth-continue"
                onClick={continueReserved}
              >
                Continue as {RESERVED_USERNAME}?
              </button>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

function normalizePhoneDigits(val) {
  if (!val) return "";
  const digits = String(val).replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits.slice(-10);
}
