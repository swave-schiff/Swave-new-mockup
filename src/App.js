import "./styles.css";
import React, { useState } from "react";
import CodeEntryScreen from "./CodeEntryScreen";
import LinkByUsernameScreen from "./LinkByUsernameScreen";
import UsernameEntryScreen from "./UsernameEntryScreen";
import LoginScreen from "./LoginScreen";
import RegistrationScreen from "./RegistrationScreen";
import ConnectionsScreen from "./ConnectionsScreen";
import MessagesScreen from "./MessagesScreen";
import ConversationScreen from "./ConversationScreen";
import ConnectionDetailScreen from "./ConnectionDetailScreen";
import ValidatePhoneScreen from "./ValidatePhoneScreen";
import SettingsScreen from "./SettingsScreen";
import FeedbackHome from "./FeedbackHome";
import FeedbackForm from "./FeedbackForm";
import SupportForm from "./SupportForm";
import HomeScreen from "./HomeScreen";
import CodeScreen from "./CodeScreen";
import ConnectionConfirmedScreen from "./screens/ConnectionConfirmedScreen";
import EnableUsernameLinkingScreen from "./screens/EnableUsernameLinkingScreen";
import AccountProfileScreen from "./screens/AccountProfileScreen";

export default function App() {
  const [activeTab, setActiveTab] = useState("login");
  const [pendingLinkUsername, setPendingLinkUsername] = useState("");
  const [lastTabBeforeCode, setLastTabBeforeCode] = useState("home");
  const [, setCurrentThread] = useState(null); // { id, name } when a card is tapped
  const [currentThreadName, setCurrentThreadName] = useState(null);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [pendingPhone, setPendingPhone] = useState("");
  const [, setLastAuthedTab] = useState("home");
  const [, setLastTabBeforeAccount] = useState("home");
  const [activeChatContact, setActiveChatContact] = useState(null);
  const [swaveCode, setSwaveCode] = useState("0000");
  const [activeConnectionDetail, setActiveConnectionDetail] = useState(null);
  const [faceIdLockEnabled, setFaceIdLockEnabled] = useState(false);
  const [faceIdUnlocked, setFaceIdUnlocked] = useState(false);
  const [pendingGateTarget, setPendingGateTarget] = useState(null); // "connections" | "conversations" | "faceidSettings" | null
  const [settingsInitialView, setSettingsInitialView] = useState("main");

  function setFaceIdLock(next) {
    setFaceIdLockEnabled(next);
    if (next) setFaceIdUnlocked(false);
    if (!next) {
      setPendingGateTarget(null);
    }
  }

  function goToTarget(target) {
    if (target === "connections") setActiveTab("connections");
    if (target === "conversations") setActiveTab("messages");
    if (target === "faceidSettings") {
      setSettingsInitialView("faceid");
      setActiveTab("account");
    }
  }

  function requestFaceIdGate(target) {
    if (!faceIdLockEnabled || faceIdUnlocked) {
      goToTarget(target);
      return;
    }
    setPendingGateTarget(target);
  }
  const openConversation = (contact = {}) => {
    const username =
      contact.username || contact.name || contact.handle || "LivinLife";
    const normalized = { ...contact, username, name: contact.name || username };
    const id = contact.id ?? contact.threadId ?? null;
    setActiveChatContact(normalized);
    setCurrentThread(normalized);
    setCurrentThreadName(username);
    setCurrentThreadId(id);
    setActiveTab("conversation");
  };
  const openConnectionDetail = (connection) => {
    const username = connection?.username || connection?.name || "LivinLife";
    setActiveConnectionDetail({ ...connection, name: username, username });
    setActiveTab("connectionDetail");
  };
  const generateSwaveCode = () => {
    const n = Math.floor(Math.random() * 10000);
    return String(n).padStart(4, "0");
  };
  const openSwaveCodeScreen = () => {
    setSwaveCode(generateSwaveCode());
    setActiveTab("swavecode");
  };
  const goHomeFromSettings = () => {
    setActiveTab("home");
  };

  React.useEffect(() => {
    const onboardingTabs = new Set([
      "login",
      "register",
      "signin",
      "validate",
      "code",
      "username",
    ]);
    if (
      !onboardingTabs.has(activeTab) &&
      activeTab !== "account" &&
      activeTab !== "account-profile" &&
      activeTab !== "username-linking"
    ) {
      setLastAuthedTab(activeTab);
    }
  }, [activeTab]);

  return (
    <>
      <div className={`app-shell ${pendingGateTarget ? "app-shell--hidden" : ""}`}>
        <div className="screen">
      <div className="safe" />

      {/* Header (hidden on these tabs) */}
      {activeTab === "home" ||
      activeTab === "login" ||
      activeTab === "signin" ||
      activeTab === "register" ||
      activeTab === "account" ||
      activeTab === "account-profile" ||
      activeTab === "FeedbackHome" ||
      activeTab === "feedbackForm" ||
      activeTab === "supportForm" ||
      activeTab === "username-linking" ||
      activeTab === "connectionDetail" ||
      activeTab === "messages" || // ðŸ‘ˆ add this
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
            setPendingPhone(normalizePhoneDigits(phone));
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
            alert(`Registered @${payload.username} â€¢ ${payload.phone}`);
            setActiveTab("home");
          }}
        />
      )}

      {activeTab === "validate" && (
        <ValidatePhoneScreen
          onBack={() => setActiveTab("login")}
          onSuccess={() => setActiveTab("username")}
          onValidate={async (code) => true}
          onResend={() => console.log("Resend code")}
        />
      )}

      {activeTab === "connection-confirmed" && (
        <ConnectionConfirmedScreen
          username={pendingLinkUsername || "TeaseMeTwice"}
          onChatNow={() => {
            openConversation({
              name: pendingLinkUsername || "LivinLife",
              username: pendingLinkUsername || "LivinLife",
            });
            setPendingLinkUsername("");
          }}
          onSaveLater={() => {
            setPendingLinkUsername("");
            setActiveTab("home");
          }}
        />
      )}

      {activeTab === "username" && (
        <UsernameEntryScreen
          phone={pendingPhone}
          onBack={() => setActiveTab("validate")}
          onComplete={(chosenUsername) => {
            setCurrentThreadName(chosenUsername);
            setActiveTab("home");
          }}
        />
      )}

      {activeTab === "home" && (
        <HomeScreen
          onEnterCode={() => {
            setLastTabBeforeCode(activeTab);
            setActiveTab("code");
          }}
          onOpenSwaveCode={openSwaveCodeScreen}
        />
      )}

      {activeTab === "account" && (
        <SettingsScreen
          onBack={goHomeFromSettings}
          onOpenHelp={() => setActiveTab("FeedbackHome")}
          onOpenLinking={() => setActiveTab("username-linking")}
          onOpenProfile={() => setActiveTab("account-profile")}
          initialView={settingsInitialView}
          faceIdLockEnabled={faceIdLockEnabled}
          faceIdUnlocked={faceIdUnlocked}
          onChangeFaceIdLock={setFaceIdLock}
          onRequestFaceIdSettings={() => requestFaceIdGate("faceidSettings")}
        />
      )}

      {activeTab === "account-profile" && (
        <AccountProfileScreen onBack={() => setActiveTab("account")} />
      )}
      {activeTab === "swavecode" && (
        <CodeScreen
          code={swaveCode || "0000"}
          onBack={() => setActiveTab("home")}
        />
      )}

      {activeTab === "connections" && (
        <ConnectionsScreen
          onOpenConnectionDetail={(c) => {
            openConnectionDetail(c);
          }}
        />
      )}
      {activeTab === "connectionDetail" && (
        <ConnectionDetailScreen
          connection={
            activeConnectionDetail || {
              id: "",
              name: "LivinLife",
              username: "LivinLife",
            }
          }
          onBack={() => setActiveTab("connections")}
          onOpenMessages={(c) => openConversation(c)}
          onDeleteOrBlock={() => alert("Delete/Block (placeholder)")}
        />
      )}

      {activeTab === "messages" && (
        <MessagesScreen
          onOpenThread={(t) => {
            openConversation(t);
          }}
        />
      )}

      {activeTab === "code" && (
        <CodeEntryScreen
          onSwitchToUsername={() => setActiveTab("linkByUsername")}
          onComplete={() => {
            setPendingLinkUsername("");
            setActiveTab("connection-confirmed");
          }}
          onBack={() => setActiveTab(lastTabBeforeCode)}
        />
      )}

      {activeTab === "linkByUsername" && (
        <LinkByUsernameScreen
          onBack={() => setActiveTab("code")}
          onLink={(uname) => {
            setPendingLinkUsername(uname);
            setActiveTab("connection-confirmed");
          }}
        />
      )}

      {activeTab === "username-linking" && (
        <EnableUsernameLinkingScreen onBack={() => setActiveTab("account")} />
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
          faceIdLockEnabled={faceIdLockEnabled}
          faceIdUnlocked={faceIdUnlocked}
          requestFaceIdGate={requestFaceIdGate}
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
          faceIdLockEnabled={faceIdLockEnabled}
          faceIdUnlocked={faceIdUnlocked}
          requestFaceIdGate={requestFaceIdGate}
        />
      )}

      {activeTab === "conversation" && (
        <ConversationScreen
          threadTitle={
            activeChatContact?.username ||
            activeChatContact?.name ||
            currentThreadName ||
            "LivinLife"
          }
          threadUser={{
            id: activeChatContact?.id ?? currentThreadId,
            name:
              activeChatContact?.username ||
              activeChatContact?.name ||
              currentThreadName ||
              "LivinLife",
          }}
          onBack={() => setActiveTab("messages")}
          onOpenConnection={(c) => {
            openConnectionDetail(c);
          }}
        />
      )}

      {/* Bottom nav */}
      {activeTab !== "login" &&
        activeTab !== "register" &&
        activeTab !== "signin" &&
        activeTab !== "validate" &&
        activeTab !== "code" &&
        activeTab !== "username" &&
        activeTab !== "swavecode" &&
        activeTab !== "account" &&
        activeTab !== "account-profile" &&
        activeTab !== "username-linking" &&
        activeTab !== "FeedbackHome" &&
        activeTab !== "feedbackForm" &&
        activeTab !== "supportForm" && (
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
                  const faceLocked = faceIdLockEnabled && !faceIdUnlocked;
                  if (faceLocked) {
                    requestFaceIdGate("connections");
                  } else {
                    setActiveTab("connections");
                  }
                }}
                locked={faceIdLockEnabled && !faceIdUnlocked}
              />
              <Tab
                icon={<IconMessage />}
                active={activeTab === "messages"}
                onClick={() => {
                  const faceLocked = faceIdLockEnabled && !faceIdUnlocked;
                  if (faceLocked) {
                    requestFaceIdGate("conversations");
                  } else {
                    setActiveTab("messages");
                  }
                }}
                locked={faceIdLockEnabled && !faceIdUnlocked}
              />
              <Tab
                icon={<IconMenu />}
                active={activeTab === "account"}
                onClick={() => {
                  setLastTabBeforeAccount(activeTab);
                  setSettingsInitialView("main");
                  setActiveTab("account");
                }}
              />
            </div>
          </nav>
        )}
        </div>
      </div>

      {/* FaceID gate overlay */}
      {pendingGateTarget && (
        <main className="faceid-gate-screen">
          <section className="auth-shell settings-shell">
            <div className="faceid-gate-card faceid-gate-card--plain">
              <div className="faceid-gate-icon">
                <IconFaceID />
              </div>
              <div className="faceid-gate-title">FACE ID</div>

              <button
                type="button"
                className="glass-btn glass-btn--tint faceid-gate-unlock"
                onClick={() => {
                  setFaceIdUnlocked(true);
                  const t = pendingGateTarget;
                  setPendingGateTarget(null);
                  goToTarget(t);
                }}
              >
                Unlock
              </button>

              <button
                type="button"
                className="glass-btn glass-btn--hollow faceid-gate-cancel"
                onClick={() => setPendingGateTarget(null)}
              >
                Cancel
              </button>
            </div>
          </section>
        </main>
      )}
    </>
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

function normalizePhoneDigits(val) {
  if (!val) return "";
  const digits = String(val).replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits.slice(-10);
}

/* ------------------- Screens ------------------- */
/* ------------------- Shared UI ------------------- */
function Tab({ icon, active, onClick, locked = false }) {
  return (
    <button
      className={`tab ${active ? "tab-active" : ""} ${locked ? "tabbar-item--locked" : ""}`.trim()}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

/* ---------- Inline SVG Icons (no external packages) ---------- */
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

function IconFaceID() {
  return (
    <svg viewBox="0 0 24 24" className="ico" aria-hidden="true">
      <path
        d="M7 3H5a2 2 0 0 0-2 2v2M17 3h2a2 2 0 0 1 2 2v2M7 21H5a2 2 0 0 1-2-2v-2M17 21h2a2 2 0 0 0 2-2v-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 10v.2M15 10v.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M12 10.5v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.5 16c.8.9 1.6 1.3 2.5 1.3s1.7-.4 2.5-1.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

