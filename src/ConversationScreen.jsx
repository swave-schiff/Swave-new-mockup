// src/ConversationScreen.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

/* ---------- Small helpers ---------- */

function initials(name) {
  const p = String(name || "")
    .trim()
    .split(/\s+/);
  return ((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase() || "U";
}

function Avatar({ name, size = 56, onClick }) {
  const inits = useMemo(() => initials(name), [name]);
  return (
    <button
      onClick={onClick}
      className="card glass"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        fontWeight: 700,
        color: "#e9eef9",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.20), 0 6px 16px rgba(0,0,0,0.45)",
      }}
      aria-label={`${name || "User"} profile`}
    >
      {inits}
    </button>
  );
}

function TrashIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...props}>
      <path
        d="M3 6h18M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlaneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...props}>
      <path
        d="M22 2L11 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M22 2L15 22l-4-9-9-4 20-7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function useLongPress(cb, { ms = 500 } = {}) {
  const t = useRef(null);
  const start = (e) => {
    e.preventDefault();
    t.current = setTimeout(() => cb(e), ms);
  };
  const clear = () => {
    if (t.current) clearTimeout(t.current);
    t.current = null;
  };
  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: clear,
    onContextMenu: (e) => e.preventDefault(),
  };
}

function ConfirmSheet({
  open,
  title,
  lines = [],
  primary,
  secondary,
  onPrimary,
  onSecondary,
  onClose,
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(0,0,0,0.45)",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      <div className="card glass confirm-sheet">
        <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{title}</div>
        <div style={{ color: "#cfd6e6", lineHeight: 1.4 }}>
          {lines.map((l, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              {l}
            </div>
          ))}
        </div>
        <div className="confirm-actions-vertical">
          <button
            className="glass-btn tile glass-btn--hollow edge-feather btn-sm"
            onClick={onSecondary}
          >
            {secondary}
          </button>
          <button
            className="glass-btn tile glass-btn--tint edge-feather btn-sm"
            onClick={onPrimary}
          >
            {primary}
          </button>
          <button
            className="glass-btn tile glass-btn--hollow edge-feather btn-sm cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Demo conversation seed ---------- */
const SEED = [
  {
    id: "m1",
    who: "them",
    text: `Our server said these shots are "compliments of the secret admirer across the bar in the black button down with arm tats" I'm presuming that's you?`,
    at: "12:17",
  },
  {
    id: "m2",
    who: "me",
    text: "Thought u girls might be thirsty after shaking it out there on the dance floor",
    at: "12:18",
  },
  {
    id: "m3",
    who: "them",
    text: "You buy shots often for strangers you see on the dance floor?  How bout u show us some of your moves",
    at: "12:19",
  },
  {
    id: "m4",
    who: "me",
    text: "I already showed you one of my moves when i bought you those shots didn't I?",
    at: "12:20",
  },
  {
    id: "m5",
    who: "them",
    text: "My friend is asking if your friend standing to your left is single?  She thinks he's cute",
    at: "12:21",
  },
  {
    id: "m6",
    who: "me",
    text: "He is!  How bout u girls join us?  We have a big table...w/ bottle service 🥂🍾🍸",
    at: "12:22",
  },
];

/* ---------- Bubble ---------- */
function Bubble({ who = "me", at, children, onLongPress }) {
  const isMe = who === "me";
  const lp = useLongPress(onLongPress, { ms: 500 });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMe ? "1fr auto" : "auto 1fr",
        alignItems: "end",
        gap: 8,
        margin: "6px 10px",
      }}
    >
      {!isMe && <div />}
      <div
        {...lp}
        className="card"
        style={{
          maxWidth: "78vw",
          fontSize: "0.98rem",
          lineHeight: 1.35,
          padding: "12px 14px",
          borderRadius: 16,
          wordBreak: "break-word",
          color: isMe ? "#eaf2ff" : "#0f1320",
          background: isMe
            ? "linear-gradient(180deg, rgba(72,130,255,0.95), rgba(38,98,255,0.95))"
            : "rgba(255,255,255,0.85)",
          boxShadow: isMe
            ? "0 6px 14px rgba(0,0,0,0.45)"
            : "0 4px 10px rgba(0,0,0,0.35)",
        }}
      >
        {children}
      </div>
      {isMe && <div />}
      <div
        style={{
          gridColumn: isMe ? "2/3" : "1/2",
          color: "#aeb7c9",
          fontSize: 12,
          padding: isMe ? "0 6px 0 0" : "0 0 0 6px",
        }}
      >
        {at}
      </div>
    </div>
  );
}

