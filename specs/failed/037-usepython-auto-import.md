# 037: Remove the hand import of ref from usePython
Files: app/composables/usePython.ts
Severity: low

## Problem
`app/composables/usePython.ts` line 1 is `import { ref } from 'vue'`. Nuxt auto-imports
`ref`, and docs/patterns.md rule 6 says not to import it by hand. It is the only hand
import of a Vue API left in `app/`. patterns.md lists usePython.ts as "do not edit unless
the spec names them": this spec names it, and changes only this line.

## Required change
In `app/composables/usePython.ts`, delete this line and the blank line after it:
```ts
import { ref } from 'vue'

```
Change nothing else in the file.

## Acceptance gates
- `grep -rnE "from 'vue'" app` prints nothing.
- `head -1 app/composables/usePython.ts` prints `export interface RunResult {`.
- `npm run generate` exits 0.
- In the browser, Run on the hello lesson still prints its output, and the toolbar shows
  the Python version.
