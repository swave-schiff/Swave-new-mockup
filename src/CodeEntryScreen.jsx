import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";

export default function CodeEntryScreen({
  onSwitchToUsername,
  onComplete = () => {},
  onBack,
  onBackToHome,
}) {
  const [digits, setDigits] = useState([]);
  const code = useMemo(() => digits.join(""), [digits]);
  const backHandler = onBack || onBackToHome;

  // keyboard input
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^\d$/.test(e.key)) {
        setDigits((d) => (d.length < 4 ? [...d, e.key] : d));
      } else if (e.key === "Backspace") {
        setDigits((d) => d.slice(0, -1));
      } else if (e.key === "Enter" && digits.length === 4) {
        onComplete(code);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [digits.length, code, onComplete]);

  // auto-complete when 4 digits
  useEffect(() => {
    if (digits.length === 4) {
      const t = setTimeout(() => onComplete(code), 80);
      return () => clearTimeout(t);
    }
  }, [digits.length, code, onComplete]);

  const onDigit = (n) =>
    setDigits((d) => (d.length < 4 ? [...d, String(n)] : d));
  const onBackspace = () => setDigits((d) => d.slice(0, -1));
  const onClear = () => setDigits([]);

  return (
    <div className="screen">
      <div className="safe" />
      <main className="code-screen main-with-tabbar">
        {/* back chevron */}
        {backHandler && (
          <div className="top-actions">
            <button
              className="chevron-btn"
              onClick={backHandler}
              aria-label="Back"
            >
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
        )}

        <div className="code-slots">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`slot ${digits[i] ? "filled" : ""}`}>
              {digits[i] || ""}
            </div>
          ))}
        </div>

        {/* keypad */}
        <div className="keypad">
          <button className="key-btn" onClick={() => onDigit(1)}>
            1
          </button>
          <button className="key-btn" onClick={() => onDigit(2)}>
            2
          </button>
          <button className="key-btn" onClick={() => onDigit(3)}>
            3
          </button>
          <button className="key-btn" onClick={() => onDigit(4)}>
            4
          </button>
          <button className="key-btn" onClick={() => onDigit(5)}>
            5
          </button>
          <button className="key-btn" onClick={() => onDigit(6)}>
            6
          </button>
          <button className="key-btn" onClick={() => onDigit(7)}>
            7
          </button>
          <button className="key-btn" onClick={() => onDigit(8)}>
            8
          </button>
          <button className="key-btn" onClick={() => onDigit(9)}>
            9
          </button>
          <button className="key-btn" onClick={onClear} aria-label="Clear">
            #
          </button>
          <button className="key-btn" onClick={() => onDigit(0)} aria-label="0">
            0
          </button>
          <button className="key-btn delete-key" onClick={onBackspace} aria-label="Delete">
            <svg
              className="delete-icon"
              width="28"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
              stroke="currentColor"
              fill="none"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 6L4 12l6 6h9a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-9zM13 9l-3 3 3 3m4-3H10" />
            </svg>
          </button>
        </div>

        <button
          id="alt-to-username"
          className="glass-btn tile glass-btn--hollow alt-entry-btn"
          onClick={onSwitchToUsername}
        >
          Enter Username Instead of Code
        </button>
      </main>

      <nav className="tabbar"></nav>
    </div>
  );
}
