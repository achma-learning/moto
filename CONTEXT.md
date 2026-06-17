# Kymco Agility 50 4T — Marrakech Wiki — AI Context File
_Last synced: 2026-06-16 @ dc907d7_

## 1. What This Is (Plain English)
- **In one sentence:** A static website that's basically a personal maintenance manual for my Kymco Agility 50 4T scooter, tuned for Marrakech's heat and dust.
- **Why it exists:** Factory service intervals assume mild European weather. Mine lives in 40 °C+ summers, fine Saharan dust, and stop-and-go traffic — so I keep a wiki of shortened intervals, known failure modes, and how-to guides I can pull up on my phone in the garage.
- **Who uses it:** Just me (and any friend with the same bike). Public-readable on GitHub Pages (`https://achma-learning.github.io/moto/`), but it's a personal logbook in spirit.
- **Vibe:** Polished personal tool. Hand-written HTML, no build step — the content *is* the product. Parts are bilingual French/English (especially `wiki/maintenance.html`).

## 2. How To Run It
- **Setup once:** Nothing to install. Clone the repo. No package manager, no dependencies, no `.env`.
- **Run dev:** Open `index.html` in a browser. For correct nav paths, serve it: `python3 -m http.server` from the repo root, then visit `http://localhost:8000/`. `file://` mostly works too.
- **Build / deploy:** No build. Push to `main` → GitHub Pages serves it at `achma-learning.github.io/moto/`. There is **no** `.github/workflows/` — Pages is wired up in repo settings, not CI. Work on feature branches (`claude/...`), merge to `main` via PR.
- **Required env vars:** None.

## 3. Tech Stack
- **Language + runtime:** Plain HTML5, CSS3, vanilla JavaScript (ES5-style IIFE — `wiki/nav.js:3`). No transpiler, no Node needed to run.
- **Framework / key libraries:** None. Zero dependencies, on purpose.
- **What kind of project:** Static website / personal wiki on GitHub Pages.
- **External services:** GitHub Pages (hosting) only. `idea.md` sketches a *future* predictive-maintenance rig (ESP32 + K-Line + ntfy.sh) — none of it exists in the repo yet.

