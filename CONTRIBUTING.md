# Contributing to the Fate Condensed Campaign Generator Suite
<!-- BL-16: rename when rebrand ships -->

This document explains how to add new content — table entries, campaigns, and generator data — without touching any generator logic.

---

## Table of Contents

1. [Project structure](#1-project-structure)
2. [How the engine uses your data](#2-how-the-engine-uses-your-data)
3. [The Variety Matrix system](#3-the-variety-matrix-system)
4. [Table types reference](#4-table-types-reference)
5. [Adding entries to an existing campaign](#5-adding-entries-to-an-existing-campaign)
6. [Adding a new campaign](#6-adding-a-new-campaign)
7. [The Table Manager and filteredTables](#7-the-table-manager-and-filteredtables)
8. [Testing your changes](#8-testing-your-changes)
9. [Checklist before submitting a PR](#9-checklist-before-submitting-a-pr)

---

## 1. Project structure

See `README.md` for the full annotated file tree. The key rule:

> **If you are adding or editing table content, you should only need to touch `data/[campaign].js`.** If you are adding a new campaign, you also touch the HTML files, `core/ui.js`, `sw.js`, and `manifest.json`. You should never need to touch `core/engine.js` for a content contribution.

---

## 2. How the engine uses your data

Each campaign file registers one entry into the global `CAMPAIGNS` object:

```js
CAMPAIGNS["mycampaign"] = {
  meta:        { id, name, tagline, icon, font },
  colors:      { /* dark theme colour tokens */ },
  lightColors: { /* light theme colour tokens */ },
  tables:      { /* all generator tables — see §4 */ },
};
```

When a user clicks **Roll**, the engine calls:

```js
generate(genId, CAMPAIGNS[campId].tables, partySize)
```

It passes the entire `tables` object to the appropriate `generate*` function. Each function reads specific keys — for example, `generateMinorNPC(t)` reads `t.names_first`, `t.names_last`, `t.minor_concepts`, and `t.minor_weaknesses`. If a key is missing or empty, the generator throws or produces blank output.

---

## 3. The Variety Matrix system

### The problem it solves

A flat list of 20 NPC concepts gives you 20 results. You will see repeats quickly. A Variety Matrix produces thousands of distinct combinations from a compact data structure.

### How it works

A Variety Matrix table is a JavaScript object with two keys:

- **`t`** — an array of template strings containing `{VarName}` tokens.
- **`v`** — a map of variable names to arrays of possible values.

`fillTemplate()` picks one template at random, finds every `{VarName}` token, and replaces each with a random value from `v[VarName]`.

### Example

```js
scene_tone: {
  t: [
    "{TAdj} and {TAdj2}",
    "{TNoun}-charged, {TQual}",
    "The air is {TAir}",
    "{TQual} — {TUndertone}",
  ],
  v: {
    TAdj:       ["Tense", "Hostile", "Wary", "Desperate", "Charged"],
    TAdj2:      ["unstable", "heavily armed", "barely civil", "watching the exits"],
    TNoun:      ["Violence", "Desperation", "Betrayal", "Tension"],
    TQual:      ["standoff", "fragile truce", "open hostility", "wary cooperation"],
    TAir:       ["thick with unspoken threats", "heavy with what nobody's saying"],
    TUndertone: ["weapons visible", "exits being watched", "hands near hilts"],
  }
}
```

Four templates × six variable groups × ~5 values each = hundreds of unique combinations from ~35 entries.

### Naming conventions

Variable names use **CamelCase with a table-specific prefix** to prevent collisions.

| Table | Prefix | Example |
|-------|--------|---------|
| `minor_concepts` | `M` | `MAdj`, `MRole` |
| `major_concepts` | `Maj` | `MajAdj`, `MajRole` |
| `other_aspects` | `O` | `OContext`, `OTrait` |
| `scene_tone` | `T` | `TAdj`, `TQual` |
| `scene_danger` | `D` | `DAdj`, `DHazard` |
| `setting_aspects` | `S` | `SAdj`, `SNoun` |

The `t` array can mix template strings (with `{VarName}`) and plain strings (no tokens). Plain strings are picked verbatim — useful for lines too specific to template.

---

## 4. Table types reference

Every campaign's `tables` object must contain the following keys.

### Variety Matrix tables

| Key | Used by generator |
|-----|-------------------|
| `minor_concepts` | Minor NPC |
| `major_concepts` | Major NPC |
| `other_aspects` | Major NPC |
| `scene_tone` | Scene, Encounter |
| `scene_danger` | Scene, Encounter, Seed |
| `setting_aspects` | Campaign, Seed |

### Flat string arrays

| Key | Used by | Min entries |
|-----|---------|-------------|
| `names_first` | Minor NPC, Major NPC | 20 |
| `names_last` | Minor NPC, Major NPC | 10 |
| `troubles` | Major NPC | 15 |
| `minor_weaknesses` | Minor NPC | 15 |
| `scene_cover` | Scene, Encounter | 10 |
| `scene_movement` | Scene | 10 |
| `scene_usable` | Scene | 10 |
| `twists` | Encounter, Seed | 15 |
| `victory` | Encounter, Seed | 10 |
| `defeat` | Encounter, Seed | 10 |
| `seed_locations` | Seed | 10 |
| `seed_objectives` | Seed | 10 |
| `seed_complications` | Seed | 10 |
| `compel_situations` | Compel | 12 |
| `compel_consequences` | Compel | 12 |
| `consequence_mild` | Consequence | 8 |
| `consequence_moderate` | Consequence | 8 |
| `consequence_severe` | Consequence | 8 |
| `consequence_contexts` | Consequence | 8 |
| `backstory_questions` | Backstory | 10 |
| `backstory_hooks` | Backstory | 5 |
| `backstory_relationship` | Backstory | 1 (single string) |
| `faction_name_prefix` | Faction | 10 |
| `faction_name_suffix` | Faction | 10 |
| `faction_goals` | Faction | 8 |
| `faction_methods` | Faction | 8 |
| `faction_weaknesses` | Faction | 8 |
| `faction_face_roles` | Faction | 8 |
| `complication_types` | Complication | 5 |
| `complication_aspects` | Complication | 10 |
| `complication_arrivals` | Complication | 8 |
| `complication_env` | Complication | 8 |

### Object arrays

| Key | Schema | Used by |
|-----|--------|---------|
| `stunts` | `{name, skill, desc, type}` — type is `"bonus"` or `"special"` | NPC, Encounter |
| `opposition` | `{name, type, aspects[], skills[], stress, stunt, qty}` — type is `"minor"` or `"major"` | Encounter, Seed |
| `current_issues` | `{name, desc, faces[{name,role}], places[]}` | Campaign, Seed |
| `impending_issues` | Same as `current_issues` | Campaign |
| `zones` | `[name, aspect, description]` (3-element array) | Scene, Encounter |
| `challenge_types` | `{name, desc, primary, opposing, success, failure}` | Challenge |

---

## 5. Adding entries to an existing campaign

1. Open `data/[campaign].js`
2. Find the table key you want to extend
3. Add entries following the exact schema in §4
4. Run the smoke test (§8)

For string arrays, append strings. For object arrays, match the field names exactly. For Variety Matrix tables, add templates to `t`, values to existing `v` keys, or new variable keys (used in at least one template).

---

## 6. Adding a new campaign

### Step 1 — Create the data file

Create `data/western.js`:

```js
CAMPAIGNS["western"] = {
  meta: {
    id:      "western",
    name:    "Dust and Iron",
    tagline: "Frontier justice. Railroad barons and the ghosts of the old war.",
    icon:    "★",
    font:    "'Inter', sans-serif",
  },
  colors:      { /* dark theme tokens — copy from any existing campaign */ },
  lightColors: { /* light theme tokens — copy from any existing campaign */ },
  tables: {
    // All required keys from §4
  },
};
```

### Step 2 — Add to `core/ui.js`

Find `CAMPAIGN_PAGES` and add:

```js
western: 'campaigns/western.html',
```

Find `CAMPAIGN_INFO` and add a matching entry with `name`, `icon`, `genre`, `vibes`, and `tagline`.

### Step 3 — Create the HTML page

Copy any existing campaign HTML (e.g. `campaigns/thelongafter.html`) and change:

- `data-campaign` attribute on `<html>`
- `<title>` and all `<meta>` description/OG/Twitter tags
- The data script tag: `<script src="../data/western.js?v=N"></script>`
- The `CampaignApp` call: `{ campId: 'western' }`

Script load order must be: `shared.js` → `universal.js` → `western.js` → `engine.js` → `ui.js` → `db.js` → `intro.js`

### Step 4 — Add to `index.html`

```html
<script src="data/western.js?v=N"></script>
```

### Step 5 — Add to `sw.js` and `manifest.json`

In `sw.js` `APP_SHELL` array:
```js
'./campaigns/western.html',
'./data/western.js',
```

In `manifest.json` shortcuts:
```json
{
  "name": "Dust and Iron",
  "short_name": "Western",
  "url": "./campaigns/western.html",
  "icons": [{ "src": "assets/favicons/icon-192.png", "sizes": "192x192" }]
}
```

### Step 6 — Add campaign colour CSS

In `assets/css/theme.css`, add `[data-campaign="western"]` and `[data-theme="light"][data-campaign="western"]` blocks following the pattern of existing campaigns.

### Step 7 — Create a guide page (optional but standard)

Copy any `campaigns/guide-*.html` and update the world name, tagline, prose sections, and inspiration list. Add a link to it from `campaigns/western.html`'s header nav.

---

## 7. The Table Manager and filteredTables

The Table Manager lets users exclude entries, lock specific entries, and add custom strings. Handled by `filteredTables(t, prefs)` in `core/engine.js`.

Rules:
- **Excluded entries** are removed from the pool. If all are excluded, the original pool is used as a fallback.
- **Locked entries** replace the pool — only locked entries roll.
- **Custom entries** are appended to string-type arrays only. They do not work on object arrays (`stunts`, `opposition`, etc.).
- **Variety Matrix tables** (`{t, v}` objects) pass through unchanged — the Table Manager does not edit templates or variables.

Prefer longer arrays — the Table Manager's power is proportional to pool size.

---

## 8. Testing your changes

No build step required. Open any HTML file directly from `file://` or a local server.

**Manual:**
1. Open `campaigns/[yourcampaign].html` in a browser
2. Click Roll for every generator at least once
3. Confirm no blank or `undefined` output
4. Open the Table Manager (🎛 Customize) and verify entries display correctly

**Node smoke test** (no browser required):

```bash
node -e "
var CAMPAIGNS={};
var fs=require('fs');
eval(fs.readFileSync('data/shared.js','utf8'));
eval(fs.readFileSync('data/universal.js','utf8'));
['thelongafter','cyberpunk','fantasy','space','victorian','postapoc'].forEach(function(c){
  eval(fs.readFileSync('data/'+c+'.js','utf8'));
});
eval(fs.readFileSync('core/engine.js','utf8'));
var pass=0,fail=0;
['thelongafter','cyberpunk','fantasy','space','victorian','postapoc'].forEach(function(c){
  GENERATORS.forEach(function(g){
    try{ generate(g.id,CAMPAIGNS[c].tables,4) ? pass++ : (fail++, console.log('FAIL:'+c+'/'+g.id)); }
    catch(e){ fail++; console.log('ERR:'+c+'/'+g.id+' '+e.message); }
  });
});
console.log(pass+'/96 passed, '+fail+' failed');
"
```

Expected: `96/96 passed, 0 failed`

---

## 9. Checklist before submitting a PR

- [ ] Every required table key is present (see §4)
- [ ] No table key contains an empty array — use at least one placeholder entry
- [ ] All `stunts` entries are objects `{name, skill, desc, type}` — no raw strings
- [ ] `type` on each stunt is `"bonus"` or `"special"`
- [ ] All `{VarName}` tokens in Variety Matrix templates have matching keys in `v`
- [ ] Variable name prefixes do not collide within the same campaign file
- [ ] +2 bonus stunts specify one skill, one action type, and a genuine limiting condition
- [ ] Node smoke test passes with zero errors
- [ ] New campaign: `CAMPAIGN_PAGES` and `CAMPAIGN_INFO` entries added in `core/ui.js`
- [ ] New campaign: `index.html`, `sw.js`, and `manifest.json` updated
- [ ] New campaign: colour CSS added to `assets/css/theme.css`
