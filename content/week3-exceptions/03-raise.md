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
