# 051: Concepts collection and the lesson format doc (rest of failed spec 044)
Files: content.config.ts, docs/lesson-format.md
Severity: med

## Problem
Spec 044 failed. Shell step 050 now writes `content/concepts.yml`. Nuxt Content still needs a
`concepts` collection for that file and a `concepts` field on lessons. `docs/lesson-format.md`
lacks `minutes`, `concepts`, `hints` and `check` tests.

Do this after shell step 050. It replaces two whole files and touches no others.

## Required change
1. **Replace the whole of `content.config.ts`** with exactly this content. Delete everything
   in the file first.
```ts
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // content/week0-functions/01-hello.md is served at /learn/week0-functions/01-hello
    lessons: defineCollection({
      type: 'page',
      // Every lesson lives in a week folder; root files belong to pages.
      source: { include: '**/*.md', exclude: ['*.md'], prefix: '/learn' },
      schema: z.object({
        week: z.number(),
        order: z.number(),
        minutes: z.number().optional(),
        concepts: z.array(z.string()).optional(), // ids from content/concepts.yml
      }),
    }),
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
    concepts: defineCollection({
      type: 'data',
      source: 'concepts.yml',
      schema: z.object({
        concepts: z.array(
          z.object({ id: z.string(), title: z.string(), week: z.number(), group: z.string(), requires: z.array(z.string()) }),
        ),
      }),
    }),
  },
})
```

2. **Replace the whole of `docs/lesson-format.md`** with exactly this content. Delete
   everything in the file first.
````markdown
# Lesson Format

A lesson is a Markdown file in a week folder, for example
`content/week0-functions/01-hello.md`. It is served at `/learn/week0-functions/01-hello`.

## Frontmatter

```yaml
title: Hello, world
week: 0
order: 1
minutes: 5
concepts: [print, strings]
```

- `title`: Required. The lesson heading. The page shows it as the only H1, so the body
  must not start with a `#` heading.
- `week`: Required. The CS50P week, 0 to 9. It must match an entry in `content/weeks.yml`.
- `order`: Required. The lesson's place in its week, starting at 1.
- `minutes`: Optional. About how long the lesson takes.
- `concepts`: Optional. Ids from `content/concepts.yml` that the lesson teaches. Every
  exercise in the lesson counts towards these concepts on the Progress page.

## Exercise Block

```
::exercise
---
id: w0-l1-ex1
prompt: Print the text hello, world on one line.
starter: |
  # write your code below
hints:
  - Use the print function and put the text inside its parentheses.
tests:
  - stdin: ""
    stdout: "hello, world"
solution: |
  print("hello, world")
---
::
```

Fields:
- `id`: Required. Unique across the course. Pattern `w<week>-l<order>-ex<n>`, for
  example `w0-l1-ex1`. It is also the exercise's anchor, so `/learn/...#w0-l1-ex1`
  scrolls to it.
- `prompt`: Required. One or two sentences saying what the program must do.
- `starter`: Optional. Code shown in the editor at the start.
- `hints`: Optional. Shown one at a time when the learner asks.
- `tests`: Required, at least one. Each test is one of two kinds:
  - An output test with `stdin` and `stdout`.
    - `stdin`: every line the program reads with `input()`, in order. Use `stdin: ""`
      when it reads nothing. For more than one line use a YAML block:
      ```yaml
      tests:
        - stdin: |
            3
            4
          stdout: "7"
      ```
    - `stdout`: the whole expected output. Prompt text from `input("...")` is part of
      stdout, and the typed answer is not. Example: `name = input("Name: ")` then
      `print("hi", name)` with stdin `Bob` gives stdout `"Name: hi Bob"`. Trailing
      whitespace is ignored when comparing.
  - A check test with `check`: Python run after the learner's code. It passes if it
    raises nothing, for example `check: assert square(3) == 9`. It may also have `stdin`.
- `solution`: Required. A correct program that passes every test.

Add new optional fields only. Do not rename or remove existing fields.
````

## Acceptance gates
- `git diff --stat HEAD -- content.config.ts docs/lesson-format.md` lists both files, each with
  more than 0 lines added.
- `grep -n "concepts: defineCollection\|concepts: z.array(z.string()).optional()" content.config.ts`
  prints two lines.
- `grep -c "^import" content.config.ts` prints `1`.
- `grep -n "minutes\|concepts\|hints\|check" docs/lesson-format.md` prints at least 8 lines.
- `npm run generate` exits 0, and its output does not contain `YAML array is not supported`.
- If this spec fails the way 044 did, Orca can run it as a shell step instead: write each block
  with `cat > <file> <<'END'`.
