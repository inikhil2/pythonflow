# 042: Delete two hand-added import lines (shell step; replaces specs 040 and 041)
Run after: whatever spec is in progress is committed. These lines are not touched by spec 036.

The builder added two import lines that the specs did not have. It has failed three
times to remove one of them (specs 040 and 041), so the orchestrator removes them from
the shell. Both are hand imports that patterns.md rule 6 does not allow:
- `app/pages/learn/index.vue` line 3: `import type { RunResult } from '~/composables/usePython'`
  (`RunResult` is not used in the page).
- `app/components/LearningPath.vue` line 3: `import StatusChip from '~/components/StatusChip.vue'`
  (Nuxt auto-imports components; spec 034 had no such line).

## Steps
```sh
cd ~/Desktop/AiderThings/cs50p-tutor
sed -i '' "/^import type { RunResult } from '~\/composables\/usePython'$/d" app/pages/learn/index.vue
sed -i '' "/^import StatusChip from '~\/components\/StatusChip.vue'$/d" app/components/LearningPath.vue
git diff --stat -- app/pages/learn/index.vue app/components/LearningPath.vue
npm run generate
```

## Acceptance gates
- `git diff --stat` shows `2 files changed, 2 deletions(-)` and no insertions.
- `grep -n "RunResult\|StatusChip.vue" app/pages/learn/index.vue app/components/LearningPath.vue`
  prints nothing.
- `npm run generate` exits 0.
- `.output/public/learn/index.html` contains `Week 0: Functions and variables` and
  `.output/public/index.html` contains `No lessons yet` (the auto-imported StatusChip and
  learning path still render).
