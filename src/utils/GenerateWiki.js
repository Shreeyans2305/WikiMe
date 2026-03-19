// ─── AI Wiki Generation ───────────────────────────────────────────────────────
// Calls the Anthropic API to fill out all wiki fields for a given person/topic.
// Returns a PAGE_DATA-shaped object ready to drop into WikiTemplate.

export async function generateWiki(name) {
  const prompt = `You are a Wikipedia editor. Create a detailed wiki page profile for "${name}".
  
Return ONLY a valid JSON object — no markdown, no backticks, no explanation. Use this exact shape:

{
  "name": "${name}",
  "subtitle": "One-line description",
  "imageUrl": "",
  "imageCaption": "",
  "born": "Date, Place (or empty string if unknown)",
  "died": "",
  "occupation": "Primary occupation",
  "spouse": "",
  "children": [],
  "nationality": "",
  "lead": "2-3 sentence intro paragraph about this person.",
  "sections": {
    "earlyLife": "Paragraph about early life and background.",
    "marriageAndChildren": "Paragraph about personal life (or empty string).",
    "death": "",
    "philosophy": "Paragraph about their ideas, philosophy, or approach (if relevant).",
    "publishedWorks": "Paragraph about notable works, projects, or achievements.",
    "recognition": "Paragraph about awards, impact, legacy."
  },
  "references": [],
  "seeAlso": [],
  "externalLinks": [],
  "categories": [],
  "lastEdited": "${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}"
}

If this is a real public figure, use factual information. If this appears to be a private individual, generate a plausible creative profile. Fill every string field — never leave them null.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  // Strip any accidental markdown fences before parsing
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}