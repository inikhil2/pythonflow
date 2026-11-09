# 105: Check and commit week 3
Files: none (shell and browser work only)
Severity: med

## Problem
Spec 104 adds the three week 3 lessons. Check them, in the browser too, then commit.

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
1. Learn shows week 3, Exceptions, with lessons 01 to 03 in order, below week 2.
2. Next on week 2 lesson 04 goes to week 3 lesson 01, and Prev and Next run through 03.
3. No raw `::` text shows on any week 3 lesson.
4. All six new solutions pass Check answer, and Progress records them under week 3.
5. On 01, Step through the trace jumps from the `int(text)` line straight to the
   `except ValueError` body, skipping the f-string `print`, and then prints `Bye`.
6. On 03 exercise 1, press Check answer on the starter as it is. The failed check names
   `make_score(101) should raise ValueError`. Quote what the results show, so we know a
   learner can read why a check case failed.
7. No console errors, and no sideways scroll.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/content/week3-exceptions cs50p-tutor/specs
git commit -m "Week 3: try and except, else and asking again, raising exceptions lessons"
```

## Acceptance gates
1. check-lessons prints `lessons ok: 19 lessons, 37 exercises`, and typecheck and generate
   both exit 0.
2. Browser steps 1 to 7 pass, and the step 6 result is quoted.
3. `git status --short` shows no tracked changes after the commit.
