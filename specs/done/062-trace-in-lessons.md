# 062: ::trace block in lessons (task C7)
Files: docs/lesson-format.md, content/week0-functions/01-hello.md
Severity: med

## Problem
Lessons need to embed the explorer. `Trace.vue` (spec 058) is a content component, so
`::trace` already works in Markdown. The lesson format doc must describe it, and the
hello lesson gets the first one.

Do this after spec 058.

## Required change
1. **Replace the whole of `docs/lesson-format.md`** with exactly this content. Delete everything in the file first.
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

## Trace Block

A trace block shows code the learner can step through one line at a time, with its
variables, call stack and output. Every step comes from really running the code.

```
::trace
---
code: |
  name = "Ada"
  print("hello,", name)
---
::
```

Fields:
- `code`: Required. Python the learner can edit before pressing Run and trace. Keep it
  short and do not call `input()`: a trace has no input, so `input()` raises `EOFError`.
  A trace stops after 1000 steps.

Add new optional fields only. Do not rename or remove existing fields.
````

2. **In `content/week0-functions/01-hello.md`**, insert exactly these lines directly above
   the line that starts with `Now it's your turn.`. Change nothing else in the file.
````markdown
Python runs a program one line at a time, from the top down. Press **Run and trace**, then **Step**, to watch it happen:

::trace
---
code: |
  print("hello, world")
  print("Python runs one line at a time.")
---
::

````

## Acceptance gates
- `git diff --numstat HEAD -- content/week0-functions/01-hello.md` prints `10` added and
  `0` removed.
- `wc -c < docs/lesson-format.md` prints `2931`.
- `grep -c "^::trace$" content/week0-functions/01-hello.md` prints `1`.
- `npm run generate` exits 0.
- Browser (Orca): in the hello lesson, Run and trace shows `Step 1 of 3 · line 1`. Press
  Last: the output shows both lines.
