import "./styles.css";
import React, { useState } from "react";
import CodeEntryScreen from "./CodeEntryScreen";
import UsernameEntryScreen from "./UsernameEntryScreen";
import LoginScreen from "./LoginScreen";
import RegistrationScreen from "./RegistrationScreen";
import ConnectionsScreen from "./ConnectionsScreen";
import MessagesScreen from "./MessagesScreen";
import ConversationScreen from "./ConversationScreen";
import ConnectionDetailScreen from "./ConnectionDetailScreen";
import ValidatePhoneScreen from "./ValidatePhoneScreen";
import AccountPreferencesScreen from "./AccountPreferencesScreen";
import FeedbackHome from "./FeedbackHome";
import FeedbackForm from "./FeedbackForm";
import SupportForm from "./SupportForm";

export default function App() {
  const [activeTab, setActiveTab] = useState("login");
  const [showUsername, setShowUsername] = useState(false);
  const [lastTabBeforeCode, setLastTabBeforeCode] = useState("home");
  const [linkingAlways, setLinkingAlways] = useState(false);
  const [linkingUntil, setLinkingUntil] = useState(null); // ms epoch or null
  const [currentThread, setCurrentThread] = useState(null); // { id, name } when a card is tapped
  const [currentThreadName, setCurrentThreadName] = useState(null);
  const [currentConnection, setCurrentConnection] = useState(null);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [lastAuthedTab, setLastAuthedTab] = useState("home");

  React.useEffect(() => {
    const onboardingTabs = new Set([
      "login",
      "register",
      "signin",
      "validate",
      "code",
      "username",
    ]);
    if (!onboardingTabs.has(activeTab) && activeTab !== "account") {
      setLastAuthedTab(activeTab);
    }
  }, [activeTab]);

  return (
    <div className="screen">
      <div className="safe" />

      {/* Header (hidden on these tabs) */}
      {activeTab === "home" ||
      activeTab === "login" ||
      activeTab === "signin" ||
      activeTab === "register" ||
      activeTab === "account" ||
      activeTab === "FeedbackHome" ||
      activeTab === "feedbackForm" ||
      activeTab === "supportForm" ||
      activeTab === "linking" ||
      activeTab === "connectionDetail" ||
      activeTab === "messages" || // 👈 add this
      activeTab === "connections" ? null : activeTab ===
        "conversation" ? null : (
        <header className="header">
          <h1>{tabTitle(activeTab)}</h1>
        </header>
      )}

      {/* Body */}
      {activeTab === "login" && (
        <LoginScreen
          onStartVerification={({ phone }) => {
            console.log("Start verification for", phone);
            setActiveTab("validate");
          }}
        />
      )}

      {activeTab === "register" && (
        <RegistrationScreen
          onBack={() => setActiveTab("login")}
          onComplete={(payload) => {
            // TODO: replace alert with real API
            alert(`Registered @${payload.username} • ${payload.phone}`);
            setActiveTab("home");
          }}
        />
      )}

      {activeTab === "validate" && (
        <ValidatePhoneScreen
          onBack={() => setActiveTab("login")}
          onSuccess={() => setActiveTab("home")}
          onValidate={async (code) => true}
          onResend={() => console.log("Resend code")}
        />
      )}

      {activeTab === "home" && (
        <HomeScreen
          onEnterCode={() => {
            setLastTabBeforeCode(activeTab);
            setShowUsername(false);
            setActiveTab("code");
          }}
        />
      )}

      {activeTab === "account" && (
        <AccountPreferencesScreen
          onBack={() => setActiveTab(lastAuthedTab)}
          onOpenHelp={() => setActiveTab("FeedbackHome")}
          onOpenLinking={() => setActiveTab("linking")}
        />
      )}

      {activeTab === "connections" && (
        <ConnectionsScreen
          onOpenConnection={(c) => {
            setCurrentConnection(c);
            setActiveTab("connectionDetail");
          }}
          // (optional fallback)
          onOpenConversation={(c) => {
            setCurrentThread({ id: c.id, name: c.name });
            setActiveTab("conversation");
          }}
        />
      )}

      {activeTab === "messages" && (
        <MessagesScreen
          onOpenThread={(t) => {
            setCurrentThread({ id: t.id, name: t.name });
            setActiveTab("conversation");
          }}
        />
      )}

      {activeTab === "conversation" && (
        <ConversationScreen
          threadTitle={currentThreadName || "LivinLife"}
          threadUser={{ id: currentThreadId, name: currentThreadName }} // 👈 pass the user
          onBack={() => setActiveTab("messages")}
          onOpenConnection={(c) => {
            setSelectedConnection(c); // store which user was clicked
            setActiveTab("connectionDetail");
          }}
        />
      )}

      {activeTab === "code" && !showUsername && (
        <CodeEntryScreen
          onSwitchToUsername={() => setShowUsername(true)}
          onBack={() => setActiveTab(lastTabBeforeCode)}
        />
      )}
      {activeTab === "code" && showUsername && (
        <UsernameEntryScreen onBack={() => setShowUsername(false)} />
      )}

      {activeTab === "linking" && (
        <UsernameLinkingScreen
          onBack={() => setActiveTab("account")}
          always={linkingAlways}
          until={linkingUntil}
          onEnableTimed={(minutes = 5) => {
            setLinkingUntil(Date.now() + minutes * 60_000);
            setLinkingAlways(false);
          }}
          onDisableTimed={() => setLinkingUntil(null)}
          onToggleAlways={(val) => {
            setLinkingAlways(val);
            if (val) setLinkingUntil(null);
          }}
        />
      )}

      {activeTab === "FeedbackHome" && (
        <FeedbackHome
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onBack={() => setActiveTab("account")}
          onOpenFeedback={() => setActiveTab("feedbackForm")}
          onOpenSupport={() => setActiveTab("supportForm")}
        />
      )}

      {activeTab === "feedbackForm" && (
        <FeedbackForm
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onBack={() => setActiveTab("FeedbackHome")}
          onSubmit={(payload) => {
            // TODO: send feedback payload
          }}
          onCloseAfterSubmit={() => setActiveTab("account")}
        />
      )}

      {activeTab === "supportForm" && (
        <SupportForm
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onBack={() => setActiveTab("FeedbackHome")}
          onSubmit={(payload) => {
            // TODO: send support ticket payload
          }}
          onCloseAfterSubmit={() => setActiveTab("account")}
        />
      )}

      {activeTab === "conversation" && (
        <ConversationScreen
          threadTitle={currentThreadName || "LivinLife"}
          threadUser={{ id: currentThreadId, name: currentThreadName }} // 👈 pass the user
          onBack={() => setActiveTab("messages")}
          onOpenConnection={(c) => {
            setSelectedConnection(c); // store which user was clicked
            setActiveTab("connectionDetail");
          }}
        />
      )}

      {/* Bottom nav */}
      {activeTab !== "login" &&
        activeTab !== "register" &&
        activeTab !== "signin" &&
        activeTab !== "validate" &&
        activeTab !== "code" &&
        activeTab !== "username" && (
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
                onClick={() => setActiveTab("connections")}
              />
              <Tab
                icon={<IconMessage />}
                active={activeTab === "messages"}
                onClick={() => setActiveTab("messages")}
              />
              <Tab
                icon={<IconMenu />}
                active={activeTab === "account"}
                onClick={() => setActiveTab("account")}
              />
            </div>
          </nav>
        )}
    </div>
  );
}

