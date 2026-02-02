import React, { useMemo, useRef, useState } from "react";
import "../styles.css";

export default function AccountProfileScreen({
  onBack = () => {},
  onEditPhoto = () => {},
}) {
  const username = "LivinLife";

  // local view toggle (no routing changes)
  const [view, setView] = useState("profile"); // "profile" | "avatarLibrary"

  // avatar state (preview)
  const [avatarSrc, setAvatarSrc] = useState("https://placehold.co/240x240");

  // action sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // hidden file input for "Upload from your device"
  const fileInputRef = useRef(null);

  const avatarChoices = useMemo(() => {
    // 18 placeholder avatar URLs (simple numbered placeholders for now)
    return Array.from({ length: 18 }, (_, i) => {
      const n = i + 1;
      return `https://placehold.co/240x240?text=A${n}`;
    });
  }, []);

  const openSheet = () => setIsSheetOpen(true);
  const closeSheet = () => setIsSheetOpen(false);

  const handleUploadClick = () => {
    closeSheet();
    // Slight delay helps prevent some mobile browsers from swallowing the click
    setTimeout(() => {
      if (fileInputRef.current) fileInputRef.current.click();
    }, 60);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Preview immediately
    const objectUrl = URL.createObjectURL(file);
    setAvatarSrc(objectUrl);

    // Optional callback to persist later
    onEditPhoto(file);

    // allow re-selecting same file later
    e.target.value = "";
  };

  const handleSelectAvatarLibrary = () => {
    closeSheet();
    setView("avatarLibrary");
  };

  const handlePickAvatar = (src) => {
    setAvatarSrc(src);
    setView("profile");
    // If you later want to persist avatar choice, you can call onEditPhoto({ type: "avatar", src })
  };

  // Avatar Library "page"
  if (view === "avatarLibrary") {
    return (
      <main className="auth-page connection-confirm-page">
        <div className="top-actions">
          <button
            className="chevron-btn"
            onClick={() => setView("profile")}
            aria-label="Back"
          >
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

        <section className="auth-shell connection-confirm-shell avatar-library-shell">
          <div className="connection-confirm-card">
            <div className="auth-copy connection-confirm-copy">
              <h2 className="avatar-library-title">Select Avatar</h2>

              <div className="avatar-grid" role="list" aria-label="Avatar options">
                {avatarChoices.map((src, idx) => (
                  <button
                    key={src}
                    type="button"
                    className="avatar-cell"
                    onClick={() => handlePickAvatar(src)}
                    aria-label={`Select avatar ${idx + 1}`}
                  >
                    <span className="avatar-circle" />
                  </button>
                ))}
              </div>

              <p className="avatar-library-note">
                (Placeholders for now — real Swave avatar library coming next.)
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Profile view
  return (
    <main className="auth-page connection-confirm-page profile-photo-page">
      <div className="top-actions">
        <button className="chevron-btn" onClick={onBack} aria-label="Back">
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

      <section className="auth-shell connection-confirm-shell">
        <div className="connection-confirm-card">
          <div className="auth-copy connection-confirm-copy">
            <div className="profile-avatar">
              <div className="connection-confirm-avatar">
                <img src={avatarSrc} alt={`${username} avatar`} />
              </div>

              <button
                type="button"
                className="profile-edit-btn"
                onClick={openSheet}
                aria-label="Edit profile photo"
              >
                <IconPencil />
              </button>

              {/* hidden upload input */}
              <input
                ref={fileInputRef}
                className="hidden-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                aria-hidden="true"
                tabIndex={-1}
              />
            </div>

            <h2 className="connection-confirm-name">{username}</h2>
          </div>
        </div>
      </section>

      {/* Action sheet */}
      {isSheetOpen && (
        <div className="confirm-backdrop" role="presentation" onClick={closeSheet}>
          <div
            className="confirm-sheet card glass gradient-vertical confirm-sheet--opaque profile-photo-confirm"
            role="dialog"
            aria-modal="true"
            aria-label="Change Profile Picture"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-title">Change Profile Picture</div>

            <div className="confirm-actions-vertical profile-photo-confirm-actions">
              <button
                type="button"
                className="glass-btn glass-btn--tint profile-photo-choice-btn"
                onClick={handleUploadClick}
              >
                Upload from your device
              </button>

              <button
                type="button"
                className="glass-btn glass-btn--tint profile-photo-choice-btn"
                onClick={handleSelectAvatarLibrary}
              >
                Select from the Swave avatar library
              </button>

              <button
                type="button"
                className="glass-btn glass-btn--danger profile-photo-choice-btn"
                onClick={closeSheet}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function IconPencil() {
  return (
    <svg viewBox="0 0 24 24" className="ico">
      <path
        d="M4 17.2V20h2.8l9.9-9.9-2.8-2.8L4 17.2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M14.5 7.3l2.8 2.8 1.8-1.8a2 2 0 000-2.8l-.9-.9a2 2 0 00-2.8 0l-1.8 1.8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
