# Stunt Data Specification — Ogma
> BL-02 · COMPLETE as of v2026.03.652 · last updated: 2026.03.652

## Canonical stunt object shape

```json
{
  "name":  "Shield Wall",
  "skill": "Fight",
  "desc":  "+2 to Defend when protecting an adjacent ally in the same zone.",
  "type":  "bonus",
  "tags":  ["combat", "leadership"]
}
```

### Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | ✅ | Title-case. Max ~30 chars for display. |
| `skill` | string | ✅ | Fate skill name. Matches the skill in the character's pyramid. |
| `desc` | string | ✅ | One sentence. Should state the mechanical effect explicitly. |
| `type` | `"bonus"` \| `"special"` | ✅ | See below. |
| `tags` | string[] | ✅ | From the canonical tag list. Used for stunt suggestion matching. |

### `type` values

| Value | Meaning | Typical template |
|-------|---------|-----------------|
| `"bonus"` | +2 to a specific action under specific conditions | `+2 to [action] when [condition]` |
| `"special"` | Per-scene or narrative effect that doesn't fit the +2 pattern | `Once per scene, [effect]` |

### Canonical tag list

`combat` · `stealth` · `subterfuge` · `social` · `negotiation` · `leadership` · `knowledge` · `investigation` · `technical` · `repair` · `survival` · `movement` · `intimidation` · `supernatural` · `augments` · `tech` · `endurance` · `exploration`

---

## Where stunts live

- **World data files** (`data/[world].js`) — `CAMPAIGNS.[world].tables.stunts[]` — the pool of world-specific stunts
- **Universal tables** (`data/universal.js`) — `UNIVERSAL_TABLES.stunts[]` — generic Fate stunts available in all worlds
- **NPC output** (`generate('npc_major', ...)`) — stunts array on the returned data object; pulled from the world pool by StuntSuggester based on high concept tags
- **Minor NPC output** — single `stunt` object (not array)

## Stunt builder custom stunt format

When a GM creates a custom stunt (future BL-05 Stunt UI), it uses the same shape with an added `custom: true` flag:

```json
{
  "name":   "My Custom Stunt",
  "skill":  "Lore",
  "desc":   "+2 to create advantages involving ancient languages.",
  "type":   "bonus",
  "tags":   ["knowledge"],
  "custom": true,
  "id":     "custom_1234abcd"
}
```

The `id` is generated at creation time (`'custom_' + Date.now().toString(36)`). Custom stunts are stored in IDB under `stunt_library_v1` (see BL-05).

## Print rendering

`DB.printCards()` renders stunts inline on NPC cards. No separate print card for stunts — they appear on the NPC card that owns them.

## Future: BL-05 Stunt UI

Build order: BL-02 (this spec, done) → BL-05 (stunt browser/picker panel) → BL-11 (stunt builder wizard).
