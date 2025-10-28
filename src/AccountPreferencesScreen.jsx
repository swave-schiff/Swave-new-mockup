// src/AccountPreferencesScreen.jsx
import React from "react";
import "./styles.css";

export default function AccountPreferencesScreen({
  onOpenHelp = () => {},
  onOpenLinking = () => {},
}) {
  return (
    <main className="account-main">
      <h1 className="screen-title" style={{ margin: "8px 0 12px 8px" }}>
        Account Preferences
      </h1>

      <div className="account-list">
        <button
          className="account-row card glass"
          onClick={onOpenLinking}
          aria-label="Enable Username Linking"
        >
          <div className="account-row-title">Enable username Linking</div>
          <div className="account-row-sub">
            Temporarily allow others to connect to you by typing your username.
          </div>
        </button>

        <button
          className="account-row card glass"
          onClick={onOpenHelp}
          aria-label="Feedback & Support"
        >
          <div className="account-row-title">Feedback & Support</div>
          <div className="account-row-sub">
            Send feedback or report an issue.
          </div>
        </button>
      </div>
    </main>
  );
}
