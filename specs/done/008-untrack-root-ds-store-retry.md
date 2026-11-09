# 008: Retry of 007: root .DS_Store is still tracked and not ignored
Files: ../.gitignore, ../.DS_Store
Severity: low

## Problem
Spec 007 was moved to `specs/done` but nothing changed:
- `git -C .. ls-files .DS_Store` still prints `.DS_Store` (file is tracked, added in commit `db03ff2`).
- `../.gitignore` (the repo root is `~/Desktop/AiderThings`) still contains only the line `.aider*`.
This is a file edit plus one git command. It is not a code change.

## Required change
1. Replace the whole file `../.gitignore` with exactly these two lines:
```
.aider*
.DS_Store
```
2. Run this shell command from `~/Desktop/AiderThings/cs50p-tutor` (in aider: `/run git rm --cached ../.DS_Store`):
   `git rm --cached ../.DS_Store`
   This removes the file from git only. The file stays on disk.
3. Commit both paths: `git commit -m "Stop tracking .DS_Store" -- ../.gitignore ../.DS_Store`

## Acceptance gates
- `git -C .. ls-files .DS_Store` prints nothing
- `grep -cx '.DS_Store' ../.gitignore` prints `1`
- `git -C .. status --short` does not list `.DS_Store` or `.gitignore`
