# Liquid Glass Design Language - Static Page Recommendations

> How to apply the Ogma Liquid Glass aesthetic to text-heavy pages (About, Quick-Start Guide, License, Campaign Guides) without sacrificing legibility. This document is the content-team-facing companion to the CSS architecture guide in `architecture.md`.

---

## The Core Tension

Generator pages solve a clean design problem: one action, one result, glowing glass panel. Static documentation pages solve the opposite problem: long-form prose, multiple sections, information hierarchy, printability. The Liquid Glass system was designed for the former. Applied naively to the latter, it produces beautiful illegibility - frosted backgrounds competing with body text, specular highlights distracting mid-paragraph.

The rule that resolves the tension:

> **Glass is architecture, not wallpaper.** On static pages, glass surfaces contain and separate content - they don't sit behind it.

---

## What Glass Does on Static Pages

### 1. Section Containers - Not Body Text Backgrounds

Glass panels work as discrete containers for callout content: stat blocks, download cards, code prompts, key notes. They should never be the background behind flowing paragraph text.

**Correct pattern - glass as callout container:**
```css
.about-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur-sm);
  -webkit-backdrop-filter: var(--glass-blur-sm);
  border: 1px solid var(--glass-border);
  border-radius: var(--glass-radius);
  padding: 20px;
}
```

**Incorrect pattern - glass behind prose (avoid):**
```css
/* Never do this - body text is illegible over a blurred layer */
.ln {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
}
```

### 2. The Prose Background Rule

Page body (`max-width` content column) should use a solid or very subtly tinted background, not glass. The ambient gradient and orb lighting in the page background (`body::before`, `body::after`) provides the depth - the prose column doesn't need to add to it.

**Recommended pattern:**
```css
/* The page body gets a near-transparent solid fill, not backdrop-filter */
.about, .ln, .lic {
  /* Inherits transparent background - body gradient shows through */
  position: relative;
  z-index: 1;
}
```

The orb gradients already in `theme.css` create depth behind the column. That's enough.

### 3. Inset Blocks - For Code and Monospace

Technical content (prompts, code snippets, terminal output) uses the `--inset` token - a slightly darker/lighter recessed surface with a hard border, not glass blur. Blur on a `<pre>` block makes it look broken.

```css
.role-prompt, .ln-prompt {
  background: var(--inset);
  border: 1px solid var(--border);
  border-radius: var(--glass-radius-sm);
  /* NO backdrop-filter here */
}
```

### 4. Collapsible Rows - Glass Border, Solid Fill

`<details>`/`<summary>` components (role prompts, prompt expanders) work best with a glass border and a subtle solid fill - not full glass blur. The blur fires every time the section opens and creates visual noise during expansion animation.

```css
.role-detail {
  background: var(--glass-bg);  /* low alpha solid - no blur */
  border: 1px solid var(--glass-border);
  border-radius: var(--glass-radius-sm);
  /* backdrop-filter only on hover/active, not at rest */
}
.role-detail:hover {
  backdrop-filter: var(--glass-blur-sm);
  -webkit-backdrop-filter: var(--glass-blur-sm);
}
```

### 5. Navigation Bar - Full Glass

The `land-topnav` should retain full glass treatment on static pages - it's the consistent identity surface and is thin enough that blur doesn't compete with content below it.

```css
.land-topnav {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--glass-border);
}
```

---

## Typography Hierarchy on Static Pages

The Liquid Glass system's accent colours (campaign-specific `--gold`, `--accent`) have enough saturation to serve as heading accents on static pages. Use them sparingly - one accent per section label, not per heading.

### Recommended Type Stack for Static Pages

| Element | Token | Colour |
|---|---|---|
| Page `h1` | `--text-hero` / `--text-2xl` | `var(--text)` |
| Section `h2` | `--text-xl`, weight 800 | `var(--text)` |
| Subsection `h3` | `--text-md`, weight 700 | `var(--text)` |
| Section label (caps) | `--text-label`, weight 700, `letter-spacing: 0.08em`, uppercase | `var(--accent)` |
| Body prose | `--text-base`, line-height 1.75 | `var(--text-dim)` |
| Secondary/meta | `--text-sm)`, line-height 1.65 | `var(--text-muted)` |
| Callout / inset note | `--text-sm`, line-height 1.65 | `var(--text-dim)` |

The distinction between `--text` (full brightness) and `--text-dim` (slightly reduced) is the key to prose legibility on glass-informed backgrounds. Body text at `--text-dim` sits back naturally; headers at `--text` punch forward without needing size alone.

---

## Page-by-Page Recommendations

### About Page (`about.html`)

**Current state:** Good structural use of `.about-card` for stat blocks and collapsible role prompts. The version badge uses appropriate glass-border treatment.

