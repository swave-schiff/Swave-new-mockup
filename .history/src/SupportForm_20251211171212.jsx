// src/SupportForm.jsx
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

export default function SupportForm({
  onBack,
  onSubmit = () => {},
  onCloseAfterSubmit,
  activeTab,
  setActiveTab,
}) {
  const ISSUE_MAX = 1000;
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);
  const [consent, setConsent] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const bodyLen = body.length;
  const remain = Math.max(0, ISSUE_MAX - bodyLen);

  const canSubmit =
    emailValid && subject.trim().length > 0 && bodyLen > 0 && consent;

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

        <div className="form-header">
          <h2 className="screen-title">Report an Issue</h2>
          <p className="form-subtle">
            We appreciate you letting us know about anything that’s not working
            as it should.
          </p>
        </div>

        {/* Email */}
        <label className="field">
          <span className="field-label">Email</span>
          <input
            className={`input ${email && !emailValid ? "input-error" : ""}`}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {email && !emailValid && (
            <div className="error">Enter a valid email.</div>
          )}
        </label>

        {/* Subject */}
        <label className="field">
          <span className="field-label">Subject</span>
          <input
            className="input"
            placeholder="Brief summary"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>

        {/* Issue description */}
        <label className="field">
          <span className="field-label">Please describe the issue</span>
          <textarea
            className="input textarea"
            rows={6}
            maxLength={ISSUE_MAX}
            placeholder="What happened? Steps to reproduce, what you expected, and what you saw."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="char-remaining">{remain} characters remaining</div>
        </label>

        {/* Screenshot */}
        <label className="field">
          <span className="field-label">Screenshot (optional)</span>
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && <div className="file-name">{file.name}</div>}
        </label>

        {/* Consent */}
        <label className="checkbox-row">
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

        {/* Submit */}
        <div className="reg-actions">
          <button
            className="btn-primary-outline"
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
