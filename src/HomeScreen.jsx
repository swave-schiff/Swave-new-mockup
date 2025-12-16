import React from "react";

export default function HomeScreen({ onEnterCode }) {
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
