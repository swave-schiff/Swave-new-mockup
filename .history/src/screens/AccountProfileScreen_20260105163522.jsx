import React from "react";
import "../styles.css";

export default function AccountProfileScreen({
  onBack = () => {},
  onEditPhoto = () => {},
}) {
  const username = ":";

  return (
    <main className="auth-page connection-confirm-page">
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

      <section className="auth-shell connection-confirm-shell">
        <div className="connection-confirm-card">
          <div className="auth-copy connection-confirm-copy">
            <div className="profile-avatar">
              <div className="connection-confirm-avatar">
                <img
                  src="https://placehold.co/240x240"
                  alt={`${username} avatar`}
                />
              </div>
              <button
                type="button"
                className="profile-edit-btn"
                onClick={onEditPhoto}
                aria-label="Edit profile photo"
              >
                <IconPencil />
              </button>
            </div>
            <h2 className="connection-confirm-name">{username}</h2>
          </div>
        </div>
      </section>
    </main>
  );
}

function IconPencil() {
  return (
    <svg viewBox="0 0 24 24" className="ico">
      <path
        d="M4 17.2V20h2.8l9.9-9.9-2.8-2.8L4 17.2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M14.5 7.3l2.8 2.8 1.8-1.8a2 2 0 000-2.8l-.9-.9a2 2 0 00-2.8 0l-1.8 1.8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
