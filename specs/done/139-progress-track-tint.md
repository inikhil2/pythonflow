# 139: Make the unfilled progress track visible
Files: app/assets/css/main.css
Severity: low

## Problem
Progress bars draw their unfilled track in `--surface-2`. In the light theme that is 1.06:1
against `--bg` and 1.13:1 against `--surface`, so a half-full bar looks like a short loose blue
line. Shell spec 137 measured the same in the browser. In the dark theme the track is 1.17 to
1.31:1. Every bar has a text count next to it ("3 / 7 done"), so the track only needs to be
seen, not to reach 3:1.

## Required change
In `app/assets/css/main.css`, change only the progress track. In the `progress { ... }` block,
replace this line:
```css
  background: var(--surface-2);
  overflow: hidden;
```
with:
```css
  background: color-mix(in srgb, var(--text) 12%, transparent);
  overflow: hidden;
```
And replace this line:
```css
progress::-webkit-progress-bar { background: var(--surface-2); }
```
with:
```css
progress::-webkit-progress-bar { background: color-mix(in srgb, var(--text) 12%, transparent); }
```

Change the comment above the block from
`/* Progress bars (lesson header, Continue card): a thin accent bar on a pale track. */` to
`/* Progress bars (lesson header, Continue card, mastery): a thin accent bar on a 12% text-tint track. */`

The track is then 1.28:1 in light and about 1.4:1 in dark, and the blue fill is 4.37:1 against
the track. Leave the `.btn-secondary` line that uses `--surface-2` as it is. Change nothing else.

## Acceptance gates
1. `grep -c "color-mix(in srgb, var(--text) 12%, transparent)" app/assets/css/main.css` prints `2`
2. `grep -c "var(--surface-2)" app/assets/css/main.css` prints `1`
3. `grep -c "12% text-tint track" app/assets/css/main.css` prints `1`
4. Run by hand: `git diff --numstat app/assets/css/main.css` prints `3 3`.
