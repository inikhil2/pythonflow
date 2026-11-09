# 044: Concepts data, the lesson concepts field, and the lesson format doc (task B1)
Files: content/concepts.yml, content.config.ts, docs/lesson-format.md
Severity: med

## Problem
Phase B (mastery, Progress, Practice) needs a list of concepts. Each concept has an
id, a title, a CS50P week, a group and the concepts it builds on. Lessons also need a
frontmatter field that lists the concepts they teach. The proposal data model is
`content/concepts.yml` holding `[{ id, title, week, group, requires }]`. As with
weeks.yml, Nuxt Content does not support a YAML file whose top level is a list, so the
list goes under a `concepts:` key.

`docs/lesson-format.md` is also out of date. It lacks `minutes`, `concepts`, `hints` and
`check` tests, which are all in use or added here.

This is the first Phase B spec. Specs 045 to 049 depend on it.

## Required change
1. Create `content/concepts.yml` with exactly this content.
```yaml
# Concepts by CS50P week. A lesson lists the ids it teaches in its frontmatter `concepts`.
# requires: concepts to know first. It is advice only; nothing is locked.
# group: one of Python basics, Control flow, Data structures, Functions,
# Errors and testing, Files and text, Objects, Going further.
concepts:
  - id: print
    title: Printing output
    week: 0
    group: Python basics
    requires: []
  - id: strings
    title: Strings
    week: 0
    group: Python basics
    requires: [print]
  - id: variables
    title: Variables
    week: 0
    group: Python basics
    requires: [print]
  - id: input
    title: Reading input
    week: 0
    group: Python basics
    requires: [variables, strings]
  - id: numbers
    title: Integers and floats
    week: 0
    group: Python basics
    requires: [variables]
  - id: functions
    title: Defining functions
    week: 0
    group: Functions
    requires: [variables]
  - id: return-values
    title: Return values
    week: 0
    group: Functions
    requires: [functions]
  - id: comparisons
    title: Comparisons
    week: 1
    group: Control flow
    requires: [numbers]
  - id: conditionals
    title: if, elif and else
    week: 1
    group: Control flow
    requires: [comparisons]
  - id: boolean-logic
    title: and, or and not
    week: 1
    group: Control flow
    requires: [conditionals]
  - id: match
    title: match statements
    week: 1
    group: Control flow
    requires: [conditionals]
  - id: while-loops
    title: while loops
    week: 2
    group: Control flow
    requires: [conditionals]
  - id: for-loops
    title: for loops
    week: 2
    group: Control flow
    requires: [while-loops]
  - id: lists
    title: Lists
    week: 2
    group: Data structures
    requires: [for-loops]
  - id: dictionaries
    title: Dictionaries
    week: 2
    group: Data structures
    requires: [lists]
  - id: exceptions
    title: try and except
    week: 3
    group: Errors and testing
    requires: [conditionals]
  - id: raise
    title: Raising exceptions
    week: 3
    group: Errors and testing
    requires: [exceptions]
  - id: modules
    title: Importing modules
    week: 4
    group: Going further
    requires: [functions]
  - id: random
    title: The random module
    week: 4
    group: Going further
    requires: [modules]
  - id: command-line
    title: Command-line arguments
    week: 4
    group: Going further
    requires: [modules, lists]
  - id: assert
    title: assert
    week: 5
    group: Errors and testing
    requires: [functions]
  - id: pytest
    title: Testing with pytest
    week: 5
    group: Errors and testing
    requires: [assert]
  - id: files
    title: Reading and writing files
    week: 6
    group: Files and text
    requires: [exceptions]
  - id: csv
    title: CSV files
    week: 6
    group: Files and text
    requires: [files, dictionaries]
  - id: regex
    title: Regular expressions
    week: 7
    group: Files and text
    requires: [strings]
  - id: classes
    title: Classes and objects
    week: 8
    group: Objects
    requires: [functions, dictionaries]
  - id: methods
    title: Methods
    week: 8
    group: Objects
    requires: [classes]
  - id: properties
    title: Properties
    week: 8
    group: Objects
    requires: [methods]
  - id: inheritance
    title: Inheritance
    week: 8
    group: Objects
    requires: [classes]
  - id: sets
    title: Sets
    week: 9
    group: Data structures
    requires: [lists]
  - id: comprehensions
    title: Comprehensions
    week: 9
    group: Going further
    requires: [for-loops, lists]
  - id: type-hints
    title: Type hints
    week: 9
    group: Going further
    requires: [functions]
  - id: docstrings
    title: Docstrings
    week: 9
    group: Going further
    requires: [functions]
```

2. **Replace the whole of `content.config.ts`** with exactly this content. It is the
   current file plus the `concepts` field on lessons and the `concepts` collection.
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

3. **Replace the whole of `docs/lesson-format.md`** with exactly this content.
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
- `grep -c "^  - id: " content/concepts.yml` prints `33`.
- `grep -n "concepts: defineCollection\|concepts: z.array(z.string()).optional()" content.config.ts` prints two lines.
- `grep -n "minutes\|concepts\|hints\|check" docs/lesson-format.md` prints at least 8 lines.
- `npm run generate` exits 0, and its output does not contain `YAML array is not supported`.
