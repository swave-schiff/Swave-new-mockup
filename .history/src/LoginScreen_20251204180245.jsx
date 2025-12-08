// TEST 3g - Local History Validation
// TEST: Codex Local History check
import React, { useMemo, useState } from "react";
import "./styles.css";

export default function LoginScreen({
  onStartVerification,
  onSendVerification,
  onLogin = () => {},
}) {
  const [usDigits, setUsDigits] = useState("");

  // keep only digits; drop a leading "1" (since +1 is implied)
  const toDigits = (s) => {
    const d = s.replace(/\D/g, "");
    return d.startsWith("1") ? d.slice(1, 11) : d.slice(0, 10);
  };

  // close ")" as soon as the 3rd digit is entered
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
      onStartVerification || onSendVerification || onLogin || (() => {});
    trigger({ phone: phoneE164 });
  }

  return (
    <main className="auth-page">
      <div className="auth-logo">
        <h1 className="login-brand">Swave</h1>
      </div>

      <section className="auth-shell">
        <div className="auth-card card glass">
          <div className="auth-copy">
            <h1 className="screen-title">Login or Register</h1>
            <div className="auth-subtext">
              <ul className="auth-bullets">
                <li>Enter your phone number to continue.</li>
                <li>If no account exists yet, we'll create one for you automatically.</li>
              </ul>
              <p className="auth-privacy">
                Your phone number will always remain private.
              </p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleContinue} noValidate>
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
