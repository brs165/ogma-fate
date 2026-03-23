# Ogma — Build Pipeline

> **Normal development:** no build step needed. Source files are the deployed app.
> The build pipeline is an optional optimisation for production deploys.

---

## Overview

`scripts/build.js` concatenates 8 core JS files into a single bundle (`dist/ogma.core.min.js`), reducing per-request overhead on first load. It auto-detects which minifier is available and selects the appropriate tier.

---

## Tier table

| Tier | Requires | Savings | Notes |
|------|----------|---------|-------|
| **1** | `npm install` (terser) | ~55% | Full compress + mangle. Best for production. |
| **2** | `npm install` (esbuild) | ~40% | Fast transform minify. Good for CI. |
| **3** | Node.js only (no deps) | ~11–14% | Comment strip + blank collapse. Always available. |

Tier is auto-detected: terser → esbuild → Tier 3. Force a tier with `--tier N`.

---

## Install (for Tier 1/2)

```bash
npm install
```

devDependencies added: `terser`, `esbuild`, `html-minifier-terser`, `puppeteer`, `sharp`.

---

## Usage

```bash
# Auto-detect tier, produce dist/ogma.core.min.js
node scripts/build.js

# Force Tier 3 (no deps required)
node scripts/build.js --tier 3

# Tier 3 + rewrite campaign HTML to use bundle tag
node scripts/build.js --tier 3 --rewrite-html

# Bump version then build (for CI / deploy)
npm run build:prod
```

---

## Deploy modes

| Mode | Command | What happens |
|------|---------|--------------|
| **Source** (default) | push to Cloudflare Pages | No build. Campaign HTML loads individual script tags. SW caches all files. |
| **Bundled** | `npm run build:prod` then deploy `dist/` | Campaign HTML rewrites to 1 bundle tag. SW also caches `/ogma.core.min.js`. |

**Source mode is the default and always works.** Bundled mode is an optional optimisation and requires `--rewrite-html` to wire up campaign pages.

---

## Before/after metrics (Tier 3, v360)

| | Before | After |
|--|--------|-------|
| Bundle size | 564 KB | 500 KB |
| Script tags per campaign page | 12 | 4 (data + CDN + bundle + intro) |
| Savings | — | ~11% |

Tier 1 (terser, full install) projects ~55% savings.

---

## What the pipeline does NOT do

- Does not touch data files (`data/*.js`)
- Does not modify CDN script tags (React, ReactDOM, Dexie)
- Does not modify `partysocket.js` (no UMD CDN build exists)
- Does not change the SW cache strategy
- Does not affect development workflow — source files remain the app

---

## Adding a new core file

1. Add the file path to the `CORE_FILES` array in `scripts/build.js`
2. If it should be bundled (not data/CDN), add its pattern to `BUNDLE_REPLACES`
3. Run `node scripts/build.js` to verify the pipeline still produces valid output
