# 127: Restore the git index for public/trace.py
Files: none (shell work only)
Severity: med

## Problem
Aider left `public/trace.py` as a staged delete plus an untracked file of the same name. The
content is the file spec 124 wrote. Until the index is fixed, `git diff HEAD --stat` counts the
whole file as changed, so spec 126 gate 1 cannot pass even after the fix lands.

## Required change
Run this, with no aider job running:
```sh
cd ~/Desktop/AiderThings/cs50p-tutor
git add public/trace.py
git status --short public/trace.py
git diff HEAD --stat -- public/trace.py
```

## Acceptance gates
1. `git status --short public/trace.py` prints `M  public/trace.py`. It no longer shows a `D `
   line or a `??` line.
2. `git diff HEAD --stat -- public/trace.py` shows `6 insertions(+)` and no deletions, since the
   file still holds spec 124's lines.
