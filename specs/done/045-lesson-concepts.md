# 045: Lessons carry their concepts and exercise ids; useConcepts (task B7, and course data for B2 to B6)
Files: content/week0-functions/01-hello.md, app/composables/useCourse.ts
Severity: med

## Problem
Mastery (spec 046) works out which exercises belong to a concept from each lesson's
`concepts` list and its exercise ids. `useCourse()` does not return either one yet, and
the hello lesson has no `concepts`. The pages also need the concept list from shell step 050 and spec 051.

The exercise ids come from each lesson body through `exerciseIds()`. The body itself is
not returned, so it does not go into the page payload.

Do this spec after shell step 050 and spec 051.

## Required change
1. In `content/week0-functions/01-hello.md`, replace this text (in the frontmatter):
```yaml
minutes: 5
---
```
   with:
```yaml
minutes: 5
concepts: [print, strings]
---
```

2. **Replace the whole of `app/composables/useCourse.ts`** with exactly this content.
   Delete everything in the file first. Do not add any import lines: `useAsyncData`,
   `queryCollection`, `computed` and `exerciseIds` are auto-imported by Nuxt.
```ts
export interface CourseLesson {
  path: string
  title: string
  week: number
  order: number
  minutes?: number
  concepts: string[] // concept ids from the lesson frontmatter
  exercises: string[] // ::exercise ids, in page order
}

export interface CourseWeek {
  week: number
  title: string
  summary: string
  lessons: CourseLesson[]
}

// The course outline: every week from content/weeks.yml with its lessons in order.
export async function useCourse() {
  const { data } = await useAsyncData('course', async (): Promise<CourseWeek[]> => {
    const [outline, lessons] = await Promise.all([
      queryCollection('weeks').first(),
      queryCollection('lessons')
        .select('path', 'title', 'week', 'order', 'minutes', 'concepts', 'body')
        .order('week', 'ASC')
        .order('order', 'ASC')
        .all(),
    ])
    // The body is read only for its exercise ids, so it stays out of the page payload.
    const all = lessons.map(({ body, concepts, ...lesson }) => ({
      ...lesson,
      concepts: concepts ?? [],
      exercises: exerciseIds(body),
    }))
    return (outline?.weeks ?? []).map((w) => ({ ...w, lessons: all.filter((l) => l.week === w.week) }))
  })
  return computed(() => data.value ?? [])
}

// Every concept from content/concepts.yml, in file order.
export async function useConcepts() {
  const { data } = await useAsyncData('concepts', async () => (await queryCollection('concepts').first())?.concepts ?? [])
  return computed(() => data.value ?? [])
}
```

## Acceptance gates
- `grep -n "^concepts: \[print, strings\]$" content/week0-functions/01-hello.md` prints one line.
- `grep -n "^import" app/composables/useCourse.ts` prints nothing.
- `grep -n "export async function useCourse\|export async function useConcepts\|exercises: exerciseIds(body)" app/composables/useCourse.ts`
  prints three lines.
- `npm run generate` exits 0. The built Learn page still contains `Week 0: Functions and variables`,
  and `.output/public/index.html` still contains `Start with Hello, world`.
- `grep -c '"body"' .output/public/index.html` prints `0` (the lesson body is not in the
  Today page payload).
