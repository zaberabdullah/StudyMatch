# StudyMatch — AI-Matched Study Abroad Platform

A full-stack agentic AI application that matches students to universities
abroad based on their IELTS/GPA scores, budget, and preferences, using an
LLM-powered recommendation engine and a context-aware chat assistant.

## Stack
- **Frontend:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · TanStack Query
- **Backend:** Node.js · Express · TypeScript · MongoDB (Mongoose) · JWT + Google OAuth
- **AI:** Any OpenAI-compatible provider (OpenAI, Groq, Together AI, or local Ollama)

## AI Features (2 implemented, per project requirements)
1. **AI Smart Recommendation Engine** (`/recommendations`) — reasons over the
   student's profile, past interactions, and real listing data to return a
   ranked, explained shortlist. Learns from view/save/apply interactions
   stored in `Interaction` and supports free-text refinement.
2. **AI Chat Assistant** (floating widget, all pages) — conversational,
   app-aware assistant with persisted history per session, typing indicator,
   and AI-generated follow-up question suggestions.

## Project layout
```
studymatch/
  backend/      Express + TypeScript API
  frontend/     Next.js + TypeScript app
```

## Deployment guide (all on Vercel + MongoDB Atlas + Cloudinary)

Both the frontend (Next.js) and backend (Express) deploy from the **same
GitHub repo** — you push once, then create **two separate Vercel projects**
that each point at a different root directory within it.

### Step 1 — Push to GitHub first
```bash
cd studymatch
git init
git add .
git commit -m "Initial commit: StudyMatch full-stack AI platform"
git branch -M main
git remote add origin https://github.com/<your-username>/studymatch.git
git push -u origin main
```
Both Vercel projects (frontend and backend) will import this same repo —
that satisfies "frontend and backend" submission links even though it's one
repository, since each has its own root directory and its own deployment.

### Step 2 — Database: MongoDB Atlas
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a user with a password.
3. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) — required
   since Vercel's serverless functions run from rotating IPs.
4. Click **Connect → Drivers**, copy the connection string, and insert your
   database name before the `?`, e.g.
   `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/studymatch?appName=Cluster0`
   — this becomes your `MONGODB_URI`.

### Step 3 — Image hosting: Cloudinary
1. Create a free account at [cloudinary.com](https://cloudinary.com) (no
   card required).
2. Your **Dashboard** page shows three values you need: **Cloud name**,
   **API Key**, **API Secret** — copy all three.
3. These become `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
   `CLOUDINARY_API_SECRET`.

### Step 4 — Backend: Vercel project #1
1. On [vercel.com](https://vercel.com), click **Add New → Project**, import
   your `studymatch` repo.
2. Set **Root Directory** to `backend`.
3. Vercel will detect `vercel.json` and the `api/index.ts` serverless
   function automatically — no build command changes needed.
4. Add environment variables (from `backend/.env.example`): `MONGODB_URI`,
   `JWT_SECRET`, `JWT_EXPIRES_IN`, `GOOGLE_CLIENT_ID`, `AI_API_KEY`,
   `AI_BASE_URL`, `AI_MODEL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
   `CLOUDINARY_API_SECRET`, and `CLIENT_URL` (set this to your frontend's
   Vercel URL once you have it in Step 5 — you can update it after).
5. Deploy. You'll get a URL like `https://studymatch-backend.vercel.app`.
6. Seed the database once: on your own machine, temporarily point
   `backend/.env`'s `MONGODB_URI` at the same Atlas cluster and run
   `npm run seed` locally — it writes directly to Atlas, so this only needs
   to happen once regardless of where the backend is hosted.

### Step 5 — Frontend: Vercel project #2
1. Click **Add New → Project** again, import the **same** `studymatch` repo.
2. Set **Root Directory** to `frontend`.
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` → `https://studymatch-backend.vercel.app/api`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` → your Google OAuth Client ID
4. Deploy. You'll get a URL like `https://studymatch.vercel.app`.
5. Go back to the **backend** project's settings and update `CLIENT_URL` to
   this frontend URL, then redeploy the backend (required for CORS to allow
   requests from it).