**Recommendations:**
- The stat card (16 generators / 6 worlds / 9,750+ entries / 19,200 QA runs) is the right place for a specular glass surface. Add `box-shadow: var(--glass-inset), var(--glass-shadow)` to `.about-card` to give it the full glass depth.
- Section labels (`<h2>` elements) could use a subtle left-border accent strip instead of a full-width bottom border: `border-left: 3px solid var(--accent); padding-left: 12px; border-bottom: none`. This is lighter and feels more intentional.
- The Duck.ai links injected below role prompts need a consistent glass-pill treatment: small, rounded, `background: var(--glass-bg)`, `border: 1px solid var(--glass-border)`. Currently they render as plain links.

### Quick-Start Guide (`learn.html`)

**Current state:** The path cards (🌱 New / ⚔ D&D / 🎲 Other / 🎭 GM Craft) already use `.ln-path` with glass treatment. The `ln-note` callout boxes use a border-left accent pattern.

**Recommendations:**
- The path cards at the top are the highest-value glass surface on this page - they are the primary CTA. Add a subtle hover specular: `::before` gradient overlay at 135° that appears on hover. This makes them feel physically pressable.
- The `ln-card` callout containers (e.g. "Ready to start?") should match the `about-card` treatment exactly - currently they use slightly different padding. Unify them.
- AI prompt `<details>` blocks: the `ln-prompt-copy` button is positioned absolute inside the `<pre>`. On mobile this overlaps the first line of text. Fix: move it to a row above the `<pre>`, aligned right, inside `.ln-prompt-inner`.
- Add a `position: sticky; top: 0` behaviour to the section-jump nav (the four path cards at the top) on desktop so users can navigate back to their path after scrolling deep into a section.

### License Page (`license.html`)

**Current state:** The attribution `lic-card` blocks are glass-bordered but their content is dense legal prose. This is the right call - legibility over aesthetics here.

**Recommendations:**
- The human-readable intro card (CC BY 3.0 summary) warrants a slightly more prominent glass treatment with a coloured left border using `var(--c-green)` or `var(--accent)` - it's the only piece of the page a typical user actually needs to read.
- The legal attribution blocks should stay as-is: `background: var(--glass-bg)` with no blur. They are reference material, not UI.
- Consider a two-column layout for the three attribution cards on wide viewports - they have comparable length and a `grid-template-columns: 1fr 1fr` grid with the third card spanning both columns would use vertical space more efficiently.

### Campaign Guides (`campaigns/guide-*.html`)

**Current state:** Not audited in detail for this sprint.

**Recommendations (general):**
- Campaign guides should use their campaign's `data-campaign` attribute so the page inherits the campaign accent colour automatically from `theme.css`. This gives each guide its own visual identity without any extra CSS.
- World-specific prose sections benefit from a subtle campaign-tinted ambient gradient behind the column - the orb backgrounds already do this if `data-campaign` is set on `<html>`.
- "Play in this world" CTAs at the bottom of each guide should be styled as the `.btn-roll` primary action button (campaign-tinted, pill-shaped) rather than a generic link. The guide's purpose is to funnel the GM into the generator.

---

## Specular Highlight Implementation

The 135° specular highlight planned for BL-36 applies to glass card surfaces on generator result panels. On static pages, the same technique is appropriate only for the **highest-value callout surfaces** (the stat card on About, the path cards on Quick Start, the CC BY summary on License). It should not be applied to body-level glass containers.

Implementation when BL-36 ships:

```css
.about-card::before,
.ln-path::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 42%);
  pointer-events: none;
  border-radius: inherit;
}
/* Light mode: reduce alpha - glass is already lighter */
[data-theme="light"] .about-card::before,
[data-theme="light"] .ln-path::before {
  background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 38%);
}
```

---

## Print CSS Reminder

All static pages include `@media print` rules that strip nav, glass effects, and backgrounds. Prose columns are the only content that survives to paper. This is intentional - GMs print rules references, not design systems.

Ensure any new glass surface added to static pages is excluded from print:

```css
@media print {
  .about-card, .ln-card, .ln-path, .lic-card {
    background: transparent !important;
    backdrop-filter: none !important;
    border: 1px solid #ccc !important;
    box-shadow: none !important;
  }
}
```

---

## Summary - The Three Rules

1. **Glass contains; it doesn't surround.** Prose flows on transparent or solid backgrounds. Glass wraps callouts, cards, and navigation - not paragraphs.

2. **One blur layer per visual stack.** The nav bar blurs. The result panel blurs. Body content does not. Never stack two blurred layers.

3. **Specular highlights earn their place.** Apply the 135° gradient only to surfaces that are primary actions or high-value callouts - not to every glass element on the page.

---

*Document version: see devdocs/CHANGELOG.md*  
*Maintained by the Ogma CSS/Design Engineer. Update whenever a new static page is added or BL-36 adaptive vibrancy ships.*
