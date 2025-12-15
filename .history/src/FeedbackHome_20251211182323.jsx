// src/FeedbackHome.jsx
import React from "react";
import "./styles.css";
import { IconMessage } from "./components/Tabbar";

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
              <IconMessage />
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
              <IconMessage />
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
