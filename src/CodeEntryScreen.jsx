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
    <div className="code-screen">
      {/* back chevron */}
      {backHandler && (
        <div className="top-actions">
          <button
            className="chevron-btn"
            onClick={backHandler}
            aria-label="Back"
          >
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
      )}

      {/* round code slots */}
      <div className="code-boxes">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`code-box ${digits[i] ? "filled" : ""}`}>
            {digits[i] || ""}
          </div>
        ))}
      </div>

      {/* keypad */}
      <div className="keypad">
        {/* Row 1 */}
        <button className="keypad-btn" onClick={() => onDigit(1)}>
          1
          <span className="rim-light" />
          <span className="rim-dark" />
          <span className="rim-inner" />
        </button>
        <button className="keypad-btn" onClick={() => onDigit(2)}>
          2 <span className="keypad-sub">ABC</span>
          <span className="rim-light" />
          <span className="rim-dark" />
          <span className="rim-inner" />
        </button>
        <button className="keypad-btn" onClick={() => onDigit(3)}>
          3 <span className="keypad-sub">DEF</span>
          <span className="rim-light" />
          <span className="rim-dark" />
          <span className="rim-inner" />
        </button>

        {/* Row 2 */}
        <button className="keypad-btn" onClick={() => onDigit(4)}>
          4 <span className="keypad-sub">GHI</span>
          <span className="rim-light" />
          <span className="rim-dark" />
          <span className="rim-inner" />
        </button>
        <button className="keypad-btn" onClick={() => onDigit(5)}>
          5 <span className="keypad-sub">JKL</span>
          <span className="rim-light" />
          <span className="rim-dark" />
          <span className="rim-inner" />
        </button>
        <button className="keypad-btn" onClick={() => onDigit(6)}>
          6 <span className="keypad-sub">MNO</span>
          <span className="rim-light" />
          <span className="rim-dark" />
          <span className="rim-inner" />
        </button>

        {/* Row 3 */}
        <button className="keypad-btn" onClick={() => onDigit(7)}>
          7 <span className="keypad-sub">PQRS</span>
          <span className="rim-light" />
          <span className="rim-dark" />
          <span className="rim-inner" />
        </button>
        <button className="keypad-btn" onClick={() => onDigit(8)}>
          8 <span className="keypad-sub">TUV</span>
          <span className="rim-light" />
          <span className="rim-dark" />
          <span className="rim-inner" />
        </button>
        <button className="keypad-btn" onClick={() => onDigit(9)}>
          9 <span className="keypad-sub">WXYZ</span>
          <span className="rim-light" />
          <span className="rim-dark" />
          <span className="rim-inner" />
        </button>

        {/* Row 4: Clear (#), 0, Backspace */}
        <button
          className="keypad-btn keypad-btn--action"
          onClick={onClear}
          aria-label="Clear"
        >
          #
          <span className="rim-light" />
          <span className="rim-dark" />
          <span className="rim-inner" />
        </button>

        <button
          className="keypad-btn keypad-zero"
          onClick={() => onDigit(0)}
          aria-label="0"
        >
          0
          <span className="rim-light" />
          <span className="rim-dark" />
          <span className="rim-inner" />
        </button>

        <button
          className="keypad-btn keypad-btn--action"
          onClick={onBackspace}
          aria-label="Delete"
        >
          <svg
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
          <span className="rim-light" />
          <span className="rim-dark" />
          <span className="rim-inner" />
        </button>
      </div>

      <button
        id="alt-to-username"
        className="glass-btn tile glass-btn--hollow"
        onClick={onSwitchToUsername}
      >
        Enter Username Instead of Code
      </button>
    </div>
  );
}
