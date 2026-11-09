# 025: Remove the hand import of ErrorHelp in RunOutput
Files: app/components/RunOutput.vue
Severity: low

## Problem
`app/components/RunOutput.vue` imports `ErrorHelp` by hand. Nuxt auto-imports
components, and `docs/patterns.md` rule 6 says not to import auto-imported names by
hand. No other component does this.

## Required change
In `app/components/RunOutput.vue`, delete exactly this line:
```ts
import ErrorHelp from '~/components/ErrorHelp.vue'
```
Change nothing else.

## Acceptance gates
- `grep -c "import ErrorHelp" app/components/RunOutput.vue` prints 0.
- `npm run generate` exits 0.
- Browser: Run `print(x)` in the hello lesson. The NameError explanation still shows.