/* ---------- Screen ---------- */
export default function ConversationScreen({
  threadTitle = "LivinLife",
  threadUser = { id: "u1", name: "LivinLife" },
  onBack = () => {},
  onOpenConnection = () => {},
  onDeleteThread = (scope) => alert(`Delete thread: ${scope}`),
  onDeleteMessage = (id, scope) => alert(`Delete message ${id}: ${scope}`),
}) {
  const [messages, setMessages] = useState(SEED);
  const [text, setText] = useState("");
  const [confirm, setConfirm] = useState(null); // {type:'thread'|'message', id?}
  const scrollerRef = useRef(null);

  // Set --sbw CSS var (scrollbar width) so our fixed composer avoids it
  useEffect(() => {
    const applyScrollbarWidthVar = () => {
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--sbw", `${sbw}px`);
    };
    applyScrollbarWidthVar();
    window.addEventListener("resize", applyScrollbarWidthVar);
    return () => window.removeEventListener("resize", applyScrollbarWidthVar);
  }, []);

  // autoscroll to bottom when messages change
  useEffect(() => {
    const sc = scrollerRef.current;
    if (sc) sc.scrollTop = sc.scrollHeight;
  }, [messages.length]);

  const send = () => {
    const v = text.trim();
    if (!v) return;
    setMessages((m) => [
      ...m,
      {
        id: `m${Date.now()}`,
        who: "me",
        text: v,
        at: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      },
    ]);
    setText("");
  };

  const doDeleteThread = (scope) => {
    setMessages([]);
    setConfirm(null);
    onDeleteThread(scope);
  };
  const doDeleteMessage = (scope) => {
    if (confirm?.id) {
      setMessages((m) => m.filter((x) => x.id !== confirm.id));
      onDeleteMessage(confirm.id, scope);
    }
    setConfirm(null);
  };

  return (
    <main className="conversation-screen">
      {/* Top bar */}
      <div className="conv-topbar">
        <div className="top-actions" style={{ position: "static" }}>
          <button className="chevron-btn" aria-label="Back" onClick={onBack}>
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

        <div
          className="conv-header-center"
          onClick={() =>
            onOpenConnection({ id: threadUser?.id, name: threadUser?.name })
          }
          role="button"
          tabIndex={0}
        >
          <Avatar name={threadUser?.name || threadTitle} size={56} />
          <button className="conv-title-btn">
            {threadUser?.name || threadTitle}
          </button>
        </div>

        <div className="conv-header-actions">
          <button
            onClick={() => setConfirm({ type: "thread" })}
            className="icon-btn"
            aria-label="Delete thread"
            title="Delete thread"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Scrollable list */}
      <div ref={scrollerRef} className="conv-scroll">
        <div style={{ height: 8 }} />
        {messages.map((m) => (
          <Bubble
            key={m.id}
            who={m.who}
            at={m.at}
            onLongPress={() => setConfirm({ type: "message", id: m.id })}
          >
            {m.text}
          </Bubble>
        ))}
        <div style={{ height: 16 }} />
      </div>

      {/* Fixed composer */}
      <div className="composer-fixed">
        <div className="composer-card card glass">
          <input
            className="composer-input"
            placeholder="Type your message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            className="glass-btn tile glass-btn--tint edge-feather btn-sm"
            onClick={send}
            aria-label="Send"
          >
            <PlaneIcon />
          </button>
        </div>
      </div>

      {/* Confirm modals (no fragment needed) */}
      <ConfirmSheet
        open={confirm?.type === "thread"}
        title="Permanently delete this entire message thread?"
        lines={[
          "Choose where to delete:",
          "• “Your phone only” will remove the thread just on this device.",
          "• “Both phones” will request deletion on the other device as well.",
        ]}
        primary="Both phones"
        secondary="Your phone only"
        onPrimary={() => doDeleteThread("both")}
        onSecondary={() => doDeleteThread("local")}
        onClose={() => setConfirm(null)}
      />

      <ConfirmSheet
        open={confirm?.type === "message"}
        title="Delete this message?"
        lines={[
          "Choose where to delete:",
          "• “Your phone only” removes only on this device.",
          "• “Both phones” requests deletion on the other device too.",
        ]}
        primary="Both phones"
        secondary="Your phone only"
        onPrimary={() => doDeleteMessage("both")}
        onSecondary={() => doDeleteMessage("local")}
        onClose={() => setConfirm(null)}
      />
    </main>
  );
}
