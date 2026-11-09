# 073: Remove the app copy under specs/done, and the unused shell 072
Files: specs/done/app/ (delete), specs/shell/072-projects-gallery-shell.md (delete)
Severity: medium

## Problem
Commit 8d49a82 ("Spec 068") added 50 files under `specs/done/app/`. They are copies of
every file in `app/` (components, composables, layouts, pages, utils, main.css), and each
one is byte-identical to its live file. Nothing reads them. Type checking skips them,
because `.nuxt/tsconfig.json` includes only `../app/**/*`. Still, they are a second,
stale copy of the code: anyone searching for a component finds two copies, and the
copies will drift as soon as the live files change.

The same commit also added `specs/shell/072-projects-gallery-shell.md`. That step was a
fallback in case spec 068 failed. Spec 068 then passed: the committed `content.config.ts`,
`app/components/ProjectCard.vue` and `app/pages/projects/index.vue` are 2612, 2628 and
1395 bytes and match the spec. So 072 must not be run.

## Steps
Run from `~/Desktop/AiderThings/cs50p-tutor`. Leave the spec 069 work in progress alone.

```sh
git rm -r -q specs/done/app
git rm -q specs/shell/072-projects-gallery-shell.md
```

## Acceptance gates
1. `ls specs/done | grep -v '\.md$'` prints nothing.
2. `ls specs/shell/072-projects-gallery-shell.md` fails with "No such file or directory".
3. `git status --short -- app content content.config.ts` shows no new changes from this
   step. Only spec 069's own files may appear there.
4. `wc -c app/components/ProjectCard.vue app/pages/projects/index.vue content.config.ts`
   still shows 2628, 1395 and 2612.
5. Commit as "Shell 073: remove app copy under specs/done and unused shell 072".
   The commit lists 51 deleted files and nothing else.
