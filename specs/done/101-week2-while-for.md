# 101: Week 2 lessons 01 and 02: while loops, for loops and range
Files: content/week2-loops/01-while-loops.md, content/week2-loops/02-for-and-range.md
Severity: med

## Problem
Week 1 is committed. plan.md lists week 2 as `while`, `for`, lists, `len`, `range` and
dictionaries, and no week 2 lessons exist yet. This spec adds the first two, in a new folder
`content/week2-loops/`. The app and the lesson checker pick up week folders on their own,
so no code changes.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week2-loops/01-while-loops.md`** with exactly this content, and nothing before or after it.
````markdown
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
````
2. **Create `content/week2-loops/02-for-and-range.md`** with exactly this content, and nothing before or after it.
````markdown
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
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 14 lessons, 27 exercises`.
2. File sizes match:
```sh
   wc -c "content/week2-loops/01-while-loops.md"   # expect 2821
   wc -c "content/week2-loops/02-for-and-range.md"   # expect 2842
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week2-loops/01-while-loops.md" | shasum | cut -c1-12   # expect 71b64296aab2
   awk '/^::exercise$/,/^::$/' "content/week2-loops/02-for-and-range.md" | shasum | cut -c1-12   # expect bb12ab0ca105
```
4. `git status --short` shows only these new lesson files.