function tabTitle(tab) {
  switch (tab) {
    case "account":
      return "Account Preferences";
    case "Connections":
      return "Connections";
    case "messages":
      return "Messages";
    default:
      return "";
  }
}

/* ------------------- Screens ------------------- */
function HomeScreen({ onEnterCode }) {
  return (
    <main className="home-main">
      <div className="swave-circle glow">
        <h2>Tap to Swave</h2>
        <p className="subtext">
          Generate a 4-digit
          <br />
          code to flash
        </p>
      </div>

      <div className="input-block">
        <p className="subtext">Did someone flash a swave code at you?</p>

        {/* iOS-26 glass tile button with feathered rim */}
        <button
          className="glass-btn tile glass-btn--hollow edge-feather btn-one-line"
          onClick={onEnterCode}
        >
          Enter Swave Code or Username
        </button>
      </div>
    </main>
  );
}

function Placeholder({ label }) {
  return (
    <main className="main">
      <div className="card">
        <div className="row">
          <span className="row-label">{label} screen coming soon…</span>
        </div>
      </div>
    </main>
  );
}


/* ------------------- Username Linking Screen ------------------- */
function UsernameLinkingScreen({
  onBack,
  always,
  until,
  onEnableTimed,
  onDisableTimed,
  onToggleAlways,
}) {
  const [now, setNow] = React.useState(Date.now());

  // Tick every second to update countdown and auto-stop when expired
  React.useEffect(() => {
    if (!until) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [until]);

  const remainingMs = until ? Math.max(0, until - now) : 0;
  const timedActive = until && remainingMs > 0;

  // auto-clear when it expires
  React.useEffect(() => {
    if (until && remainingMs <= 0) onDisableTimed();
  }, [remainingMs, until, onDisableTimed]);

  const mm = Math.floor(remainingMs / 60000);
  const ss = Math.floor((remainingMs % 60000) / 1000)
    .toString()
    .padStart(2, "0");

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
        <h2 className="linking-title">
          Allow people to link with your username
        </h2>

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

        {/* Timed enable */}
        <button
          className={`btn-hollow big ${timedActive ? "btn-on" : ""}`}
          onClick={() => (timedActive ? onDisableTimed() : onEnableTimed(5))}
        >
          <span className="btn-ico">
            <IconAlarm />
          </span>
          {timedActive ? (
            <>
              Enabled • {mm}:{ss}
            </>
          ) : (
            <>Only Enable Username Linking for 5 min.</>
          )}
        </button>

        {/* OR divider */}
        <div className="or-wrap">
          <span className="or-line" />
          <span className="or-text">or</span>
          <span className="or-line" />
        </div>

        {/* Always allow */}
        <div className="toggle-row">
          <span className="toggle-label">Always allow username linking</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={!!always}
              onChange={(e) => onToggleAlways(e.target.checked)}
            />
            <span className="slider" />
          </label>
        </div>
      </div>
    </main>
  );
}

/* ------------------- Shared UI ------------------- */
function Tab({ icon, active, onClick }) {
  return (
    <button className={`tab ${active ? "tab-active" : ""}`} onClick={onClick}>
      {icon}
    </button>
  );
}

/* ---------- Inline SVG Icons (no external packages) ---------- */
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
function IconLink() {
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
function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" className="ico">
      <path
        d="M10 5H6a2 2 0 00-2 2v10a2 2 0 002 2h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M14 16l4-4-4-4M18 12H9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconHome() {
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
function IconMessage() {
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
function IconUsers() {
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
function IconMenu() {
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
