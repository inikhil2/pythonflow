# 103: Check and commit week 2
Files: none (shell and browser work only)
Severity: med

## Problem
Specs 101 and 102 add the four week 2 lessons. Check them together, in the browser too,
then commit.

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
1. Learn shows week 2, Loops, with lessons 01 to 04 in order, below week 1.
2. Next on week 1 lesson 04 goes to week 2 lesson 01, and Prev and Next run through 04.
3. No raw `::` text shows on any week 2 lesson.
4. All eight new solutions pass Check answer, and Progress records them under week 2.
5. On 01, Step through the trace goes back to the `while` line after each `n = n - 1`,
   three times, and then reaches `print("liftoff")`.
6. Lesson 01 says the app stops a program after 10 seconds. Check that claim: in the 01
   exercise 1 editor, type `while True:` and an indented `pass` on the next line, then
   Run. Within about 10 seconds, the output shows a message saying the program ran for more
   than 10 seconds and was stopped. Then press Run again on the lesson's own solution, to
   show that the runner recovered. Quote the message.
7. No console errors, and no sideways scroll.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/content/week2-loops cs50p-tutor/specs
git commit -m "Week 2: while, for and range, lists and dictionaries lessons"
```

## Acceptance gates
1. check-lessons prints `lessons ok: 16 lessons, 31 exercises`, and typecheck and generate
   both exit 0.
2. Browser steps 1 to 7 pass, and the step 6 message is quoted.
3. `git status --short` shows no tracked changes after the commit.
