# 125: Check and commit the trace attribute display
Files: none (shell and browser work only)
Severity: med

## Problem
Spec 124 makes the trace Variables panel show the attributes of objects from the learner's own
classes. Check it, in the browser too, then commit.

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
1. On week 8 lesson 02, Step through the first trace. The `counter` box shows type `Counter`
   and one item, `count = 0`, which becomes `count = 1` and then `count = 2`. The item has no
   index number in front of it.
2. On week 8 lesson 05, Step through the trace. Inside `__init__`, the `self` box gains
   `name = 'Ada'` and then `school = 'Lakeside'`. At the end, `student` shows both.
3. On week 8 lesson 03, Step through the trace. `temperature` shows `_celsius = 25` at the end.
4. A list still shows numbered items, and a dict still shows `key: value` items with no
   numbers. Use any week 2 or week 6 trace that has them, and name the lesson used.
5. On week 6 lesson 01, Step through the trace. The file variable still shows its normal
   repr, not attributes.
6. Report any console errors, and confirm there is no sideways scroll in the Variables panel at
   406 wide.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/public/trace.py cs50p-tutor/app/composables/usePython.ts cs50p-tutor/app/components/VariableBoxes.vue cs50p-tutor/specs
git commit -m "Trace: show the attributes of the learner's objects in Variables"
```

## Acceptance gates
1. check-lessons prints `lessons ok: 42 lessons, 77 exercises`, check-projects and
   check-tutor-prompt print their ok lines, and typecheck and generate both exit 0.
2. Browser steps 1 to 6 pass, and step 4 names the lesson used.
3. `git status --short` shows no tracked changes after the commit.
