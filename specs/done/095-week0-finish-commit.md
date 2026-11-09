# 095: Check and commit the tutor hint fix and the last week 0 lessons
Files: none (shell and browser work only)
Severity: med

## Problem
Specs 092, 093 and 094 change the tutor prompt and add lessons 06, 07 and 08. Before the
commit, check them together, in the browser as well, the same way as 089.

## Required change
Run these steps in order, with no aider job running:
```sh
cd ~/Desktop/AiderThings/cs50p-tutor
node scripts/check-tutor-prompt.ts
node scripts/check-lessons.ts
node scripts/check-projects.ts
npx nuxi typecheck
npm run generate
git status --short
```
Then check the built site in the browser, using dark theme at 1360 and 406 wide:
1. Learn shows week 0 lessons 01 to 08 in order, and Prev and Next go from 05 through 08.
2. No raw `::` text shows on lessons 06, 07 or 08.
3. All six new solutions pass Check answer, and Progress records them.
4. On 07, Step goes into `hello` and back out on each call. On 08, the trace shows `area`
   holding 16.
5. With llama-server running, go to the 01 exercise and Check `print("hello")`. Then press
   Ask three times with an empty question. No reply may contain the line `print("hello, world")`
   or any other complete line of fixed code.
6. No console errors, and no sideways scroll.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/app/utils/tutorPrompt.ts cs50p-tutor/scripts/check-tutor-prompt.ts cs50p-tutor/content/week0-functions cs50p-tutor/specs
git commit -m "Week 0: numbers, functions and return values lessons, and a hint-only tutor"
```

## Acceptance gates
1. The command output is:
   - `tutor prompt ok`
   - `lessons ok: 8 lessons, 15 exercises`
   - `projects ok: 5 projects, 22 milestones`
   - typecheck exits 0
   - generate exits 0
2. Browser steps 1 to 6 pass. Step 5 is reported with all three replies quoted.
3. `git status --short` shows no tracked changes after the commit.
