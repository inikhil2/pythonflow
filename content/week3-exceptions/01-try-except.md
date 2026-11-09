---
title: try and except
week: 3
order: 1
minutes: 10
concepts: [exceptions]
---

Welcome to week 3! You've already met plenty of errors: `NameError`, `KeyError`, `IndexError`. When one happens, Python stops the whole program. This week you'll learn to catch errors instead, so your program can deal with them and keep going.

Here is an error you'll see often. `int()` can only turn text into a number when the text looks like a whole number:

```python
age = int("seven")
```

Python stops with `ValueError: invalid literal for int() with base 10: 'seven'`. An error like this, raised while the program runs, is called an **exception**. A program that reads numbers with `int(input())` crashes the same way whenever someone types a word.

To catch an exception, put the risky line inside `try`, and say what to do instead under `except`:

::trace
---
code: |
  text = "seven"
  try:
      age = int(text)
      print(f"Next year you'll be {age + 1}")
  except ValueError:
      print("That's not a whole number")
  print("Bye")
---
::

Step through it. `int(text)` raises `ValueError`, so Python skips the rest of the `try` body and jumps to the `except ValueError` body. Then the program carries on as normal and prints `Bye`. If `text` were `"12"`, the `try` body would finish, and the `except` body would never run.

Name the exception you expect, as in `except ValueError`. A bare `except:` catches every error, even a typo in your own code, and hides the real problem.

Your turn: stop a crash.

::exercise
---
id: w3-l1-ex1
prompt: Read a whole number and print double its value. If what you read is not a whole number, print not a number instead.
starter: |
  n = int(input())
  print(n * 2)
hints:
  - The starter crashes with ValueError when it reads abc.
  - Put both lines inside try, and print not a number under except ValueError.
tests:
  - stdin: "4"
    stdout: "8"
  - stdin: "abc"
    stdout: "not a number"
  - stdin: "2.5"
    stdout: "not a number"
solution: |
  try:
      n = int(input())
      print(n * 2)
  except ValueError:
      print("not a number")
---
::

Different problems raise different exceptions. Dividing by zero raises `ZeroDivisionError`, for example. One `try` can have several `except` blocks, one for each kind of error. Python runs the first one that matches.

Now handle two kinds of error.

::exercise
---
id: w3-l1-ex2
prompt: Read two whole numbers, one per line, and print the first divided by the second. Print not a number if either is not a whole number, and can't divide by zero if the second is 0.
starter: |
  try:
      a = int(input())
      b = int(input())
      print(a / b)
  except ValueError:
      print("not a number")
hints:
  - The starter handles words, but still crashes when the second number is 0.
  - Add a second block, except ZeroDivisionError, under the first one.
tests:
  - stdin: |
      6
      3
    stdout: "2.0"
  - stdin: |
      5
      0
    stdout: "can't divide by zero"
  - stdin: |
      x
      2
    stdout: "not a number"
solution: |
  try:
      a = int(input())
      b = int(input())
      print(a / b)
  except ValueError:
      print("not a number")
  except ZeroDivisionError:
      print("can't divide by zero")
---
::
