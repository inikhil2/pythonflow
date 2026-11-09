# 138: Update nuxt, vue-tsc and @lucide/vue to their latest minor versions
Files: package.json, package-lock.json
Severity: low

## Problem
`npm outdated` shows three minor bumps: nuxt 4.6.2 to 4.6.3, vue-tsc 3.1.5 to 3.3.14, and
@lucide/vue 1.61.0 to 1.66.0. Leave pyodide (314.x) and typescript (7.x) alone. Both are major
versions and need their own plan. Run this only after 137 is committed.

## Required change
Run these with no aider job running:
```sh
cd ~/Desktop/AiderThings/cs50p-tutor
npm install nuxt@4.6.3 @lucide/vue@1.66.0
npm install -D vue-tsc@3.3.14
npm outdated
node scripts/check-lessons.ts
node scripts/check-projects.ts
node scripts/check-tutor-prompt.ts
npx nuxi typecheck
npm run generate
git status --short
```
If typecheck or generate fails, do not commit. Run `git checkout -- package.json package-lock.json`
and `npm install`, then report the error.

Then a short browser check of the built site (dark theme, 1360 wide):
1. Home, Learn and one project page load, and their icons show.
2. Week 0 lesson 01: Run and Check answer pass. No console errors on a fresh load.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/package.json cs50p-tutor/package-lock.json cs50p-tutor/specs
git commit -m "Update nuxt 4.6.3, vue-tsc 3.3.14, @lucide/vue 1.66.0"
```

## Acceptance gates
1. `grep -cF "\"nuxt\": \"^4.6.3\"" package.json` prints `1`
2. `grep -cF "\"vue-tsc\": \"^3.3.14\"" package.json` prints `1`
3. `grep -cF "\"@lucide/vue\": \"^1.66.0\"" package.json` prints `1`
4. `grep -cF "\"pyodide\": \"^0.29.5\"" package.json` prints `1`
5. Run by hand: `npm outdated` lists only pyodide and typescript. All three check scripts print
   their ok lines, and typecheck and generate exit 0.
6. Run by hand: browser steps 1 and 2 pass, and `git status --short` shows no tracked changes
   after the commit.
