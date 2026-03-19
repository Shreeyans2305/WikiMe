import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveWiki, slugExists } from "../utils/wikiStorage";
import ImageUploader from "../componenets/Imageuploader";
import AIPromptWizard from "../componenets/Aipromptwizard";
import "./CreateWiki.css";

const emptyWiki = {
  name: "",
  subtitle: "",
  imageUrl: "",
  imageCaption: "",
  born: "",
  died: "",
  occupation: "",
  spouse: "",
  children: [],
  nationality: "",
  lead: "",
  sections: {
    earlyLife: "",
    marriageAndChildren: "",
    death: "",
    philosophy: "",
    publishedWorks: "",
    recognition: "",
  },
  references: [],
  seeAlso: [],
  externalLinks: [],
  categories: [],
  lastEdited: new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
};

function StepNameSlug({ onNext }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugError, setSlugError] = useState("");

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-"),
    );
    setSlugError("");
  };

  const handleSlugChange = (e) => {
    setSlug(
      e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/--+/g, "-"),
    );
    setSlugError("");
  };

  const handleNext = async () => {
    if (!name.trim() || !slug.trim()) return;
    if (await slugExists(slug)) {
      setSlugError(`"${slug}" is already taken.`);
      return;
    }
    onNext({ name, slug });
  };

  return (
    <div className="cw-step">
      <h2 className="cw-step-title">Who is this wiki about?</h2>
      <p className="cw-step-sub">Give them a name and a shareable link.</p>
      <div className="cw-field">
        <label className="cw-label">Name</label>
        <input
          className="cw-input"
          type="text"
          placeholder="e.g. Ada Lovelace"
          value={name}
          onChange={handleNameChange}
        />
      </div>
      <div className="cw-field">
        <label className="cw-label">Your wiki URL</label>
        <div className="cw-slug-row">
          <span className="cw-slug-prefix">wikime.app/wiki/</span>
          <input
            className="cw-input cw-slug-input"
            type="text"
            placeholder="ada-lovelace"
            value={slug}
            onChange={handleSlugChange}
          />
        </div>
        {slugError && <p className="cw-error">{slugError}</p>}
      </div>
      <button
        className="cw-btn cw-btn-primary"
        disabled={!name.trim() || !slug.trim()}
        onClick={handleNext}
      >
        Continue →
      </button>
    </div>
  );
}

function StepChooseMethod({ name, onAI, onManual }) {
  return (
    <div className="cw-step">
      <h2 className="cw-step-title">How do you want to build it?</h2>
      <p className="cw-step-sub">
        Generating a wiki for <strong>{name}</strong>
      </p>
      <div className="cw-method-cards">
        <button className="cw-method-card cw-method-ai" onClick={onAI}>
          <span className="cw-method-icon">✦</span>
          <span className="cw-method-label">Generate with AI</span>
          <span className="cw-method-desc">
            Answer a few questions, get a prompt to paste into any AI of your
            choice
          </span>
        </button>
        <button className="cw-method-card cw-method-manual" onClick={onManual}>
          <span className="cw-method-icon">✎</span>
          <span className="cw-method-label">Write it myself</span>
          <span className="cw-method-desc">Fill in each section by hand</span>
        </button>
      </div>
    </div>
  );
}

