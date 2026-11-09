# 140: Check the progress track and commit
Files: none (shell and browser work only)
Severity: low

## Problem
Spec 139 tints the unfilled progress track. Check it in both themes, then commit. Run this only
after 139 is in specs/done.

## Required change
Run these with no aider job running:
```sh
cd ~/Desktop/AiderThings/cs50p-tutor
npx nuxi typecheck
npm run generate
git status --short
```
Then serve the built site. Every lesson is complete, so to see a part-full bar, open DevTools and
set one `progress` element's value lower (for example 3 of 7), or use the mastery list if a group
is not fully mastered. Check at 1360 wide:
1. Light theme (force it the same way as in 137): the unfilled part of the bar shows as a faint
   grey track on both the page background and a white card. Report the track colour you measure.
2. Dark theme: the same, a faint track that is visible on the background and on a card.
3. The blue fill is unchanged in both themes. No console errors.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/app/assets/css/main.css cs50p-tutor/specs
git commit -m "Progress bars: show the unfilled track in both themes"
```

## Acceptance gates
1. Run by hand: typecheck and generate both exit 0.
2. Run by hand: browser steps 1 to 3 pass, with the step 1 colour reported.
3. Run by hand: `git status --short` shows no tracked changes after the commit.
