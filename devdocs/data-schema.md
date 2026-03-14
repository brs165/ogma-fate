# Ogma Data Schema Reference

> Complete schema definitions for all campaign data files (`data/*.js`) and the universal tables file (`data/universal.js`). This document is the authoritative reference for anyone authoring new content or building tooling around Ogma's data layer.

---

## Overview

Ogma's data layer is a set of plain JavaScript files that register into a global `CAMPAIGNS` object. Each file is loaded via `<script>` tag - no imports, no bundler. `data/shared.js` declares the empty `CAMPAIGNS` object; each campaign file populates one entry.

```
data/
├── shared.js       - CAMPAIGNS={}, GENERATORS, GENERATOR_GROUPS, HELP_CONTENT, ALL_SKILLS, SKILL_LABEL
├── universal.js    - UNIVERSAL (setting-agnostic tables merged at runtime)
├── cyberpunk.js    - CAMPAIGNS["cyberpunk"]
├── fantasy.js      - CAMPAIGNS["fantasy"]
├── postapoc.js     - CAMPAIGNS["postapoc"]
├── space.js        - CAMPAIGNS["space"]
├── thelongafter.js - CAMPAIGNS["thelongafter"]
└── victorian.js    - CAMPAIGNS["victorian"]
```

---

## Campaign Object Schema

Every campaign file registers one entry:

```js
CAMPAIGNS["<id>"] = {
  meta:        CampaignMeta,
  colors:      CampaignColors,      // dark theme
  lightColors: CampaignColors,      // light theme
  tables:      CampaignTables,
};
```

---

### CampaignMeta

```typescript
interface CampaignMeta {
  id:      string;   // matches CAMPAIGNS key - e.g. "cyberpunk"
  name:    string;   // display name - e.g. "Neon Abyss"
  tagline: string;   // one-sentence world pitch
  icon:    string;   // single emoji or unicode symbol
  font:    string;   // CSS font-family string
}
```

**Example:**
```js
meta: {
  id:      "cyberpunk",
  name:    "Neon Abyss",
  tagline: "High Tech, Low Life. Corporate feudalism and transhumanist anxiety.",
  icon:    "⬡",
  font:    "'Inter', sans-serif",
}
```

---

### CampaignColors

Both `colors` (dark) and `lightColors` (light) use the same shape:

```typescript
interface CampaignColors {
  bg:         string;  // page/body background
  panel:      string;  // panel and card background
  border:     string;  // border colour
  gold:       string;  // heading colour ("gold" is a naming legacy)
  accent:     string;  // primary interactive accent
  dim:        string;  // dimmed/secondary accent
  text:       string;  // primary body text
  muted:      string;  // secondary/muted text
  textDim:    string;  // dimmed text (between muted and text)
  red:        string;  // danger/trouble colour
  blue:       string;  // setting/informational colour
  green:      string;  // success/usable colour
  purple:     string;  // tone/atmospheric colour
  tag:        string;  // tag/pill background (semi-transparent)
  tagBorder:  string;  // tag/pill border (semi-transparent)
}
```

**Contrast requirement:** `accent` must achieve ≥ 4.5:1 against `bg` in both dark and light themes. The CSS engine applies `accent` as `--accent` via `[data-campaign="X"]` blocks in `theme.css` - adding a campaign file does **not** automatically add CSS. You must add CSS blocks manually.

---

### CampaignTables

The tables object is large. Required keys by generator:

#### Shared across all generators

| Key | Type | Min entries | Description |
|-----|------|-------------|-------------|
| `names_first` | `string[]` | 20 | First names / given names / call signs |
| `names_last` | `string[]` | 10 | Surnames / epithets / clan names |
| `stunts` | `Stunt[]` | 8 | Character and NPC stunts |

#### Minor NPC generator

| Key | Type | Min | Description |
|-----|------|-----|-------------|
| `minor_concepts` | `VarietyMatrix` | - | High concept aspect for minor NPCs |
| `minor_weaknesses` | `string[]` | 15 | Weakness/trouble aspect for minor NPCs (≤10 words target) |

