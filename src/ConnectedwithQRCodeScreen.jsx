import React, { useMemo, useState } from "react";
import "./styles.css";

export default function ConnectedwithQRCodeScreen({
  onBack = () => {},
  username = "TeaseMeTwice",
  displayName,
  avatarUrl = "https://placehold.co/240x240",
  onStartVerification,
  onSendVerification,
  onLogin = () => {},
  onAfterLogin = () => {},
}) {
  const [usDigits, setUsDigits] = useState("");
  const displayUsername = displayName || username || "TeaseMeTwice";

  const toDigits = (s) => {
    const d = s.replace(/\D/g, "");
    return d.startsWith("1") ? d.slice(1, 11) : d.slice(0, 10);
  };

  const formatUS = (d) => {
    if (!d) return "";
    if (d.length <= 3) return `(${d}${d.length === 3 ? ")" : ""}`;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
  };

  const phoneDisplay = useMemo(() => formatUS(usDigits), [usDigits]);
  const phoneValid = usDigits.length === 10;
  const phoneE164 = useMemo(
    () => (usDigits ? `+1${usDigits}` : ""),
    [usDigits]
  );

  function handlePhoneKeyDown(e) {
    if (e.key !== "Backspace") return;
    const el = e.currentTarget;
    const caret = el.selectionStart ?? 0;
    const selLen = (el.selectionEnd ?? caret) - caret;
    if (selLen === 0 && caret === el.value.length && usDigits.length === 3) {
      setUsDigits((prev) => prev.slice(0, 2));
      e.preventDefault();
    }
  }

  function handleContinue(e) {
    e?.preventDefault?.();
    if (!phoneValid) return;
    const trigger =
      onStartVerification ||
      onSendVerification ||
      onLogin ||
      onAfterLogin ||
      (() => {});
    trigger({ phone: phoneE164 });
  }

  return (
    <main className="auth-page connection-confirm-page qr-connect-page">
      <div className="top-actions">
        <button type="button" className="chevron-btn" aria-label="Back" onClick={onBack}>
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

      <section className="auth-shell connection-confirm-shell">
        <div className="connection-confirm-card">
          <div className="qr-connect-copy">
            <p className="connection-confirm-label qr-connect-label">
              Before you can start chatting with:
            </p>

            <div className="auth-copy connection-confirm-copy">
              <div className="connection-confirm-avatar qr-connect-avatar">
                <img src={avatarUrl} alt={`${displayUsername} avatar`} />
              </div>
              <h2 className="connection-confirm-name qr-connect-name">
                {displayUsername}
              </h2>
            </div>

            <p className="qr-connect-helper">
              Quick phone check (takes a moment). If you're new, we'll create
              your account automatically.
            </p>
          </div>

          <form className="auth-form qr-connect-form" onSubmit={handleContinue} noValidate>
            <label className="auth-field">
              <div className="phone-input-wrap">
                <span className="phone-prefix" aria-hidden="true">
                  +1
                </span>
                <input
                  type="tel"
                  className="phone-input"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="(555) 123-4567"
                  value={phoneDisplay}
                  onChange={(e) => setUsDigits(toDigits(e.target.value))}
                  onKeyDown={handlePhoneKeyDown}
                  aria-label="US phone number"
                />
              </div>
            </label>
            <p className="auth-privacy">
              Your phone number will always remain private.
            </p>

            <button
              type="submit"
              className="glass-btn glass-btn--tint auth-continue"
              disabled={!phoneValid}
              aria-disabled={!phoneValid}
            >
              Continue
            </button>
          </form>

          <p className="auth-legal">Carrier SMS charges may apply.</p>
        </div>
      </section>
    </main>
  );
}

