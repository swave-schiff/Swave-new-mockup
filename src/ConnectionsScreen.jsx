// src/ConnectionsScreen.jsx
import React, { useMemo, useState, useEffect } from "react";
import "./styles.css";
import { Users } from "lucide-react";
import GlassRowCard from "./components/GlassRowCard";

const SEED_CONNECTIONS = [
  {
    id: "1",
    name: "TeaseMeTwice",
    handle: "avamk",
    lastMessage: "U joining us l8r",
    lastTimestamp: "2025-10-12T14:22:00Z",
  },
  {
    id: "2",
    name: "MissMysterious",
    handle: "benc",
    lastMessage: "Heading to club in 30",
    lastTimestamp: "2025-10-15T07:45:00Z",
  },
  {
    id: "3",
    name: "BarelyBehaving",
    handle: "chloen",
    lastMessage: "Typing…",
    lastTimestamp: "2025-10-15T15:05:00Z",
  },
  {
    id: "4",
    name: "SinsInHeels",
    handle: "diegos",
    lastMessage: "Wanna hang this Sat?",
    lastTimestamp: "2025-10-13T19:02:00Z",
  },
  {
    id: "5",
    name: "Carpe_diem",
    handle: "ellaz",
    lastMessage: "Let's grab drinks",
    lastTimestamp: "2025-10-14T22:10:00Z",
  },
];

export default function ConnectionsScreen({
  onOpenConversation = () => {},
  onOpenConnection, // optional, preferred
}) {
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("name"); // default A–Z

  // Set CSS var --sbw to actual scrollbar width
  useEffect(() => {
    const applyScrollbarWidthVar = () => {
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--sbw", `${sbw}px`);
    };
    applyScrollbarWidthVar();
    window.addEventListener("resize", applyScrollbarWidthVar);
    return () => window.removeEventListener("resize", applyScrollbarWidthVar);
  }, []);

  const items = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = SEED_CONNECTIONS.filter(
      (c) =>
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.handle.toLowerCase().includes(term) ||
        c.lastMessage.toLowerCase().includes(term)
    );
    list =
      sortBy === "name"
        ? [...list].sort((a, b) => a.name.localeCompare(b.name))
        : [...list].sort(
            (a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp)
          );
    return list;
  }, [q, sortBy]);

  // choose which handler to use
  const open = onOpenConnection ?? onOpenConversation;

  return (
    <main className="connections-main main-with-tabbar">
      {/* Header (left) + toggle below, right-aligned) */}
      <div className="connections-topbar">
        <div className="connections-title">
          <Users size={22} className="title-icon" strokeWidth={1.8} />
          <h1 className="screen-title">Connections</h1>
        </div>

        <div className="connections-sortrow">
          <div
            className="sort-toggle card glass"
            role="tablist"
            aria-label="Sort connections"
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

      {/* List */}
      <div className="connections-list with-bottom-search">
        {items.map((c) => {
          const { date, time } = splitWhen(c.lastTimestamp);
          return (
            <GlassRowCard
              key={c.id}
              initial={initials(c.name)}
              name={c.name}
              subtitle={truncate(c.lastMessage, 80)}
              time={{ date, time }}
              onClick={() => open && open(c)}
              ariaLabel={`Open connection for ${c.name}`}
            />
          );
        })}
      </div>

      {/* Fixed bottom search (blurred glass) */}
      <div className="connections-search-fixed">
        <div className="search-clip">
          <input
            className="connections-input-plain"
            type="text"
            placeholder="Search connections"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search connections"
          />
        </div>
      </div>
    </main>
  );
}

/* helpers */
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
