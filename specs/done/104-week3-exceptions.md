# 104: Week 3 lessons: try and except, else and asking again, raising exceptions
Files: content/week3-exceptions/01-try-except.md, content/week3-exceptions/02-else-and-validating.md, content/week3-exceptions/03-raise.md
Severity: med

## Problem
Week 2 is committed. plan.md lists week 3 as `try/except`, `else`, `raise` and validating
input, and no week 3 lessons exist yet. This spec adds all three, in a new folder
`content/week3-exceptions/`. The app and the lesson checker pick up week folders on their
own, so no code changes.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week3-exceptions/01-try-except.md`** with exactly this content, and nothing before or after it.
````markdown
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
````
2. **Create `content/week3-exceptions/02-else-and-validating.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: else, and asking again
week: 3
order: 2
minutes: 10
concepts: [exceptions, while-loops]
---

Catching an error is good. Asking the person to try again is better. To do that, you need two more pieces: `else` after a `try`, and a way to leave a loop.

A `try` can end with an `else` block. It runs only when the `try` body raised no exception:

```python
try:
    n = int("21")
except ValueError:
    print("not a number")
else:
    print(f"Got {n}")
```

This prints `Got 21`. Keep the `try` body short, with only the line that might fail, and put the rest in `else`. That way, `except ValueError` can't catch a mistake from some other line by accident.

Next, a loop that asks until the answer is good. `while True:` starts a loop whose condition is always true, so it would go round forever. The word `break` jumps straight out of the loop, to the first line after it. Step through this trace:

::trace
---
code: |
  answers = ["ten", "10"]
  i = 0
  while True:
      try:
          n = int(answers[i])
      except ValueError:
          print("Please type a whole number")
          i += 1
      else:
          break
  print(f"Got {n}")
---
::

Here a list stands in for the person typing. The first answer raises `ValueError`, so the loop goes round again. The second works, so `else` runs `break`, and the program prints `Got 10`.

Your turn: turn a single try into a loop.

::exercise
---
id: w3-l2-ex1
prompt: Read lines until one is a whole number. For each line that is not, print try again. Then print the number as a line like Got 5.
starter: |
  try:
      n = int(input())
  except ValueError:
      print("try again")
  else:
      print(f"Got {n}")
hints:
  - The starter asks only once. Put the try, except and else inside while True.
  - Under else, use break to leave the loop. Print Got after the loop, not inside it.
tests:
  - stdin: "5"
    stdout: "Got 5"
  - stdin: |
      abc
      5
    stdout: |
      try again
      Got 5
  - stdin: |
      one
      2.5
      3
    stdout: |
      try again
      try again
      Got 3
solution: |
  while True:
      try:
          n = int(input())
      except ValueError:
          print("try again")
      else:
          break
  print(f"Got {n}")
---
::

Sometimes there's nothing to do in an `except` block except carry on. Python won't allow an empty block, so write `pass`, which means "do nothing".

Checking that input is the right type and in the right range is called **validating** it. Now validate a rating.

::exercise
---
id: w3-l2-ex2
prompt: Read lines until one is a whole number from 1 to 10. Ignore every other line. Then print a line like Thanks for rating it 7.
starter: |
  while True:
      try:
          rating = int(input())
      except ValueError:
          pass
      else:
          break
  print(f"Thanks for rating it {rating}")
hints:
  - The starter takes any whole number, even 11 or 0.
  - Under else, break only if 1 <= rating <= 10. Otherwise the loop goes round again.
tests:
  - stdin: "5"
    stdout: "Thanks for rating it 5"
  - stdin: |
      ten
      3
    stdout: "Thanks for rating it 3"
  - stdin: |
      11
      0
      7
    stdout: "Thanks for rating it 7"
solution: |
  while True:
      try:
          rating = int(input())
      except ValueError:
          pass
      else:
          if 1 <= rating <= 10:
              break
  print(f"Thanks for rating it {rating}")
