---
title: for loops and range
week: 2
order: 2
minutes: 10
concepts: [for-loops, while-loops]
---

Counting with a `while` loop takes three lines of setup: start a counter, check it, and add to it. Counting is so common that Python has a loop built for it, the `for` loop.

```python
for i in range(3):
    print(i)
```

This prints `0`, `1` and `2`. `range(3)` gives the numbers from 0 up to 3, but not including 3. The `for` loop takes each number in turn, puts it in the variable `i`, and runs the body once for each.

Starting at 0 and stopping just before the end can feel odd at first. It means `range(3)` runs exactly 3 times. To start somewhere else, give `range` two numbers: `range(1, 4)` gives 1, 2 and 3, again stopping just before the second number. Step through this trace:

::trace
---
code: |
  for i in range(1, 4):
      print(i * 10)
  print("done")
---
::

The loop prints `10`, `20` and `30`. Then `range` has no numbers left, so Python leaves the loop and prints `done`. There's no counter to forget, so a `for` loop over a `range` always stops.

Your turn: fix a loop that is off by one.

::exercise
---
id: w2-l2-ex1
prompt: Read a whole number n. For every number from 1 to n, print a line like 3 squared is 9.
starter: |
  n = int(input())
  for i in range(n):
      print(f"{i} squared is {i * i}")
hints:
  - The starter begins at 0 squared and stops one number too early.
  - range(1, n + 1) gives every number from 1 up to and including n.
tests:
  - stdin: "3"
    stdout: |
      1 squared is 1
      2 squared is 4
      3 squared is 9
  - stdin: "1"
    stdout: "1 squared is 1"
solution: |
  n = int(input())
  for i in range(1, n + 1):
      print(f"{i} squared is {i * i}")
---
::

Sometimes you need the loop to repeat, but you don't care about the number itself. A useful pattern is the **running total**: start a variable at 0 before the loop, and add to it each time round.

```python
total = 0
for i in range(1, 5):
    total += i
print(total)
```

This prints `10`, because 1 + 2 + 3 + 4 is 10. A common mistake: setting `total = 0` inside the loop. Then it goes back to 0 every round, and only the last number counts.

Now keep a running total of numbers you read.

::exercise
---
id: w2-l2-ex2
prompt: Read a whole number n, then read n more whole numbers, one per line. Print their total.
starter: |
  n = int(input())
  for i in range(n):
      total = 0
      total += int(input())
  print(total)
hints:
  - Each round, the starter puts total back to 0, so only the last number is left.
  - Move total = 0 above the for line, so it starts at 0 just once.
tests:
  - stdin: |
      3
      4
      5
      6
    stdout: "15"
  - stdin: |
      2
      10
      -3
    stdout: "7"
solution: |
  n = int(input())
  total = 0
  for i in range(n):
      total += int(input())
  print(total)
---
::
