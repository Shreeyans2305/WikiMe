import { OpenRouter } from "@openrouter/sdk";

const client = new OpenRouter({
  apiKey: import.meta.env.VITE_HACKCLUB_TOKEN || "no-key",
  serverURL: "https://ai.hackclub.com/proxy/v1",
});

export async function generateWiki(name, answers) {
  const toneMap = {
    encyclopedic: "neutral and encyclopedic, like Wikipedia",
    celebratory: "warm and celebratory, highlighting achievements",
    playful: "fun, witty and light-hearted",
    dramatic: "epic and cinematic, making them sound legendary",
  };
  const tone = toneMap[answers?.tone] || "neutral and encyclopedic";

  const prompt = `You are a Wikipedia editor. Write a detailed wiki page profile for "${name}".

Context about this person:
- Who they are: ${answers?.who || "not specified"}
- Known for: ${answers?.known_for || "not specified"}
- Key facts: ${answers?.details || "not specified"}
- Tone: Write in a ${tone} style
${answers?.extras ? `- Extra details: ${answers.extras}` : ""}

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
  "lead": "2-3 sentence intro paragraph.",
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
  "lastEdited": "DATEPLACEHOLDER"
}

Fill every string field with content — never leave them null. If a field genuinely does not apply, use an empty string "".`;

  try {
    const response = await client.chat.send({
      chatGenerationParams: {
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        stream: false,
      },
    });

    const text = response.choices?.[0]?.message?.content;

    if (!text) {
      const err = new Error("Empty response from API");
      err.code = "API_UNAVAILABLE";
      throw err;
    }

    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    // Ensure lastEdited is set correctly regardless of what the model put
    parsed.lastEdited = new Date().toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });

    return parsed;

  } catch (e) {
    if (e.code === "API_UNAVAILABLE") throw e;
    const err = new Error(e.message);
    err.code = "API_UNAVAILABLE";
    throw err;
  }
}