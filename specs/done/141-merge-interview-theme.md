# 141: Merge the Interview section and theme toggle, check, commit
Files: none (shell and browser work only)
Severity: medium

## Problem
The Haiku agent built Phase 2 P1 (theme toggle) and P2 (Interview section) on branch
`worktree-agent-af0c8b9dfab6ce9e7`, in five commits, all reviewed by the PE: 9917d61, c57094b, 22ca66a (per-tier test minimums,
`wrong:` solutions, samples renumbered to 057-two-sum and 012-valid-parentheses), e9ae8ec
(random-input checks against the reference, mutation testing) and 4187b33 (step limit on
mutant runs, random check names the input that raised).
`git merge-tree` shows the branch merges into main with no conflicts. The Phase 2 section of
plan.md is still uncommitted on main.

## Required change
Run these with no aider job running:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/plan.md
git commit -m "Plan: Phase 2, theme toggle and Interview track"
git merge --no-ff worktree-agent-af0c8b9dfab6ce9e7 -m "Merge Interview section and theme toggle (Phase 2 P1+P2)"
cd cs50p-tutor
npx nuxi typecheck
npm run generate
node scripts/check-lessons.ts
node scripts/check-interview.ts
ls .output/public/learn | grep -ci interview
git status --short
```
Then serve the built site and check it in the browser:
1. Theme toggle, at 1360 and 406 wide. It shows top right on every page. Light and Dark change
   the page at once, including over the OS setting. Each choice survives a reload with no flash
   of the other theme. System follows the OS again. Keyboard: Tab reaches each segment, focus is
   visible, and aria-pressed is true only on the selected one. In the code workbench, the editor
   stays dark in both themes.
2. /interview: Easy shows 2 problems, numbered 12 and 57, and "0 solved" (or the true count). Medium and Hard show the
   empty state, and `?tier=medium` survives a reload. Each row shows its number, title, topic,
   companies and status. There is no sideways scroll at 406.
3. /interview/easy/057-two-sum: the back link, the tier, topic and status chips, the companies, a
   "LeetCode #1" link that opens in a new tab, and four lesson links by title (one is
   "Dictionaries"), never a bare path. Solve the exercise: it passes, the chip turns Completed, and the list
   page then counts it as solved after a reload. At 1360 wide the workbench splits beside the
   text. Previous and Next go between 012 and 057.
   In View Source, the page HTML contains none of the `wrong:` solution code.
   Do this before the correct solve above: submit this wrong answer, which passes every fixed test:
   ```python
   def two_sum(nums, target):
       seen = {}
       for i, n in enumerate(nums):
           if n and target - n in seen:
               return [seen[target - n], i]
           seen[n] = i
   ```
   Check: Tests 1 to 7 pass, the row "200 random inputs" fails, and its message reads
   `two_sum([...], ...) should return [...], but returned None` with a real input shown.
   The chip does not show Completed.
4. /learn/week2-loops/04-dictionaries shows "Practice from this lesson" with Two Sum, above the
   pager. Also open it with a trailing slash. /learn/week2-loops/03-lists shows both problems.
   /learn/week2-loops/01-while-loops shows no such block.
5. The phone tab bar at 406 wide fits 6 items (Interview included) with no overflow.
6. No console errors on any page above.

Then delete the merged worktree branch:
```sh
cd ~/Desktop/AiderThings
git worktree remove .claude/worktrees/agent-af0c8b9dfab6ce9e7
git branch -d worktree-agent-af0c8b9dfab6ce9e7
```

## Acceptance gates
1. Run by hand: typecheck and generate both exit 0.
2. Run by hand: check-lessons prints `lessons ok: 49 lessons, 91 exercises`.
3. Run by hand: check-interview prints `012-valid-parentheses: 5 mutants killed`,
   `057-two-sum: 2 mutants killed` and `interview ok: 2 problems`.
4. Run by hand: the `grep -ci interview` line prints `0`.
5. Run by hand: browser steps 1 to 6 pass. Report each one, and any that fail, with what you saw.
6. Run by hand: `git status --short` shows no tracked changes, and `git log --oneline -3` shows
   the merge commit on top.
