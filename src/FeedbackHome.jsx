// src/FeedbackHome.jsx
import React from "react";
import "./styles.css";

export default function FeedbackHome({
  onBack,
  onOpenFeedback,
  onOpenSupport,
}) {
  return (
    <main className="main">
      {/* Back chevron */}
      <div className="top-actions">
        <button className="chevron-btn" onClick={onBack} aria-label="Back">
          <svg
            className="chevron-svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
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

      {/* One glass card with two rows */}
      <div className="card glass settings-card account-card">
        {/* Feedback row */}
        <button
          type="button"
          className="settings-row"
          onClick={onOpenFeedback}
        >
          <span className="settings-left">
            <span className="settings-icon">
              {/* Message icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <span className="settings-label">
              Feedback &amp; Suggestions
            </span>
          </span>

          <span className="settings-chevron">
            <svg
              className="chevron-svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M9 6L15 12L9 18"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        <div className="settings-divider" />

        {/* Report issue row */}
        <button
          type="button"
          className="settings-row"
          onClick={onOpenSupport}
        >
          <span className="settings-left">
            <span className="settings-icon">
              {/* Message icon reused */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <span className="settings-label">
              Report an Issue
            </span>
          </span>

          <span className="settings-chevron">
            <svg
              className="chevron-svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M9 6L15 12L9 18"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
    </main>
  );
}
