// src/FeedbackHome.jsx
import React from "react";
import "./styles.css";


export default function FeedbackHome({
  onBack,
  onOpenFeedback,
  onOpenSupport,
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="screen">
      <div className="safe" />

      <main className="main main-with-tabbar">
        {/* Back chevron */}
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
              <span className="settings-label">Feedback &amp; Suggestions</span>
            </span>
            <span className="settings-chevron">
              <IconChevron />
            </span>
          </button>

          <div className="settings-divider" />

          {/* Report Issue row */}
          <button
            type="button"
            className="settings-row"
            onClick={onOpenSupport}
          >
            <span className="settings-left">
              <span className="settings-icon">
                <IconHelp />
              </span>
              <span className="settings-label">Report an Issue</span>
            </span>
            <span className="settings-chevron">
              <IconChevron />
            </span>
          </button>
        </div>
      </main>

      {/* Bottom tab bar */}
      <Tabbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