#### Major NPC generator

| Key | Type | Min | Description |
|-----|------|-----|-------------|
| `major_concepts` | `VarietyMatrix` | - | High concept for major NPCs |
| `troubles` | `string[]` | 15 | Trouble aspects for major NPCs |
| `other_aspects` | `VarietyMatrix` | - | Three additional aspects for major NPCs |

#### Scene Setup generator

| Key | Type | Min | Description |
|-----|------|-----|-------------|
| `scene_tone` | `VarietyMatrix` | - | Atmospheric/tone aspects |
| `scene_movement` | `VarietyMatrix\|string[]` | 10 | Movement/traversal aspects |
| `scene_cover` | `string[]` | 10 | Cover/protection aspects |
| `scene_danger` | `VarietyMatrix` | - | Active danger aspects |
| `scene_usable` | `string[]` | 10 | Usable environment elements |
| `zones` | `Zone[]` | 6 | Scene zones (3-element arrays) |

#### Campaign Issues generator

| Key | Type | Min | Description |
|-----|------|-----|-------------|
| `current_issues` | `Issue[]` | 5 | Current campaign issues |
| `impending_issues` | `Issue[]` | 5 | Impending campaign issues |
| `setting_aspects` | `VarietyMatrix` | - | Permanent world truths |

#### Encounter generator

Uses: `scene_tone`, `scene_movement`, `scene_cover`, `scene_danger`, `scene_usable`, `zones`, `opposition`, `twists`, `victory`, `defeat`

| Key | Type | Min | Description |
|-----|------|-----|-------------|
| `opposition` | `Opposition[]` | 6 | NPC opposition (minor and major types) |
| `twists` | `string[]` | 15 | Mid-scene twist aspects |
| `victory` | `string[]` | 10 | Victory condition descriptions |
| `defeat` | `string[]` | 10 | Defeat condition descriptions |

#### Adventure Seed generator

Uses: `opposition`, `twists`, `victory`, `defeat`, `current_issues`, `setting_aspects`

| Key | Type | Min | Description |
|-----|------|-----|-------------|
| `seed_locations` | `string[]` | 10 | Opening scene locations |
| `seed_objectives` | `string[]` | 10 | Party objectives |
| `seed_complications` | `string[]` | 10 | Complications that emerge |

#### Compel generator

| Key | Type | Min | Description |
|-----|------|-----|-------------|
| `compel_situations` | `string[]` | 12 | Compel situation descriptions |
| `compel_consequences` | `string[]` | 12 | What happens when accepted |

> **Note:** `compel_event_templates` and `compel_decision_templates` are injected from `UNIVERSAL` when the universal toggle is enabled. Campaigns do not need to define them.

#### Challenge generator

| Key | Type | Min | Description |
|-----|------|-----|-------------|
| `challenge_types` | `ChallengeType[]` | 5 | Challenge types with skill requirements |

Uses `victory` and `defeat` for stakes.

#### Contest generator

Uses `scene_tone` for the situation aspect, plus `twists`, `victory`, `defeat`.

> **Note:** `contest_types` and `contest_twists` are injected from `UNIVERSAL`.

#### Consequence generator

| Key | Type | Min | Description |
|-----|------|-----|-------------|
| `consequence_mild` | `string[]` | 8 | Mild consequence aspect names |
| `consequence_moderate` | `string[]` | 8 | Moderate consequence aspect names |
| `consequence_severe` | `string[]` | 8 | Severe consequence aspect names |
| `consequence_contexts` | `string[]` | 8 | Contexts in which consequences are suffered |

Uses `compel_situations` for the compel hook.

#### Faction generator

| Key | Type | Min | Description |
|-----|------|-----|-------------|
| `faction_name_prefix` | `string[]` | 10 | First word of faction name |
| `faction_name_suffix` | `string[]` | 10 | Second word of faction name |
| `faction_goals` | `string[]` | 8 | What the faction wants |
| `faction_methods` | `string[]` | 8 | How they pursue it |
| `faction_weaknesses` | `string[]` | 8 | Their exploitable vulnerability |
| `faction_face_roles` | `string[]` | 8 | Role description for the named face NPC |

