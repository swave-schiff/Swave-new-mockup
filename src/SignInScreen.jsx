// src/SignInScreen.jsx
import React, { useMemo, useState } from "react";
import "./styles.css";

export default function SignInScreen({ onBack, onSuccess = () => {} }) {
  // ——— Phone helpers (US-only, same behavior as registration) ———
  const [usDigits, setUsDigits] = useState(""); // just the 10 US digits
  const [pw, setPw] = useState("");

  // keep only digits; drop a leading "1" (since +1 is shown)
  const toDigits = (s) => {
    const d = s.replace(/\D/g, "");
    return d.startsWith("1") ? d.slice(1, 11) : d.slice(0, 10);
  };

  // close ")" as soon as 3rd digit is entered
  const formatUS = (d) => {
    if (!d) return "";
    if (d.length <= 3) return `(${d}${d.length === 3 ? ")" : ""}`;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
  };

  const phoneDisplay = useMemo(() => formatUS(usDigits), [usDigits]);
  const phoneValid = usDigits.length === 10;
  const canSubmit = phoneValid && pw.length > 0;

  // Backspace fix at the "(xxx)" boundary
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

  function submit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onSuccess({ phone: `+1${usDigits}`, password: pw });
  }

  return (
    <main className="reg-main">
      {/* Top chevron */}
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

      <div className="card reg-card signin-card">
        <h2 className="reg-title">Log in</h2>

        <form onSubmit={submit} noValidate>
          {/* Phone */}
          <label className="field">
            <span className="field-label">Mobile phone</span>
            <div className="input input-prefix">
              <span className="prefix" aria-hidden="true">
                +1
              </span>
              <input
                className="prefix-input"
                type="tel"
                inputMode="numeric"
                placeholder="(555) 555-1234"
                value={phoneDisplay}
                onChange={(e) => setUsDigits(toDigits(e.target.value))}
                onKeyDown={handlePhoneKeyDown}
                aria-label="US phone number"
              />
            </div>
          </label>

          {/* Password */}
          <label className="field">
            <span className="field-label">Password</span>
            <input
              className="input"
              type="password"
              placeholder="Your password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </label>

          <div className="reg-actions">
            <button
              type="submit"
              className="btn-primary-outline"
              disabled={!canSubmit}
              aria-disabled={!canSubmit}
            >
              Log in
            </button>
          </div>

          <button type="button" className="link-btn small">
            Forgot password?
          </button>
        </form>
      </div>
    </main>
  );
}
