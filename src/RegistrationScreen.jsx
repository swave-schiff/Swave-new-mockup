import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

export default function RegistrationScreen({ onBack, onComplete = () => {} }) {
  const [step, setStep] = useState(1); // 1 = phone verify, 2 = final steps

  /* ---------- Username ---------- */
  const [username, setUsername] = useState("");
  const reUser = /^[a-z0-9._-]{6,20}$/;
  const usernameValid = useMemo(() => reUser.test(username), [username]);
  const [userTouched, setUserTouched] = useState(false);

  /* ---------- Phone + OTP (US only) ---------- */
  const [usDigits, setUsDigits] = useState(""); // just the 10 US digits
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [attemptedSend, setAttemptedSend] = useState(false); // show error only after clicking Send
  const otpInputRef = useRef(null);

  // keep only digits; drop a leading "1" (since +1 is already shown)
  const toDigits = (s) => {
    const d = s.replace(/\D/g, "");
    return d.startsWith("1") ? d.slice(1, 11) : d.slice(0, 10);
  };

  // close the ")" as soon as the 3rd digit is entered
  const formatUS = (d) => {
    if (!d) return "";
    if (d.length <= 3) return `(${d}${d.length === 3 ? ")" : ""}`;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
  };

  const phoneDisplay = useMemo(() => formatUS(usDigits), [usDigits]);
  const phoneE164 = useMemo(
    () => (usDigits ? `+1${usDigits}` : ""),
    [usDigits]
  );
  const phoneValid = usDigits.length === 10;

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

  function sendCode() {
    if (!phoneValid) {
      setAttemptedSend(true);
      return;
    }
    setAttemptedSend(false);
    setOtpSent(true);
    setOtp("");
    setOtpVerified(false);
    setTimeout(() => otpInputRef.current?.focus(), 0);
  }

  function handleOtpChange(v) {
    const next = v.replace(/\D/g, "").slice(0, 5);
    setOtp(next);
    setOtpVerified(next.length === 5);
  }

  // Auto-advance to Step 2 once OTP is verified
  useEffect(() => {
    if (otpVerified) {
      const t = setTimeout(() => setStep(2), 250);
      return () => clearTimeout(t);
    }
  }, [otpVerified]);

  /* ---------- Passwords ---------- */
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const pwChecks = useMemo(
    () => ({
      len: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      num: /[0-9]/.test(pw),
      sym: /[^A-Za-z0-9]/.test(pw),
    }),
    [pw]
  );
  const strength = useMemo(() => {
    let s = 0;
    if (pwChecks.len) s++;
    if (pwChecks.upper) s++;
    if (pwChecks.lower && pwChecks.num) s++;
    if (pwChecks.sym) s++;
    return s;
  }, [pwChecks]);
  const pwValid = strength >= 2;
  const pwMatch = pw.length > 0 && pw2.length > 0 && pw === pw2;

  // Final submit only available on Step 2
  const formValid = usernameValid && otpVerified && pwValid && pwMatch;

  const topBack = step === 1 ? onBack : () => setStep(1);

  function submit() {
    if (!formValid) return;
    onComplete({
      username,
      phone: phoneE164,
      password: pw,
    });
  }

  return (
    <main className="reg-main">
      {/* Top chevron */}
      <div className="top-actions">
        <button className="chevron-btn" onClick={topBack} aria-label="Back">
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

      <div
        className={`card reg-card ${step === 1 ? "reg-step1" : "reg-step2"}`}
      >
        {step === 1 ? (
          <h2 className="reg-title">Create Account</h2>
        ) : (
          <h2 className="reg-title">Final steps</h2>
        )}

        {/* ----------------- STEP 1: Phone verification ----------------- */}
        {step === 1 && (
          <>
            <div className="field">
              <span className="field-label">Mobile phone</span>

              {/* single, seamless input with +1 prefix */}
              <div
                className={`input input-prefix ${
                  attemptedSend && !phoneValid ? "input-error" : ""
                }`}
              >
                <span className="prefix" aria-hidden="true">
                  +1
                </span>
                <input
                  className="prefix-input"
                  type="tel"
                  inputMode="numeric"
                  placeholder="(555) 555-1234"
                  value={phoneDisplay}
                  onChange={(e) => {
                    setUsDigits(toDigits(e.target.value));
                    setAttemptedSend(false);
                  }}
                  onKeyDown={handlePhoneKeyDown}
                  aria-label="US phone number"
                />
              </div>

              {/* button below the input */}
              <button
                className="btn-outline btn-otp"
                onClick={sendCode}
                disabled={!phoneValid}
                aria-disabled={!phoneValid}
              >
                {otpSent ? "Resend" : "Send code"}
              </button>

              {attemptedSend && !phoneValid && (
                <div className="error">Enter a valid 10-digit US number.</div>
              )}
            </div>

            {otpSent && (
              <div className="field">
                <span className="field-label">Verification code</span>

                {/* visually hidden capture input */}
                <input
                  ref={otpInputRef}
                  className="otp-capture"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                />

                <div
                  className="code-boxes"
                  onClick={() => otpInputRef.current?.focus()}
                  role="group"
                  aria-label="6-digit verification code"
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`code-box ${otp[i] ? "filled" : ""}`}
                    >
                      {otp[i] || ""}
                    </div>
                  ))}
                </div>

                <div className="otp-status">
                  {otpVerified ? (
                    <span className="ok-dot" aria-label="verified">
                      ● Verified
                    </span>
                  ) : (
                    <span className="muted">Enter 5-digit code we sent</span>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* ----------------- STEP 2: Final details ----------------- */}
        {step === 2 && (
          <>
            {/* Username */}
            <label className="field field--username">
              <span className="field-label">Unique Username</span>
              <input
                className={`input ${
                  userTouched && !usernameValid ? "input-error" : ""
                }`}
                placeholder="at least 6 characters"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                onBlur={() => setUserTouched(true)}
                autoComplete="off"
                spellCheck={false}
              />
              {userTouched && !usernameValid && (
                <div className="error">
                  Use 6–20 characters: a–z, 0–9, dot, underscore, or hyphen.
                </div>
              )}
            </label>

            {/* Password */}
            <label className="field">
              <span className="field-label">Password</span>
              <input
                className="input"
                type="password"
                placeholder="At least 8 characters"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />

              {/* Meter (optional, still here) */}
              <div className="pw-meter" data-score={strength}>
                <span />
                <span />
                <span />
                <span />
              </div>

              {/* Live checklist */}
              <div className="pw-reqs" role="list" aria-live="polite">
                <div
                  className={`req ${pwChecks.len ? "met" : ""}`}
                  role="listitem"
                >
                  <svg
                    className="req-check"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M12.5 5L6.75 10.5 3.5 7.75"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  At least 8 characters
                </div>
                <div
                  className={`req ${pwChecks.upper ? "met" : ""}`}
                  role="listitem"
                >
                  <svg
                    className="req-check"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M12.5 5L6.75 10.5 3.5 7.75"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Uppercase letter (A–Z)
                </div>
                <div
                  className={`req ${pwChecks.lower ? "met" : ""}`}
                  role="listitem"
                >
                  <svg
                    className="req-check"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M12.5 5L6.75 10.5 3.5 7.75"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Lowercase letter (a–z)
                </div>
                <div
                  className={`req ${pwChecks.num ? "met" : ""}`}
                  role="listitem"
                >
                  <svg
                    className="req-check"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M12.5 5L6.75 10.5 3.5 7.75"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Number (0–9)
                </div>
                <div
                  className={`req ${pwChecks.sym ? "met" : ""}`}
                  role="listitem"
                >
                  <svg
                    className="req-check"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M12.5 5L6.75 10.5 3.5 7.75"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Symbol (!@#$…)
                </div>
              </div>
            </label>

            {/* Confirm password */}
            <label className="field">
              <span className="field-label">Confirm password</span>
              <input
                className={`input ${pw2 && !pwMatch ? "input-error" : ""}`}
                type="password"
                placeholder="Re-enter your password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
              />
              {!pwMatch && pw2.length > 0 && (
                <div className="error">Passwords do not match.</div>
              )}
            </label>

            {/* Submit */}
            <div className="reg-actions">
              <button
                className="glass-btn glass-btn--tint"
                onClick={submit}
                disabled={!formValid}
                aria-disabled={!formValid}
              >
                Create Account
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
