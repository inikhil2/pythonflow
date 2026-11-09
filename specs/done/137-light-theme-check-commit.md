# 137: Check the light theme in the browser and commit
Files: none (shell and browser work only)
Severity: med

## Problem
The light theme, `prefers-contrast: more` and `prefers-reduced-transparency: reduce` have never
been checked in a browser (specs/backlog/light-theme.md). Spec 136 darkens the light success and
warning colours. Check everything with emulated preferences, then commit. Run this only after 136
is in specs/done.

## Required change
Run these with no aider job running:
```sh
cd ~/Desktop/AiderThings/cs50p-tutor
node scripts/check-lessons.ts
npx nuxi typecheck
npm run generate
git status --short
```
Then serve the built site. In Chrome DevTools > Rendering, set "Emulate CSS media feature
prefers-color-scheme" to light. The page has no in-page theme switch. Check at 1360 and 406 wide:
1. Home and Learn: the page is light, cards are white on the pale background, and card shadows show.
2. Progress bars (lesson header, Continue card): the blue fill is clearly visible. Report whether
   the unfilled track can be seen at all.
3. Chips on Learn and Projects: Not started, In progress and Completed read clearly. If any page
   shows Needs revision, check that one too, and otherwise say none was shown.
4. A lesson with an exercise (week 0 lesson 01): the workbench stays dark, with no light boxes or
   light text inside it. Run, Check answer and Step through all work. Pass and fail lines in the
   results read clearly on the light page.
5. Trace on 9-02 inside `add`: the Variables and Global variables boxes and the call stack stay
   dark and readable.
6. Keyboard focus: Tab through the lesson page. The focus ring shows on the light page and inside
   the workbench.
7. Still in light, set prefers-contrast to more: cards gain a visible border and nothing loses its
   text. Then set it back.
8. Set prefers-reduced-transparency to reduce: at 406 wide, the sidebar background is solid, with
   no see-through content behind it. Then set it back.
9. Set prefers-color-scheme to dark: one page looks as before (no regression). No console errors
   on a fresh load in either theme.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/app/assets/css/main.css cs50p-tutor/DESIGN.md cs50p-tutor/specs
git commit -m "Light theme: darker success and warning so status chips are readable"
```

## Acceptance gates
1. Run by hand: check-lessons prints `lessons ok: 49 lessons, 91 exercises`, and typecheck and
   generate both exit 0.
2. Run by hand: browser steps 1 to 9 pass, with the step 2 and step 3 answers reported.
3. Run by hand: `git status --short` shows no tracked changes after the commit.
