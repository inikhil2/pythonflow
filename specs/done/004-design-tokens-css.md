# 004: Create app/assets/css/main.css with the DESIGN.md tokens and load it
Files: app/assets/css/main.css, nuxt.config.ts
Severity: med

## Problem
DESIGN.md says the color tokens are defined once in `app/assets/css/main.css`.
That file does not exist, and `nuxt.config.ts` loads no CSS. Every
`var(--bg-alt)`, `var(--text)` and `var(--accent)` used in
`app/components/content/Exercise.vue` resolves to nothing, so the exercise box
has no background and no focus ring color.

## Required change
1. Create `app/assets/css/main.css` with exactly:

```css
:root {
  --bg: #ffffff;
  --bg-alt: #f5f5f7;
  --text: #1d1d1f;
  --text-2: #6e6e73;
  --accent: #0071e3;
  --accent-press: #0062c3;
  --success: #1d8348;
  --error: #d70015;
  --border: rgba(0,0,0,0.08);
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #000000;
    --bg-alt: #1c1c1e;
    --text: #f5f5f7;
    --text-2: #98989d;
    --accent: #2997ff;
    --accent-press: #0a84ff;
    --success: #30d158;
    --error: #ff453a;
    --border: rgba(255,255,255,0.12);
  }
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
  font-size: 1.0625rem;
  line-height: 1.5;
  letter-spacing: 0;
  font-optical-sizing: auto;
  transition: background-color 200ms cubic-bezier(0.2, 0.8, 0.2, 1), color 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

code, pre, textarea {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
}

h1 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; }
h2 { font-size: 1.75rem; font-weight: 600; line-height: 1.2; letter-spacing: -0.015em; }
h3 { font-size: 1.25rem; font-weight: 600; line-height: 1.3; }

button:active { transform: scale(0.97); transition: transform 100ms ease-out; }

:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 1ms !important; animation: none !important; }
}
@media (prefers-reduced-transparency: reduce) {
  .sidebar, .topbar { background: var(--bg-alt); backdrop-filter: none; }
}
@media (prefers-contrast: more) {
  :root { --border: currentColor; }
}
```

2. In `nuxt.config.ts`, add this line directly after the `modules: [ ... ],` block:
   `  css: ['~/assets/css/main.css'],`

## Acceptance gates
- `grep -c "css: \['~/assets/css/main.css'\]" nuxt.config.ts` prints `1`
- `grep -c -- '--bg-alt' app/assets/css/main.css` prints `2`
- `npm run generate` exits 0 and `grep -rlE -- '--bg-alt: ?#f5f5f7' .output/public/_nuxt/` prints at least one file