function ReferencesEditor({ references, onChange }) {
  const add = () =>
    onChange([...references, { id: Date.now(), label: "", url: "" }]);

  const update = (id, field, val) =>
    onChange(references.map((r) => (r.id === id ? { ...r, [field]: val } : r)));

  const remove = (id) => onChange(references.filter((r) => r.id !== id));

  return (
    <section className="cw-section">
      <h3 className="cw-section-title">References &amp; links</h3>
      <p className="cw-references-hint">
        Add links to your sources, portfolio, social profiles, or anything you
        want to showcase.
      </p>

      {references.length === 0 && (
        <div className="cw-references-empty">No references yet.</div>
      )}

      <div className="cw-references-list">
        {references.map((ref, i) => (
          <div className="cw-reference-row" key={ref.id}>
            <span className="cw-reference-num">{i + 1}</span>
            <div className="cw-reference-fields">
              <input
                className="cw-input cw-ref-label"
                placeholder="Label — e.g. My Portfolio, GitHub, Paper title…"
                value={ref.label}
                onChange={(e) => update(ref.id, "label", e.target.value)}
              />
              <input
                className="cw-input cw-ref-url"
                placeholder="URL — https://…"
                value={ref.url}
                onChange={(e) => update(ref.id, "url", e.target.value)}
              />
            </div>
            <button
              className="cw-reference-remove"
              onClick={() => remove(ref.id)}
              title="Remove"
              type="button"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button className="cw-btn cw-btn-add-ref" onClick={add} type="button">
        + Add reference
      </button>
    </section>
  );
}

function StepEditor({ slug, data, onChange, onNext }) {
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

  return (
    <div className="cw-step cw-step-editor">
      <h2 className="cw-step-title">Edit your wiki</h2>
      <p className="cw-step-sub">
        Review and tweak everything before publishing.
      </p>

      <section className="cw-section">
        <h3 className="cw-section-title">Basic info</h3>
        <div className="cw-grid-2">
          {[
            ["Name", "name", ""],
            ["Subtitle", "subtitle", "The Mathematician & Pioneer"],
            ["Born", "born", "10 Dec 1815, London"],
            ["Died", "died", ""],
            ["Occupation", "occupation", ""],
            ["Nationality", "nationality", ""],
            ["Spouse", "spouse", ""],
          ].map(([label, key, ph]) => (
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
            value={data.lead}
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
              value={data.sections[key] || ""}
              onChange={(e) => updateSection(key, e.target.value)}
              placeholder={`Write about ${label.toLowerCase()}…`}
            />
          </div>
        ))}
      </section>

      <ReferencesEditor
        references={data.references || []}
        onChange={(refs) => update("references", refs)}
      />

      <div className="cw-editor-footer">
        <p className="cw-slug-preview">
          Your link: <strong>wikime.app/wiki/{slug}</strong>
        </p>
        <button className="cw-btn cw-btn-primary cw-btn-large" onClick={onNext}>
          Continue →
        </button>
      </div>
    </div>
  );
}

function StepPassword({ onSave, saving }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (password && password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password && password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    onSave(password || null);
  };

  return (
    <div className="cw-step">
      <h2 className="cw-step-title">Protect your wiki</h2>
      <p className="cw-step-sub">
        Set a password to allow editing later — or skip to publish as read-only.
      </p>
      <div className="cw-password-card">
        <div className="cw-password-icon">🔒</div>
        <div className="cw-field">
          <label className="cw-label">
            Password <span className="cw-optional">(optional)</span>
          </label>
          <div className="cw-pass-row">
            <input
              className="cw-input"
              type={showPass ? "text" : "password"}
              placeholder="Choose a password…"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
            <button
              className="cw-show-btn"
              onClick={() => setShowPass(!showPass)}
              type="button"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {password && (
          <div className="cw-field">
            <label className="cw-label">Confirm password</label>
            <input
              className="cw-input"
              type={showPass ? "text" : "password"}
              placeholder="Re-enter password…"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setError("");
              }}
            />
          </div>
        )}
        {error && <p className="cw-error">{error}</p>}
        <div className="cw-password-notice">
          {password
            ? "✓ You'll need this password to edit the wiki later."
            : "Without a password, this wiki cannot be edited after publishing."}
        </div>
      </div>
      <div className="cw-password-actions">
        <button
          className="cw-btn cw-btn-primary cw-btn-large"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="cw-spinner" /> Publishing…
            </>
          ) : password ? (
            "Publish with password →"
          ) : (
            "Publish →"
          )}
        </button>
        {password && (
          <button
            className="cw-btn cw-btn-ghost"
            onClick={() => onSave(null)}
            disabled={saving}
          >
            Publish without password
          </button>
        )}
      </div>
    </div>
  );
}

function StepShare({ slug, hasPassword }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const url = `${window.location.origin}/wiki/${slug}`;

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="cw-step cw-step-share">
      <div className="cw-share-icon">🎉</div>
      <h2 className="cw-step-title">Your wiki is live!</h2>
      <p className="cw-step-sub">
        {hasPassword
          ? "You can edit it anytime with your password."
          : "This wiki is published as read-only."}
      </p>
      <div className="cw-share-box">
        <span className="cw-share-url">{url}</span>
        <button className="cw-btn cw-btn-copy" onClick={copy}>
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
      <div className="cw-share-actions">
        <button
          className="cw-btn cw-btn-secondary"
          onClick={() => navigate(`/wiki/${slug}`)}
        >
          View my wiki
        </button>
        <button
          className="cw-btn cw-btn-ghost"
          onClick={() => navigate("/create")}
        >
          Create another
        </button>
      </div>
    </div>
  );
}

const STEPS = ["name", "method", "editor", "password", "share"];

export default function CreateWiki() {
  const [step, setStep] = useState("name");
  const [meta, setMeta] = useState({ name: "", slug: "" });
  const [wikiData, setWikiData] = useState(emptyWiki);
  const [showWizard, setShowWizard] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishedWithPassword, setPublishedWithPassword] = useState(false);

  const stepIndex = STEPS.indexOf(step);

  const handleNameNext = ({ name, slug }) => {
    setMeta({ name, slug });
    setWikiData({ ...emptyWiki, name });
    setStep("method");
  };

  const handleWizardComplete = (parsed) => {
    setWikiData({
      ...emptyWiki,
      ...parsed,
      references: parsed.references || [],
    });
    setShowWizard(false);
    setStep("editor");
  };

  const handleSave = async (password) => {
    setSaving(true);
    try {
      await saveWiki(meta.slug, wikiData, password);
      setPublishedWithPassword(!!password);
      setStep("share");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cw-page">
      <div className="cw-progress">
        {["Who", "How", "Edit", "Lock", "Share"].map((label, i) => (
          <div
            key={label}
            className={`cw-progress-step ${i <= stepIndex ? "cw-progress-active" : ""}`}
          >
            <div className="cw-progress-dot" />
            <span className="cw-progress-label">{label}</span>
          </div>
        ))}
        <div
          className="cw-progress-line"
          style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }}
        />
      </div>

      {step === "name" && <StepNameSlug onNext={handleNameNext} />}
      {step === "method" && (
        <StepChooseMethod
          name={meta.name}
          onAI={() => setShowWizard(true)}
          onManual={() => setStep("editor")}
        />
      )}
      {step === "editor" && (
        <StepEditor
          slug={meta.slug}
          data={wikiData}
          onChange={setWikiData}
          onNext={() => setStep("password")}
        />
      )}
      {step === "password" && (
        <StepPassword onSave={handleSave} saving={saving} />
      )}
      {step === "share" && (
        <StepShare slug={meta.slug} hasPassword={publishedWithPassword} />
      )}

      {showWizard && (
        <AIPromptWizard
          name={meta.name}
          onComplete={handleWizardComplete}
          onClose={() => setShowWizard(false)}
        />
      )}
    </div>
  );
}