Uses `names_first` + `names_last` for the face NPC's name.

**Important:** `faction_name_prefix` and `faction_name_suffix` must have no duplicate entries. A named assertion (NA-07) checks this for postapoc - extend if needed for new campaigns.

#### Scene Complication generator

| Key | Type | Min | Description |
|-----|------|-----|-------------|
| `complication_types` | `string[]` | 5 | Complication category labels |
| `complication_aspects` | `string[]` | 10 | New situation aspect texts |
| `complication_arrivals` | `string[]` | 8 | Who or what arrives unexpectedly |
| `complication_env` | `string[]` | 8 | Environmental shift descriptions |

#### PC Backstory generator

| Key | Type | Min | Description |
|-----|------|-----|-------------|
| `backstory_questions` | `string[]` | 10 | Session zero questions |
| `backstory_hooks` | `string[]` | 5 | Opening session hooks |
| `backstory_relationship` | `string` | 1 | Single string describing relationship exercise |

> Note: `backstory_relationship` is a plain string, not an array.

#### Obstacle, Countdown, Constraint generators

These three generators draw exclusively from `UNIVERSAL` (injected via `mergeUniversal`). Campaigns do not define `hazards`, `blocks`, `distractions`, `countdowns`, `limitations`, or `resistances`. The universal tables cover all six worlds for these generators.

---

## Object Type Definitions

### Stunt

```typescript
interface Stunt {
  name:  string;  // Stunt name - e.g. "Face in the Crowd"
  skill: string;  // Governing skill - must match an entry in ALL_SKILLS
  desc:  string;  // Full description - state the condition and benefit precisely
  type:  "bonus" | "special";
  // "bonus"   → +2 to [skill] when [specific condition]
  // "special" → once-per-scene rule exception or unique mechanic
}
```

**Validation rules:**
- `type: "bonus"` stunts must name exactly one skill and one limiting condition
- `type: "special"` stunts must describe the special effect explicitly
- No stunt may charge a Fate Point - NA-03 assertion checks this
- No stunt may reference a skill not in `ALL_SKILLS`

**ALL_SKILLS (19 skills):**
`Academics, Athletics, Burglary, Contacts, Crafts, Deceive, Drive, Empathy, Fight, Investigate, Lore, Notice, Physique, Provoke, Rapport, Resources, Shoot, Stealth, Will`

---

### Opposition

```typescript
interface Opposition {
  name:    string;           // NPC name
  type:    "minor" | "major";
  aspects: string[];         // 1 for minor, 2–3 for major
  skills:  OppSkill[];       // Array of {name, r} skill objects
  stress:  number;           // Total stress boxes (1-point each, FCon model)
  stunt?:  string;           // Optional: stunt description as a plain string
  qty?:    number;           // Optional: group size (default 1)
  desc?:   string;           // Optional: flavour description
}

interface OppSkill {
  name: string;
  r:    number;  // 1–5 rating
}
```

**Validation rules:**
- `minor` opposition: stress 1–3, no consequence slots
- `major` opposition: stress calculated per `stressFromRating()` - mirrors PC rules
- `type: "minor"` NPCs should not exceed 3 stress boxes (NA-01 assertion)

---

### Zone

```typescript
type Zone = [
  name:        string,  // Zone name - e.g. "Rooftop Garden"
  aspect:      string,  // Zone's situation aspect - e.g. "Cover Everywhere You Look"
  description: string,  // Short flavour description - e.g. "Hydroponic towers, chest-height"
]
```

Zones are 3-element arrays (not objects). The engine accesses them as `z[0]`, `z[1]`, `z[2]`.

---

### Issue (Campaign Issues)

```typescript
interface Issue {
  name:    string;       // Issue name - short, aspect-like
  desc:    string;       // 1–2 sentence description for play context
  faces?:  IssueFace[];  // Optional: named NPCs connected to this issue
  places?: string[];     // Optional: locations associated with this issue
}

interface IssueFace {
  name: string;
  role: string;  // Their relationship to the issue
}
```

---

