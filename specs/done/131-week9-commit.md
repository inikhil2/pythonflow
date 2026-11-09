# 131: Check and commit week 9
Files: none (shell and browser work only)
Severity: med

## Problem
Specs 128, 129 and 130 add the seven week 9 lessons, Et cetera, which end the course. Check them,
in the browser too, then commit. Step 10 also probes how the app handles a learner's own
`sys.exit`, which the content checker cannot test.

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
1. Learn shows week 9, Et cetera, with lessons 01 to 07 in order, below week 8.
2. Next on week 8 lesson 06 goes to week 9 lesson 01, and Next runs through to 07.
3. No raw `::` text shows on any week 9 lesson.
4. Dunder names show with both underscores: 03 shows `__doc__` and `__annotations__`, and none
   render as bold text. On 05, `*args` and `**kwargs` show as code, not as italic or bold text.
5. All fourteen new solutions pass Check answer, and Progress records them under week 9.
6. On 02, Step through the trace. The variables show `count`, and it reaches 2.
7. On 07, Step through the trace. The current line goes back into `countdown` after each
   `print(number)`, and `n` counts down from 3.
8. On 04, Check answer with the starter of the second exercise. The panel shows the message
   `parse stopped with an error, because it has no --loud option`. Quote what it shows. Then
   Check the solution of that exercise, and it passes.
9. On 01, Check answer with the starter of the first exercise. Quote the failure the panel shows.
10. On week 4 lesson 03, replace the editor code with these two lines and press Run:
    ```python
    import sys
    sys.exit("bye")
    ```
    Quote what the output panel shows. Then replace the code with `print("hi")` and press Run.
    Report whether `hi` prints, or whether the page hangs or needs a reload. Restore the starter.
11. Week 0 lesson 01 and week 8 lesson 06 still check as before. Report any console errors, and
    confirm there is no sideways scroll.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/content/week9-etcetera cs50p-tutor/specs
git commit -m "Week 9: sets, global variables and constants, type hints and docstrings, argparse, unpacking, comprehensions, generators"
```

## Acceptance gates
1. check-lessons prints `lessons ok: 49 lessons, 91 exercises`, check-projects and
   check-tutor-prompt print their ok lines, and typecheck and generate both exit 0.
2. Browser steps 1 to 9 and 11 pass, and the outputs from steps 8 and 9 are quoted.
3. Step 10's output and the result of the `print("hi")` run are reported, whatever they are.
4. `git status --short` shows no tracked changes after the commit.
