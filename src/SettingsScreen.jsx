// src/SettingsScreen.jsx
import React from "react";
import "./styles.css";

export default function SettingsScreen({
  onBack = () => {},
  onOpenHelp = () => {},
  onOpenLinking = () => {},
  onOpenProfile = () => {},
}) {
  const rows = [
    {
      key: "profile",
      label: "My Account & Profile",
      icon: <IconUser />,
      onClick: onOpenProfile,
    },
    {
      key: "linking",
      label: "Enable Username Linking",
      icon: <IconChain />,
      onClick: onOpenLinking,
    },
    {
      key: "feedback",
      label: "Feedback & Support",
      icon: <IconHelp />,
      onClick: onOpenHelp,
    },
    { key: "logout", label: "Log Out", icon: <IconLogout />, className: "logout-row" },
  ];

  return (
    <div className="screen">
      <div className="safe" />
      <main className="settings-main main-with-tabbar">
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

        <div className="card glass account-card settings-card">
          {rows.map(({ key, label, icon, onClick, className }, idx) => (
            <React.Fragment key={key}>
              <button
                type="button"
                className={`settings-row ${className || ""}`.trim()}
                onClick={onClick}
              >
                <span className="settings-left">
                  <span className="settings-icon">{icon}</span>
                  <span className="settings-label">{label}</span>
                </span>
                <span className="settings-chevron">
                  <IconChevron />
                </span>
              </button>
              {idx < rows.length - 1 && <div className="settings-divider" />}
            </React.Fragment>
          ))}
        </div>
      </main>
    </div>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" className="ico">
      <circle
        cx="12"
        cy="8"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 20a8 8 0 0116 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconChain() {
  return (
    <svg viewBox="0 0 24 24" className="ico">
      <path
        d="M10 13l-1.5 1.5a4 4 0 01-5.7 0 4 4 0 010-5.7L6.3 5.6a4 4 0 015.7 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M14 11l1.5-1.5a4 4 0 015.7 0 4 4 0 010 5.7l-3.5 3.5a4 4 0 01-5.7 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconHelp() {
  return (
    <svg viewBox="0 0 24 24" className="ico">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9.5 9a2.5 2.5 0 014.6 1.1c0 1.8-2.1 2.1-2.1 3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1.2" fill="currentColor" />
    </svg>
  );
}

function IconLogout() {
  return (
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
      className="ico"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg viewBox="0 0 24 24" className="ico">
      <path
        d="M9 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