### ChallengeType

```typescript
interface ChallengeType {
  name:     string;  // Challenge name - e.g. "Ghost the Corp Grid"
  desc:     string;  // 1–2 sentence description
  primary:  string;  // Primary skill(s) the party uses
  opposing: string;  // What they roll against
  success:  string;  // What happens on success
  failure:  string;  // What happens on failure
}
```

---

## VarietyMatrix Schema

The Variety Matrix is Ogma's primary technique for generating thousands of unique combinations from compact data.

```typescript
interface VarietyMatrix {
  t: string[];                    // Template strings - may contain {VarName} tokens
  v: Record<string, string[]>;    // Variable pools - key matches {VarName} in templates
}
```

**How it works:** `fillTemplate(tblObj)` picks one template at random, finds every `{VarName}` token, and substitutes a random value from `v[VarName]`. Templates without tokens are used verbatim.

**Example:**
```js
minor_concepts: {
  t: [
    "A {MAdj} {MRole} working {MArrange}",
    "The most {MAdj} {MRole} in the district",
    "Corporate Drone Who Knows Too Much",      // verbatim - no tokens
  ],
  v: {
    MAdj:     ["augmented", "burned-out", "paranoid", "loyal", "strung-out"],
    MRole:    ["enforcer", "data courier", "sec guard", "fixr"],
    MArrange: ["without asking why", "by the hour", "on a kill switch"],
  }
}
```

**Naming conventions for variable keys:**

| Table | Prefix | Example |
|-------|--------|---------|
| `minor_concepts` | `M` | `MAdj`, `MRole` |
| `major_concepts` | `Maj` (or `Cmaj`) | `MajAdj`, `CmajRole` |
| `other_aspects` | `O` | `OContext`, `OTrait` |
| `scene_tone` | `T` | `TAdj`, `TQual` |
| `scene_danger` | `D` | `DAdj`, `DHazard` |
| `scene_movement` | `Mv` | `MvVerb`, `MvObs` |
| `setting_aspects` | `S` | `SAdj`, `SNoun` |

**Rules:**
- Prefix must be unique within the same campaign file. `M` and `Maj` do not collide; `M` and `M` would.
- Every `{VarName}` token in `t` must have a matching key in `v`
- Variable arrays should have ≥ 5 entries to produce meaningful variety
- Templates with more tokens produce more combinations: `{A} {B} {C}` with 5 values each = 125 combos

---

## UNIVERSAL Tables Schema

`data/universal.js` registers the `UNIVERSAL` object. It is merged into campaign tables at runtime by `mergeUniversal()`. Campaigns do not need to duplicate universal content.

### Merged keys (appended to campaign arrays)

| Key | What it adds |
|-----|-------------|
| `stunts` | ~30 setting-agnostic stunts usable across all worlds |
| `consequence_mild` | Universal mild consequence aspects |
| `consequence_moderate` | Universal moderate consequence aspects |
| `consequence_severe` | Universal severe consequence aspects |
| `consequence_contexts` | Universal consequence contexts |
| `compel_situations` | Universal compel situations |
| `compel_consequences` | Universal compel consequences |

### Injected keys (only exist in UNIVERSAL, not in campaign tables)

| Key | Schema | Used by |
|-----|--------|---------|
| `hazards` | `Hazard[]` | Obstacle generator |
| `blocks` | `Block[]` | Obstacle generator |
| `distractions` | `Distraction[]` | Obstacle generator |
| `countdowns` | `Countdown[]` | Countdown generator |
| `limitations` | `Limitation[]` | Constraint generator |
| `resistances` | `Resistance[]` | Constraint generator |
| `contest_types` | `ContestType[]` | Contest generator |
| `contest_twists` | `string[]` | Contest generator |
| `scene_framing_questions` | `string[]` | Scene Setup generator |
| `compel_event_templates` | `string[]` | Compel generator |
| `compel_decision_templates` | `string[]` | Compel generator |

### Universal Object Types

