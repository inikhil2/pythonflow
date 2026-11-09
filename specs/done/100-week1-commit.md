# 100: Check and commit week 1
Files: none (shell and browser work only)
Severity: med

## Problem
Specs 098 and 099 add the four week 1 lessons. Check them together, in the browser too,
then commit. Run this after 097 is committed.

## Required change
Run these steps in order, with no aider job running:
```sh
cd ~/Desktop/AiderThings/cs50p-tutor
node scripts/check-lessons.ts
npx nuxi typecheck
npm run generate
git status --short
```
Then check the built site in the browser, using dark theme at 1360 and 406 wide:
1. Learn shows week 1, Conditionals, with lessons 01 to 04 in order, below week 0.
2. Prev and Next go from week 0 lesson 08 into week 1 lesson 01, and on through 04. If 08
   has no Next into week 1, report it, but don't fix it here.
3. No raw `::` text shows on any week 1 lesson.
4. All eight new solutions pass Check answer, and Progress records them under week 1.
5. On 02, Step through the trace shows the `if` line, then the `elif` line, then
   `print("medium")`, and the `else` body never runs.
6. No console errors, and no sideways scroll.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/content/week1-conditionals cs50p-tutor/specs
git commit -m "Week 1: comparisons, if, elif and else, boolean logic and match lessons"
```

## Acceptance gates
1. check-lessons prints `lessons ok: 12 lessons, 23 exercises`, and typecheck and generate
   both exit 0.
2. Browser steps 1 to 6 pass, or a failure in step 2 is reported.
3. `git status --short` shows no tracked changes after the commit.
