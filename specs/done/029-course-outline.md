# 029: Week titles data and the course outline composable (task A9, part 2)
Files: content/weeks.yml, content.config.ts, app/composables/useCourse.ts
Severity: med

## Problem
Week titles ("Functions and variables") are not stored anywhere, so the Learn page can
only say "Week 0". The Learn page, the lesson header and the Today page each need the
same outline: every week with its title, summary and lessons in order. Today the Learn
page builds a partial outline itself in a `computed`.

The proposal data model is `content/weeks.yml` holding `[{ week, title, summary }]`.
Nuxt Content does not support a YAML file whose top level is a list: it prints
"YAML array is not supported" and moves the list into a `body` key. So the list goes
under a `weeks:` key instead.

Do this spec after 028.

## Required change
1. Create `content/weeks.yml` with exactly this content.
```yaml
# The ten CS50P weeks. Lessons live in content/week<N>-<topic>/ folders.
weeks:
  - week: 0
    title: Functions and variables
    summary: Write your first programs, store values in variables, and make your own functions.
  - week: 1
    title: Conditionals
    summary: Make decisions with if, elif and else, and compare values.
  - week: 2
    title: Loops
    summary: Repeat work with while and for, and walk through lists and dictionaries.
  - week: 3
    title: Exceptions
    summary: Handle errors such as ValueError with try and except, so programs keep going.
  - week: 4
    title: Libraries
    summary: Use modules from the standard library and from other people.
  - week: 5
    title: Unit tests
    summary: Check your own code with assert and pytest.
  - week: 6
    title: File I/O
    summary: Read and write files, including CSV files.
  - week: 7
    title: Regular expressions
    summary: Match, check and clean up text with patterns.
  - week: 8
    title: Object-oriented programming
    summary: Make your own types with classes, methods and properties.
  - week: 9
    title: Et cetera
    summary: Sets, type hints, docstrings and other tools worth knowing.
```

2. In `content.config.ts`, replace this text:
```ts
    pages: defineCollection({
      type: 'page',
      source: '*.md',
    }),
```
   with:
```ts
    pages: defineCollection({
      type: 'page',
      source: '*.md',
    }),
    weeks: defineCollection({
      type: 'data',
      source: 'weeks.yml',
      schema: z.object({
        weeks: z.array(z.object({ week: z.number(), title: z.string(), summary: z.string() })),
      }),
    }),
```

3. Create `app/composables/useCourse.ts` with exactly this content.
```ts
export interface CourseLesson {
  path: string
  title: string
  week: number
  order: number
  minutes?: number
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
        .select('path', 'title', 'week', 'order', 'minutes')
        .order('week', 'ASC')
        .order('order', 'ASC')
        .all(),
    ])
    return (outline?.weeks ?? []).map((w) => ({ ...w, lessons: lessons.filter((l) => l.week === w.week) }))
  })
  return computed(() => data.value ?? [])
}
```
   Callers write `const weeks = await useCourse()` in `<script setup>`. The fixed key
   `'course'` means every page shares one fetch.

## Acceptance gates
- `npm run generate` exits 0, and its output does not contain `YAML array is not supported`.
- `grep -c "week: " content/weeks.yml` prints `10`.
- `grep -n "weeks: defineCollection" content.config.ts` prints one line.
- `grep -nE ': any\b|<any>|as any' app/composables/useCourse.ts` prints nothing.
