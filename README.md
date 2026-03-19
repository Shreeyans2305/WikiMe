# WikiMe

> Make a Wikipedia-style page about anyone — your grandma, your cat, your friends. No facts required.

WikiMe is a web app for creating funny, satirical, and completely fictional Wikipedia-style pages about people and characters you know. It is **not** meant to be accurate. It is entirely for entertainment. Every published page carries a disclaimer to make that clear.

---

## What it does

You pick a name, choose a shareable URL slug, fill in the content (or let an AI do it), and publish. Anyone with the link can read the wiki. If you set a password, you can come back and edit it later. If you don't, it's published as read-only forever.

---

## Features

- **Create a wiki in minutes** — a guided multi-step flow takes you from name to published page
- **AI-assisted generation** — answer a few questions about the subject, get a ready-made prompt to paste into any AI (ChatGPT, Claude, Gemini, etc.), then paste the JSON output straight back into the app
- **Write it yourself** — fill in every section manually if you prefer full control
- **Wikipedia-style layout** — infobox with photo, table of contents, named sections, references, categories
- **Photo upload or URL** — upload an image from your device or paste a link; uploaded images go to Supabase Storage
- **References & links** — add links to sources, portfolios, social profiles, or anything you want to showcase
- **Password-protected editing** — optionally set a password when publishing; only people with the password can edit later
- **Shareable links** — every wiki lives at a permanent URL (`/wiki/your-slug`) that works on any device
- **Responsive** — works on desktop, tablet, and small phone screens
- **404 page** — a glitchy animated background greets anyone who wanders to a URL that doesn't exist

---

## Tech stack

| | |
|---|---|
| **Framework** | React 19 + Vite |
| **Routing** | React Router v7 |
| **Database** | Supabase (Postgres) |
| **File storage** | Supabase Storage |
| **Animations** | GSAP (card stack on homepage) |
| **Hosting** | Vercel |

---

## Project structure

```
src/
├── componenets/
│   ├── AIPromptWizard.jsx   # Animated popup — builds AI prompt from questions
│   ├── CardSwap.jsx         # GSAP 3D card stack animation
│   ├── ImageUploader.jsx    # Upload file or paste URL, with live preview
│   ├── LetterGlitch.jsx     # Canvas-based glitch animation (404 page)
│   ├── WikiPreviewCard.jsx  # Compact wiki card shown in homepage stack
│   └── WikiTemplate.jsx     # Full Wikipedia-style wiki renderer
├── pages/
│   ├── Home.jsx             # Landing page with card stack and CTA
│   ├── CreateWiki.jsx       # Multi-step wiki creation flow
│   ├── WikiPage.jsx         # Public wiki view with share bar
│   ├── EditWiki.jsx         # Password-gated edit page
│   └── NotFound.jsx         # 404 page with LetterGlitch background
└── utils/
    ├── wikiStorage.js       # All Supabase read/write operations
    └── uploadImage.js       # Supabase Storage image upload helper
```

---

## How the creation flow works

```
1. Name + slug   →   who is this wiki about, and what's the URL?
2. Method        →   AI-assisted or write manually?
3. Editor        →   fill in all fields, upload a photo, add references
4. Password      →   optional — set one to allow future editing
5. Share         →   copy the link and send it to whoever it's about
```

### The AI generation path

WikiMe doesn't call any AI API directly. Instead:

1. You answer 5 short questions (who they are, what they're known for, key facts, tone, extras)
2. The app assembles a detailed prompt from your answers
3. You copy the prompt and paste it into any AI chat of your choice
4. The AI returns a JSON object — you paste it straight back into the app
5. The editor pre-fills with all the generated content, which you can tweak before publishing

This approach means you're not locked into one AI provider and the app stays free to run.

---

## Running it locally

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/wikime.git
cd wikime
```

### 2. Set up Supabase

Create a free project at [supabase.com](https://supabase.com), then run the following in the **SQL Editor**:

```sql
-- Wikis table
create table wikis (
  slug          text primary key,
  data          jsonb not null,
  password_hash text,
  has_password  boolean default false,
  saved_at      timestamptz default now()
);

-- Row-level security
alter table wikis enable row level security;

create policy "Anyone can read wikis"
  on wikis for select using (true);

create policy "Anyone can insert wikis"
  on wikis for insert with check (true);

create policy "Anyone can update wikis"
  on wikis for update using (true);
```

Then go to **Storage → New bucket**, name it `wiki-images`, tick **Public bucket**, and run:

```sql
create policy "Anyone can upload images"
  on storage.objects for insert
  with check (bucket_id = 'wiki-images');

create policy "Anyone can read images"
  on storage.objects for select
  using (bucket_id = 'wiki-images');
```

### 3. Create your `.env` file

In the root of the project (next to `package.json`), create a file called `.env`:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get both values from your Supabase dashboard under **Settings → API**.

### 4. Install and run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Deploying to Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add your two environment variables under **Settings → Environment Variables**
4. Create a `vercel.json` in the project root to fix client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

5. Deploy — every subsequent `git push` to `main` redeploys automatically

---

## Password & security notes

Passwords are hashed in the browser using **SHA-256** via the native Web Crypto API before being stored in Supabase. Plain-text passwords are never sent or stored. That said, this is a fun personal project — don't use it to protect anything sensitive.

Wikis published **without** a password are permanently read-only. There is no account system, no recovery option, and no way to edit a passwordless wiki after publishing.

---

## Contributing

Contributions are welcome. If you add a feature or fix a bug, please:

- Keep the code style consistent with what's already there
- Add a comment if the logic isn't immediately obvious
- Test on both desktop and mobile before submitting a PR
- Update this README if you add something significant

Open an issue first if you're planning something large — happy to discuss before you build it.

---

## Disclaimer

WikiMe pages are user-generated, unverified, and intended to be fictional and comedic. Every published page displays a notice to that effect. Please don't use it to spread misinformation about real people or to harass anyone. Keep it fun.

---

*Keep sharing and making.*