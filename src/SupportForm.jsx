// src/SupportForm.jsx
import React, { useRef, useState } from "react";
import "./styles.css";

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

export default function SupportForm({
  onBack,
  onSubmit = () => {},
  onCloseAfterSubmit,
  activeTab,
  setActiveTab,
  faceIdLockEnabled = false,
  faceIdUnlocked = true,
  requestFaceIdGate = () => {},
}) {
  const ISSUE_MAX = 1000;
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);
  const [consent, setConsent] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const fileInputRef = useRef(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const bodyLen = body.length;
  const remain = Math.max(0, ISSUE_MAX - bodyLen);

  const canSubmit = emailValid && bodyLen > 0 && consent;

  return (
    <div className="screen">
      <div className="safe" />

      <main className="auth-page main-with-tabbar settings-subpage-no-tabbar">
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

        <section className="auth-shell">
          <div className="auth-copy">
            <h2 className="screen-title">Report an Issue</h2>
            <p className="auth-subtext">
              We appreciate you letting us know about anything that's not
              working as it should.
            </p>
          </div>

          <div className="auth-form">
            <label className="auth-field support-field">
              <span className="auth-field-label">Email</span>
              <div
                className={`phone-input-wrap ${
                  email && !emailValid ? "input-error" : ""
                }`}
              >
                <input
                  className="phone-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {email && !emailValid && (
                <div className="error">Enter a valid email.</div>
              )}
            </label>

            <label className="auth-field support-field">
              <span className="auth-field-label">Please describe the issue</span>
              <div className="phone-input-wrap">
                <textarea
                  className="phone-input support-textarea"
                  rows={6}
                  maxLength={ISSUE_MAX}
                  placeholder="What happened? Steps to reproduce, what you expected, and what you saw."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>
              <div className="feedback-remaining support-remaining">
                {remain} characters remaining
              </div>
            </label>

            <label className="auth-field support-field">
              <div className="upload-stack">
                <input
                  ref={fileInputRef}
                  className="file-input-hidden"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button
                  type="button"
                  className="glass-btn attach-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Attach Screenshot (optional)
                </button>
                {file && <div className="file-name muted">{file.name}</div>}
              </div>
            </label>

            <label className="checkbox-row glass-checkbox">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                I agree to allow helpful information about phone make/model and
                other details including app version to be submitted with this
                ticket.
              </span>
            </label>

            <div className="support-submit">
              <button
                className="glass-btn glass-btn--tint auth-continue"
                disabled={!canSubmit}
                aria-disabled={!canSubmit}
                onClick={() => {
                  if (!canSubmit) return;
                  onSubmit({ email, subject, body, file, consent });
                  setShowThanks(true);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </section>

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
    </div>
  );
}
