# 012: Four DESIGN.md color pairs fail the 4.5:1 contrast rule
Files: DESIGN.md, app/assets/css/main.css
Severity: med

## Problem
DESIGN.md requires "Text contrast at least 4.5:1 against its background in both
color schemes". Measured with the WCAG formula:
- Light `--accent #0071e3` on `--bg-alt #f5f5f7` (secondary button text): 4.31
- Light `--success #1d8348` on `--bg-alt #f5f5f7` (pass rows in a card): 4.39
- White text on dark `--accent #2997ff` (primary button, dark mode): 3.02
- Light `--error #d70015` on the output panel `#1c1c1e` (errors, light mode): 3.16

The output panel color `#1c1c1e` is also a hardcoded color outside the tokens,
which DESIGN.md forbids.

## Required change
1. In `DESIGN.md`, replace this line:
```
- `--accent: #0071e3`, `--accent-press: #0062c3`, `--success: #1d8348`, `--error: #d70015`
```
   with:
```
- `--accent: #0066cc`, `--accent-press: #0058b0`, `--success: #187a3e`, `--error: #d70015`, `--on-accent: #ffffff`
```
2. In `DESIGN.md`, directly after the line
```
- `--border: rgba(0,0,0,0.08)`
```
   add this line:
```
- Both schemes: `--output-bg: #1c1c1e`, `--output-text: #f5f5f7`, `--output-error: #ff453a`
```
3. In `DESIGN.md`, replace this line:
```
- `--accent: #2997ff`, `--accent-press: #0a84ff`, `--success: #30d158`, `--error: #ff453a`
```
   with:
```
- `--accent: #2997ff`, `--accent-press: #0a84ff`, `--success: #30d158`, `--error: #ff453a`, `--on-accent: #000000`
```
4. In `DESIGN.md`, replace this line:
```
- **Primary button:** background `--accent`, white text, pill, padding `0.6rem 1.25rem`, weight 500.
```
   with:
```
- **Primary button:** background `--accent`, `--on-accent` text, pill, padding `0.6rem 1.25rem`, weight 500.
```
5. In `DESIGN.md`, replace this line:
```
- **Output panel:** dark surface (`#1c1c1e`) with light text in both color schemes. Errors in `--error`.
```
   with:
```
- **Output panel:** `--output-bg` surface, `--output-text` text, errors in `--output-error`. Same in both color schemes.
```
6. In `app/assets/css/main.css`, in the first `:root { ... }` block:
   - change `--accent: #0071e3;` to `--accent: #0066cc;`
   - change `--accent-press: #0062c3;` to `--accent-press: #0058b0;`
   - change `--success: #1d8348;` to `--success: #187a3e;`
   - directly after `--border: rgba(0,0,0,0.08);` add these four lines:
```css
  --on-accent: #ffffff;
  --output-bg: #1c1c1e;
  --output-text: #f5f5f7;
  --output-error: #ff453a;
```
7. In `app/assets/css/main.css`, inside the dark `:root { ... }` block, directly after
   `--border: rgba(255,255,255,0.12);` add `    --on-accent: #000000;`

Resulting ratios: accent/bg-alt 5.11, success/bg-alt 4.96, black on dark accent
6.96, white on light accent 5.57, output error 4.99.

## Acceptance gates
- `grep -cE '#0071e3|#1d8348|#0062c3' app/assets/css/main.css DESIGN.md` prints `app/assets/css/main.css:0` and `DESIGN.md:0`
- `grep -c -- '--on-accent' app/assets/css/main.css` prints `2`
- `grep -c -- '--output-' app/assets/css/main.css` prints `3`
- `grep -c '#1c1c1e' DESIGN.md` prints `2` (dark `--bg-alt` and `--output-bg`)
- `npm run generate` exits 0
