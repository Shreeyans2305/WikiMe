import React, { useState, useEffect, useRef } from "react";
import "./AIPromptWizard.css";

// ─── Questions the wizard asks ────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: "who",
    question: (name) => `Who is ${name}?`,
    hint: "e.g. a software engineer, musician, fictional character, historical figure…",
    placeholder: "Describe them in a sentence or two",
    type: "textarea",
  },
  {
    id: "known_for",
    question: () => "What are they best known for?",
    hint: "Their biggest achievement, project, work, or defining trait",
    placeholder: "e.g. Inventing the World Wide Web, writing Harry Potter…",
    type: "textarea",
  },
  {
    id: "details",
    question: () => "Any key facts to include?",
    hint: "Born, nationality, education, dates, family — anything relevant",
    placeholder: "e.g. Born 1955 in San Francisco, studied at MIT, married with two kids…",
    type: "textarea",
  },
  {
    id: "tone",
    question: () => "What tone should the wiki have?",
    hint: "This shapes how formal the writing feels",
    placeholder: "",
    type: "choice",
    choices: [
      { value: "encyclopedic", label: "Encyclopedic", desc: "Formal, neutral, Wikipedia-style" },
      { value: "celebratory", label: "Celebratory", desc: "Warm, proud, highlights achievements" },
      { value: "playful", label: "Playful", desc: "Fun, witty, light-hearted" },
      { value: "dramatic", label: "Dramatic", desc: "Epic, cinematic, larger than life" },
    ],
  },
  {
    id: "extras",
    question: () => "Anything else to mention?",
    hint: "Extra context, fun facts, quotes, controversies — or leave blank",
    placeholder: "Optional — add any extra detail you want included…",
    type: "textarea",
    optional: true,
  },
];

// ─── Build the prompt from answers ───────────────────────────────────────────
function buildPrompt(name, answers) {
  const toneMap = {
    encyclopedic: "neutral and encyclopedic, like Wikipedia",
    celebratory: "warm and celebratory, highlighting achievements",
    playful: "fun, witty and light-hearted",
    dramatic: "epic and cinematic, making them sound legendary",
  };
  const tone = toneMap[answers.tone] || "neutral and encyclopedic";

  return `You are a Wikipedia editor. Write a detailed wiki page profile for "${name}".

Context about this person:
- Who they are: ${answers.who || "not specified"}
- Known for: ${answers.known_for || "not specified"}
- Key facts: ${answers.details || "not specified"}
- Tone: Write in a ${tone} style
${answers.extras ? `- Extra details: ${answers.extras}` : ""}

Return ONLY a valid JSON object — no markdown, no backticks, no explanation before or after. Use exactly this shape:

{
  "name": "${name}",
  "subtitle": "One-line description or role",
  "imageUrl": "",
  "imageCaption": "",
  "born": "Date, Place (or empty string)",
  "died": "",
  "occupation": "Primary occupation or role",
  "spouse": "",
  "children": [],
  "nationality": "",
  "lead": "2–3 sentence intro paragraph.",
  "sections": {
    "earlyLife": "Paragraph about early life and background.",
    "marriageAndChildren": "Paragraph about personal life (or empty string if not applicable).",
    "death": "",
    "philosophy": "Paragraph about their ideas, philosophy, or approach.",
    "publishedWorks": "Paragraph about notable works, projects, or achievements.",
    "recognition": "Paragraph about awards, impact, or legacy."
  },
  "references": [],
  "seeAlso": [],
  "externalLinks": [],
  "categories": [],
  "lastEdited": "${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}"
}

Fill every string field with content — never leave them null. If a field genuinely doesn't apply, use an empty string "".`;
}

// ─── Parse pasted JSON output ─────────────────────────────────────────────────
function parseAIOutput(raw) {
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── Animated step indicator ──────────────────────────────────────────────────
function StepDots({ total, current }) {
  return (
    <div className="apw-dots">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`apw-dot ${i === current ? "apw-dot-active" : i < current ? "apw-dot-done" : ""}`}
        />
      ))}
    </div>
  );
}

