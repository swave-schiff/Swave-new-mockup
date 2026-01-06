import React from "react";
import "../styles.css";

export default function UsernameLinkingScreen({ onBack = () => {} }) {
  return (
    <main className="main">
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

      <div className="card linking-card">
        <h2 className="linking-title">Allow people to link with your username</h2>

        <div className="intro">
          <p>
            One of the main benefits of Swave is that, unlike other social
            messaging apps, you are in complete control of who can be connected
            to you. Enabling 'Username Linking' will allow anyone who knows your
            username to link to you.
          </p>
          <p className="muted">
            Tip: Only enable temporarily unless you expect many requests.
          </p>
        </div>

        <button className="btn-hollow big">
          <span className="btn-ico">
            <IconAlarm />
          </span>
          <>Only Enable Username Linking for 5 min.</>
        </button>

        <div className="or-wrap">
          <span className="or-line" />
          <span className="or-text">or</span>
          <span className="or-line" />
        </div>

        <div className="toggle-row">
          <span className="toggle-label">Always allow username linking</span>
          <label className="switch">
            <input type="checkbox" disabled />
            <span className="slider" />
          </label>
        </div>
      </div>
    </main>
  );
}

function IconAlarm() {
  return (
    <svg viewBox="0 0 24 24" className="ico">
      <circle
        cx="12"
        cy="13"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 13V9M12 13l3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 4l-3 3M21 7l-3-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
