# 091: Fix week 0 lessons 04 and 05 after review (spec 088)
Files: content/week0-functions/04-strings.md, content/week0-functions/05-f-strings.md
Severity: med

## Problem
Spec 088 produced both lessons, but review found these problems.

- Both lessons put every exercise at the end. The outline placed 04's exercise 1 after
  chaining and exercise 2 after `replace`. It placed 05's exercise 1 after the braces point.
- `05-f-strings.md` copies the outline phrase "The trace's last line shows this", so gate 7
  of spec 088 fails.
- Both `python` examples in `05-f-strings.md` use `name` without defining it. A learner who
  tries them gets a NameError. They also do not say what they print, which the lesson
  rules require.
- `05-f-strings.md` says "You've been joining text with `+`", but no earlier lesson teaches `+`.
- `04-strings.md` says "Try this in the trace", and says `raw` keeps its spaces "at the end"
  when it keeps them at both ends.

Both files below are corrected. The exercise blocks are byte for byte the same as before.

## Required change
1. **Replace the whole of `content/week0-functions/04-strings.md`** with exactly this content. Delete everything in the file first.
````markdown
---
title: String methods
week: 0
order: 4
minutes: 10
concepts: [strings]
---

You've already seen how to print text with `print()`. Now let's learn how to work with strings themselves.

A **string** is text wrapped in quotes. You can use single quotes `'like this'` or double quotes `"like this"`. Both work the same way. Use double quotes when the text contains an apostrophe, like `"What's up?"`.

Strings have special functions called **methods** that belong to the string itself. You call them with a dot: `text.method()`. Here are the most useful ones:

- `strip()` removes spaces from both ends
- `lower()` makes all letters lowercase
- `upper()` makes all letters uppercase
- `title()` capitalizes the first letter of each word
- `capitalize()` capitalizes only the first letter

Watch what happens to `raw` in this trace:

::trace
---
code: |
  raw = "  ada lovelace  "
  clean = raw.strip()
  print(clean.title())
  print(raw)
---
::

Notice how `raw` still has its spaces at both ends. Methods give back a new string; the original doesn't change.

You can chain methods left to right: `name.strip().title()` removes spaces first, then capitalizes each word.

Your turn: tidy up a messy name.

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

The `replace(old, new)` method swaps every match. For example, `"banana".replace("a", "o")` gives `"bonono"`.

Now swap one word for another.

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

A common mistake: calling a method without saving or printing the result. If you type `name.strip()` but don't print it, nothing shows up. The method gives back a new string, so print it or store it in a variable.
````
2. **Replace the whole of `content/week0-functions/05-f-strings.md`** with exactly this content. Delete everything in the file first.
````markdown
---
title: f-strings
week: 0
order: 5
minutes: 8
concepts: [strings, variables]
---

You can join text with commas in `print`, or with `+`. Both get awkward when a sentence has many parts, and `+` adds no spaces. Try this:

```python
name = "Ada"
print("Hello, " + name + "!")
```

It prints `Hello, Ada!`, but only because you added the spaces and the `!` yourself. An f-string is easier.

An **f-string** is a string with `f` before the opening quote. Each `{name}` inside is replaced by the variable's value. Try this:

```python
name = "Ada"
print(f"Hello, {name}!")
```

It prints `Hello, Ada!` too, and the sentence reads the way it will look.

The braces can hold more than a name: `f"{name.upper()}!"` works and prints `ADA!`.

Your turn: build a sentence from two answers.

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

A common mistake: forgetting the `f`. The braces are then printed as they are. Compare the two `print` lines in this trace:

::trace
---
code: |
  name = "Ada"
  city = "London"
  print(f"{name} lives in {city}.")
  print("{name} lives in {city}.")
---
::

The first line shows `Ada lives in London.` The second shows `{name} lives in {city}.` exactly as written.

One last card to write.

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
2. File sizes match:
```sh
   wc -c "content/week0-functions/04-strings.md"   # expect 2610
   wc -c "content/week0-functions/05-f-strings.md"   # expect 2399
```
3. The exercise blocks are unchanged:
```sh
   awk '/^::exercise$/,/^::$/' "content/week0-functions/04-strings.md" | shasum | cut -c1-12   # expect 739ed3d3b8f8
   awk '/^::exercise$/,/^::$/' "content/week0-functions/05-f-strings.md" | shasum | cut -c1-12   # expect e9d60c23b479
```
4. `grep -c -E "Say that|Put exercise|the trace goes|The trace's last line" content/week0-functions/0[45]-*.md` gives 0 for each file.
5. `git status --short` shows only these two lesson files as changed or new.
