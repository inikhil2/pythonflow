# 087: Week 0 lessons 02 and 03 (task T9, batch 1 of 2)
Files: content/week0-functions/02-variables.md, content/week0-functions/03-input.md
Severity: med

## Problem
Week 0 has only the hello-world lesson. plan.md lists hello world, variables, `input`,
strings, f-strings, ints and floats, defining functions and return values. This batch
adds Variables and Reading input.

The exercises are fixed and already checked: each solution passes and each starter fails.
Write the explanation around them. Rules from plan.md and `docs/lesson-format.md`:
- 60 to 120 lines per file.
- Short paragraphs in a warm tutor voice that says "we" and "you".
- No `#` heading, because the page shows the title. Bold for key terms.
- Python examples in fenced code blocks marked `python`, each followed by what it prints.
- Teach only what this lesson and earlier lessons cover.
- Do not copy any text from CS50 or CS50P materials. Write every sentence yourself.

## Required change
1. **Create `content/week0-functions/02-variables.md`.** It starts with exactly this frontmatter:
```yaml
---
title: Variables
week: 0
order: 2
minutes: 8
concepts: [variables]
---
```
Then write the lesson in the tutor voice of `content/week0-functions/01-hello.md`. Cover,
in this order:
- A variable is a name that holds a value. `=` stores the value on the right under the
  name on the left. It is not "equals" as in maths.
- Using the variable gives back its value. `print(name)` prints Ada, while
  `print("name")` prints the word name. Show both.
- A variable can be given a new value later, and the old one is gone. This is where the
  trace goes.
- Naming rules: letters, digits and `_`; no digit first; case matters (`name` and `Name`
  differ). Use lowercase words joined by `_`, such as `first_name`.
- A common mistake: using a name before giving it a value, or misspelling it. Python stops
  with `NameError: name 'nme' is not defined`.
- Put exercise 1 after the first two points and exercise 2 at the end.

Include this trace block once, where the outline says:
```
::trace
---
code: |
  name = "Ada"
  print(name)
  name = "Grace"
  print(name)
---
::
```

Include these two exercise blocks exactly as written, character for character, in the
places the outline gives:
````
::exercise
---
id: w0-l2-ex1
prompt: Make a variable called name that holds the text Ada, then print it.
starter: |
  # make a variable called name here
hints:
  - 'A variable is made with an equals sign: the name on the left, the value on the right.'
  - Text needs quotes, but the variable name does not. Print the name without quotes.
tests:
  - stdin: ""
    stdout: "Ada"
  - check: assert name == "Ada"
solution: |
  name = "Ada"
  print(name)
---
::

::exercise
---
id: w0-l2-ex2
prompt: Swap the values of a and b, so a holds 2 and b holds 1. Keep the print line as it is.
starter: |
  a = 1
  b = 2
  # swap a and b here
  print(a, b)
hints:
  - If you write a = b first, the 1 in a is gone. Keep a copy of it in a third variable.
  - 'Try three lines: temp = a, then a = b, then b = temp.'
tests:
  - stdin: ""
    stdout: "2 1"
  - check: assert (a, b) == (2, 1)
solution: |
  a = 1
  b = 2
  temp = a
  a = b
  b = temp
  print(a, b)
---
::
````
2. **Create `content/week0-functions/03-input.md`.** It starts with exactly this frontmatter:
```yaml
---
title: Reading input
week: 0
order: 3
minutes: 8
concepts: [input, variables]
---
```
Then write the lesson in the tutor voice of `content/week0-functions/01-hello.md`. Cover,
in this order:
- `input()` pauses the program, waits for one line, and gives that line back as text.
  Store it in a variable to use it.
- The text inside `input("What's your name? ")` is shown first as a prompt. End it with a
  space so the answer does not touch it.
- In PythonFlow, the Input box under the editor plays the person typing: one line per
  `input()` call, in order. If it runs out of lines, Python stops with `EOFError`.
- `print` with commas puts one space between the parts, so `print("hello,", name)` gives
  `hello, Ada`.
- `input()` always gives text, even for `42`. A later lesson turns text into numbers.
- A trace cannot read input, so the trace uses fixed values. Say that the values stand in
  for what `input()` would return.
- Put exercise 1 after the prompt point and exercise 2 after the Input box point.

Include this trace block once, where the outline says:
```
::trace
---
code: |
  first = "Ada"
  last = "Lovelace"
  print(first, last)
---
::
```

Include these two exercise blocks exactly as written, character for character, in the
places the outline gives:
````
::exercise
---
id: w0-l3-ex1
prompt: Ask "What's your name? " and then greet the person as hello, followed by their name.
starter: |
  name = input("What's your name? ")
hints:
  - The starter already stores the answer in name. Now print a greeting with it.
  - 'print("hello,", name) puts a space between the two parts for you.'
tests:
  - stdin: "Ada"
    stdout: "What's your name? hello, Ada"
  - stdin: "Grace"
    stdout: "What's your name? hello, Grace"
solution: |
  name = input("What's your name? ")
  print("hello,", name)
---
::

::exercise
---
id: w0-l3-ex2
prompt: Read a first name, then a last name, each on its own line, and print the full name on one line.
starter: |
  first = input()
hints:
  - Each call to input() reads the next line, so you need a second one.
  - Store the last name in its own variable, then print both with a comma between them.
tests:
  - stdin: |
      Ada
      Lovelace
    stdout: "Ada Lovelace"
  - stdin: |
      Alan
      Turing
    stdout: "Alan Turing"
solution: |
  first = input()
  last = input()
  print(first, last)
---
::
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 3 lessons, 5 exercises`.
2. Line counts:
```sh
   wc -l "content/week0-functions/02-variables.md"   # expect 60 to 120
   wc -l "content/week0-functions/03-input.md"   # expect 60 to 120
```
3. The exercise blocks are unchanged:
```sh
   awk '/^::exercise$/,/^::$/' "content/week0-functions/02-variables.md" | shasum | cut -c1-12   # expect 98a67fbf7dcd
   awk '/^::exercise$/,/^::$/' "content/week0-functions/03-input.md" | shasum | cut -c1-12   # expect 1307dd51cba8
```
4. `npm run generate` exits 0.
5. `git status --short` lists only these two new files.
6. The principal engineer reads both lessons for voice, correctness and scope before the
   next batch.
