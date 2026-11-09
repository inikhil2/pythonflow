# 001: Move T2 files out of the nested cs50p-tutor/cs50p-tutor/ folder
Files: docs/lesson-format.md, content/week0-functions/01-hello.md, app/components/content/Exercise.vue
Severity: high

## Problem
The T2 agent wrote its files into a nested folder `cs50p-tutor/cs50p-tutor/`
instead of the project root. The real files at the project root are empty
(0 bytes):
- `docs/lesson-format.md` is empty; content is in `cs50p-tutor/docs/lesson-format.md`
- `content/week0-functions/01-hello.md` is empty; content is in `cs50p-tutor/content/week0-functions/01-hello.md`
- `app/components/content/Exercise.vue` is empty; content is in `cs50p-tutor/app/components/content/Exercise.vue`

Nuxt only reads the root paths, so the sample lesson and exercise box never render.

## Required change
Run these commands from the project root (`~/Desktop/AiderThings/cs50p-tutor`):
1. `mv cs50p-tutor/docs/lesson-format.md docs/lesson-format.md`
2. `mv cs50p-tutor/content/week0-functions/01-hello.md content/week0-functions/01-hello.md`
3. `mv cs50p-tutor/app/components/content/Exercise.vue app/components/content/Exercise.vue`
4. `rm -r cs50p-tutor` (the nested folder, now empty of files)
Do not change the content of any moved file.

## Acceptance gates
- `test -d cs50p-tutor; echo $?` prints `1`
- `wc -c docs/lesson-format.md content/week0-functions/01-hello.md app/components/content/Exercise.vue` shows a non-zero size for every file
- `head -1 docs/lesson-format.md` prints `# Lesson Format`
