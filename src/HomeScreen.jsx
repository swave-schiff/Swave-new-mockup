import React from "react";

export default function HomeScreen({
  onEnterCode = () => {},
  onOpenSwaveCode = () => {},
}) {
  return (
    <main className="home-main">
      <button
        type="button"
        className="swave-circle-btn swave-circle-btn--home"
        onClick={onOpenSwaveCode}
        aria-label="Tap to Swave"
      >
        <div className="swave-circle glow swave-circle--home">
          <h2>Tap to Swave</h2>
          <p className="subtext">
            Generate a 4-digit
            <br />
            code to flash
          </p>
        </div>
      </button>

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
