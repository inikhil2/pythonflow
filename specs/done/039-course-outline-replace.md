# 039: Replace the course outline files with the spec code (task A9, part 2, third try)
Files: app/composables/useCourse.ts, content/weeks.yml, content.config.ts
Severity: high

## Problem
Spec 038 landed with code that does not match spec 029:
- `app/composables/useCourse.ts` imports `useContent` from `#content/server`, which does
  not exist. `npm run generate` fails with "Missing #content/server specifier" as soon
  as a page calls `useCourse()`.
- `content/weeks.yml` gives each week a `name` and no `title` or `summary`.
- The `weeks` schema in `content.config.ts` has `name` and no `title` or `summary`.

The Learn page (spec 030) and later specs read `w.title`, `w.summary` and `w.lessons`,
and they need `useCourse()` to return a computed list of weeks.

Do not write your own version of any of these files. Copy the code blocks below
character for character.

## Required change
1. **Replace the whole of `app/composables/useCourse.ts`** with exactly this content.
   Delete everything in the file first. There is no import line: `useAsyncData`,
   `queryCollection` and `computed` are auto-imported by Nuxt.
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

2. **Replace the whole of `content/weeks.yml`** with exactly this content.
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

3. In `content.config.ts`, replace this text:
```ts
    weeks: defineCollection({
      type: 'data',
      source: { id: 'weeks.yml', include: 'weeks.yml' },
      schema: z.object({
        weeks: z.array(z.object({
          week: z.number(),
          name: z.string(),
        })),
      }),
    }),
```
   with:
```ts
    weeks: defineCollection({
      type: 'data',
      source: 'weeks.yml',
      schema: z.object({
        weeks: z.array(z.object({ week: z.number(), title: z.string(), summary: z.string() })),
      }),
    }),
```
   Change nothing else in `content.config.ts`.

## Acceptance gates
- `grep -rn "#content/server\|useContent\|name:" app/composables/useCourse.ts content/weeks.yml content.config.ts`
  prints nothing.
- `grep -c "title: " content/weeks.yml` prints `10`, and `grep -c "summary: " content/weeks.yml` prints `10`.
- `grep -n "export async function useCourse\|return computed" app/composables/useCourse.ts` prints two lines.
- With the spec 030 page in place, `npm run generate` exits 0, its output does not contain
  `YAML array is not supported`, and `grep -c "Week 0: Functions and variables" .output/public/learn/index.html`
  prints `1` or more.
