# 109: Check and commit week 4
Files: none (shell and browser work only)
Severity: med

## Problem
Spec 106 makes Run and Check treat code as the main script. Specs 107 and 108 add the five
week 4 lessons. Check them together, in the browser too, then commit.

## Required change
Run these steps in order, with no aider job running:
```sh
cd ~/Desktop/AiderThings/cs50p-tutor
node scripts/check-lessons.ts
node scripts/check-tutor-prompt.ts
npx nuxi typecheck
npm run generate
git status --short
```
Then check the built site in the browser, using dark theme at 1360 and 406 wide:
1. Learn shows week 4, Libraries, with lessons 01 to 05 in order, below week 3.
2. Next on week 3 lesson 03 goes to week 4 lesson 01, and Prev and Next run through 05.
3. No raw `::` text shows on any week 4 lesson.
4. All ten new solutions pass Check answer, and Progress records them under week 4.
5. On 05, paste the exercise solution into the editor and use Run with `10` as input. It
   prints `6.2`. Then, in the Playground, Run `print(__name__)`. It prints `__main__`.
6. On 03 exercise 2, put `import sys` and `sys.exit("Usage: python hi.py NAME")` in the
   editor, then Run. Quote what the output shows. Lesson 03 says it appears as
   `SystemExit:` followed by the message. Then Run the lesson's solution, to show the runner
   still works. Report any console errors from this step separately.
7. On 02, Run the first code example three times. The numbers can differ, and nothing errors.
8. No other console errors, and no sideways scroll.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/public/pyodide-worker.js cs50p-tutor/scripts/pyRunner.ts cs50p-tutor/content/week4-libraries cs50p-tutor/specs
git commit -m "Week 4: modules, random, command-line arguments, packages and APIs, your own modules; run code as __main__"
```

## Acceptance gates
1. check-lessons prints `lessons ok: 24 lessons, 46 exercises`, check-tutor-prompt prints
   `tutor prompt ok`, and typecheck and generate both exit 0.
2. Browser steps 1 to 8 pass, and the step 6 output is quoted.
3. `git status --short` shows no tracked changes after the commit.
