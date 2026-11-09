# 120: Check and commit week 7
Files: none (shell and browser work only)
Severity: med

## Problem
Specs 118 and 119 add the four week 7 lessons on regular expressions. Check them, in the browser
too, then commit.

## Required change
Run these steps in order, with no aider job running:
```sh
cd ~/Desktop/AiderThings/cs50p-tutor
node scripts/check-lessons.ts
node scripts/check-projects.ts
node scripts/check-tutor-prompt.ts
npx nuxi typecheck
npm run generate
git status --short
```
Then check the built site in the browser, using dark theme at 1360 and 406 wide:
1. Learn shows week 7, Regular expressions, with lessons 01 to 04 in order, below week 6.
2. Next on week 6 lesson 04 goes to week 7 lesson 01, and Next runs through to 04.
3. No raw `::` text shows on any week 7 lesson.
4. On 01 and 02, the pattern lists show as bullet lists. On 02, the last item reads `cat|dog`
   with no backslash.
5. Backslashes show in code: 01 shows `\d+` and `\d{4}` in its hints, and 04 shows `r"\3/\2/\1"`.
6. All eight new solutions pass Check answer, and Progress records them under week 7.
7. On 03, Step through the trace. The variables show `match`, then `low` as 10 and `high` as 25.
8. On 02, Check answer with the starter of the second exercise. Quote the failure the panel shows.
9. Week 0 lesson 01 and week 6 lesson 04 still check as before.
10. Report any console errors, and confirm there is no sideways scroll.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/content/week7-regex cs50p-tutor/specs
git commit -m "Week 7: searching with patterns, validating formats, capturing groups, replacing with patterns"
```

## Acceptance gates
1. check-lessons prints `lessons ok: 36 lessons, 66 exercises`, check-projects and
   check-tutor-prompt print their ok lines, and typecheck and generate both exit 0.
2. Browser steps 1 to 10 pass, and the failure from step 8 is quoted.
3. `git status --short` shows no tracked changes after the commit.
