# SEO Mastery 2026 — Study Guide

A complete interactive SEO study guide covering SEO, AEO, GEO, HEO, Technical, Local, Analytics, and Strategy.

## Deploy to Vercel (3 steps)

### Option A — Vercel CLI (fastest)
```bash
npm install
npx vercel
```

Follow the prompts. Your site will be live in ~60 seconds.

### Option B — Vercel Dashboard (no CLI needed)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Click **"Upload"** and drag this entire folder
4. Click **Deploy** — done

### Option C — GitHub (recommended for ongoing updates)
1. Push this folder to a GitHub repository
2. Go to vercel.com → New Project → Import from GitHub
3. Select your repo — Vercel auto-detects Vite, no config needed
4. Click Deploy

## Local Development
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Build
```bash
npm run build
```
Output goes to `dist/` — ready to upload anywhere.

## Tech Stack
- React 18
- Vite 5
- No external dependencies beyond React
- All progress is stored in React state (resets on page refresh)
  - To persist progress, add localStorage in App.jsx's useState initializers
