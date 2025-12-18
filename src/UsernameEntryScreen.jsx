// src/UsernameEntryScreen.jsx
import React, { useMemo, useState } from "react";
import "./styles.css";

const RESERVED_PHONE = "5551234567";
const RESERVED_USERNAME = "test1234"; // temporary local reserved account
const RESERVED_USERNAME_DISPLAY = "Test1234";

export default function UsernameEntryScreen({
  phone,
  onBack = () => {},
  onComplete = () => {},
}) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const normalizedPhone = useMemo(() => normalizePhoneDigits(phone), [phone]);
  const reservedPhone = normalizedPhone === RESERVED_PHONE;

  const normalized = username.trim();
  const alnumOnly = normalized ? /^[A-Za-z0-9]+$/.test(normalized) : false;
  const withinLength = normalized.length >= 6 && normalized.length <= 12;
  const isReservedUser =
    normalized && normalized.toLowerCase() === RESERVED_USERNAME;

  const canAttempt = normalized.length > 0;

  const submit = (e) => {
    e.preventDefault();
    setError("");

    if (!normalized || !alnumOnly || !withinLength) {
      setError(
        "Usernames must be 6–12 characters and contain only letters or numbers"
      );
      return;
    }

    // Temporary reserved account logic: treat test1234 as taken for other phones.
    if (isReservedUser) {
      setError("Already taken. Please try something else");
      return;
    }

    onComplete(normalized);
  };

  const continueReserved = () => {
    setUsername(RESERVED_USERNAME_DISPLAY);
    setError("");
    onComplete(RESERVED_USERNAME_DISPLAY);
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
              <p>This is what will be your display name</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={submit} noValidate>
            <label className="auth-field">
              <div className="label-stack">
                <div className="auth-field-label">Username</div>
                <div className="microtext">
                  Usernames must be 6–12 characters and contain only letters or
                  numbers
                </div>
              </div>
              <div className="phone-input-wrap">
                <input
                  type="text"
                  className="phone-input"
                  placeholder="6–12 characters"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError("");
                  }}
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
              disabled={!canAttempt}
              aria-disabled={!canAttempt}
            >
              Continue
            </button>

            {reservedPhone && (
              <button
                type="button"
                className="glass-btn tile glass-btn--hollow auth-continue"
                onClick={continueReserved}
              >
                Continue as {RESERVED_USERNAME_DISPLAY}?
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
