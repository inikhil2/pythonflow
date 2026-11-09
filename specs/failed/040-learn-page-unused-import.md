# 040: Remove the unused RunResult import from the Learn page
Files: app/pages/learn/index.vue
Severity: low

## Problem
The spec 030 change to `app/pages/learn/index.vue` matches the spec except for one added
line, `import type { RunResult } from '~/composables/usePython'`. Nothing in the page uses
`RunResult`. This is dead code, and patterns.md rule 6 does not allow hand imports.

Do this spec after 039.

## Required change
In `app/pages/learn/index.vue`, delete exactly this line:
```ts
import type { RunResult } from '~/composables/usePython'
```
Change nothing else in the file.

## Acceptance gates
- `grep -n "RunResult\|usePython" app/pages/learn/index.vue` prints nothing.
- `sed -n '2p' app/pages/learn/index.vue` prints `import { Clock } from '@lucide/vue'`, and
  `sed -n '3p'` prints an empty line.
- `npm run generate` exits 0.
