import React from "react";
import "../styles.css";

export default function ConnectionConfirmedScreen() {
  // Temporary placeholder data until wiring to real profile details
  const username = "TeaseMeTwice";

  return (
    <main className="auth-page connection-confirm-page">
      <section className="auth-shell connection-confirm-shell">
        <div className="auth-card card glass connection-confirm-card">
          <div className="auth-copy connection-confirm-copy">
            <p className="connection-confirm-label">You are now connected to:</p>
            <div className="connection-confirm-avatar">
              <img
                src="https://placehold.co/240x240"
                alt={`${username} avatar`}
              />
            </div>
            <h2 className="connection-confirm-name">{username}</h2>
          </div>

          <div className="connection-confirm-actions">
            <button className="glass-btn glass-btn--tint auth-continue">
              Save &amp; Chat Now
            </button>
            <button type="button" className="resend-btn">
              Save &amp; Chat Later
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
