# DESIGN.md: PythonFlow design rules

Follow exactly. Plain CSS in `<style scoped>`. No CSS framework, no animation library.
Every value below is already a variable in `app/assets/css/main.css`. Use the variable;
never type a hex colour, a shadow or a duration in a component.

## Colour tokens (`light-dark(light, dark)` in main.css)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f5f7fa` | `#0e1622` | page and sidebar |
| `--surface` | `#ffffff` | `#172131` | cards |
| `--surface-2` | `#edf1f6` | `#212d40` | sunken areas, lesson code blocks, secondary buttons, chips |
| `--text` | `#141922` | `#e9eef6` | body and headings |
| `--text-2` | `#566173` | `#93a3bd` | secondary text, labels |
| `--accent` | `#1462d6` | `#2b6fdc` | button fills (with `--on-accent` text) |
| `--accent-text` | `#1462d6` | `#6aa8ff` | links, selected nav text, icons |
| `--accent-soft` | `#e3edfc` | `#1c3152` | selected nav fill, info chips |
| `--on-accent` | `#ffffff` | `#ffffff` | text on `--accent` |
| `--success` | `#116a35` | `#3fcf7f` | passed, completed |
| `--warning` | `#8f4800` | `#ff9d57` | needs revision |
| `--error` | `#c8281e` | `#ff6b61` | failed, mistakes |
| `--line` | `rgb(20 25 34 / 0.08)` | `rgb(233 238 246 / 0.08)` | hairlines between list rows only |

Code workbench (same in both themes; it is always dark):
`--code-bg #121b27`, `--code-bar #18222f`, `--code-line #1a2534`, `--code-text #e4eaf2`,
`--code-muted #8193ab`, `--code-selection #2a4470`, `--code-ok #4cd788`,
`--code-err #ff7b72`. Syntax: `--syn-keyword #ff7ab2`, `--syn-string #f2c46d`,
`--syn-number #c3a6ff`, `--syn-comment #7d8ea6`, `--syn-function #6cb6ff`.

All text pairs above are at least 4.5:1. Colour is never the only signal: pair it with a
text label or an icon.

## Typography

- UI: `var(--font)` = `-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif`
- Code: `var(--font-mono)` = `ui-monospace, "SF Mono", Menlo, Consolas, monospace`
- Scale (rem): `--text-xs 0.75` (chips, captions), `--text-s 0.8125` (meta),
  `--text-m 0.9375` (UI default, buttons, nav), `--text-body 1.0625` (lesson prose),
  `--text-l 1.25` (card titles), `--text-xl 1.75` (page titles),
  `--text-2xl clamp(1.75rem, 3vw, 2.25rem)` (lesson title, greeting).
- Weights: 400 body, 500 buttons and nav, 600 titles, 700 page titles only.
- Tracking: -0.02em on `--text-xl` and up, -0.01em on `--text-l`, 0 below.
- Leading: 1.1 on page titles, 1.3 on card titles, 1.5 UI, 1.65 lesson prose.
- Lesson prose width: max `40rem`. Code is `0.875rem` with line-height 1.6.

## Spacing, radius, shadow

- Spacing scale (rem only): `--s1 0.25`, `--s2 0.5`, `--s3 0.75`, `--s4 1`, `--s5 1.5`,
  `--s6 2`, `--s7 3`. No other values.
- Page padding `--s6` desktop, `--s4` under 48rem. Grid gap `--s5`.
- Radius: `--r-s 6px` (inline code, small chips), `--r-m 10px` (buttons, inputs, nav
  items), `--r-l 14px` (cards, workbench), `--r-pill 999px` (status chips, bars).
- Shadow: `--shadow-card` on cards only (light: soft and wide; dark: none, tonal lift).
  `--shadow-float` only on floating UI (mobile tab bar, popovers).
- Cards have no border. Never stack a card inside a card; inside a card use `--surface-2`.

## Layout

