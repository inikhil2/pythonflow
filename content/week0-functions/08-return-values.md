---
title: Return values
week: 0
order: 8
minutes: 10
concepts: [return-values, functions]
---

Some functions give a value back to the code that called them. `input()` gives back the line that was typed, and `round()` gives back the rounded number. Today you'll write functions that do the same.

The `return` keyword ends a function and sends a value back to the caller:

```python
def square(n):
    return n * n

area = square(4)
print(area)
```

This prints `16`. The call `square(4)` is replaced by the value it returns, so `area` holds `16`.

Printing and returning are different. `print` shows a value on the screen, and the rest of the program can't use it. `return` hands the value back, so you can store it, print it or do more maths with it.

Step through this trace and watch the value come back from each call:

::trace
---
code: |
  def square(n):
      return n * n

  area = square(4)
  print(area)
  print(square(3) + 1)
---
::

The last line uses the returned `9` straight away, and prints `10`.

Your turn: make `square` return its answer.

::exercise
---
id: w0-l8-ex1
prompt: Change square so it returns n times n instead of printing it.
starter: |
  def square(n):
      print(n * n)
hints:
  - print shows the value, but the caller gets nothing back.
  - Use the return keyword in place of print.
tests:
  - check: assert square(3) == 9
  - check: assert square(-4) == 16
solution: |
  def square(n):
      return n * n
---
::

A function without `return` still gives something back: the special value `None`, which means "nothing". That's why this is a common mistake:

```python
def square(n):
    print(n * n)

print(square(3) + 1)
```

It prints `9` and then stops with `TypeError`, because Python can't add `1` to `None`.

A return value can come from any calculation, including one with floats. Try a temperature converter next.

::exercise
---
id: w0-l8-ex2
prompt: Make to_celsius return the temperature in Celsius for a temperature f in Fahrenheit. The formula is (f - 32) * 5 / 9. The rest of the program is done for you.
starter: |
  def to_celsius(f):
      ...

  f = int(input())
  print(round(to_celsius(f)))
hints:
  - Replace the ... with a return line that uses the formula.
  - The parentheses around f - 32 matter. Without them, Python multiplies first.
tests:
  - stdin: "212"
    stdout: "100"
  - stdin: "50"
    stdout: "10"
  - stdin: "32"
    check: assert to_celsius(212) == 100
solution: |
  def to_celsius(f):
      return (f - 32) * 5 / 9

  f = int(input())
  print(round(to_celsius(f)))
---
::
