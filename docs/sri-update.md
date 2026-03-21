# SRI Hash Update Guide

This document explains what SRI hashes are, when they need updating, and exactly
what to do when they do.

---

## What are SRI hashes?

Every CDN script tag in Ogma's HTML looks like this:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"
        integrity="sha384-tMH8h3BGESGckSAVGZ82T9n90ztNXxvdwvdM6UoR56cYcf+0iGXBliJ29D+wZ/x8"
        crossorigin="anonymous"></script>
```

The `integrity` attribute is a fingerprint of the exact file bytes. The browser
downloads the file, hashes it, and refuses to run it if the hash doesn't match.
This prevents a compromised CDN from injecting malicious code into Ogma.

---

## When do hashes need updating?

**Only in two situations:**

1. **You bump a CDN dependency to a new version** — e.g. React 18.2.0 → 18.3.0
2. **You switch CDN provider** — e.g. cdnjs → unpkg

That's it. The hash for a given URL is permanent — the file at that URL never
changes. `react.production.min.js` at version 18.2.0 on cdnjs will always hash
to the same value.

**You do NOT need to update hashes if:**
- You deploy a new version of Ogma
- You change your own code
- You add new generators or worlds

---

## How will I know if hashes need updating?

**CI will tell you.** The `qa` job in `.github/workflows/ci.yml` runs
`node scripts/check-cdn-versions.js` on every push. If hashes are wrong or
missing, the job fails with a clear error message pointing to this document.

You can also run it locally at any time:
```bash
node scripts/check-cdn-versions.js
```

---

## Step-by-step: how to update hashes after a version bump

**Step 1 — Update the version in `cdn-dependencies.json`**

Open `cdn-dependencies.json` and change the version number and URL for the
dependency you're updating. For example, bumping React to 18.3.0:

```json
"react": {
  "version": "18.3.0",
  "url": "https://cdnjs.cloudflare.com/ajax/libs/react/18.3.0/umd/react.production.min.js",
  ...
}
```

**Step 2 — Compute the new hash**

Run this command on a normal internet connection (not behind a corporate firewall,
not in a sandboxed container):

```bash
# React
curl -s "https://cdnjs.cloudflare.com/ajax/libs/react/18.3.0/umd/react.production.min.js" \
  | openssl dgst -sha384 -binary | openssl base64 -A

# ReactDOM
curl -s "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.0/umd/react-dom.production.min.js" \
  | openssl dgst -sha384 -binary | openssl base64 -A

# Dexie (if updating)
curl -s "https://cdnjs.cloudflare.com/ajax/libs/dexie/X.Y.Z/dexie.min.js" \
  | openssl dgst -sha384 -binary | openssl base64 -A
```

Each command outputs a base64 string. That's your new hash.

**Step 3 — Give the hashes to Claude**

Send Claude the three hash strings and say "update SRI hashes". Claude will
update all 20 HTML files and `cdn-dependencies.json` in a single pass.

Alternatively, update `cdn-dependencies.json` manually with:
```json
"integrity": "sha384-<your-hash-here>"
```
Then run `node scripts/check-cdn-versions.js` to verify.

**Step 4 — Update vendored copies (for offline support)**

Download the real files to replace the vendored stubs:

```bash
curl -o assets/js/react.production.min.js \
  "https://cdnjs.cloudflare.com/ajax/libs/react/18.3.0/umd/react.production.min.js"

curl -o assets/js/react-dom.production.min.js \
  "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.0/umd/react-dom.production.min.js"
```

**Step 5 — Verify and deploy**

```bash
node scripts/check-cdn-versions.js   # should pass clean
node scripts/verify-cdn-deps.js      # should show OK for all
node tests/qa_named.js             # should be 102/102
```

Then push to main — CI will confirm before deploying.

---

## Current pinned versions

| Library   | Version | Hash (sha384) |
|-----------|---------|---------------|
| React     | 18.2.0  | `tMH8h3BGESGckSAVGZ82T9n90ztNXxvdwvdM6UoR56cYcf+0iGXBliJ29D+wZ/x8` |
| ReactDOM  | 18.2.0  | `bm7MnzvK++ykSwVJ2tynSE5TRdN+xL418osEVF2DE/L/gfWHj91J2Sphe582B1Bh` |
| Dexie     | 4.0.10  | `3VWLzUTczDc/wazaoH+b5qG4iME0duPONRO281rRiaFkfpV/b3w5uxrvod7rCHcW` |

These hashes are permanent for these versions. They will never need updating
unless you change the version number.

---

## React 19 note

React 19 removes the UMD build entirely, which is what Ogma uses. When you
eventually upgrade to React 19, the CDN pattern changes — there will be no
`react.production.min.js` UMD file to link to. That upgrade is a larger
architectural change, not just a hash update. It's parked in the backlog until
needed. Do not bump React past 18.x without a plan for this.
