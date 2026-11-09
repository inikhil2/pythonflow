# 117: Check and commit week 6
Files: none (shell and browser work only)
Severity: med

## Problem
Specs 115 and 116 add the four week 6 lessons on files. Check them, in the browser too, then
commit.

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
1. Learn shows week 6, File I/O, with lessons 01 to 04 in order, below week 5.
2. Next on week 5 lesson 04 goes to week 6 lesson 01, and Next runs through to 04.
3. On week 6 lessons 01 and 02, a Prev link shows at the bottom, before Next. The built HTML
   has one on every lesson after the very first. If the page shows none, say whether that is
   after loading the page directly or after pressing Next.
4. No raw `::` text shows on any week 6 lesson, and the `text` block in 03 shows as plain text.
5. All seven new solutions pass Check answer, and Progress records them under week 6.
6. On 01, Step through the first trace. The variables show `file` while it is open, and the
   output shows `Ada` and `Bo`.
7. In the Playground, Run `open("note.txt", "w").write("hi")`, then Run
   `print(open("note.txt").read())`. The second run prints `hi`, because files stay until reload.
8. On 04, Check answer with the starter. Quote the failure the panel shows.
9. Week 0 lesson 01 and week 5 lesson 03 still check as before.
10. Report any console errors, and confirm there is no sideways scroll.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/content/week6-file-io cs50p-tutor/specs
git commit -m "Week 6: writing files, reading files, CSV files, binary files"
```

## Acceptance gates
1. check-lessons prints `lessons ok: 32 lessons, 58 exercises`, check-projects and
   check-tutor-prompt print their ok lines, and typecheck and generate both exit 0.
2. Browser steps 1 to 10 pass, and the answers to steps 3 and 8 are quoted.
3. `git status --short` shows no tracked changes after the commit.
