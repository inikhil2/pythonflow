---
title: Importing modules
week: 4
order: 1
minutes: 10
concepts: [modules]
---

Welcome to week 4! You've written plenty of your own functions. Python also comes with hundreds more, ready-made and tested, grouped into **modules**. A module is a file of Python code that you can use from your own program. This week you'll learn to use other people's code, and to share your own.

To use a module, `import` it at the top of your program. Then put the module's name and a dot in front of each function you use from it:

```python
import math

print(math.sqrt(16))
```

This prints `4.0`. The `math` module has square roots, rounding helpers like `math.floor`, and values such as `math.pi`.

The `statistics` module works with lists of numbers. Step through this trace:

::trace
---
code: |
  import statistics

  scores = [70, 85, 90, 100]
  print(statistics.mean(scores))
  print(statistics.median(scores))
---
::

The **mean** is the average: add the values up and divide by how many there are. The **median** is the middle value once they're in order. With an even number of values, it's halfway between the middle two, so here it is `87.5`.

A common mistake: calling `sqrt(16)` after `import math`, without the `math.` in front. Python stops with `NameError`, because `import math` makes the module's name available, not the names inside it.

Your turn: fix that mistake.

::exercise
---
id: w4-l1-ex1
prompt: Read the two shorter sides of a right-angled triangle, one per line, as whole numbers. Print the longest side, rounded to 2 decimal places.
starter: |
  import math

  a = int(input())
  b = int(input())
  print(round(sqrt(a * a + b * b), 2))
hints:
  - The starter stops with NameError, because sqrt lives inside the math module.
  - Write math.sqrt instead of sqrt.
tests:
  - stdin: |
      3
      4
    stdout: "5.0"
  - stdin: |
      1
      1
    stdout: "1.41"
solution: |
  import math

  a = int(input())
  b = int(input())
  print(round(math.sqrt(a * a + b * b), 2))
---
::

If you only need one or two functions, you can import them by name: `from statistics import median`. Then you call `median(...)` directly, with no module name in front.

Now import one function by name.

::exercise
---
id: w4-l1-ex2
prompt: Read whole numbers, one per line, until the word done. Then print their median.
starter: |
  numbers = []
  line = input()
  while line != "done":
      numbers.append(int(line))
      line = input()
  print(median(numbers))
hints:
  - The starter stops with NameError, because median has not been imported.
  - Add from statistics import median as the first line.
tests:
  - stdin: |
      3
      1
      2
      done
    stdout: "2"
  - stdin: |
      4
      1
      3
      2
      done
    stdout: "2.5"
solution: |
  from statistics import median

  numbers = []
  line = input()
  while line != "done":
      numbers.append(int(line))
      line = input()
  print(median(numbers))
---
::
