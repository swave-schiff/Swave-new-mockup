// src/App.js
import React, { useState } from "react";
import "./styles.css";

import LoginScreen from "./LoginScreen";
import AccountPreferencesScreen from "./AccountPreferencesScreen";
import ConnectionsScreen from "./ConnectionsScreen";
import MessagesScreen from "./MessagesScreen";
import ConversationScreen from "./ConversationScreen";
import ConnectionDetailScreen from "./ConnectionDetailScreen";
import CodeEntryScreen from "./CodeEntryScreen";
import UsernameEntryScreen from "./UsernameEntryScreen";
import Placeholder from "./Placeholder";

// Icons for bottom nav
import { IconHome, IconUsers, IconMessage, IconMenu } from "./Icons";

export default function App() {
  // Navigation state
  const [activeTab, setActiveTab] = useState("login");
  const [lastTabBeforeCode, setLastTabBeforeCode] = useState("login");
  const [showUsername, setShowUsername] = useState(false);

  // For active conversations and connections
  const [currentThread, setCurrentThread] = useState({ id: null, name: null });
  const [currentConnection, setCurrentConnection] = useState(null);

  const tabTitle = (tab) => {
    switch (tab) {
      case "account":
        return "Account Preferences";
      case "connections":
        return "Connections";
      case "messages":
        return "Messages";
      default:
        return "";
    }
  };

  return (
    <div className="screen">
      <div className="safe" />

      {/* Header (hidden on these tabs) */}
      {activeTab === "login" ||
      activeTab === "signin" ||
      activeTab === "register" ||
      activeTab === "account" ||
      activeTab === "feedbackHub" ||
      activeTab === "feedbackForm" ||
      activeTab === "supportForm" ||
      activeTab === "linking" ? null : (
        <header className="header">
          <h1>{tabTitle(activeTab)}</h1>
        </header>
      )}

      {/* ===== Main Screens ===== */}

      {activeTab === "login" && (
        <LoginScreen
          onLogin={() => setActiveTab("connections")}
          onRegister={() => setActiveTab("register")}
          onEnterCode={() => {
            setLastTabBeforeCode("login");
            setActiveTab("code");
          }}
        />
      )}

      {activeTab === "account" && (
        <AccountPreferencesScreen
          onOpenHelp={() => setActiveTab("feedbackHub")}
          onOpenLinking={() => setActiveTab("linking")}
        />
      )}

      {activeTab === "connections" && (
        <ConnectionsScreen
          onOpenConversation={(c) => {
            setCurrentThread({ id: c.id, name: c.name });
            setActiveTab("conversation");
          }}
          onOpenConnection={(c) => {
            setCurrentConnection(c);
            setActiveTab("connectionDetail");
          }}
        />
      )}

      {activeTab === "connectionDetail" && (
        <ConnectionDetailScreen
          connection={currentConnection}
          onBack={() => setActiveTab("connections")}
          onOpenMessages={(c) => {
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
          threadTitle={currentThread?.name || "LivinLife"}
          threadUser={{
            id: currentThread?.id,
            name: currentThread?.name,
          }}
          onBack={() => setActiveTab("messages")}
          onOpenConnection={(c) => {
            setCurrentConnection(c);
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

      {activeTab === "feedbackHub" && (
        <Placeholder label="Support & Feedback" />
      )}
      {activeTab === "feedbackForm" && <Placeholder label="Feedback Form" />}
      {activeTab === "supportForm" && <Placeholder label="Support Form" />}
      {activeTab === "linking" && <Placeholder label="Username Linking" />}

      {/* ===== Bottom Nav ===== */}
      {activeTab !== "login" &&
        activeTab !== "register" &&
        activeTab !== "signin" && (
          <nav className="tabbar">
            <div className="tabwrap">
              <Tab
                icon={<IconHome />}
                active={activeTab === "connections"}
                onClick={() => setActiveTab("connections")}
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

/* ===== Tab Component ===== */
function Tab({ icon, active, onClick }) {
  return (
    <button
      className={`tab ${active ? "tab-active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {icon}
    </button>
  );
}
