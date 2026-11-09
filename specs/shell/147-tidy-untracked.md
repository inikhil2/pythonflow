# 147: Tidy the untracked files in cs50p-tutor
Files: docs/design/pythonflow-mockups.png, specs/failed/143-interview-easy-001-003-fix.md
Severity: low

## Problem
`git status` shows two untracked files in cs50p-tutor.
- `PythonFlow Learning App Interface Collection.png` (1.5 MB, 23 Oct) is the design mockup the app's
  look is based on: dashboard, lesson, playground, progress and the dark theme. It is the user's
  reference, not junk, so keep it. It should not sit in the project root, though, and its name has spaces.
- `specs/failed/143-interview-easy-001-003-fix.md` is a failed spec. Every other failed spec is
  committed as history (037, 040, 041, 044, 126), so this one should be too.
`.harness/` at the AiderThings root stays untracked on purpose. Leave it alone.

## Required change
Run these from `~/Desktop/AiderThings/cs50p-tutor`:

```
mkdir -p docs/design
mv "PythonFlow Learning App Interface Collection.png" docs/design/pythonflow-mockups.png
git add docs/design/pythonflow-mockups.png specs/failed/143-interview-easy-001-003-fix.md specs/shell/147-tidy-untracked.md
git commit -m "Docs: keep the PythonFlow design mockups; record failed spec 143"
```

Delete nothing.

## Acceptance gates
1. `ls docs/design/pythonflow-mockups.png` prints the path.
2. `git status --short .` prints nothing for cs50p-tutor (`.harness/` is outside it).
3. `git log -1 --stat` lists exactly the two files above plus this spec.
