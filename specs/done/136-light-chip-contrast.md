# 136: Darken the light-theme success and warning colours so chip text is readable
Files: app/assets/css/main.css, DESIGN.md
Severity: med

## Problem
Status chips draw their text in `--success` or `--warning` on a 14% tint of the same colour
(`color-mix(in srgb, var(--success) 14%, transparent)` in StatusChip.vue). Chip text is
`--text-xs` (12px), so it needs a contrast of at least 4.5:1. In the light theme it falls short:

| Chip | on `--bg` | on `--surface` | on `--surface-2` |
|---|---|---|---|
| Completed (`#157a3f`) | 4.18 | 4.43 | 3.95 |
| Needs revision (`#a35200`) | 4.29 | 4.58 | 4.08 |

The dark theme is fine (above 6:1). A lighter tint does not fix it on `--surface-2`, so the light
token values must be darker.

## Required change
Change only the light (first) value of two tokens. Keep the dark values as they are.

In `app/assets/css/main.css`, replace these two lines:
```css
  --success: light-dark(#157a3f, #3fcf7f);
  --warning: light-dark(#a35200, #ff9d57);
```
with:
```css
  --success: light-dark(#116a35, #3fcf7f);
  --warning: light-dark(#8f4800, #ff9d57);
```

In `DESIGN.md`, replace these two table rows:
```markdown
| `--success` | `#157a3f` | `#3fcf7f` | passed, completed |
| `--warning` | `#a35200` | `#ff9d57` | needs revision |
```
with:
```markdown
| `--success` | `#116a35` | `#3fcf7f` | passed, completed |
| `--warning` | `#8f4800` | `#ff9d57` | needs revision |
```

New worst-case chip contrast: success 4.81, warning 4.86. As plain text on `--surface-2` they are
5.90 and 5.98. Change nothing else in either file.

## Acceptance gates
1. `grep -c "light-dark(#116a35, #3fcf7f)" app/assets/css/main.css` prints `1`
2. `grep -c "light-dark(#8f4800, #ff9d57)" app/assets/css/main.css` prints `1`
3. `grep -c "157a3f" app/assets/css/main.css` prints `0`
4. `grep -c "a35200" DESIGN.md` prints `0`
5. `grep -c "#116a35" DESIGN.md` prints `1`
6. Run by hand: `git diff --numstat app/assets/css/main.css DESIGN.md` prints `2 2` for each file.
