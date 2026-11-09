# 038: Redo spec 029, which was committed with empty files (task A9, part 2)
Files: content/weeks.yml, content.config.ts, app/composables/useCourse.ts
Severity: high

## Problem
Commit 9cb2b8f ("Spec 029") moved spec 029 to done, but none of its work is there:
- `content/weeks.yml` is 0 bytes.
- `app/composables/useCourse.ts` is 0 bytes.
- `content.config.ts` has no `weeks` collection (`grep -n weeks content.config.ts` prints nothing).

Specs 030, 031, 032, 034 and 036 all call `useCourse()`, so none of them can work until
this is fixed. Spec 030 is in specs/open now and must wait for this spec.

## Required change
Make exactly the three changes in `specs/done/029-course-outline.md`, section
"Required change", steps 1, 2 and 3:
1. Write the full `content/weeks.yml` shown in step 1 (ten weeks under a `weeks:` key).
2. Add the `weeks` collection to `content.config.ts`, after the `pages` collection, as
   shown in step 2.
3. Write the full `app/composables/useCourse.ts` shown in step 3.

Copy each code block exactly. Do not leave any of the three files empty.

## Acceptance gates
- `wc -c content/weeks.yml app/composables/useCourse.ts` shows more than 0 bytes for both files.
- `grep -c "week: " content/weeks.yml` prints `10`.
- `grep -n "weeks: defineCollection" content.config.ts` prints one line.
- `grep -n "export async function useCourse" app/composables/useCourse.ts` prints one line.
- `npm run generate` exits 0, and its output does not contain `YAML array is not supported`.
- `git show --stat HEAD` for the commit for this spec shows non-zero line counts for all three files.
