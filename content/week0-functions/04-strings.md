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
