// src/CodeScreen.jsx
import React from "react";
import "./styles.css";

export default function CodeScreen({ code = "0000", onBack = () => {} }) {
  const digits = String(code).padStart(4, "0").slice(0, 4).split("");
  const inviteUrl = `https://swave.com/invite/${code}`;

  return (
    <main className="code-main">
      <div className="top-actions">
        <button className="chevron-btn" aria-label="Back" onClick={onBack}>
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

      <div className="code-center">
        <div className="code-stage">
          <div className="code-stage-inner">
            <div className="code-digits" aria-label={`Swave code ${code}`}>
              {digits.map((d, i) => (
                <div key={`${d}-${i}`} className="code-digit">
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="code-waiting"
          data-testid="code-waiting"
          aria-live="polite"
        >
          Waiting for them to enter this code. Please wait.
        </div>

        <div
          className="code-qr"
          data-testid="code-qr"
          aria-label={`Swave invite QR code for ${inviteUrl}`}
          data-invite={inviteUrl}
        >
          <img
            className="code-qr-img"
            src={`https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(
              inviteUrl
            )}`}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>
    </main>
  );
}
