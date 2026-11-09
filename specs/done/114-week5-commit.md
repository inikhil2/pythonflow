# 114: Check and commit week 5
Files: none (shell and browser work only)
Severity: med

## Problem
Spec 111 makes Run, Check and Step through load the Pyodide packages that code imports, such as
pytest. Specs 112 and 113 add the four week 5 lessons. Check them together, in the browser too,
then commit.

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
1. Learn shows week 5, Unit tests, with lessons 01 to 04 in order, below week 4.
2. Next on week 4 lesson 05 goes to week 5 lesson 01, and Prev and Next run through 04.
3. No raw `::` text shows on any week 5 lesson, and the `text` block in 02 shows as plain text.
4. All five new solutions pass Check answer, and Progress records them under week 5.
5. Reload, open 03, paste the solution and press Check answer. Report roughly how long this first
   Check takes, since pytest loads then. Check again: it should be quick now.
6. On 03, put the starter back, change `pass` to `make_score(101)`, then Check answer. Quote the
   failure the panel shows.
7. In the Playground, Run `import pytest` and then `print(pytest.__version__)`. It prints
   `8.3.5`. Then Step through the same code: the tracer starts, with no "could not start"
   message.
8. Week 0 lesson 01 still runs and checks as before.
9. Report any console errors. "Loading pytest" and similar lines are normal logs.
10. No sideways scroll.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/public/pyodide-worker.js cs50p-tutor/scripts/pyRunner.ts cs50p-tutor/content/week5-unit-tests cs50p-tutor/specs
git commit -m "Week 5: testing with assert, pytest, testing for exceptions, laying out tests; load imported packages"
```

## Acceptance gates
1. check-lessons prints `lessons ok: 28 lessons, 51 exercises`, check-projects and
   check-tutor-prompt print their ok lines, and typecheck and generate both exit 0.
2. Browser steps 1 to 10 pass, and the times from step 5 and the failure from step 6 are quoted.
3. `git status --short` shows no tracked changes after the commit.
