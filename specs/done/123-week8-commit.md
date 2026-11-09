# 123: Check and commit week 8
Files: none (shell and browser work only)
Severity: med

## Problem
Specs 121 and 122 add the six week 8 lessons on object-oriented programming. Check them, in the
browser too, then commit.

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
1. Learn shows week 8, Object-oriented programming, with lessons 01 to 06 in order, below week 7.
2. Next on week 7 lesson 04 goes to week 8 lesson 01, and Next runs through to 06.
3. No raw `::` text shows on any week 8 lesson.
4. Dunder names show with both underscores in prose and code: 01 shows `__init__`, 02 shows
   `__str__`, and 06 shows `__add__` and `__eq__`. None render as bold text.
5. On 03, `@property` and `@celsius.setter` show in the trace code.
6. All eleven new solutions pass Check answer, and Progress records them under week 8.
7. On 02, Step through the first trace. The variables show `counter`, and `count` reaches 2.
8. On 05, Check answer with the starter of the first exercise. Quote the failure the panel shows.
9. On 04, Check the first exercise's solution twice in a row. Both runs pass.
10. Week 0 lesson 01 and week 7 lesson 04 still check as before. Report any console errors, and
    confirm there is no sideways scroll.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/content/week8-objects cs50p-tutor/specs
git commit -m "Week 8: classes and objects, methods, properties, class methods, inheritance, operator overloading"
```

## Acceptance gates
1. check-lessons prints `lessons ok: 42 lessons, 77 exercises`, check-projects and
   check-tutor-prompt print their ok lines, and typecheck and generate both exit 0.
2. Browser steps 1 to 10 pass, and the failure from step 8 is quoted.
3. `git status --short` shows no tracked changes after the commit.
