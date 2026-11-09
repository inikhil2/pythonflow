---
title: if, elif and else
week: 1
order: 2
minutes: 10
concepts: [conditionals, comparisons]
---

Now that you can ask a yes-or-no question, let's make the program act on the answer.

An `if` statement runs some lines only when a condition is `True`:

```python
x = 12
if x > 10:
    print("big")
```

This prints `big`. If `x` were `5`, it would print nothing at all. Notice the same shape as `def` in week 0: a colon at the end of the line, then a body indented by four spaces.

Add `else` to say what happens when the condition is `False`:

```python
x = 5
if x > 10:
    print("big")
else:
    print("small")
```

This prints `small`. Exactly one of the two bodies runs, never both.

Your turn: write your first decision. The `%` operator from week 0 helps here, because a number is even when `n % 2` is `0`.

::exercise
---
id: w1-l2-ex1
prompt: Read a whole number and print even if it is even, or odd if it is not.
starter: |
  n = int(input())
hints:
  - n % 2 gives the remainder after dividing by 2. Even numbers leave 0.
  - 'Use if with the comparison n % 2 == 0, then else for the odd case.'
tests:
  - stdin: "4"
    stdout: "even"
  - stdin: "7"
    stdout: "odd"
  - stdin: "0"
    stdout: "even"
solution: |
  n = int(input())
  if n % 2 == 0:
      print("even")
  else:
      print("odd")
---
::

When there are more than two choices, use `elif`, short for "else if". Python checks each condition from the top down and runs only the first body whose condition is `True`. It skips the rest, even if they would be `True` too. Step through this trace to watch it skip:

::trace
---
code: |
  x = 5
  if x > 10:
      print("big")
  elif x > 3:
      print("medium")
  else:
      print("small")
---
::

`x > 10` is `False`, so Python moves on. `x > 3` is `True`, so it prints `medium` and jumps past the `else`.

Because only the first match runs, order matters. If you test `x > 3` before `x > 10`, a value like `50` stops at the first test and prints `medium`.

A common mistake: forgetting the colon at the end of an `if`, `elif` or `else` line. Python stops with `SyntaxError` before running anything.

Now fix a chain that checks in the wrong order.

::exercise
---
id: w1-l2-ex2
prompt: Read a temperature in Celsius as a whole number. Print hot for 30 or more, warm for 20 or more, mild for 10 or more, and cold for anything lower.
starter: |
  temp = int(input())
  if temp >= 10:
      print("mild")
  elif temp >= 20:
      print("warm")
  elif temp >= 30:
      print("hot")
hints:
  - With 35, the first test temp >= 10 is already True, so the chain stops there. Put the highest limit first.
  - Nothing prints for cold temperatures yet. An else at the end catches everything left.
tests:
  - stdin: "35"
    stdout: "hot"
  - stdin: "25"
    stdout: "warm"
  - stdin: "12"
    stdout: "mild"
  - stdin: "3"
    stdout: "cold"
solution: |
  temp = int(input())
  if temp >= 30:
      print("hot")
  elif temp >= 20:
      print("warm")
  elif temp >= 10:
      print("mild")
  else:
      print("cold")
---
::
