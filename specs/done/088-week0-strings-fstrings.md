# 088: Week 0 lessons 04 and 05 (task T9, batch 2 of 2)
Files: content/week0-functions/04-strings.md, content/week0-functions/05-f-strings.md
Severity: med

## Problem
Week 0 has only the hello-world lesson. plan.md lists hello world, variables, `input`,
strings, f-strings, ints and floats, defining functions and return values. This batch
adds String methods and f-strings.

The exercises are fixed and already checked: each solution passes and each starter fails.
Write the explanation around them. Rules from plan.md and `docs/lesson-format.md`:
- 60 to 120 lines per file.
- Short paragraphs in a warm tutor voice that says "we" and "you".
- No `#` heading, because the page shows the title. Bold for key terms.
- Python examples in fenced code blocks marked `python`, each followed by what it prints.
- Teach only what this lesson and earlier lessons cover.
- Do not copy any text from CS50 or CS50P materials. Write every sentence yourself.
- The outline is instructions for you, not lesson text. Never copy its sentences, and
  never write phrases such as "Put exercise", "Say that" or "the trace goes".
- Put each exercise block where the outline says, not all at the end.

## Required change
1. **Create `content/week0-functions/04-strings.md`.** It starts with exactly this frontmatter:
```yaml
---
title: String methods
week: 0
order: 4
minutes: 10
concepts: [strings]
---
```
Then write the lesson in the tutor voice of `content/week0-functions/01-hello.md`. Cover,
in this order:
- A string is text in quotes. Single or double quotes both work. Use double quotes when
  the text has an apostrophe, as in "What's".
- A method is a function that belongs to a value, called with a dot: `name.upper()`.
  Show `strip`, `lower`, `upper`, `title` and `capitalize`, each with its result.
- Methods give back a new string. The original does not change. The trace shows this:
  `raw` still has its spaces at the end.
- Chain methods left to right: `name.strip().title()`.
- `replace(old, new)` swaps every match: `"banana".replace("a", "o")` gives `"bonono"`.
- A common mistake: calling a method without saving or printing the result, then
  wondering why nothing changed.
- Put exercise 1 after the chaining point and exercise 2 after `replace`.

Include this trace block once, where the outline says:
```
::trace
---
code: |
  raw = "  ada lovelace  "
  clean = raw.strip()
  print(clean.title())
  print(raw)
---
::
```

Include these two exercise blocks exactly as written, character for character, in the
places the outline gives:
````
::exercise
---
id: w0-l4-ex1
prompt: Read a name that may have extra spaces and odd capitals, and print it tidied up, such as Ada Lovelace.
starter: |
  name = input()
  print(name)
hints:
  - The strip method removes spaces from both ends of a string.
  - The title method gives each word a capital first letter. You can chain them, as in name.strip().title().
tests:
  - stdin: "  ada lovelace  "
    stdout: "Ada Lovelace"
  - stdin: "GRACE hopper"
    stdout: "Grace Hopper"
solution: |
  name = input()
  print(name.strip().title())
---
::

::exercise
---
id: w0-l4-ex2
prompt: Read a sentence and print it with every cat changed to dog.
starter: |
  sentence = input()
hints:
  - The replace method takes the old text first and the new text second.
  - replace gives you a new string. Print that new string, not the original.
tests:
  - stdin: "my cat likes other cats"
    stdout: "my dog likes other dogs"
  - stdin: "no pets here"
    stdout: "no pets here"
solution: |
  sentence = input()
  print(sentence.replace("cat", "dog"))
---
::
````
2. **Create `content/week0-functions/05-f-strings.md`.** It starts with exactly this frontmatter:
```yaml
---
title: f-strings
week: 0
order: 5
minutes: 8
concepts: [strings, variables]
---
```
Then write the lesson in the tutor voice of `content/week0-functions/01-hello.md`. Cover,
in this order:
- Joining text with `+` or commas gets awkward when the sentence has many parts, and `+`
  adds no spaces. Show one clumsy example.
- An f-string is a string with `f` before the opening quote. Each `{name}` inside is
  replaced by the variable's value.
- The braces can hold more than a name: `f"{name.upper()}!"` works.
- A common mistake: forgetting the `f`. The braces are then printed as they are. The
  trace's last line shows this.
- Put exercise 1 after the braces point and exercise 2 at the end.

Include this trace block once, where the outline says:
```
::trace
---
code: |
  name = "Ada"
  city = "London"
  print(f"{name} lives in {city}.")
  print("{name} lives in {city}.")
---
::
```

Include these two exercise blocks exactly as written, character for character, in the
places the outline gives:
````
::exercise
---
id: w0-l5-ex1
prompt: Read a name and then a city, and print one sentence such as Ada lives in London. using an f-string.
starter: |
  name = input()
  city = input()
hints:
  - An f-string starts with f before the opening quote.
  - 'Put each variable in curly braces inside the text: f"{name} lives in {city}."'
tests:
  - stdin: |
      Ada
      London
    stdout: "Ada lives in London."
  - stdin: |
      Grace
      New York
    stdout: "Grace lives in New York."
solution: |
  name = input()
  city = input()
  print(f"{name} lives in {city}.")
---
::

::exercise
---
id: w0-l5-ex2
prompt: Read a name and print a two-line birthday card. The first line is Dear, the name and a comma. The second is Happy birthday, the name and an exclamation mark.
starter: |
  name = input()
  print("Dear name,")
hints:
  - The starter prints the word name, not the value. An f-string with {name} prints the value.
  - Use two print calls, one per line of the card.
tests:
  - stdin: "Sam"
    stdout: |
      Dear Sam,
      Happy birthday, Sam!
  - stdin: "Lin"
    stdout: |
      Dear Lin,
      Happy birthday, Lin!
solution: |
  name = input()
  print(f"Dear {name},")
  print(f"Happy birthday, {name}!")
---
::
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 5 lessons, 9 exercises`.
2. Line counts:
```sh
   wc -l "content/week0-functions/04-strings.md"   # expect 60 to 120
   wc -l "content/week0-functions/05-f-strings.md"   # expect 60 to 120
```
3. The exercise blocks are unchanged:
```sh
   awk '/^::exercise$/,/^::$/' "content/week0-functions/04-strings.md" | shasum | cut -c1-12   # expect 739ed3d3b8f8
   awk '/^::exercise$/,/^::$/' "content/week0-functions/05-f-strings.md" | shasum | cut -c1-12   # expect e9d60c23b479
```
4. `npm run generate` exits 0.
5. `git status --short` lists only these two new files.
6. The principal engineer reads both lessons for voice, correctness and scope before the
   next batch.
7. `grep -c -E "Say that|Put exercise|the trace goes|The trace's last line" content/week0-functions/0[45]-*.md`
   gives 0 for each file.
