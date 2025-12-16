import React from "react";

export default function GlassRowCard({
  initial,
  name,
  subtitle,
  time,
  onClick,
  ariaLabel,
}) {
  const timeParts =
    time && typeof time === "object"
      ? { date: time.date, clock: time.time }
      : time
      ? { date: time, clock: null }
      : null;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick && onClick(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick && onClick(e);
    }
  };

  return (
    <button
      type="button"
      className="connection-row card glass gradient-vertical"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
    >
      <div className="connection-avatar" aria-hidden="true">
        {initial}
      </div>

      <div className="connection-meta">
        <div className="connection-top">
          <div className="connection-name">{name}</div>
          {timeParts ? (
            <div className="connection-time">
              {timeParts.date ? <div className="date">{timeParts.date}</div> : null}
              {timeParts.clock ? <div className="time">{timeParts.clock}</div> : null}
            </div>
          ) : null}
        </div>
        <div className="connection-sub">{subtitle}</div>
      </div>
    </button>
  );
}