// ─── Main wizard component ────────────────────────────────────────────────────
export default function AIPromptWizard({ name, onComplete, onClose }) {
  const [phase, setPhase] = useState("questions"); // questions | prompt | paste | error
  const [questionIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [prompt, setPrompt] = useState("");
  const [pasteValue, setPasteValue] = useState("");
  const [parseError, setParseError] = useState("");
  const [copied, setCopied] = useState(false);
  const [animating, setAnimating] = useState(false);
  const inputRef = useRef();

  const q = QUESTIONS[questionIndex];
  const isLast = questionIndex === QUESTIONS.length - 1;

  // Focus input whenever question changes
  useEffect(() => {
    if (phase === "questions") {
      setTimeout(() => inputRef.current?.focus(), 320);
    }
  }, [questionIndex, phase]);

  // ── Navigation ──────────────────────────────────────────────────────────────
  const goNext = () => {
    if (!currentAnswer.trim() && !q.optional) return;
    const newAnswers = { ...answers, [q.id]: currentAnswer };
    setAnswers(newAnswers);

    if (isLast) {
      const p = buildPrompt(name, newAnswers);
      setPrompt(p);
      animateTo("prompt");
    } else {
      animateTo(null, () => {
        setQIndex((i) => i + 1);
        setCurrentAnswer("");
      });
    }
  };

  const goBack = () => {
    if (questionIndex === 0) { onClose(); return; }
    animateTo(null, () => {
      setQIndex((i) => i - 1);
      setCurrentAnswer(answers[QUESTIONS[questionIndex - 1].id] || "");
    });
  };

  const animateTo = (nextPhase, cb) => {
    setAnimating(true);
    setTimeout(() => {
      if (nextPhase) setPhase(nextPhase);
      cb?.();
      setAnimating(false);
    }, 260);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && q.type !== "textarea") {
      e.preventDefault();
      goNext();
    }
  };

  // ── Copy prompt ─────────────────────────────────────────────────────────────
  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Parse pasted output ─────────────────────────────────────────────────────
  const handlePaste = () => {
    setParseError("");
    try {
      const parsed = parseAIOutput(pasteValue);
      onComplete(parsed);
    } catch {
      setParseError("Couldn't parse that output. Make sure you copied the full JSON response from the AI.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="apw-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`apw-modal ${animating ? "apw-modal-exit" : "apw-modal-enter"}`}>

        {/* Close button */}
        <button className="apw-close" onClick={onClose}>✕</button>

        {/* ── Phase: Questions ── */}
        {phase === "questions" && (
          <div className="apw-phase">
            <div className="apw-eyebrow">Step {questionIndex + 1} of {QUESTIONS.length}</div>
            <StepDots total={QUESTIONS.length} current={questionIndex} />

            <h2 className="apw-question">{q.question(name)}</h2>
            {q.hint && <p className="apw-hint">{q.hint}</p>}

            {q.type === "textarea" && (
              <textarea
                ref={inputRef}
                className="apw-textarea"
                rows={3}
                placeholder={q.placeholder}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            )}

            {q.type === "choice" && (
              <div className="apw-choices">
                {q.choices.map((c) => (
                  <button
                    key={c.value}
                    className={`apw-choice ${currentAnswer === c.value ? "apw-choice-active" : ""}`}
                    onClick={() => setCurrentAnswer(c.value)}
                  >
                    <span className="apw-choice-label">{c.label}</span>
                    <span className="apw-choice-desc">{c.desc}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="apw-nav">
              <button className="apw-btn-ghost" onClick={goBack}>
                {questionIndex === 0 ? "Cancel" : "← Back"}
              </button>
              <button
                className="apw-btn-primary"
                onClick={goNext}
                disabled={!currentAnswer.trim() && !q.optional}
              >
                {isLast ? "Build my prompt →" : "Next →"}
              </button>
            </div>
          </div>
        )}

        {/* ── Phase: Show prompt ── */}
        {phase === "prompt" && (
          <div className="apw-phase">
            <div className="apw-eyebrow">Your AI prompt is ready</div>
            <h2 className="apw-question">Copy this into any AI</h2>
            <p className="apw-hint">
              Paste it into ChatGPT, Claude, Gemini, or any AI chat. Then copy the entire response and paste it back here.
            </p>

            <div className="apw-prompt-box">
              <pre className="apw-prompt-text">{prompt}</pre>
            </div>

            <div className="apw-nav">
              <button className="apw-btn-ghost" onClick={() => animateTo("questions", () => { setQIndex(QUESTIONS.length - 1); setCurrentAnswer(answers[QUESTIONS[QUESTIONS.length - 1].id] || ""); })}>
                ← Edit answers
              </button>
              <button className="apw-btn-copy" onClick={copyPrompt}>
                {copied ? "✓ Copied!" : "Copy prompt"}
              </button>
              <button className="apw-btn-primary" onClick={() => animateTo("paste")}>
                I've got the output →
              </button>
            </div>
          </div>
        )}

        {/* ── Phase: Paste output ── */}
        {phase === "paste" && (
          <div className="apw-phase">
            <div className="apw-eyebrow">Paste the AI's response</div>
            <h2 className="apw-question">Paste the JSON output here</h2>
            <p className="apw-hint">
              The AI should return a block of JSON. Copy the <strong>entire</strong> response — including the curly braces — and paste it below.
            </p>

            <textarea
              className="apw-textarea apw-paste-area"
              rows={8}
              placeholder={'{\n  "name": "...",\n  "lead": "...",\n  ...\n}'}
              value={pasteValue}
              onChange={(e) => { setPasteValue(e.target.value); setParseError(""); }}
            />

            {parseError && <p className="apw-error">{parseError}</p>}

            <div className="apw-nav">
              <button className="apw-btn-ghost" onClick={() => animateTo("prompt")}>
                ← Back to prompt
              </button>
              <button
                className="apw-btn-primary"
                onClick={handlePaste}
                disabled={!pasteValue.trim()}
              >
                Fill my wiki →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}