import React from "react";
import "./styles.css";

export default function LoginScreen({ onLogin, onRegister, onEnterCode }) {
  return (
    <main className="login-main">
      <h1 className="login-brand">Swave</h1>

      <div className="login-cards">
        {/* Login card */}
        <button className="card glass login-card" onClick={onLogin}>
          <div className="login-card-text">
            <div className="login-card-title">Login</div>
            <div className="login-card-sub">
              Generate Code, Chats, Profile & Connections
            </div>
          </div>
          <span className="login-chevron" aria-hidden="true">
            ›
          </span>
        </button>

        {/* Register card */}
        <button className="card glass login-card" onClick={onRegister}>
          <div className="login-card-text">
            <div className="login-card-title">Register</div>
            <div className="login-card-sub">
              Don’t have a Swave login yet? What are you waiting for?
            </div>
          </div>
          <span className="login-chevron" aria-hidden="true">
            ›
          </span>
        </button>
      </div>

      <p className="login-prompt">Did someone flash a Swave code at you?</p>

      {/* Primary CTA uses glass style */}
      <button className="glass-btn glass-btn--hollow big" onClick={onEnterCode}>
        Enter Swave Code
        {/* edge + glint layers for subtle bevel effect */}
        <span className="edge-top" />
        <span className="edge-left" />
        <span className="corner-glint tl" />
        <span className="corner-glint tr" />
      </button>
    </main>
  );
}
