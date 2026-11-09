# 007: Stop tracking the macOS .DS_Store file at the repo root
Files: ../.gitignore, ../.DS_Store
Severity: low

## Problem
Commit `db03ff2` added `../.DS_Store` (the repo root is `~/Desktop/AiderThings`,
one level above `cs50p-tutor`). It is a macOS Finder file, not project code.
`cs50p-tutor/.gitignore` ignores `.DS_Store`, but the root `../.gitignore`
contains only `.aider*`, so the root copy is not ignored.

## Required change
Run from `~/Desktop/AiderThings/cs50p-tutor`:
1. `printf '.DS_Store\n' >> ../.gitignore`
2. `git rm --cached ../.DS_Store` (removes it from git only; the file stays on disk)
3. `git commit -m "Stop tracking .DS_Store" -- ../.gitignore ../.DS_Store`

## Acceptance gates
- `git -C .. ls-files .DS_Store` prints nothing
- `grep -cx '.DS_Store' ../.gitignore` prints `1`
- `git -C .. status --short .DS_Store` prints nothing
