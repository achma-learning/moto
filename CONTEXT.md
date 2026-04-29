# Kymco Agility 50 4T — Marrakech Wiki — AI Context File
_Last synced: 2026-04-29 @ 7af7e8e_

## 1. What This Is (Plain English)
- **In one sentence:** A static website that's basically a personal maintenance manual for my Kymco Agility 50 4T scooter, written for Marrakech's heat and dust.
- **Why it exists:** Factory service intervals assume mild European weather. Mine lives in 40 °C+ summers, fine dust, and stop-and-go traffic — so I keep a wiki of shortened intervals, known failure modes, and how-to guides I can pull up in the garage on my phone.
- **Who uses it:** Just me (and any friend with the same bike). Public-readable, but it's a personal logbook in spirit. Hosted on GitHub Pages: `https://achma-learning.github.io/moto/`.
- **Vibe:** Polished personal tool. Hand-written HTML, no build step, content is the product. Bilingual French/English in places (especially `wiki/maintenance.html`).

## 2. How To Run It
- **Setup once:** Nothing. Clone the repo. There's no package manager, no dependencies, no `.env`.
- **Run dev:** Open `index.html` in a browser. Or `python3 -m http.server` from the repo root, then visit `http://localhost:8000/` (the relative paths to `wiki/` need a real server context for nav to feel right, but `file://` mostly works too).
- **Build / deploy:** No build. Push to `main` → GitHub Pages serves it. The live site is `achma-learning.github.io/moto/`. Branch policy: feature branches like `claude/...`, merged via PR to `main`.
- **Required env vars:** None.

## 3. Tech Stack
- **Language + runtime:** Plain HTML5, CSS3, vanilla JavaScript (ES5-ish — see IIFE in `wiki/nav.js:3`). No transpiler, no Node required to run.
- **Framework / key libraries:** None. Zero dependencies on purpose.
- **What kind of project:** Static website / personal wiki, hosted on GitHub Pages.
- **External services:** GitHub Pages for hosting. That's it. `idea.md` describes a *future* predictive-maintenance system (ESP32 + K-Line + GitHub Actions + ntfy.sh) but none of that exists in the repo yet.

## 4. Code Map (The Important Files Only)
- `index.html` — Landing page. Quick-action buttons, spec summary, and card grid linking to all wiki sections. The shopfront.
- `wiki/nav.js` — The one piece of real logic. Injects the nav bar into every page, handles the wiki/root path prefix, theme toggle (dark/light, persisted to `localStorage`), client-side search index, and auto-anchors on `h2`/`h3` (`wiki/nav.js:114`). If you add a page, register it in both `pages` (line 19) **and** `searchIndex` (line 71).
- `wiki/style.css` — All styling. CSS variables drive the dark/light theme (`wiki/style.css:3` and `:21`). Single source of truth for visuals.
- `wiki/maintenance.html` — Service intervals, Marrakech-adjusted. The most-referenced page; per the latest commit message, it's the "source of truth" the other wiki pages get reconciled against.
- `wiki/oil-systems.html` — Critical content: this bike has two separate oil systems (engine 10W-40 / gear 80W-90). Mixing them up is the #1 user error.
- `wiki/failure-modes.html` — The "what breaks first" ranked list (CVT rollers, pilot jet, etc.).
- `wiki/diagnostics.html` — Hardware/software design notes for the ESP32 + L9637D K-Line reader (planned project, not built).
- `wiki/specs.html`, `guides.html`, `troubleshooting.html`, `parts.html`, `seasonal.html`, `pre-ride.html` — Reference content. Pure HTML, no logic.
- `wiki/favicon.svg` — Inline SVG favicon, injected by `nav.js`.
- `guides-docs/` — Original Kymco PDFs and scanned manuals. Source material; don't link to them from the wiki (large files, not for serving).
- `idea.md`, `idea2 (esp32>phone).md`, `idea3(copy functional version).md`, `suggestion-digital-tack-ai.md`, `kymco_agility_k_line_ai_system_architecture.svg` — Design notes and brainstorms for the ESP32/AI predictive-maintenance side project. Not part of the live site.

