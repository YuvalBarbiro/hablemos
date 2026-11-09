# ¡Hablemos! — Spanish from scratch

A home-screen web app (PWA) for learning Spanish from English, with optional Hebrew hints.
No build step and no dependencies: plain HTML, CSS and JavaScript.

## What's inside

- **33 lessons in 6 units**: concepts, tap-to-hear words and sentences, and a practice session
  (multiple choice, listening, sentence building, typing, and Language Transfer-style "think it out" prompts)
- **Daily review**: spaced repetition with 7 levels (1 day up to 6 months)
- **Reference**: cognate rules (English → Spanish), verb tables, pronouns, searchable dictionary
- **Audio**: all 90 Language Transfer tracks, each paired with a lesson, with a listened checklist
- Works offline, keeps a streak and XP, and lets you back up and restore progress

## Run locally

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765.

## Files

| Path | What |
|---|---|
| `index.html` | App shell |
| `js/app.js` | All app logic (router, views, exercises, spaced repetition, speech) |
| `js/data/units*.js` | Curriculum. Add or edit lessons here |
| `js/data/reference.js` | Cognates, verb tables, pronouns, Language Transfer links |
| `css/app.css` | Styles (light and dark) |
| `sw.js` | Offline cache |

## Publishing an update

1. Bump `VERSION` in `sw.js` and `APP_VERSION` in `index.html`; otherwise installed phones keep the old cached copy.
2. Commit and push. GitHub Pages redeploys in about a minute.
3. On the iPhone, open the app; a "New version ready" banner appears. Tap it.

## Install on iPhone

Open the site in **Safari**, tap **Share → Add to Home Screen**. It then opens full screen like an app.
