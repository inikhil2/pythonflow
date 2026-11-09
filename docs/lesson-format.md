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
- `week`: Required. The week, 0 to 10. Weeks 0 to 9 follow CS50P; week 10 is Algorithms. It must match an entry in `content/weeks.yml`.
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