### Step 6 — Google OAuth authorized origins
In the Google Cloud Console, add **both** URLs as authorized JavaScript
origins on your OAuth Client ID: `http://localhost:3000` (local dev) and
your frontend's Vercel URL (production). Keep both — don't remove localhost.

### Notes on this setup
- **Cold starts:** serverless functions "sleep" after inactivity; the first
  request after a while takes 1-2 extra seconds while it wakes up and
  reconnects to MongoDB. This is normal and not a bug.
- **Local dev is unaffected:** `npm run dev` in `backend/` still runs the
  traditional persistent Express server via `src/server.ts` — the
  serverless `api/index.ts` entry point is only used by Vercel.
- **Redeploys:** pushing to `main` on GitHub auto-redeploys both Vercel
  projects independently.

## Getting started

### 1. Backend
```bash
cd backend
cp .env.example .env     # then fill in MONGODB_URI, JWT_SECRET, AI_API_KEY, etc.
npm install
npm run seed              # loads 8 real university listings + admin user
npm run dev                # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL and Google client ID
npm install
npm run dev                # http://localhost:3000
```

### 3. Demo login
Click **"Use demo account"** on the login or register page — no credentials
needed. It auto-creates/logs into a seeded demo student profile
(IELTS 6.5, GPA 3.4, $25k budget) so you can immediately try the
recommendation engine and chat assistant.

### 4. AI provider setup
`AI_API_KEY` / `AI_BASE_URL` / `AI_MODEL` in `backend/.env` accept any
OpenAI-compatible endpoint:
- **OpenAI:** `AI_BASE_URL=https://api.openai.com/v1`, `AI_MODEL=gpt-4o-mini`
- **Groq:** `AI_BASE_URL=https://api.groq.com/openai/v1`, `AI_MODEL=llama-3.1-70b-versatile`
- **Ollama (local):** `AI_BASE_URL=http://localhost:11434/v1`, `AI_MODEL=llama3.1`, `AI_API_KEY=ollama`

### 5. Google Sign-In
The button is fully wired using `@react-oauth/google` — you only need to
supply a Client ID, no code changes required:
1. Create an OAuth Client ID at the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Add `http://localhost:3000` (and your deployed domain) as an authorized JavaScript origin.
3. Set `GOOGLE_CLIENT_ID` in `backend/.env` (used to verify the token server-side).
4. Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `frontend/.env.local` (used to render the button).

Until a client ID is set, the button renders disabled with a clear
"not configured" label instead of breaking the page.

> **Why the button might look "missing":** if `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
> isn't set in `frontend/.env.local`, the button shows as a greyed-out
> "Continue with Google (not configured)" pill rather than the real Google
> widget — this is intentional so the page doesn't crash, but it can look
> like there's no button at all. Set the env var and restart `npm run dev`
> to see the real Google button.

## What's fully implemented vs. what to extend
**Implemented:** auth (register/login/demo/JWT), Google OAuth end-to-end
(backend verification + wired frontend button), full CRUD for listings,
search/filter/sort/pagination, protected add/manage pages, details page
with related items, a full reviews & ratings system (post/delete review,
live-recomputed aggregate rating), Cloudinary-backed image upload with
preview (plus manual URL entry) that works on serverless hosting, both AI
features end-to-end, responsive nav/footer, a serverless-ready backend
(Vercel entry point + cached MongoDB connection) alongside the traditional
`npm run dev` server for local development, 8-section landing page, design
system (Tailwind tokens, custom fonts).

**Recommended next steps for a production submission:**
- Deploy following the step-by-step guide above (two Vercel projects +
  Atlas + Cloudinary), then update the Live URL and GitHub link in your
  submission.
- Add a proper reviews moderation flow (report/hide) if you want to extend
  further — not required by the assignment brief.

## Scripts
| Location | Command | What it does |
|---|---|---|
| backend | `npm run dev` | Start API with hot reload |
| backend | `npm run seed` | Seed 8 universities + admin account |
| backend | `npm run build && npm start` | Production build/run |
| frontend | `npm run dev` | Start Next.js dev server |
| frontend | `npm run build && npm start` | Production build/run |
