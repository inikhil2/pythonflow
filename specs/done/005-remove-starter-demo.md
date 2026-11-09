# 005: Remove the Nuxt Content starter demo components and home text
Files: app/components/Counter.vue, app/components/Alert.vue, content/index.md
Severity: low

## Problem
`app/components/Counter.vue` and `app/components/Alert.vue` are leftovers from the
Nuxt Content starter. The app does not use them. `Alert.vue` hardcodes colors
(`background-color: #fff`, `rgba(0, 0, 0, 0.1)`, default `'orange'`), which
DESIGN.md forbids, and has a hover lift animation DESIGN.md does not allow.
`content/index.md` is the starter's "Welcome to Nuxt Content Starter" text and is
the only file that uses `::alert` and `::counter`.

## Required change
1. Delete `app/components/Counter.vue`.
2. Delete `app/components/Alert.vue`.
3. Replace the whole file `content/index.md` with exactly:

```md
# Learn Python with a personal tutor

Short lessons that follow Harvard's CS50P course, with code you can run right here.

Start with [Hello, world](/week0-functions/01-hello).
```

Do not touch `content/about.md` (task T19 rewrites it).

## Acceptance gates
- `ls app/components` lists only `content`
- `grep -cE 'alert|counter' content/index.md` prints `0`
- `npm run generate` exits 0
