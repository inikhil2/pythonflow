# 043: Delete the hand import of ref from usePython (shell step; replaces spec 037)
Run after: nothing; it does not conflict with any open spec.

`app/composables/usePython.ts` line 1 is `import { ref } from 'vue'`, and line 2 is blank.
Nuxt auto-imports `ref`, and patterns.md rule 6 does not allow hand imports. Spec 037
failed with no change, so the orchestrator removes the line from the shell.

## Steps
```sh
cd ~/Desktop/AiderThings/cs50p-tutor
sed -i '' "1{/^import { ref } from 'vue'$/d;}" app/composables/usePython.ts
sed -i '' '1{/^$/d;}' app/composables/usePython.ts
git diff --stat -- app/composables/usePython.ts
npm run generate
```

## Acceptance gates
- `git diff --stat` shows `1 file changed, 2 deletions(-)` and no insertions.
- `head -1 app/composables/usePython.ts` prints `export interface RunResult {`.
- `grep -rnE "from 'vue'" app` prints nothing.
- `npm run generate` exits 0.
- In the browser, Run on the hello lesson prints `hello, world` (or the lesson's expected
  output), and the toolbar shows the Python version.
