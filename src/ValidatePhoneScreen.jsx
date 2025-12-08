import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

export default function ValidatePhoneScreen({
  onBack,
  onSuccess = () => {},
  onValidate = async () => true,
  onResend = () => {},
}) {
  const [digits, setDigits] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputsRef = useRef([]);

  const code = useMemo(() => digits.join(""), [digits]);
  const complete = code.length === 5;

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const updateDigit = (idx, val) => {
    const next = val.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const copy = [...prev];
      copy[idx] = next;
      return copy;
    });
    if (next && idx < 4) {
      inputsRef.current[idx + 1]?.focus();
    }
    if (!next) setError("");
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
      setDigits((prev) => {
        const copy = [...prev];
        copy[idx - 1] = "";
        return copy;
      });
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    const txt = e.clipboardData.getData("text") || "";
    const onlyDigits = txt.replace(/\D/g, "").slice(0, 5);
    if (!onlyDigits) return;
    const filled = onlyDigits.split("");
    while (filled.length < 5) filled.push("");
    setDigits(filled.slice(0, 5));
    setError("");
    if (filled.length === 5) {
      inputsRef.current[4]?.focus();
    }
    e.preventDefault();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!complete || submitting) return;
    setSubmitting(true);
    try {
      const ok = await onValidate(code);
      if (ok !== false) {
        setError("");
        onSuccess();
      } else {
        setError("Invalid code, please try again");
      }
    } catch (err) {
      setError("Invalid code, please try again");
    } finally {
      setSubmitting(false);
    }
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
            <h1 className="screen-title">Verify Code</h1>
            <div className="auth-subtext">
              <p>We’ve sent a 5-digit code to your phone number.</p>
              <p>Enter it below to continue.</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={submit} noValidate>
            <div
              className="otp-inputs"
              onPaste={handlePaste}
              role="group"
              aria-label="5-digit verification code"
            >
              {digits.map((d, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  className="otp-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => updateDigit(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  aria-label={`Digit ${idx + 1}`}
                />
              ))}
            </div>

            {error && <div className="error">{error}</div>}

            <button
              type="submit"
              className="glass-btn glass-btn--tint auth-continue"
              disabled={!complete || submitting}
              aria-disabled={!complete || submitting}
            >
              Validate
            </button>

            <button
              type="button"
              className="auth-legal resend-btn"
              onClick={() => {
                setError("");
                onResend();
              }}
            >
              Resend code
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
