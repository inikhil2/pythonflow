# 134: Check and commit the trace's global variables
Files: none (shell and browser work only)
Severity: med

## Problem
Specs 132 and 133 make the trace show the main program's variables in a "Global variables" box
while the trace is inside a function. Spec 135 removes dead code that 132 left behind. Run this
only after 133 and 135 are done. Check them, in the browser too, then commit.

The gate commands of spec 132 imported `public/trace.py` without `-B`, so Python wrote
`public/__pycache__/trace.cpython-314.pyc`. Everything in `public/` is copied into the built site,
so delete that folder before generating.

## Required change
Run these steps in order, with no aider job running:
```sh
cd ~/Desktop/AiderThings/cs50p-tutor
rm -r public/__pycache__
node scripts/check-lessons.ts
npx nuxi typecheck
npm run generate
git status --short
```
Then check the built site in the browser, using dark theme at 1360 and 406 wide. Do a fresh page
load for each lesson.
1. On week 9 lesson 02, Step through the trace. On the main program's lines there is one box,
   titled Variables, and no Global variables box.
2. Still on 9-02, step into `add`. The Variables box says "No variables yet.", and a second box
   titled Global variables shows `count`. After the first `add()` returns, `count` is 1; after the
   second, 2. Report the value the Global variables box shows on each step inside `add`.
3. On week 3 lesson 01 (or any lesson whose trace calls a function with a parameter), step into the
   function. The parameter shows in Variables, and the main program's variables show in Global
   variables. Name the lesson you used.
4. On week 8 lesson 01, Step through the trace into `__init__`. Global variables shows the class
   name, and it does not show any functions or modules.
5. At 406 wide, the two boxes stack with no sideways scroll, inside the trace panel as well as on
   the page.
6. Week 0 lesson 01 and week 9 lesson 07 still trace and check as before. Report any console errors
   from fresh page loads.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/public/trace.py cs50p-tutor/app/composables/usePython.ts cs50p-tutor/app/components/VariableBoxes.vue cs50p-tutor/app/components/content/Trace.vue cs50p-tutor/specs
git commit -m "Trace: show the main program's variables while inside a function"
```

## Acceptance gates
1. check-lessons prints `lessons ok: 49 lessons, 91 exercises`, and typecheck and generate both
   exit 0.
2. Browser steps 1 to 6 pass, and the values from step 2 and the lesson from step 3 are reported.
3. `git status --short` shows no tracked changes after the commit, and no `public/__pycache__`.
4. `ls .output/public/__pycache__` reports that there is no such file or directory.
