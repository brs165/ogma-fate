# Ogma — Campaign World Voices

> Reference for content and world-building sessions.
> Describes the tone, voice, and creative DNA of each campaign world.
> Load alongside `docs/claude/BOOTSTRAP.md` when doing content work.

---

## Campaign Voice Reference

Each world has a distinct register that table content must honour.

| World | ID | Voice |
|---|---|---|
| The Long After | `thelongafter` | Elegiac, mythic, world-weary. Things have names from before the collapse. The nostalgia is the danger. |
| Neon Abyss | `cyberpunk` | Transhumanist anxiety. The chrome is a leash. Precision over action-movie energy. |
| Shattered Kingdoms | `fantasy` | Wound-lore fantasy. Magic is scar tissue. Everything has a cost that compounds. |
| Void Runners | `space` | Blue-collar solidarity. The ship payment is always due. Competence under pressure, not heroism. |
| The Gaslight Chronicles | `victorian` | The Enlightenment was a mistake. Cosmic horror with manners. The horror is in the implication, not the reveal. |
| The Long Road | `postapoc` | Lyrical, not grimdark. The question is what you build. Loss as texture, not as wallpaper. |
| Dust and Iron | `western` | Frontier justice. The land doesn't care. Violence has weight and aftermath. Silence before speech. |
| dVenti Realm | `dVentiRealm` | Post-collapse political thriller. The Senate is gone but the factions remain. Bureaucracy as obstruction, loyalty as currency. **Content source: D&D 5e SRD ONLY.** Every creature, faction archetype, spell school, and environment must derive from the D&D 5e SRD (open5e.com). No named settings, no proprietary monsters, no non-SRD IP of any kind. When in doubt, check open5e.com before writing. |

---

## Content rules

- **Check the SRD first.** Before writing any mechanics content, verify against the Fate Condensed SRD. Cross-system bleed (Core/FAE terms bleeding into FCon output) is the #1 content error.
- **"Significant milestone" does not exist in FCon.** The correct FCon term is "breakthrough" (p.39). Any instance in content is an error.
- **Voice before mechanics.** Table entries should sound like they belong to the world before they demonstrate the mechanic.
- **Concrete before abstract.** Every mechanic earns its explanation with an example first.
- **Aspects must be bidirectional.** Can it be invoked for +2? Can it cause a complication? If only one way — it's too narrow.

---

## Architecture constraints (for content sessions)

| Constraint | Notes |
|---|---|
| No build step | Source files = deployed files. No compilation. |
| React 18 CDN UMD | `h()` alias, no JSX |
| Offline-first | All content must work without network after first load |
| No backend | All generator logic is client-side in `core/engine.js` |

---

*For data schemas and table authoring mechanics, see `docs/content-authoring.md` and `docs/data-schema.md`.*
*For media touchstones and inspirations per world, see `docs/campaign-inspirations.csv`.*