```typescript
interface Hazard {
  name:    string;
  rating:  number;   // 1–5, determines passive opposition and attack rating
  weapon:  number;   // Weapon value added to successful hits (0 = no weapon)
  aspect:  string;   // The hazard's situation aspect
  disable: string;   // How PCs can neutralise it
}

interface Block {
  name:    string;
  rating:  number;   // Passive opposition rating
  weapon:  number;   // Usually 0 for blocks
  aspect:  string;
  disable: string;
}

interface Distraction {
  name:           string;
  choice:         string;   // The choice presented to the party
  repercussion_leave: string;  // What happens if they ignore it
  repercussion_deal:  string;  // What happens if they deal with it
  opposition:     number;   // Passive opposition if a roll is needed
}

interface Countdown {
  name:    string;
  boxes:   number;   // Number of boxes in the track (typically 3–6)
  unit:    string;   // "exchanges" | "scenes" | "sessions" | custom
  trigger: string;   // What causes a box to fill
  outcome: string;   // What happens when the last box fills
}

interface Limitation {
  name:             string;
  restricted_action: string;  // What is restricted
  consequence:      string;   // Cost if restriction is violated
}

interface Resistance {
  name:          string;
  what_resists:  string;   // What category of action is blocked
  bypass:        string;   // Specific method that defeats the resistance
}

interface ContestType {
  name:     string;
  desc:     string;
  side_a:   string;   // Label for the first side
  side_b:   string;   // Label for the second side
  skills_a: string;   // Skills the first side uses
  skills_b: string;   // Skills the second side uses
}
```

---

## Engine API Reference

These functions are defined in `core/engine.js` and available globally after it loads.

### `generate(genId, tables, partySize, opts?) → object`

Dispatches to the appropriate generator. Returns a generator-specific object - see result shapes below.

| Parameter | Type | Description |
|-----------|------|-------------|
| `genId` | `string` | One of the 16 generator IDs |
| `tables` | `object` | Output of `filteredTables(mergeUniversal(campaign.tables), prefs)` |
| `partySize` | `number` | Number of PCs - used for GM fate point count and contest balance |
| `opts` | `object?` | Optional: `{ severity: 'mild'|'moderate'|'severe' }` for consequence generator |

### `mergeUniversal(tables) → object`

Merges `UNIVERSAL` into a campaign `tables` object. Returns a new object - does not mutate the original. Call this every time you call `generate()`.

### `filteredTables(tables, prefs) → object`

Applies user table preferences (excluded, locked, custom entries) to a tables object. `prefs` is the saved preferences object from IndexedDB/localStorage. Returns a filtered copy.

### `fillTemplate(tblObj) → string`

Picks a random template from a VarietyMatrix and substitutes all `{VarName}` tokens. Returns `''` if the input is malformed or token keys are missing.

### `pick(arr) → any`

Picks a random element from an array. Returns `''` (empty string) if the array is empty or null/undefined.

### `pickN(arr, n) → any[]`

Picks `n` unique random elements from an array. Returns fewer than `n` if the array is smaller.

### `stressFromRating(r) → number`

Calculates stress box count from a skill rating per Fate Condensed p.12:
- rating 0 → 3 boxes
- rating 1–2 → 4 boxes
- rating 3+ → 6 boxes

### `toMarkdown(genId, data, campName) → string`

Exports a generator result as formatted Markdown. Returns `''` for unknown genIds.

### `toFariJSON(genId, data, campName) → string | null`

Exports an NPC result as Fari App v4 JSON. Also accepted by Foundry VTT Fate Core Official importer. Returns `null` for non-NPC generators.

### `toRoll20JSON(genId, data) → string | null`

Exports an NPC result as a Roll20 attribute array for the "Fate by Evil Hat" sheet's Developer Mode import. Returns `null` for non-NPC generators.

---

## Generator Result Shapes

### npc_minor

```typescript
{
  name:    string;
  aspects: string[];         // [high_concept, weakness?] - weakness may be absent
  skills:  { name: string; r: number }[];
  stunt:   Stunt | null;
  stress:  number;           // Box count - 1-point each
}
```

### npc_major