---
::
````
3. **Create `content/week3-exceptions/03-raise.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Raising exceptions
week: 3
order: 3
minutes: 10
concepts: [raise, exceptions]
---

So far, Python has raised every exception for you. Your own functions can raise them too. That's how a function says "I can't do this with what you gave me", and lets the code that called it decide what to do.

To raise an exception, write `raise` and the kind of exception, with a message in brackets:

```python
def make_score(n):
    if n < 0 or n > 100:
        raise ValueError("scores go from 0 to 100")
    return n
```

`make_score(80)` returns `80`. `make_score(150)` stops at the `raise` line. The function never reaches `return`, and Python reports `ValueError: scores go from 0 to 100`, just as it would for any other error.

`ValueError` is a good choice when the value has the right type but makes no sense, like a score of 150.

Your turn: make a function refuse bad values.

::exercise
---
id: w3-l3-ex1
prompt: Finish make_score so that it raises ValueError when n is less than 0 or more than 100, and returns n otherwise.
starter: |
  def make_score(n):
      return n
hints:
  - Before the return, check whether n < 0 or n > 100.
  - When it is, write raise ValueError with a short message in brackets.
tests:
  - check: |
      assert make_score(50) == 50
      assert make_score(0) == 0
      assert make_score(100) == 100
  - check: |
      try:
          make_score(101)
          raise AssertionError("make_score(101) should raise ValueError")
      except ValueError:
          pass
  - check: |
      try:
          make_score(-1)
          raise AssertionError("make_score(-1) should raise ValueError")
      except ValueError:
          pass
solution: |
  def make_score(n):
      if n < 0 or n > 100:
          raise ValueError("scores go from 0 to 100")
      return n
---
::

The code that calls the function catches the exception with `try` and `except`, as usual. Step through this trace:

::trace
---
code: |
  def make_score(n):
      if n < 0 or n > 100:
          raise ValueError("scores go from 0 to 100")
      return n

  try:
      score = make_score(150)
      print(score)
  except ValueError:
      print("That score is not allowed")
---
::

`make_score(150)` raises, so Python leaves the function, skips `print(score)`, and runs the `except` body.

Notice that `int("abc")` raises `ValueError` too. So one `except ValueError` catches both kinds of bad input: text that isn't a number, and a number your function refuses.

Now use the function from a program.

::exercise
---
id: w3-l3-ex2
prompt: Read a score and pass it through make_score. Print a line like Score saved 80, or print Please type a score from 0 to 100 if the input is not a whole number or is out of range.
starter: |
  def make_score(n):
      if n < 0 or n > 100:
          raise ValueError("scores go from 0 to 100")
      return n

  score = make_score(int(input()))
  print(f"Score saved {score}")
hints:
  - The starter crashes for 150 and for abc, and both crashes are ValueError.
  - Wrap the last two lines in try, and print the message under except ValueError.
tests:
  - stdin: "80"
    stdout: "Score saved 80"
  - stdin: "150"
    stdout: "Please type a score from 0 to 100"
  - stdin: "abc"
    stdout: "Please type a score from 0 to 100"
solution: |
  def make_score(n):
      if n < 0 or n > 100:
          raise ValueError("scores go from 0 to 100")
      return n

  try:
      score = make_score(int(input()))
      print(f"Score saved {score}")
  except ValueError:
      print("Please type a score from 0 to 100")
---
::
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 19 lessons, 37 exercises`.
2. File sizes match:
```sh
   wc -c "content/week3-exceptions/01-try-except.md"   # expect 3222
   wc -c "content/week3-exceptions/02-else-and-validating.md"   # expect 3411
   wc -c "content/week3-exceptions/03-raise.md"   # expect 3549
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week3-exceptions/01-try-except.md" | shasum | cut -c1-12   # expect 7d8381d4bcf7
   awk '/^::exercise$/,/^::$/' "content/week3-exceptions/02-else-and-validating.md" | shasum | cut -c1-12   # expect 430749741fb6
   awk '/^::exercise$/,/^::$/' "content/week3-exceptions/03-raise.md" | shasum | cut -c1-12   # expect e880930b62de
```
4. `git status --short` shows only these new lesson files.
