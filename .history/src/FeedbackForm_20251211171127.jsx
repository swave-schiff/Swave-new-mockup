// src/FeedbackForm.jsx
import React, { useState } from "react";
import "./styles.css";
import { Tabbar } from "./components/Tabbar";

function ThankYouModal({ message, onClose }) {
  return (
    <div className="overlay">
      <div className="overlay-card">
        <div className="overlay-msg">{message}</div>
        <button className="btn-primary-outline" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default function FeedbackForm({
  onBack,
  onSubmit = () => {},
  onCloseAfterSubmit,
  activeTab,
  setActiveTab,
}) {
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [showThanks, setShowThanks] = useState(false);

  const maxChars = 1000;
  const remaining = maxChars - text.length;
  const canSubmit = text.trim().length > 0; // email optional

  return (
    <div className="screen">
      <div className="safe" />

      <main className="main main-with-tabbar">
        {/* Back chevron */}
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

        {/* Title */}
        <h2 className="screen-title">Feedback &amp; Suggestions</h2>

        {/* Feedback textarea */}
        <label className="field">
          <span className="field-label">Your feedback</span>
          <textarea
            className="input textarea"
            rows={6}
            maxLength={maxChars}
            placeholder="Tell us what you like and what we can improve…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="char-remaining">
            {remaining} characters remaining
          </div>
        </label>

        {/* Optional email */}
        <label className="field">
          <span className="field-label">Email (optional)</span>
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="help-text">
            Enter email if it is okay for us to write you back.
          </div>
        </label>

        {/* Submit */}
        <div className="reg-actions">
          <button
            className="btn-primary-outline"
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
            onClick={() => {
              if (!canSubmit) return;
              onSubmit({ text, email: email.trim() || null });
              setShowThanks(true);
            }}
          >
            Submit
          </button>
        </div>

        {showThanks && (
          <ThankYouModal
            message="Thank you. We try our best to respond within 1 business day."
            onClose={() => {
              setShowThanks(false);
              onCloseAfterSubmit?.();
            }}
          />
        )}
      </main>

      <Tabbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
