# 013: Focus ring disappears in Windows high-contrast mode; editor repeats the global rule
Files: app/assets/css/main.css, app/components/content/Exercise.vue
Severity: low

## Problem
1. `app/assets/css/main.css`, rule `:focus-visible { outline: none; box-shadow: ... }`.
   In forced-colors mode (Windows high contrast) browsers remove `box-shadow`,
   so keyboard users see no focus ring at all. DESIGN.md: "Every interactive
   element ... has a visible focus ring."
2. `app/components/content/Exercise.vue`, rule `.code-editor:focus { outline: none; box-shadow: ... }`
   repeats the global ring and has the same problem. A focused textarea always
   matches `:focus-visible`, so the global rule already covers it.

## Required change
1. In `app/assets/css/main.css`, replace:
```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent);
}
```
   with exactly:
```css
/* The transparent outline becomes visible in forced-colors mode, where box-shadow is removed. */
:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent);
}
```
2. In `app/components/content/Exercise.vue`, delete this whole rule, including its blank line before:
```css
.code-editor:focus {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent);
}
```

## Acceptance gates
- `grep -c 'outline: none' app/assets/css/main.css app/components/content/Exercise.vue` prints `app/assets/css/main.css:0` and `app/components/content/Exercise.vue:0`
- `grep -c 'outline: 2px solid transparent' app/assets/css/main.css` prints `1`
- `grep -c 'code-editor:focus' app/components/content/Exercise.vue` prints `0`
- `npm run generate` exits 0
