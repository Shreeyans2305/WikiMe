import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadWiki, saveWiki, verifyPassword } from "../utils/wikiStorage";
import WikiTemplate from "../componenets/WikiTemplate";
import "./WikiPage.css";

// ─── Password modal ───────────────────────────────────────────────────────────
function PasswordModal({ slug, onSuccess, onCancel }) {
  const [attempt, setAttempt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    if (!attempt) return;
    setLoading(true);
    setError("");
    const ok = await verifyPassword(slug, attempt);
    setLoading(false);
    if (ok) {
      onSuccess();
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <div className="wp-modal-backdrop">
      <div className="wp-modal">
        <div className="wp-modal-icon">🔒</div>
        <h3 className="wp-modal-title">Enter your password</h3>
        <p className="wp-modal-sub">
          This wiki is password-protected. Enter your password to edit it.
        </p>
        <div className="wp-modal-field">
          <div className="wp-pass-row">
            <input
              className="wp-modal-input"
              type={showPass ? "text" : "password"}
              placeholder="Your password…"
              value={attempt}
              onChange={(e) => {
                setAttempt(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
            <button
              className="wp-show-btn"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
          {error && <p className="wp-modal-error">{error}</p>}
        </div>
        <div className="wp-modal-actions">
          <button
            className="wp-btn"
            onClick={handleSubmit}
            disabled={!attempt || loading}
          >
            {loading ? "Checking…" : "Unlock"}
          </button>
          <button className="wp-btn wp-btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main WikiPage ────────────────────────────────────────────────────────────
export default function WikiPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [wiki, setWiki] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editUnlocked, setEditUnlocked] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const data = await loadWiki(slug);
      if (data) {
        setWiki(data);
      } else {
        setNotFound(true);
      }
    };
    fetch();
  }, [slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleEditClick = () => {
    if (!wiki.hasPassword) return; // shouldn't be reachable, but guard anyway
    if (editUnlocked) {
      navigate(`/edit/${slug}`);
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    setEditUnlocked(true);
    navigate(`/edit/${slug}`);
  };

  if (notFound) {
    return (
      <div className="wp-notfound">
        <h1>Wiki not found</h1>
        <p>
          No wiki exists at <strong>/wiki/{slug}</strong>.
        </p>
        <p>
          It may have been created on a different device, or the link might be
          wrong.
        </p>
        <button className="wp-btn" onClick={() => navigate("/create")}>
          Create your own wiki
        </button>
        <button className="wp-btn wp-btn-ghost" onClick={() => navigate("/")}>
          Go home
        </button>
      </div>
    );
  }

  if (!wiki) {
    return (
      <div className="wp-loading">
        <div className="wp-spinner" />
      </div>
    );
  }

  return (
    <div className="wp-page">
      {/* Share / edit toolbar */}
      <div className="wp-share-bar">
        <button className="wp-home-link" onClick={() => navigate("/")}>
          ← WikiMe
        </button>
        <div className="wp-share-right">
          {/* Only show Edit if the wiki has a password */}
          {wiki.hasPassword && (
            <button className="wp-edit-btn" onClick={handleEditClick}>
              ✎ Edit
            </button>
          )}
          <button className="wp-share-btn" onClick={copyLink}>
            {copied ? "✓ Copied!" : "Share this wiki"}
          </button>
          <button className="wp-create-btn" onClick={() => navigate("/create")}>
            Create yours →
          </button>
        </div>
      </div>

      {/* Password modal */}
      {showPasswordModal && (
        <PasswordModal
          slug={slug}
          onSuccess={handlePasswordSuccess}
          onCancel={() => setShowPasswordModal(false)}
        />
      )}

      {/* Wiki content */}
      <WikiTemplate data={wiki} />
    </div>
  );
}