## 5. Rules For Editing This Code
- **Zero dependencies. Keep it that way.** No `package.json`, no npm, no bundler. If a feature needs a library, push back.
- **No build step.** Edit HTML/CSS/JS, push, done. Don't introduce SSG (Astro, Eleventy, etc.) without a real reason.
- **Vanilla JS only.** Keep `nav.js` in IIFE form, ES5-compatible — it has to run on cheap Android browsers in a garage with bad signal.
- **When you add a wiki page**, register it in **both** arrays in `wiki/nav.js` (`pages` for the menu, `searchIndex` for search). Forgetting one is the most common drift.
- **Mobile-first.** Every page must read fine on a phone screen one-handed. Test at ~375px width.
- **Marrakech intervals are deliberately shorter than factory.** Don't "correct" them back to the OEM schedule. The whole point is the local adjustment.
- **Bilingual content is intentional** in some pages (FR primary, EN bracketed). Match the existing pattern of the page you're editing rather than forcing one language.
- **Don't link the PDFs in `guides-docs/`** from the wiki HTML — they're heavy and there for human reference, not for serving.

## 6. Fragile Bits & Landmines
- **`wiki/nav.js` path-prefix logic** (`wiki/nav.js:5`) decides between root and `wiki/` based on whether the URL contains `/wiki/`. It works, but if you ever move pages or add a deeper subdirectory, this breaks silently — links 404 only on the affected pages. Test from both `index.html` and any wiki page after touching it.
- **Two parallel arrays in `nav.js`** (`pages` and `searchIndex`) are a known duct-tape duplication. Adding a page requires updating both — no single source of truth. Don't "refactor" it into something clever without testing search on every page.
- **Theme is set on `<html>` before paint** by reading `localStorage` synchronously inside the IIFE (`wiki/nav.js:38`). Moving that logic later in the file causes a visible white flash on dark-mode loads. Leave the order alone.
- **Anchor-link injection runs on `DOMContentLoaded`** but the IIFE itself runs at script-tag time. Don't merge them — anchor injection needs the DOM ready, the rest doesn't, and the early stuff prevents the flash above.
- **`maintenance.html` is the canonical source** for service intervals (per commit `fc659a2`). If `guides.html`, `seasonal.html`, etc. disagree, fix the *other* page, not maintenance.
- **`guides-docs/test`** is a 1-byte placeholder file. Looks deletable. Probably is. Verify before removing — it might exist to keep the directory tracked by git.
- **Filenames with spaces and parentheses** in `guides-docs/` and the root `idea*.md` files. Quote them in shell commands; don't auto-rename without checking nothing references them.
- **The `idea*.md` and `suggestion*` files at the repo root** are scratchpads for the unbuilt ESP32 project. They look like docs but aren't authoritative for anything in the live site.

## 7. Current State
- **Last shipped:** PR #18 merged — scooter website optimization pass; `maintenance.html` reaffirmed as source of truth and other wiki pages synced to it (commit `fc659a2`).
- **Working on now:** Adding this `CONTEXT.md` (branch `claude/add-context-documentation-n0vY2`).
- **Next up:**
  1. _Not yet figured out_ — possibly start Phase 1 of the ESP32 K-Line logger described in `idea.md`.
  2. _Not yet figured out_ — verify all wiki pages still match `maintenance.html` after recent edits.

## 8. Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update CONTEXT.md":
> 1. Re-run Phase 0 — check for new `GEMINI.md` / `CLAUDE.md` / `.github/` files.
> 2. Re-scan the tree, manifests, and `.github/workflows/` for drift.
> 3. Read our recent conversation for new decisions, fragile bits discovered, or shifted goals.
> 4. Refresh the `_Last synced_` line with today's date and current commit SHA.
> 5. Rewrite — do not append. One clean source of truth. Preserve still-true content, revise the rest.
> 6. Keep §1 and §2 in plain English. Keep the file under ~350 lines.
