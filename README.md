# Randon

**Curious, calm, local-first learning** — a mobile-first PWA that gives you one random lesson a day, on your device. No account. No backend. Built around showing up — not streak pressure.

Randon is for showing up: pick topics you care about, get a short daily lesson (article or illustrated visual), revisit what you’ve cached, and open public-domain books when you want to go deeper.

## Features

- **Onboarding** — multi-select topics (Physics, Cybersecurity, STEM Science, Painting, History, Law)
- **Today** — a daily random lesson drawn for your local calendar date
- **Lessons** — article mode with a calm topic still (no autoplay video), or **visual step-card** lessons (SVG/CSS diagrams)
- **Library** — revisit cached lessons offline (All / In progress / Finished / Offline)
- **Books** — Project Gutenberg public-domain catalog; **Open** reads on-device **TXT**; **Download EPUB** is a real Gutenberg file link (not an in-app EPUB parser)
- **Settings** — topics, appearance (System / Light / Dark), local data export/import; optional “days this month” showing-up dots (not XP/flames)
- **PWA** — installable; IndexedDB persistence; offline revisit of cached lessons

Tone: **curious + calm**. No gamification leagues, confetti, or crack/attack how-tos in cybersecurity content (defensive hygiene only).

## Quick start

```bash
npm install
npm run dev
```

Open the local URL Vite prints.

```bash
npm run build
npm run preview
```

## Lesson routes (visual pack)

| Route | Lesson |
|--------|--------|
| `/lesson/cyber-threat` | Threat modeling a small site |
| `/lesson/stem-candle` | Faraday’s candle |
| `/lesson/physics-inertia` | Inertia |
| `/lesson/cyber-hash-fingerprint` | Hash as a fingerprint machine |
| `/lesson/physics-resonance-swing` | Resonance — the push on the beat |
| `/lesson/painting-complements-vibrate` | Complements that vibrate |
| `/design/visual-lessons` | Stacked preview of all six |

Visual system: cream `#F7F4EF`, surface `#FFFFFF`, ink `#2C2926`, muted `#6B6560`, line `#E8E4DC`, teal `#3D8B84`, amber `#C9893A`. Dark: bg `#1C1A17`, surface `#26231F`, ink `#F2EDE6`, muted `#A39E96`, line `#3A3631`. Amber is for showing-up / avalanche / on-beat accents only.

## Books honesty

- **Open** → on-device TXT reader
- **Download EPUB** → real Gutenberg EPUB file
- No fake in-app EPUB reader; no paid ebook APIs

## Stack

Vite + React + TypeScript, Tailwind, react-router-dom, IndexedDB (idb), vite-plugin-pwa.

## License

App code: see repository license if present. Book content: public-domain sources (e.g. Project Gutenberg).
