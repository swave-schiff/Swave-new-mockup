// src/MessagesScreen.jsx
import React, { useMemo, useState, useEffect } from "react";
import "./styles.css";

/* Your Message icon (same as bottom nav) */
function IconMessage() {
  return (
    <svg viewBox="0 0 24 24" className="ico" aria-hidden="true">
      <path
        d="M4 5h16v12H8l-4 4V5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

/* Seed conversations (sample data) */
const SEED_THREADS = [
  {
    id: "T1",
    name: "TeaseMeTwice",
    handle: "avamk",
    lastMessage: "U joining us l8r",
    lastTimestamp: "2025-10-12T14:22:00Z",
  },
  {
    id: "T2",
    name: "MissMysterious",
    handle: "benc",
    lastMessage: "Heading to club in 30",
    lastTimestamp: "2025-10-15T07:45:00Z",
  },
  {
    id: "T3",
    name: "BarelyBehaving",
    handle: "chloen",
    lastMessage: "Typing…",
    lastTimestamp: "2025-10-15T15:05:00Z",
  },
  {
    id: "T4",
    name: "SinsInHeels",
    handle: "diegos",
    lastMessage: "Wanna hang this Sat?",
    lastTimestamp: "2025-10-13T19:02:00Z",
  },
  {
    id: "T5",
    name: "Carpe_diem",
    handle: "ellaz",
    lastMessage: "Let's grab drinks",
    lastTimestamp: "2025-10-14T22:10:00Z",
  },
];

export default function MessagesScreen({ onOpenThread = () => {} }) {
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("date"); // 'date' | 'name'

  // keep your scrollbar width var working for the fixed search (same as Connections)
  useEffect(() => {
    const applyScrollbarWidthVar = () => {
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--sbw", `${sbw}px`);
    };
    applyScrollbarWidthVar();
    window.addEventListener("resize", applyScrollbarWidthVar);
    return () => window.removeEventListener("resize", applyScrollbarWidthVar);
  }, []);

  const threads = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = SEED_THREADS.filter(
      (t) =>
        !term ||
        t.name.toLowerCase().includes(term) ||
        t.lastMessage.toLowerCase().includes(term)
    );
    list =
      sortBy === "name"
        ? [...list].sort((a, b) => a.name.localeCompare(b.name))
        : [...list].sort(
            (a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp)
          );
    return list;
  }, [q, sortBy]);

  return (
    <main className="connections-main">
      {/* Header + right-aligned toggle (reuses same classes/styles) */}
      <div className="connections-topbar">
        <div className="connections-title">
          <span className="title-icon" aria-hidden="true">
            <IconMessage />
          </span>
          <h1 className="screen-title">Messages</h1>
        </div>

        <div className="connections-sortrow">
          <div
            className="sort-toggle card glass"
            role="tablist"
            aria-label="Sort messages"
          >
            <button
              role="tab"
              aria-selected={sortBy === "date"}
              className={`toggle-option ${sortBy === "date" ? "active" : ""}`}
              onClick={() => setSortBy("date")}
            >
              Recent
            </button>
            <button
              role="tab"
              aria-selected={sortBy === "name"}
              className={`toggle-option ${sortBy === "name" ? "active" : ""}`}
              onClick={() => setSortBy("name")}
            >
              A–Z
            </button>
          </div>
        </div>
      </div>

      {/* Thread list (reuses your Connections row/card styles) */}
      <div className="connections-list with-bottom-search">
        {threads.map((t) => {
          const { date, time } = splitWhen(t.lastTimestamp);
          return (
            <button
              key={t.id}
              className="connection-row card glass"
              onClick={() => onOpenThread(t)}
              aria-label={`Open thread with ${t.name}`}
            >
              <div className="connection-avatar" aria-hidden="true">
                {initials(t.name)}
              </div>

              <div className="connection-meta">
                <div className="connection-top">
                  <div className="connection-name">{t.name}</div>
                  <div className="connection-time">
                    <div className="date">{date}</div>
                    <div className="time">{time}</div>
                  </div>
                </div>
                <div className="connection-sub">
                  {truncate(t.lastMessage, 80)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Fixed bottom search (same component/pattern) */}
      <div className="connections-search-fixed">
        <div className="search-clip">
          <input
            className="connections-input-plain"
            type="text"
            placeholder="Search messages"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search messages"
          />
        </div>
      </div>
    </main>
  );
}

/* helpers (same as Connections) */
function initials(name) {
  const p = String(name).trim().split(/\s+/);
  return ((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase();
}
function truncate(s, n) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
function splitWhen(iso) {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  let date;
  if (isToday) date = "Today";
  else if (diffDays < 7) date = d.toLocaleDateString([], { weekday: "short" });
  else date = d.toLocaleDateString([], { month: "short", day: "numeric" });
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return { date, time };
}
