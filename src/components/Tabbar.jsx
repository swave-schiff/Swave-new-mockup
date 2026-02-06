import React from "react";

export function Tabbar({
  activeTab,
  setActiveTab,
  faceIdLockEnabled = false,
  faceIdUnlocked = true,
  requestFaceIdGate = () => {},
}) {
  const faceLocked = faceIdLockEnabled && !faceIdUnlocked;
  return (
    <nav className="tabbar">
      <div className="tabwrap">
        <Tab
          icon={<IconHome />}
          active={activeTab === "home"}
          onClick={() => setActiveTab("home")}
        />
        <Tab
          icon={<IconUsers />}
          active={activeTab === "connections"}
          onClick={() => {
            if (faceLocked) {
              requestFaceIdGate("connections");
            } else {
              setActiveTab("connections");
            }
          }}
          locked={faceLocked}
        />
        <Tab
          icon={<IconMessage />}
          active={activeTab === "messages"}
          onClick={() => {
            if (faceLocked) {
              requestFaceIdGate("conversations");
            } else {
              setActiveTab("messages");
            }
          }}
          locked={faceLocked}
        />
        <Tab
          icon={<IconMenu />}
          active={activeTab === "account"}
          onClick={() => setActiveTab("account")}
        />
      </div>
    </nav>
  );
}

export function Tab({ icon, active, onClick, locked = false }) {
  return (
    <button
      className={`tab ${active ? "tab-active" : ""} ${locked ? "tabbar-item--locked" : ""}`.trim()}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

export function IconHome() {
  return (
    <svg viewBox="0 0 24 24" className="ico">
      <path
        d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" className="ico">
      <circle
        cx="9"
        cy="9"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M2 19a7 7 0 0114 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="17"
        cy="9"
        r="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M14.5 17a6 6 0 017.5 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function IconMessage() {
  return (
    <svg viewBox="0 0 24 24" className="ico">
      <path
        d="M4 5h16v12H8l-4 4V5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" className="ico">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
