---
title: Integers and floats
week: 0
order: 6
minutes: 10
concepts: [numbers, input]
---

So far every value we've used has been text. Python can also do maths, and today you'll meet its two kinds of number.

An **integer**, or `int`, is a whole number such as `7`, `0` or `-3`. A **float** is a number with a decimal point, such as `2.5` or `7.0`. Numbers have no quotes around them. `7` is a number, and `"7"` is text.

Python does arithmetic with these operators:

- `+` adds and `-` subtracts
- `*` multiplies
- `/` divides and always gives a float
- `//` divides and drops the remainder
- `%` gives just the remainder

```python
print(7 + 2)
print(7 / 2)
```

That prints `9` and then `3.5`. Step through this trace to see `//` and `%` at work too:

::trace
---
code: |
  apples = 7
  people = 2
  print(apples / people)
  print(apples // people)
  print(apples % people)
---
::

Seven apples shared by two people is `3.5` each. If we don't cut any apples, each person gets `3` and `1` is left over.

Here's the catch from the last few lessons: `input()` always gives back text. Adding two pieces of text joins them, so this program surprises people:

```python
x = input()
y = input()
print(x + y)
```

With `3` and `4` in the Input box, it prints `34`, not `7`. The `int()` function turns text into an integer, and `float()` turns it into a float:

```python
x = int("3")
y = int("4")
print(x + y)
```

Now it prints `7`. You can wrap the call straight around `input()`, as in `x = int(input())`.

Your turn: fix the adding program.

::exercise
---
id: w0-l6-ex1
prompt: Read two whole numbers, one per line, and print their sum.
starter: |
  x = input()
  y = input()
  print(x + y)
hints:
  - input() gives back text, so x + y joins the two pieces of text.
  - Turn each answer into an integer with int() before you add them.
tests:
  - stdin: |
      3
      4
    stdout: "7"
  - stdin: |
      10
      -2
    stdout: "8"
solution: |
  x = int(input())
  y = int(input())
  print(x + y)
---
::

Floats often have more digits than you want. `round(number, places)` gives the number rounded to that many decimal places, so `round(3.14159, 2)` gives `3.14`.

A common mistake: `int("2.5")` stops with `ValueError`, because `2.5` is not a whole number. Use `float()` when the answer may have a decimal point.

Now try one that needs a float.

::exercise
---
id: w0-l6-ex2
prompt: Read a distance in miles, which may have a decimal point, and print it in kilometres rounded to 1 decimal place. One mile is 1.609 kilometres.
starter: |
  miles = input()
hints:
  - The answer may be 3.5, so turn it into a number with float(), not int().
  - Multiply by 1.609, then use round with 1 as the second argument.
tests:
  - stdin: "10"
    stdout: "16.1"
  - stdin: "3.5"
    stdout: "5.6"
solution: |
  miles = float(input())
  print(round(miles * 1.609, 1))
---
::
