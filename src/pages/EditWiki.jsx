import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { loadWiki, verifyPassword } from "../utils/wikiStorage";
import ImageUploader from "../componenets/Imageuploader";
import "./CreateWiki.css";
import "./EditWiki.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function PasswordGate({ slug, onUnlock }) {
  const [attempt, setAttempt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!attempt) return;
    setLoading(true);
    setError("");
    const ok = await verifyPassword(slug, attempt);
    setLoading(false);
    if (ok) {
      onUnlock();
    } else {
      setError("Incorrect password.");
    }
  };

  return (
    <div className="ew-gate">
      <div className="ew-gate-card">
        <div className="ew-gate-icon">🔒</div>
        <h2 className="cw-step-title">Password required</h2>
        <p className="cw-step-sub">Enter your password to edit this wiki.</p>

        <div className="cw-field">
          <div className="cw-pass-row">
            <input
              className="cw-input"
              type={showPass ? "text" : "password"}
              placeholder="Your password…"
              value={attempt}
              autoFocus
              onChange={(e) => { setAttempt(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              className="cw-show-btn"
              onClick={() => setShowPass(!showPass)}
              type="button"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
          {error && <p className="cw-error">{error}</p>}
        </div>

        <div className="ew-gate-actions">
          <button
            className="cw-btn cw-btn-primary"
            onClick={handleSubmit}
            disabled={!attempt || loading}
          >
            {loading ? <><span className="cw-spinner" /> Checking…</> : "Unlock →"}
          </button>
          <button
            className="cw-btn cw-btn-ghost"
            onClick={() => navigate(`/wiki/${slug}`)}
          >
            Back to wiki
          </button>
        </div>
      </div>
    </div>
  );
}

function Editor({ slug, data, onChange, onSave, saving }) {
  const update = (key, val) => onChange({ ...data, [key]: val });
  const updateSection = (key, val) =>
    onChange({ ...data, sections: { ...data.sections, [key]: val } });

  const sectionLabels = {
    earlyLife: "Early life",
    marriageAndChildren: "Personal life",
    death: "Death",
    philosophy: "Philosophy / Approach",
    publishedWorks: "Works & achievements",
    recognition: "Recognition & legacy",
  };

  const fields = [
    ["Name", "name", ""],
    ["Subtitle", "subtitle", "The Mathematician & Pioneer"],
    ["Born", "born", "10 Dec 1815, London"],
    ["Died", "died", ""],
    ["Occupation", "occupation", ""],
    ["Nationality", "nationality", ""],
    ["Spouse", "spouse", ""],
  ];

  return (
    <div className="cw-step cw-step-editor">
      <h2 className="cw-step-title">Edit wiki</h2>
      <p className="cw-step-sub">
        Editing <strong>{data.name}</strong> ·{" "}
        <span className="ew-slug">wikime.app/wiki/{slug}</span>
      </p>

      <section className="cw-section">
        <h3 className="cw-section-title">Basic info</h3>
        <div className="cw-grid-2">
          {fields.map(([label, key, ph]) => (
            <div className="cw-field" key={key}>
              <label className="cw-label">{label}</label>
              <input
                className="cw-input"
                value={data[key] || ""}
                placeholder={ph}
                onChange={(e) => update(key, e.target.value)}
              />
            </div>
          ))}
        </div>
        <ImageUploader
          value={data.imageUrl}
          caption={data.imageCaption}
          onChange={({ imageUrl, imageCaption }) =>
            onChange({ ...data, imageUrl, imageCaption })
          }
        />
      </section>

      <section className="cw-section">
        <h3 className="cw-section-title">Introduction</h3>
        <div className="cw-field">
          <label className="cw-label">Opening paragraph</label>
          <textarea
            className="cw-textarea"
            rows={4}
            value={data.lead || ""}
            onChange={(e) => update("lead", e.target.value)}
            placeholder="A short intro that appears at the top of the wiki…"
          />
        </div>
      </section>

      <section className="cw-section">
        <h3 className="cw-section-title">Sections</h3>
        {Object.entries(sectionLabels).map(([key, label]) => (
          <div className="cw-field" key={key}>
            <label className="cw-label">{label}</label>
            <textarea
              className="cw-textarea"
              rows={3}
              value={data.sections?.[key] || ""}
              onChange={(e) => updateSection(key, e.target.value)}
              placeholder={`Write about ${label.toLowerCase()}…`}
            />
          </div>
        ))}
      </section>

      <div className="cw-editor-footer">
        <p className="cw-slug-preview">
          Saving to: <strong>wikime.app/wiki/{slug}</strong>
        </p>
        <button
          className="cw-btn cw-btn-primary cw-btn-large"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? <><span className="cw-spinner" /> Saving…</> : "Save changes →"}
        </button>
      </div>
    </div>
  );
}

function SavedBanner({ slug, onDismiss }) {
  const navigate = useNavigate();
  return (
    <div className="ew-saved-banner">
      <span>✓ Changes saved</span>
      <button className="ew-saved-view" onClick={() => navigate(`/wiki/${slug}`)}>
        View wiki →
      </button>
      <button className="ew-saved-dismiss" onClick={onDismiss}>✕</button>
    </div>
  );
}

export default function EditWiki() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [wiki, setWiki] = useState(null);
  const [wikiData, setWikiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await loadWiki(slug);
      setLoading(false);
      if (!data) {
        setNotFound(true);
        return;
      }
      setWiki(data);
      setWikiData(data);
      if (!data.hasPassword) {
        navigate(`/wiki/${slug}`, { replace: true });
      }
    };
    load();
  }, [slug]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const updatedData = {
        ...wikiData,
        lastEdited: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      };

      const { error } = await supabase.from("wikis").upsert(
        {
          slug,
          data: { ...updatedData, slug },
          password_hash: wiki.passwordHash,
          has_password: true,
          saved_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      );

      if (error) throw new Error(error.message);
      setWikiData(updatedData);
      setSaved(true);
      navigate(`/wiki/${slug}`);
    } catch (e) {
      console.error("Save failed:", e);
      setSaveError("Save failed — please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="ew-loading">
        <div className="cw-spinner" style={{ borderTopColor: "#555", borderColor: "#eee" }} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="ew-gate">
        <div className="ew-gate-card">
          <h2 className="cw-step-title">Wiki not found</h2>
          <p className="cw-step-sub">No wiki exists at /wiki/{slug}.</p>
          <button className="cw-btn cw-btn-primary" onClick={() => navigate("/")}>
            Go home
          </button>
        </div>
      </div>
    );
  }

  // Password gate
  if (!unlocked) {
    return <PasswordGate slug={slug} onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="cw-page">
      <div className="ew-topbar">
        <button
          className="cw-btn cw-btn-ghost"
          onClick={() => navigate(`/wiki/${slug}`)}
        >
          ← Back to wiki
        </button>
      </div>

      {saved && <SavedBanner slug={slug} onDismiss={() => setSaved(false)} />}
      {saveError && <p className="cw-ai-error">{saveError}</p>}

      <Editor
        slug={slug}
        data={wikiData}
        onChange={setWikiData}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}