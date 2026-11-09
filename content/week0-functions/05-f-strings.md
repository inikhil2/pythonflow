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
