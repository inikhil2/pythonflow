# 097: Check and commit the tutor output fix
Files: none (shell and browser work only)
Severity: low

## Problem
Spec 096 changes what the tutor is told about failing output. Check it live once, then commit.

## Required change
Run these steps with no aider job running:
```sh
cd ~/Desktop/AiderThings/cs50p-tutor
node scripts/check-tutor-prompt.ts
npx nuxi typecheck
npm run generate
```
Then, in the browser with llama-server running: on the 01 exercise, Check `print("hello")`,
then press Ask three times with an empty question. Quote all three replies.

Then commit:
```sh
cd ~/Desktop/AiderThings
git add cs50p-tutor/app/utils/tutorPrompt.ts cs50p-tutor/scripts/check-tutor-prompt.ts cs50p-tutor/specs
git commit -m "Tutor: send output without its trailing newline"
```

## Acceptance gates
1. The commands print `tutor prompt ok`, and typecheck and generate both exit 0.
2. No reply blames a newline or line break, and no reply contains a fixed line of code.
   At least two of the three replies name the missing comma or the missing word world.
3. `git status --short` shows no tracked changes after the commit.
