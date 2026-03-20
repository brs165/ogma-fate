# Ogma — Data Schema Reference

> **Last updated:** 2026.03.148 — Sprint I (schema consistency pass)

## File structure

One JS file per world in `data/`. Each file assigns to `CAMPAIGNS["worldKey"]`.

```js
CAMPAIGNS["worldKey"] = {
  meta:   { id, name, tagline, icon, font },
  colors: { bg, panel, border, gold, accent, dim, text, muted, textDim, red, blue, green, purple, tag, tagBorder },
  lightColors: { /* same keys */ },
  tables: { /* all generator tables */ }
};
```

---

## Required tables (present in all 8 worlds)

| Key | Type | Used by | Notes |
|-----|------|---------|-------|
| `names_first` | string[] | npc_minor, npc_major | |
| `names_last` | string[] | npc_minor, npc_major | Epithets/surnames |
| `minor_concepts` | template object | npc_minor | Has `.t` (templates) and `.v` (vars) |
| `major_concepts` | template object | npc_major | |
| `minor_weaknesses` | string[] | npc_minor, npc_major | Min 40 entries |
| `troubles` | string[] | npc_major | Min 40 entries. **`major_trouble` is a legacy alias — engine accepts both, normalise to `troubles`** |
| `stunts` | object[] | npc_minor, npc_major | Each: `{name, skill, desc, tags[]}` |
| `setting_aspects` | template object | campaign, seed | |
| `other_aspects` | string[] | campaign | Scene/situation aspects |
| `current_issues` | object[] | campaign | Each: `{name, desc, faces[]?, places[]?}` |
| `impending_issues` | object[] | campaign | Same structure |
| `seed_locations` | string[] | seed | Min 20 entries |
| `seed_objectives` | string[] | seed | |
| `seed_complications` | string[] | seed | |
| `compel_situations` | string[] | compel | Min 35 entries |
| `compel_consequences` | string[] | compel | |
| `challenge_types` | object[] | challenge | Each: `{name, desc, primary, opposing, success, failure}` |
| `consequence_mild` | string[] | consequence | World-flavoured mild consequences |
| `consequence_moderate` | string[] | consequence | |
| `consequence_severe` | string[] | consequence | |
| `consequence_contexts` | string[] | consequence | |
| `opposition` | object[] | encounter, obstacle, countdown, constraint | Min 10 entries. Each: `{name, type, aspects[], skills[], stress, stunt, qty}` |
| `twists` | string[] | encounter | Min 25 entries |
| `victory` | string[] | encounter | |
| `defeat` | string[] | encounter | |
| `faction_goals` | string[] | faction | Min 12 entries |
| `faction_methods` | string[] | faction | Min 9 entries |
| `faction_weaknesses` | string[] | faction | |
| `faction_face_roles` | string[] | faction | Min 12 entries |
| `faction_name_prefix` | string[] | faction | |
| `faction_name_suffix` | string[] | faction | |
| `complication_types` | string[] | complication | |
| `complication_aspects` | string[] | complication | |
| `complication_arrivals` | string[] | complication | |
| `complication_env` | string[] | complication | |
| `backstory_questions` | string[] | backstory | Min 20 entries |
| `backstory_hooks` | string[] | backstory | |
| `backstory_relationship` | string[] | backstory | |
| `scene_tone` | string[] | scene | |
| `scene_movement` | string[] | scene | |
| `scene_cover` | string[] | scene | |
| `scene_danger` | string[] | scene | |
| `scene_usable` | string[] | scene | |
| `zones` | string[] or object[] | scene | |

---

## World-specific tables (intentional additions)

| Key | World | Notes |
|-----|-------|-------|
| `obstacle_aspects` | western only | Additional obstacle flavour for frontier setting |

---

## Minimum depth thresholds

Established during Sprint B (Dust & Iron) and Sprint C (dVenti). New worlds should meet these before shipping:

| Table | Minimum |
|-------|---------|
| `troubles` | 40 |
| `compel_situations` | 35 |
| `twists` | 25 |
| `opposition` | 12 (including 4+ major NPCs) |
| `minor_weaknesses` | 40 |
| `current_issues` | 6 |
| `impending_issues` | 6 |
| `faction_face_roles` | 12 |
| `faction_goals` | 12 |

---

## Opposition object schema

```js
{
  name: string,
  type: "minor" | "major",
  aspects: string[],          // 1 for minor, 2-3 for major
  skills: [{name: string, r: number}],  // r = 1-5 (Superb max per FCon)
  stress: number,             // 1-6 (minor: 1-3, major: 3-6)
  stunt: string | null,       // null for minor, string for major
  qty: number                 // default 1
}
```

**FCon rules constraints:**
- Max skill rating: 5 (Superb). NA-66 asserts this.
- Max stress: 6 (reserved for boss-tier major NPCs like the Resurrected Thing).

---

## Current issues / impending issues object schema

```js
{
  name: string,
  desc: string,
  faces: [{name: string, role: string}]?,  // optional
  places: string[]?                         // optional
}
```

---

## QA coverage

- **NA-66** asserts no opposition skill > 5
- **Smoke test** (128/128) verifies all 16 generators produce valid output for all 8 worlds
- **Sprint I** confirmed: all 8 worlds now have schema parity on all required tables
