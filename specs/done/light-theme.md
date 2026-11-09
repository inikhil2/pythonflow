# Backlog: light theme (do last)
Decided by the user on 2026-10-24: tackle the light theme at the very end, after all phases.

Unverified so far: light mode rendering (progress bars, chips, cards, workbench), plus
`prefers-contrast` and `prefers-reduced-transparency`. The page follows the OS theme and has
no in-page switch, so checking needs an OS or browser colour-scheme override.

## Result (2026-11-06)
Checked in Chrome with the in-page theme switch (the page has one now). Light mode renders cleanly on all main pages; no visible text below WCAG AA on 10 pages; all colour tokens pass on every background (lowest 4.75). Simulated `prefers-contrast: more` (card borders) and `prefers-reduced-transparency: reduce` (solid panels) both work. No fix needed.
