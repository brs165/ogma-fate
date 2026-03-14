# Ogma - Content Authoring Guide

> How to add new table entries, create a new campaign world, and validate your work without a browser. This document covers practical how-to steps that are not found elsewhere in devdocs. For schema definitions see `data-schema.md`. For architecture context see `architecture.md`.

---

## Adding Entries to an Existing Campaign

1. Open `data/[campaign].js`
2. Find the table key you want to extend
3. Add entries following the schemas in `data-schema.md §CampaignTables`
4. Run the smoke test (see §QA below)

**For string arrays** — append strings. Keep them ≤10 words (target) and specific.

**For object arrays** (`stunts`, `opposition`) — match field names exactly. Never add raw strings to object arrays.

**For Variety Matrix tables** — add templates to `t`, values to existing `v` keys, or new variable keys (used in at least one template). Variable name prefixes must not collide within the same campaign file.

**Content injection pattern** (preferred for large additions — keeps original arrays intact):

```js
// At the bottom of data/cyberpunk.js
(function() {
  var t = CAMPAIGNS.cyberpunk.tables;
  t.troubles = t.troubles.concat([
    "New trouble entry one",
    "New trouble entry two",
  ]);
})();
```

---

## Adding a New Campaign World

### Step 1 — Create the data file

Create `data/western.js` using the schema from `data-schema.md §Campaign Object Schema`:

```js
CAMPAIGNS["western"] = {
  meta: {
    id:      "western",
    name:    "Dust and Iron",
    tagline: "Frontier justice. Railroad barons and the ghosts of the old war.",
    icon:    "★",
    font:    "'Inter', sans-serif",
  },
  colors:      { /* dark theme tokens - copy from any existing campaign */ },
  lightColors: { /* light theme tokens - copy from any existing campaign */ },
  tables: {
    // All required keys from data-schema.md §CampaignTables
  },
};
```

All required table keys are listed in `data-schema.md §CampaignTables`. Every key must be present with at least one entry - no empty arrays.

### Step 2 — Register in `core/ui.js`

Find `CAMPAIGN_PAGES` and add:
```js
western: 'campaigns/western.html',
```

Find `CAMPAIGN_INFO` and add a matching entry with `name`, `icon`, `genre`, `vibes`, `hook`, and `tagline`.

### Step 3 — Create the HTML page

Copy any existing campaign HTML (e.g. `campaigns/thelongafter.html`) and change:
- `data-campaign` attribute on `<html>` to `"western"`
- `<title>` and all `<meta>` description/OG/Twitter tags
- The data script tag: `<script src="../data/western.js?v=N"></script>`
- The `CampaignApp` call at the bottom: `{ campId: 'western' }`

Script load order (non-negotiable): `shared.js` → `universal.js` → `western.js` → `engine.js` → `ui.js` → `db.js` → `intro.js`

### Step 4 — Add to `index.html`

```html
<script src="data/western.js?v=N"></script>
```

### Step 5 — Add to `sw.js`

In `sw.js` `APP_SHELL` array, add both:
```js
'./campaigns/western.html',
'./data/western.js',
```

### Step 6 — Add to `manifest.json`

```json
{
  "name": "Dust and Iron",
  "short_name": "Western",
  "url": "./campaigns/western.html",
  "icons": [{ "src": "assets/favicons/icon-192.png", "sizes": "192x192" }]
}
```

### Step 7 — Add campaign CSS

In `assets/css/theme.css`, add two blocks following the pattern of existing campaigns:
- `[data-campaign="western"]` — dark theme accent colours
- `[data-theme="light"][data-campaign="western"]` — light theme accent colours

**Contrast requirement:** `--accent` in light mode must pass 4.5:1 against `#ffffff`. Check with a contrast tool before shipping.

### Step 8 — Create the campaign guide page (standard)

Copy any `campaigns/guide-*.html` and update: world name, tagline, prose sections, and inspiration list. The guide gets a `data-campaign="western"` attribute so it inherits the campaign theme automatically.

### Step 9 — Create the intro sequence in `core/intro.js`

