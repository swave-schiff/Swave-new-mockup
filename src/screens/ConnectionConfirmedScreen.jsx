import React from "react";
import "../styles.css";

export default function ConnectionConfirmedScreen({
  onChatNow = () => {},
  onSaveLater = () => {},
  username = "TeaseMeTwice",
}) {
  const displayUsername = username || "TeaseMeTwice";

  return (
    <main className="auth-page connection-confirm-page">
      <section className="auth-shell connection-confirm-shell">
        <div className="connection-confirm-card">
          <div className="auth-copy connection-confirm-copy">
            <p className="connection-confirm-label">You are now connected to:</p>
            <div className="connection-confirm-avatar">
              <img
                src="https://placehold.co/240x240"
                alt={`${displayUsername} avatar`}
              />
            </div>
            <h2 className="connection-confirm-name">{displayUsername}</h2>
          </div>

          <div className="connection-confirm-actions">
            <button
              className="glass-btn glass-btn--tint auth-continue"
              onClick={onChatNow}
            >
              Save &amp; Chat Now
            </button>
            <button type="button" className="resend-btn" onClick={onSaveLater}>
              Save &amp; Chat Later
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
