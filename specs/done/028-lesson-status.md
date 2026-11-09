# 028: Lesson and week status, and the status chip (task A9, part 1)
Files: app/utils/lessonStatus.ts, scripts/check-lesson-status.ts, app/components/StatusChip.vue
Severity: med

## Problem
The Learn page, the lesson header and the Today page all need the same answers from
stored progress: is a lesson not started, in progress or completed; what is a week's
status; how many lessons in a week are completed; and which lesson to continue. None of
this exists yet. Proposal ruling 7 sets the states: Not started, In progress, Completed.
There are no locks.

Do this spec first. Specs 030 to 036 use these functions and this component.

## Required change
1. Create `app/utils/lessonStatus.ts` with exactly this content. Node runs this file
   directly (the `import type` line is removed when it runs), so use only plain type
   annotations.
```ts
import type { Progress } from '~/utils/progress'

export type Status = 'not-started' | 'in-progress' | 'completed'

// Only the lessons map is read, so readonly progress from useProgress() fits.
type Lessons = Pick<Progress, 'lessons'>

// Opening a lesson starts it; passing every exercise completes it.
export function lessonStatus(p: Lessons, path: string): Status {
  const lesson = p.lessons[path]
  if (lesson?.completedAt) return 'completed'
  return lesson ? 'in-progress' : 'not-started'
}

// A week is completed when every lesson is, and in progress once any lesson is opened.
export function weekStatus(p: Lessons, paths: string[]): Status {
  const statuses = paths.map((path) => lessonStatus(p, path))
  if (statuses.length > 0 && statuses.every((s) => s === 'completed')) return 'completed'
  return statuses.some((s) => s !== 'not-started') ? 'in-progress' : 'not-started'
}

export function completedCount(p: Lessons, paths: string[]): number {
  return paths.filter((path) => lessonStatus(p, path) === 'completed').length
}

// The most recently opened unfinished lesson (resume), else the first unfinished one in course order.
export function nextLesson(p: Lessons, paths: string[]): { path: string; resume: boolean } | null {
  let resume: string | null = null
  let resumeAt = ''
  for (const path of paths) {
    const lesson = p.lessons[path]
    if (lesson && !lesson.completedAt && lesson.openedAt > resumeAt) {
      resume = path
      resumeAt = lesson.openedAt
    }
  }
  if (resume) return { path: resume, resume: true }
  const first = paths.find((path) => lessonStatus(p, path) !== 'completed')
  return first ? { path: first, resume: false } : null
}
```

2. Create `scripts/check-lesson-status.ts` with exactly this content.
```ts
import assert from 'node:assert/strict'
import { completedCount, lessonStatus, nextLesson, weekStatus } from '../app/utils/lessonStatus.ts'

type Lessons = Record<string, { openedAt: string; completedAt?: string }>
const p = (lessons: Lessons) => ({ lessons })

const A = '/learn/week0-functions/01-hello'
const B = '/learn/week0-functions/02-variables'
const C = '/learn/week1-conditionals/01-if'
const T1 = '2026-10-01T10:00:00.000Z'
const T2 = '2026-10-02T10:00:00.000Z'
const T3 = '2026-10-03T10:00:00.000Z'
const done = { openedAt: T1, completedAt: T2 }

assert.equal(lessonStatus(p({}), A), 'not-started')
assert.equal(lessonStatus(p({ [A]: { openedAt: T1 } }), A), 'in-progress')
assert.equal(lessonStatus(p({ [A]: done }), A), 'completed')

assert.equal(weekStatus(p({}), [A, B]), 'not-started')
assert.equal(weekStatus(p({ [B]: { openedAt: T1 } }), [A, B]), 'in-progress')
assert.equal(weekStatus(p({ [A]: done }), [A, B]), 'in-progress')
assert.equal(weekStatus(p({ [A]: done, [B]: done }), [A, B]), 'completed')
assert.equal(weekStatus(p({ [A]: done }), []), 'not-started')

assert.equal(completedCount(p({ [A]: done, [B]: { openedAt: T1 } }), [A, B]), 1)
assert.equal(completedCount(p({ [C]: done }), [A, B]), 0)

// Fresh storage: start at the first lesson.
assert.deepEqual(nextLesson(p({}), [A, B, C]), { path: A, resume: false })
// The most recently opened unfinished lesson wins.
assert.deepEqual(nextLesson(p({ [A]: { openedAt: T1 }, [B]: { openedAt: T3 } }), [A, B, C]), { path: B, resume: true })
// A completed lesson is never resumed, even when opened last.
assert.deepEqual(nextLesson(p({ [A]: { openedAt: T3, completedAt: T3 }, [B]: { openedAt: T1 } }), [A, B, C]), { path: B, resume: true })
// Nothing in progress: the first unfinished lesson in course order.
assert.deepEqual(nextLesson(p({ [A]: done }), [A, B, C]), { path: B, resume: false })
// A stored path that is no longer in the course is ignored.
assert.deepEqual(nextLesson(p({ '/learn/old': { openedAt: T3 } }), [A, B, C]), { path: A, resume: false })
assert.equal(nextLesson(p({ [A]: done, [B]: done, [C]: done }), [A, B, C]), null)

console.log('lesson status ok')
```

3. Create `app/components/StatusChip.vue` with exactly this content. The icon and the
   word both show the state, so it never relies on colour alone.
```vue
<script setup lang="ts">
import { Circle, CircleCheck, CircleDot } from '@lucide/vue'
import type { Status } from '~/utils/lessonStatus'

const props = defineProps<{ status: Status }>()

const labels: Record<Status, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  completed: 'Completed',
}
const label = computed(() => labels[props.status])
</script>

<template>
  <span class="chip" :class="status">
    <CircleCheck v-if="status === 'completed'" :size="14" aria-hidden="true" />
    <CircleDot v-else-if="status === 'in-progress'" :size="14" aria-hidden="true" />
    <Circle v-else :size="14" aria-hidden="true" />
    {{ label }}
  </span>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
  padding: var(--s1) var(--s2);
  border-radius: var(--r-pill);
  font-size: var(--text-xs);
  font-weight: 600;
  white-space: nowrap;
}

.not-started {
  background: var(--surface-2);
  color: var(--text-2);
}

.in-progress {
  background: var(--accent-soft);
  color: var(--accent-text);
}

.completed {
  background: color-mix(in srgb, var(--success) 14%, transparent);
  color: var(--success);
}
</style>
```

## Acceptance gates
- `node scripts/check-lesson-status.ts` prints `lesson status ok` and exits 0.
- Changing `'in-progress'` to `'not-started'` in the second line of `lessonStatus` makes
  the check fail (try it, then undo it).
- `grep -nE '#[0-9a-fA-F]{3,6}\b|: any\b|<any>|as any' app/components/StatusChip.vue app/utils/lessonStatus.ts`
  prints nothing.
- `npm run generate` exits 0.