Add an entry to `SEQUENCES` and `META` following the existing six-world patterns. Each intro has a `bg` colour, world name, tagline, and a sequence of typed lines with timing.

---

## The Table Manager and filteredTables

The Table Manager lets users exclude, lock, or add custom strings to any table. Handled by `filteredTables(t, prefs)` in `core/engine.js`.

- **Excluded entries** are removed from the pool. If all are excluded, the original pool is used as fallback.
- **Locked entries** replace the pool entirely - only locked entries roll.
- **Custom entries** are appended to string-type arrays only. They do not work on object arrays (`stunts`, `opposition`, etc.).
- **Variety Matrix tables** pass through unchanged - the Table Manager does not edit templates or variables.

Prefer longer arrays — the Table Manager's power scales with pool size.

---

## QA Checklist

Run from the project root. Node.js required. See `devdocs/BACKLOG.md` for the current named assertion count.

### Before every release

```bash
# Syntax check
node --check core/ui.js && node --check core/engine.js

# Paren balance
node -e "
var fs=require('fs');
['core/engine.js','core/ui.js','core/db.js','core/intro.js'].forEach(function(f){
  var s=fs.readFileSync(f,'utf8');
  var d=(s.match(/\(/g)||[]).length-(s.match(/\)/g)||[]).length;
  console.log(f+':'+(d===0?' PASS':' FAIL diff='+d));
});"

# Smoke test (96/96)
node -e "
var fs=require('fs');
eval(fs.readFileSync('data/shared.js','utf8'));
eval(fs.readFileSync('data/universal.js','utf8'));
['thelongafter','cyberpunk','fantasy','space','victorian','postapoc'].forEach(function(c){
  eval(fs.readFileSync('data/'+c+'.js','utf8'));
});
eval(fs.readFileSync('core/engine.js','utf8'));
var camps=['thelongafter','cyberpunk','fantasy','space','victorian','postapoc'];
var gens=['npc_minor','npc_major','scene','campaign','encounter','seed','compel','challenge','contest','consequence','faction','complication','backstory','obstacle','countdown','constraint'];
var errs=[];var total=0;
camps.forEach(function(camp){
  var t=filteredTables(mergeUniversal(CAMPAIGNS[camp].tables),{});
  gens.forEach(function(gen){
    try{var r=generate(gen,t,4);if(!r||typeof r!=='object')errs.push(camp+'/'+gen);total++;}
    catch(e){errs.push(camp+'/'+gen+': '+e.message);}
  });
});
console.log('Smoke: '+total+'/96  errors:'+errs.length);
errs.forEach(function(e){console.log('  FAIL:',e);});"

# Named assertions (see devdocs/BACKLOG.md for current count)
node qa_named.js
```

### For content-only changes (no JS modified)

Run the smoke test only. Named assertions are only required when touching `core/` files.

### Content quality checklist

- [ ] Every required table key is present — no missing keys, no empty arrays
- [ ] All `stunts` entries are objects `{name, skill, desc, type}` — no raw strings
- [ ] `type` on each stunt is `"bonus"` or `"special"`
- [ ] All `{VarName}` tokens in Variety Matrix templates have matching keys in `v`
- [ ] Variable name prefixes do not collide within the same campaign file
- [ ] `+2` bonus stunts specify one skill, one action type, and a genuine limiting condition
- [ ] No stunt charges a Fate Point (NA-03 checks this)
- [ ] Troubles and minor_weaknesses are ≤12 words (target ≤10)
- [ ] No entries contain "significant milestone", "breakthrough" as an advancement term, or Fate Core-specific mechanics
- [ ] New campaign: `CAMPAIGN_PAGES`, `CAMPAIGN_INFO`, and intro sequence added
- [ ] New campaign: `index.html`, `sw.js`, `manifest.json`, and `theme.css` updated
- [ ] Smoke test passes: 96/96 (or N×16 for new campaign count)

---

*For schema definitions: `devdocs/data-schema.md`*
*For architecture: `devdocs/architecture.md`*
*For QA assertion details: `qa_named.js` in project root*
*Document version: see `devdocs/CHANGELOG.md`*
