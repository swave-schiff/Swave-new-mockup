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

function Avatar({ name, size = 56, onClick, className = "" }) {
  const inits = useMemo(() => initials(name), [name]);
  return (
    <button
      onClick={onClick}
      className={`connection-avatar ${className}`.trim()}
      style={{
        width: size,
        height: size,
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
    <div role="dialog" aria-modal="true" className="confirm-overlay">
      <div className="card glass gradient-vertical confirm-sheet">
        <div className="confirm-title">{title}</div>
        <div className="confirm-body">
          {lines.map((l, i) => (
            <div key={i} className="confirm-line">
              {l}
            </div>
          ))}
        </div>
        <div className="confirm-actions-vertical">
          <button
            className="glass-btn tile glass-btn--tint edge-feather btn-sm confirm-choice-btn"
            onClick={onSecondary}
          >
            {secondary}
          </button>
          <button
            className="glass-btn tile glass-btn--tint edge-feather btn-sm confirm-choice-btn"
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
function Bubble({
  who = "me",
  at,
  children,
  onLongPress,
  contactName = "LivinLife",
}) {
  const isMe = who === "me";
  const lp = useLongPress(onLongPress, { ms: 500 });
  const bubbleClass = `card bubble ${
    isMe ? "bubble-out swave-surface-gradient-vertical" : "bubble-in"
  }`.trim();
  const nameLabel = isMe ? "Me" : contactName;
  const rowClass = `message-row ${isMe ? "message-row--out" : "message-row--in"}`;

  return (
    <div className={`msg ${isMe ? "msg--out" : "msg--in"}`}>
      <div className="msg-wrap">
        <div
          className={`message-username ${
            isMe ? "message-username--me" : ""
          }`.trim()}
        >
          {nameLabel}
        </div>
        <div className={rowClass}>
          {isMe ? (
            <>
              <div className="message-time">{at}</div>
              <div {...lp} className={bubbleClass}>
                {children}
              </div>
            </>
          ) : (
            <>
              <div {...lp} className={bubbleClass}>
                {children}
              </div>
              <div className="message-time">{at}</div>
            </>
          )}
        </div>
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
  const composerInputRef = useRef(null);
  const MAX_INPUT_HEIGHT = 120;
  const canSend = text.trim().length > 0;
  const displayName = threadUser?.name || threadTitle || "LivinLife";

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
    resetComposerHeight();
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

  const resetComposerHeight = () => {
    const el = composerInputRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.overflowY = "hidden";
    }
  };

  const handleComposerChange = (e) => {
    const val = e.target.value;
    setText(val);
    const el = composerInputRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, MAX_INPUT_HEIGHT);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY =
      el.scrollHeight > MAX_INPUT_HEIGHT ? "auto" : "hidden";
  };

  return (
    <main className="conversation-screen main-with-tabbar">
      {/* Top bar */}
      <header className="conversation-header">
        <div className="conversation-header-grid">
          <div className="conversation-header-left">
            <button className="chevron-btn" aria-label="Back" onClick={onBack}>
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

          <div
            className="conversation-header-center"
            onClick={() =>
              onOpenConnection({ id: threadUser?.id, name: displayName })
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              onOpenConnection({ id: threadUser?.id, name: displayName })
            }
          >
            <Avatar
              name={displayName}
              size={56}
              className="conversation-header-avatar"
            />
            <div className="conversation-header-name">
              {displayName}
            </div>
          </div>

          <div className="conversation-header-actions">
            <button
              onClick={() => setConfirm({ type: "thread" })}
              className="conversation-header-action"
              aria-label="Delete thread"
              title="Delete thread"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable list */}
      <section ref={scrollerRef} className="conversation-scroll">
        <div style={{ height: 8 }} />
        {messages.map((m) => (
          <Bubble
            key={m.id}
            who={m.who}
            at={m.at}
            contactName={displayName}
            onLongPress={() => setConfirm({ type: "message", id: m.id })}
          >
            {m.text}
          </Bubble>
        ))}
        <div style={{ height: 16 }} />
      </section>

      {/* Fixed composer */}
      <footer className="conversation-composer">
        <div className="composer-card card glass gradient-vertical conversation-composer-inner">
          <textarea
            ref={composerInputRef}
            className="composer-input"
            placeholder="Type your message"
            value={text}
            onChange={handleComposerChange}
            rows={1}
          />
          <button
            className={`composer-send swave-surface-gradient-vertical ${
              canSend ? "" : "composer-send--disabled"
            }`}
            onClick={send}
            aria-label="Send"
            disabled={!canSend}
            aria-disabled={!canSend}
          >
            <PlaneIcon />
          </button>
        </div>
      </footer>

      {/* Confirm modals (no fragment needed) */}
      <ConfirmSheet
        open={confirm?.type === "thread"}
        title="Permanently delete this entire message thread?"
        lines={[
          "Choose where to delete:",
          "• “Your phone only” will remove the thread just on this device.",
          "• “Both phones” will ion on the other device as well.",
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
          "• “Both phones” removes on the other device too.",
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