- Desktop: sidebar `15rem` + content. Content max width `72rem`, centred.
- Under `48rem`: the sidebar becomes a fixed bottom tab bar (icons over labels, glass:
  `--glass` background with `backdrop-filter: blur(20px) saturate(180%)`). Content gets
  bottom padding `5rem`.
- Lesson page: one column, max `46rem`. From `75rem`: the workbench moves right and
  sticks (split pane, text 1fr, workbench 1.2fr).
- One primary button per view. Secondary actions use the secondary button.

## Components

- **Primary button** `.btn-primary`: `--accent` fill, `--on-accent` text, `--r-m`,
  padding `var(--s2) var(--s4)`, weight 500, `--text-m`, optional 16px icon before the label.
- **Secondary button** `.btn-secondary`: `--surface-2` fill, `--text` text, same shape.
  On the dark workbench, use `--code-line` fill and `--code-text` text.
- **Status chip**: pill, `--text-xs`, weight 500, padding `var(--s1) var(--s3)`, a 12px
  icon plus a word: Completed (success), In progress (accent-text on accent-soft),
  Not started (text-2 on surface-2), Needs revision (warning).
- **Nav item**: 18px icon + label, `--r-m`, padding `var(--s2) var(--s3)`. Selected:
  `--accent-soft` fill, `--accent-text` text, `aria-current="page"`.
- **Workbench**: `--code-bg`, `--r-l`. A toolbar (`--code-bar`) with status on the left
  and Reset and Run on the right. Run turns into Stop while running (same place). The
  output console is below, mono, stdout in `--code-text`, errors in `--code-err`, and a
  status line with an icon and words.
- **Progress bar**: 6px tall, pill, `--surface-2` track, `--accent` fill, the width
  animates.
- **Lists**: rows separated by 1px `--line`; no card per row.
- **Icons**: `@lucide/vue`, stroke-width 1.75, `aria-hidden="true"`, always next to a text
  label. No emoji in the interface.

## Theme

The top-right toggle (`ThemeToggle.vue`, in the default layout) chooses System, Light or Dark.
It is saved in `localStorage` under `pythonflow:theme`. Light or Dark sets
`data-theme` on `<html>`, and the `:root[data-theme=...]` rules in `main.css` set `color-scheme`
and the `light-dark()` switch, so they win over the system setting. System removes the attribute.
An inline script in `nuxt.config.ts` applies the saved choice before first paint.

## Motion

- Tokens: `--ease cubic-bezier(0.2, 0.8, 0.2, 1)`, `--dur-fast 100ms`, `--dur 200ms`,
  `--dur-slow 400ms`.
- Press feedback: `button:active { transform: scale(0.97) }` over `--dur-fast`.
- Hover: colour or background change only, `--dur`.
- Progress bars and value changes in the explorer: `--dur-slow`.
- Animate `opacity` and `transform` (and `width` on progress bars) only. No bounce.
  Never block input during a transition. Theme changes ease the background over `--dur`.

## Accessibility (required)

- Focus: `:focus-visible { outline: 2px solid var(--accent-text); outline-offset: 2px }`
  (global in main.css; it survives forced-colors mode). Never remove it.
- `prefers-reduced-motion: reduce` sets all durations to 1ms. `prefers-reduced-transparency`
  makes the tab bar solid `--surface`. `prefers-contrast: more` turns `--line` into
  `currentColor` and gives cards a 1px border.
- Real `<button>` for actions, `<NuxtLink>` for navigation. Every icon-only control has
  an `aria-label`. Status text changes go in a `role="status"` element.
- Every page has one `<h1>`. Landmarks: `<nav aria-label="Main">`, `<main>`.
- Touch targets at least 2.75rem tall on mobile.

## Voice

- Sentence case. Specific verbs: "Run", "Stop", "Reset code", "Check answer",
  "Show hint", "Next lesson". Never "Submit" or "Go".
- Errors say what happened and what to do next. Empty states invite one action.
- Lessons: warm, second person, one idea per paragraph.
