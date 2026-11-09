# 006: Fix an inaccurate sentence in the Hello, world lesson
Files: content/week0-functions/01-hello.md
Severity: med

## Problem
The lesson says: "Without them, Python would try to find a variable named `hello, world`, which doesn't exist." This is wrong. `hello, world` is not a valid variable name (it has a comma and a space), so Python would report a SyntaxError, not a missing variable. A beginner would learn the wrong reason.

## Required change
1. In `content/week0-functions/01-hello.md`, replace the whole sentence "Without them, Python would try to find a variable named `hello, world`, which doesn't exist." with exactly: "Without them, Python would try to read `hello, world` as code instead of text, and it would show you an error."
2. Change nothing else in the file.

## Acceptance gates
- `grep -c "variable named" content/week0-functions/01-hello.md` prints `0`
- `grep -c "read \`hello, world\` as code" content/week0-functions/01-hello.md` prints `1`
