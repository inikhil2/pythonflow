# 015: lesson-format.md does not say which fields are required or how stdin/stdout work
Files: docs/lesson-format.md
Severity: med

## Problem
`docs/lesson-format.md` is the frozen format the content writers (T9 to T18)
follow. Its "Fields" list leaves out facts they need to write tests that pass:
1. It does not say `tests` and `solution` are required. plan.md requires a
   `solution` that passes its own tests.
2. It does not say how to give more than one line of input.
3. It does not say that `input("Name: ")` prompt text is part of stdout. The
   runner was checked in Pyodide: `n = input("Name: "); print("hi", n)` with
   stdin `Bob` gives stdout `Name: hi Bob`. The typed answer is not echoed. A
   writer who leaves the prompt out of `stdout` writes a test the solution fails.
4. It does not give the `id` pattern. plan.md and the sample lesson use `w<week>-l<order>-ex<n>`.

## Required change
Replace everything from the line `Fields:` down to (not including) the line
`This format is frozen. Do not change existing fields.` with exactly:

````
Fields:
- `id`: Required. Unique. Pattern `w<week>-l<order>-ex<n>`, for example `w0-l1-ex1`.
- `prompt`: Required. One or two sentences saying what the program must do.
- `starter`: Optional. Code shown in the editor at the start.
- `tests`: Required, at least one. Each test has:
  - `stdin`: every line the program reads with `input()`, in order. Use `stdin: ""` when it reads nothing. For more than one line use a YAML block:
    ```yaml
    tests:
      - stdin: |
          3
          4
        stdout: "7"
    ```
  - `stdout`: the whole expected output. Prompt text from `input("...")` is part of stdout, and the typed answer is not. Example: `name = input("Name: ")` then `print("hi", name)` with stdin `Bob` gives stdout `"Name: hi Bob"`. Trailing whitespace is ignored when comparing.
- `solution`: Required. A correct program that passes every test.

````

## Acceptance gates
- `grep -c 'Required' docs/lesson-format.md` prints `4`
- `grep -c 'Name: hi Bob' docs/lesson-format.md` prints `1`
- `grep -c 'This format is frozen' docs/lesson-format.md` prints `1`
