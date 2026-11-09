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
