# ADR-0001: No Build Step (Source Mode)

**Date:** 2026-03 | **Status:** Accepted — amended v2026.03.362

## Context
Ogma deploys as a static site on Cloudflare Pages. Should we use a build tool (Vite, Webpack) for optimised bundles, or serve source files directly?

## Decision
**No required build step. Source files are the deployed files.**

An optional build pipeline (`scripts/build.js`) was added in v2026.03.362 for production optimisation. It is not required for deployment or development.

## Consequences
**Positive:** Zero toolchain to install — contributors clone and open. No build artefacts required. Browser devtools show actual source. Deployable to any static host with zero config.

**Negative:** No tree-shaking, minification, or code splitting in source mode. File sizes larger than a bundled equivalent. Cannot use npm packages without a UMD/CDN build.

**Mitigations:** Service worker caches all files after first load — parse cost paid once. `?v=N` cache busting prevents stale files. CDN delivers React/Dexie with edge caching. Optional `scripts/build.js` (Tier 1 terser: ~55% savings, Tier 3 no-dep: ~11%) available for production deploy via `npm run build`.

## Optional build pipeline (v2026.03.362+)

`scripts/build.js` concatenates 8 core JS files → `dist/ogma.core.min.js`. Auto-detects terser (Tier 1, ~55%), esbuild (Tier 2, ~40%), or pure Node concat (Tier 3, ~11%). HTML rewrite via `--rewrite-html` flag replaces 12 campaign script tags with 1 bundle tag.

Install: `npm install --ignore-scripts` (use `--ignore-scripts` to skip puppeteer browser download in restricted environments).

The bundle is NOT in SW `APP_SHELL` — a missing bundle must never abort the SW install.

## Alternatives considered
- **Vite** — excellent DX, but adds a required build step that breaks the "just open index.html" workflow.
- **ES Modules only** — partially adopted; requires `type="module"` across all HTML and changes the global-variable communication pattern. Parked as SPA-06.