## 4. Code Map (The Important Files Only)
- `index.html` — Landing page: quick-action buttons, a spec summary, and a card grid linking every wiki section. The shopfront.
- `wiki/nav.js` — The only real logic. Injects the nav bar on every page, resolves the `wiki/` vs root path prefix (`wiki/nav.js:5`), theme toggle (dark/light, saved to `localStorage`), a client-side search index, and auto-anchors on `h2`/`h3` (`wiki/nav.js:118`). **Add a page → register it in BOTH `pages` (`wiki/nav.js:19`, the menu) and `searchIndex` (`wiki/nav.js:73`, search).**
- `wiki/style.css` — All styling. CSS variables drive the dark/light themes (`wiki/style.css:3` and `:21`). Single source of truth for visuals; includes the document-card / PDF-preview styles used by the Documents page.
- `wiki/maintenance.html` — Service intervals in two columns: **Marrakech-adjusted** vs **factory** (`Intervalle usine`). The factory column mirrors the official Kymco driver's-manual chart (p.39). Most-referenced page; canonical for intervals.
- `wiki/specs.html` — Technical specs. As of 2026-06-16 these match the **official factory spec sheet** (driver's manual p.40); fluids/plug list the **OEM** grade (15W-40 API SF, Champion P-RZ9HC), with the Marrakech alternatives cross-referenced to the maintenance page. Mechanical service limits (brake disc 3.0 mm, drum, belt width) and exact torque values come from the **workshop/atelier manual** (KN10 platform — engineering data the driver's manual omits). K-Line connector/PID content was moved out — see Diagnostics.
- `wiki/documents.html` — Opens the two official PDFs that came with the bike (driver's manual + maintenance passport) as cards with cover thumbnails and an on-demand inline PDF preview. Deliberately links files from `guides-docs/`.
- `wiki/manuals.html` — External/reference index: user + workshop manuals (4T / 2T / 125), parts catalogs, Wayback backups, and local copies in `guides-docs/`.
- `wiki/oil-systems.html` — Critical content: two separate oil systems (engine 10W-40 / gear 80W-90). Mixing them is the #1 user error.
- `wiki/failure-modes.html` — "What breaks first" ranked list (CVT rollers, pilot jet, …).
- `wiki/diagnostics.html` — Design notes + live-PID table for the planned ESP32 + L9637D K-Line reader (not built). All K-Line / OBD content lives here now.
- `wiki/guides.html`, `troubleshooting.html`, `parts.html`, `seasonal.html`, `pre-ride.html` — Reference content. Pure HTML, no logic.
- `wiki/favicon.svg` — Inline SVG favicon, injected by `nav.js`.
- `guides-docs/` — Original Kymco PDFs, scanned manual/passport PNGs, and the two generated `cover-*.jpg` thumbnails. Source material; only `documents.html` and `manuals.html` link a few of these on purpose.
- `idea*.md`, `suggestion*`, `kymco_agility_k_line_ai_system_architecture.svg` — Brainstorms for the unbuilt ESP32/AI side project. Not part of the live site.

## 5. Rules For Editing This Code
- **Zero dependencies. Keep it that way.** No `package.json`, no npm, no bundler.
- **No build step.** Edit HTML/CSS/JS, push, done. No SSG (Astro/Eleventy) without a real reason.
- **Vanilla JS only.** Keep `nav.js` an ES5-compatible IIFE — it runs on cheap Android browsers with bad signal.
- **Add a wiki page → update BOTH arrays in `wiki/nav.js`** (`pages` and `searchIndex`). Forgetting one is the most common drift.
- **Mobile-first.** Every page must read fine one-handed at ~375px.
- **Two pages, two truths — don't conflate them:**
  - `maintenance.html` = **Marrakech-adjusted recommendations** (intervals deliberately shorter than factory). Don't "correct" the Marrakech column back to OEM.
  - `specs.html` = **factory / OEM truth** from the official manual. Don't "upgrade" its fluids to the Marrakech 10W-40 — the OEM revert was deliberate (2026-06-16).
- **Bilingual content is intentional** on some pages (FR primary, EN bracketed). Match the page you're editing.
- **Linking a `guides-docs/` file is OK now** (the old "never link PDFs" rule is retired). But URL-encode spaces/parens in the path (e.g. `Driver%20manuel%20(kymco%20agility%2050).pdf`) and lazy-load any heavy preview to save mobile data.

## 6. Fragile Bits & Landmines
- **`nav.js` path-prefix logic** (`wiki/nav.js:5`) picks root vs `wiki/` by checking for `/wiki/` in the URL. Move pages or add a deeper subdir and links 404 silently on the affected pages. Test from both `index.html` and a wiki page after touching it.
- **Two parallel arrays in `nav.js`** (`pages` + `searchIndex`) — known duplication, no single source. Update both; don't "refactor" into something clever without testing search on every page.
- **Theme is set on `<html>` before paint** by reading `localStorage` synchronously in the IIFE (`wiki/nav.js:40`). Move it later and dark-mode loads flash white. Leave the order.
- **Anchor-link injection runs on `DOMContentLoaded`** (`wiki/nav.js:118`) while the rest of the IIFE runs at script-tag time. Don't merge them — anchors need the DOM ready; the early code prevents the flash above.
- **`maintenance.html` is canonical for intervals.** If `guides.html` / `seasonal.html` / etc. disagree, fix the *other* page.
- **`specs.html` is canonical for factory figures.** Idle is 1,700 rpm, compression 11:1, etc. — corrected from the official sheet, and the matching idle ranges in `diagnostics.html` were synced too. Don't revert them to the old guessed values.
- **Filenames with spaces / parentheses** in `guides-docs/` (and the root `idea*.md`). Quote them in shell, URL-encode when linking, and don't auto-rename without checking references in `documents.html` / `manuals.html`.

## 7. Current State
- **Last shipped:** PR #30 (branch `claude/kind-pasteur-g24i8u`) — new **Documents** page for the two official PDFs (cover thumbnails + lazy inline preview); `specs.html` synced to the official driver's-manual spec sheet with fluids reverted to OEM; `maintenance.html` factory column rewritten to match the manual chart; `diagnostics.html` idle synced to 1,700 rpm; K-Line connector/PID block removed from `specs.html`; then added workshop-manual service limits + exact torque values to `specs.html` (brake disc 3.0 mm, rear axle 108-127 N·m, belt width 17.5/16.5 mm, etc.).
- **Working on now:** This `CONTEXT.md` refresh.
- **Next up:**
  1. Decide whether the Marrakech air-filter *replace* interval (5,000 km) should be shortened — it's currently longer than the manual's 2,000 km.
  2. Decide whether the OEM-vs-Marrakech split on `specs.html` should propagate to the homepage / other pages that still quote 10W-40.

## 8. Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update CONTEXT.md":
> 1. Re-run Phase 0 — check for new `GEMINI.md` / `CLAUDE.md` / `.github/` files.
> 2. Re-scan the tree, manifests, and `.github/workflows/` for drift.
> 3. Read our recent conversation for new decisions, fragile bits discovered, or shifted goals.
> 4. Refresh the `_Last synced_` line with today's date and current commit SHA.
> 5. Rewrite — do not append. One clean source of truth. Preserve still-true content, revise the rest.
> 6. Keep §1 and §2 in plain English. Keep the file under ~350 lines.
