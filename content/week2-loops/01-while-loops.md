---
title: while loops
week: 2
order: 1
minutes: 10
concepts: [while-loops, conditionals]
---

Welcome to week 2! Your programs can now make decisions. This week they'll learn to repeat work, so that a few lines of code can do the same job ten times, or a thousand.

The simplest way to repeat is a `while` loop. It looks like an `if`, with a condition, a colon and an indented body. The difference is what happens after the body runs: Python goes back to the top and checks the condition again. It keeps going round until the condition is `False`.

```python
n = 3
while n > 0:
    print(n)
    n = n - 1
print("liftoff")
```

This prints `3`, `2`, `1` and then `liftoff`. Step through this trace and watch Python jump back to the `while` line after each round:

::trace
---
code: |
  n = 3
  while n > 0:
      print(n)
      n = n - 1
  print("liftoff")
---
::

The line `n = n - 1` matters. Each round makes `n` smaller, so the condition `n > 0` turns `False` in the end. Changing a variable by a small amount is so common that Python has a shorter way to write it: `n -= 1` takes 1 away from `n`, and `n += 1` adds 1.

A common mistake: forgetting to change the variable. Then the condition stays `True` forever, and the loop never stops. If that happens here, press Stop, or wait: the app stops any program that runs for more than 10 seconds.

Your turn: count up instead of down.

::exercise
---
id: w2-l1-ex1
prompt: Read a whole number n, and print every number from 1 up to n, one per line. Use a while loop.
starter: |
  n = int(input())
  i = 1
hints:
  - Keep going while i is not bigger than n, so the condition is i <= n.
  - Inside the loop, print i, then add 1 to it with i += 1.
tests:
  - stdin: "3"
    stdout: |
      1
      2
      3
  - stdin: "1"
    stdout: "1"
  - stdin: "5"
    stdout: |
      1
      2
      3
      4
      5
solution: |
  n = int(input())
  i = 1
  while i <= n:
      print(i)
      i += 1
---
::

A `while` loop is also the right tool when you don't know how many rounds you'll need. A program can keep asking for input until it gets an answer it can use. Each time someone types a bad answer, the loop goes round once more.

Now use a loop to keep asking.

::exercise
---
id: w2-l1-ex2
prompt: Read whole numbers, one per line, until you get one that is more than 0. Then print that number.
starter: |
  n = int(input())
  if n <= 0:
      n = int(input())
  print(n)
hints:
  - The starter only asks again once, so two bad numbers in a row get through.
  - Change if to while, so it keeps asking for as long as the number is not more than 0.
tests:
  - stdin: "7"
    stdout: "7"
  - stdin: |
      -2
      4
    stdout: "4"
  - stdin: |
      0
      -5
      9
    stdout: "9"
solution: |
  n = int(input())
  while n <= 0:
      n = int(input())
  print(n)
---
::
