import React, { useEffect, useRef, useState } from "react";
import "../styles.css";

export default function UsernameLinkingScreen({ onBack = () => {} }) {
  const [alwaysAllow, setAlwaysAllow] = useState(false);
  const [isTempEnabled, setIsTempEnabled] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isTempEnabled) {
      return;
    }

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTempEnabled]);

  const startTimed = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRemainingSeconds(300);
    setIsTempEnabled(true);
  };

  const cancelTimed = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTempEnabled(false);
    setRemainingSeconds(300);
  };

  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const ss = String(remainingSeconds % 60).padStart(2, "0");

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
        <h2 className="linking-title">Allow people to link with your username</h2>

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

        <div className="linking-actions">
          {!isTempEnabled ? (
            <button
              className="glass-btn glass-btn--tint big"
              onClick={startTimed}
            >
              <span className="btn-ico">
                <IconAlarm />
              </span>
              <>Only Enable Username Linking for 5 min.</>
            </button>
          ) : (
            <div className="linking-timer">
              <div className="linking-timer-row">
                <div className="linking-countdown">
                  {mm}:{ss}
                </div>
                <button
                  type="button"
                  className="glass-btn glass-btn--danger big"
                  onClick={cancelTimed}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="linking-separator">- or -</div>

        <div className="toggle-row">
          <span className="toggle-label">Always allow username linking</span>
          <label
            className={`toggle-switch ${alwaysAllow ? "toggle-switch--on" : ""}`}
          >
            <input
              type="checkbox"
              checked={alwaysAllow}
              onChange={(e) => setAlwaysAllow(e.target.checked)}
              aria-checked={alwaysAllow}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>
    </main>
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
