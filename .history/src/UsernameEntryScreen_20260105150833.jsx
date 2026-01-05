// src/UsernameEntryScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";

const RESERVED_PHONE = "5551234567";
const RESERVED_USERNAME = "test1234"; // temporary local reserved account
const RESERVED_USERNAME_DISPLAY = "Test1234";

export default function UsernameEntryScreen({
  phone,
  onBack = () => {},
  onComplete = () => {},
}) {
  const normalizedPhone = useMemo(() => normalizePhoneDigits(phone), [phone]);
  const reservedPhone = normalizedPhone === RESERVED_PHONE;

  const [username, setUsername] = useState(
    reservedPhone ? RESERVED_USERNAME_DISPLAY : ""
  );
  const [error, setError] = useState("");
  const [showEditor, setShowEditor] = useState(!reservedPhone);

  useEffect(() => {
    if (reservedPhone) {
      setShowEditor(false);
      setUsername((prev) => prev || RESERVED_USERNAME_DISPLAY);
    } else {
      setShowEditor(true);
    }
    setError("");
  }, [reservedPhone]);

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

  const toggleEditor = () => {
    setShowEditor((prev) => {
      const next = !prev;
      if (next && reservedPhone && !username) {
        setUsername(RESERVED_USERNAME_DISPLAY);
      }
      return next;
    });
    setError("");
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
            <h1 className="screen-title">Choose a unique username</h1>
            <div className="auth-subtext">
              <p>This is your display name others will see</p>
            </div>
          </div>

          {reservedPhone && !showEditor ? (
            <div className="auth-form">
              <button
                type="button"
                className="glass-btn glass-btn--tint auth-continue"
                onClick={continueReserved}
                aria-label={`Continue as ${RESERVED_USERNAME_DISPLAY}`}
              >
                <div>Continue as</div>
                <div>{RESERVED_USERNAME_DISPLAY}</div>
              </button>
              <button
                type="button"
                className="glass-btn tile glass-btn--hollow edge-feather btn-sm"
                onClick={toggleEditor}
              >
                {"\u270f\ufe0f"} Change Username
              </button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={submit} noValidate>
              <label className="auth-field ">
                <div className="label-stack">
                  <span className="auth-field-label feedback-label">Username</span>
                </div>
                <div className="phone-input-wrap">
                  <input
                    type="text"
                    className="phone-input"
                    placeholder="6-12 characters"
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
                <div className="auth-subtext">
                  <p>
                    Usernames must be 6–12 characters and contain only letters or
                    numbers
                  </p>
                </div>
              </label>

              {error && (
                <div className="auth-subtext error">
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="glass-btn glass-btn--tint auth-continue"
                disabled={!canAttempt}
                aria-disabled={!canAttempt}
              >
                Continue
              </button>
            </form>
          )}
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