```typescript
{
  name:    string;
  aspects: {
    high_concept: string;
    trouble:      string;
    others:       string[];  // Always 3 entries
  };
  skills:          { name: string; r: number }[];
  stunts:          Stunt[];   // Always 2 entries
  physical_stress: number;
  mental_stress:   number;
  refresh:         number;   // max(1, 3 - stunts.length)
}
```

### scene

```typescript
{
  aspects: {
    name:        string;
    category:    "tone" | "movement" | "cover" | "danger" | "usable";
    free_invoke: boolean;
  }[];
  zones:             { name: string; aspect: string; description: string }[];
  framing_questions: string[];
}
```

### campaign

```typescript
{
  current:   Issue;
  impending: Issue;
  setting:   string[];  // 3 setting aspect strings
}
```

### encounter

```typescript
{
  aspects:         string[];        // 3–4 situation aspects
  zones:           { name: string; aspect: string }[];
  opposition:      Opposition[];
  twist:           string;
  victory:         string;
  defeat:          string;
  gm_fate_points:  number;          // = partySize
}
```

### seed

```typescript
{
  location:    string;
  objective:   string;
  complication: string;
  issue:       string;
  setting_asp: string;
  opposition:  Opposition[];
  scenes:      { num: number; type: string; brief: string }[];
  twist:       string;
  victory:     string;
  defeat:      string;
}
```

### compel

```typescript
{
  situation:     string;
  consequence:   string;
  template_type: "event" | "decision";
  template:      string | null;
}
```

### challenge

```typescript
{
  name:        string;
  desc:        string;
  primary:     string;
  opposing:    string;
  success:     string;
  failure:     string;
  stakes_good: string;
  stakes_bad:  string;
}
```

### contest

```typescript
{
  contest_type:     string;
  desc:             string;
  side_a:           string;
  side_b:           string;
  skills_a:         string;
  skills_b:         string;
  aspect:           string;
  victories_needed: number;  // Always 3
  track_a:          string;  // "☐ ☐ ☐"
  track_b:          string;
  twists:           string[];  // Always 3
  stakes_good:      string;
  stakes_bad:       string;
}
```

### consequence

```typescript
{
  severity:    "mild" | "moderate" | "severe";
  aspect:      string;
  context:     string;
  compel_hook: string;
}
```

### faction

```typescript
{
  name:     string;
  goal:     string;
  method:   string;
  weakness: string;
  face:     { name: string; role: string };
}
```

### complication

```typescript
{
  type:        string;
  new_aspect:  string;
  arrival:     string;
  env:         string;
  spotlight:   "aspect" | "arrival" | "env";
}
```

### backstory

```typescript
{
  questions:    string[];  // Always 3
  relationship: string;
  hook:         string;
}
```

### obstacle (hazard)

```typescript
{
  obstacle_type:  "hazard";
  name:           string;
  rating:         number;
  rating_label:   string;   // e.g. "Great"
  weapon:         number;
  aspect:         string;
  disable:        string;
  gm_note:        string;
}
```

### obstacle (block)

```typescript
{
  obstacle_type: "block";
  name:          string;
  rating:        number;
  rating_label:  string;
  weapon:        number;
  aspect:        string;
  disable:       string;
  gm_note:       string;
}
```

### obstacle (distraction)

```typescript
{
  obstacle_type:      "distraction";
  name:               string;
  choice:             string;
  repercussion_leave: string;
  repercussion_deal:  string;
  opposition:         number;
  opposition_label:   string;
  gm_note:            string;
}
```

### countdown

```typescript
{
  name:     string;
  boxes:    number;
  track:    string;   // "☐ ☐ ☐ ☐" - box count as string
  unit:     string;
  trigger:  string;
  outcome:  string;
  gm_note:  string;
}
```

### constraint (limitation)

```typescript
{
  constraint_type:  "limitation";
  name:             string;
  restricted_action: string;
  consequence:      string;
  gm_note:          string;
}
```

### constraint (resistance)

```typescript
{
  constraint_type: "resistance";
  name:            string;
  what_resists:    string;
  bypass:          string;
  gm_note:         string;
}
```

---

*Document version: 2026.03.12*
