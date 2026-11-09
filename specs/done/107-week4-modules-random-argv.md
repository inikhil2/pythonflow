# 107: Week 4 lessons 01 to 03: modules, random, command-line arguments
Files: content/week4-libraries/01-modules.md, content/week4-libraries/02-random.md, content/week4-libraries/03-command-line.md
Severity: med

## Problem
Week 3 is committed. plan.md lists week 4 as `random`, `statistics`, `sys`/`argv`, packages,
APIs (mocked) and writing your own modules, and no week 4 lessons exist yet. This spec adds
the first three, in a new folder `content/week4-libraries/`. The app and the lesson checker
pick up week folders on their own.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week4-libraries/01-modules.md`** with exactly this content, and nothing before or after it.
````markdown
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
````
2. **Create `content/week4-libraries/02-random.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: The random module
week: 4
order: 2
minutes: 8
concepts: [random, modules]
---

Games, quizzes and simulations need a bit of chance. The `random` module gives your program random choices and random numbers.

- `random.randint(a, b)` gives a random whole number from `a` to `b`
- `random.choice(items)` picks one value from a list
- `random.shuffle(items)` mixes a list into a random order

```python
import random

print(random.randint(1, 6))
print(random.choice(["red", "green", "blue"]))
```

Run this a few times. The output changes almost every time, which is the whole point.

A common mistake: thinking `randint` stops before the end, like `range`. It doesn't. `random.randint(1, 6)` can give 6, so it's a fair die. `range(1, 6)` stops at 5.

Step through this trace to watch `shuffle` change a list:

::trace
---
code: |
  import random

  order = ["Ana", "Ben", "Cy"]
  random.shuffle(order)
  print(order)
---
::

`shuffle` gives back nothing. It changes the list you hand it, so `order` itself is now in a new order.

How can tests check a program that does something different each time? They call it many times and check every answer is allowed. That's how the tests below work.

Your turn: roll a fair die.

::exercise
---
id: w4-l2-ex1
prompt: Finish roll so that it returns a random whole number from 1 to 6. Every number from 1 to 6 must be possible, and nothing else.
starter: |
  import random

  def roll():
      return random.randint(0, 6)
hints:
  - randint includes both ends, so randint(0, 6) can give 0.
  - The lowest roll on a die is 1.
tests:
  - check: |
      rolls = []
      for i in range(600):
          rolls.append(roll())
      for r in rolls:
          assert 1 <= r <= 6, f"roll() gave {r}"
      for face in range(1, 7):
          assert face in rolls, f"roll() never gave {face}"
solution: |
  import random

  def roll():
      return random.randint(1, 6)
---
::

Now pick from a list.

::exercise
---
id: w4-l2-ex2
prompt: Finish pick so that it returns one question from the list questions, chosen at random.
starter: |
  import random

  def pick(questions):
      return questions[0]
hints:
  - The starter always gives the first question, so it is not random.
  - random.choice(questions) returns one value from the list.
tests:
  - check: |
      quiz = ["2 + 2?", "Capital of Peru?", "Largest planet?"]
      picked = []
      for i in range(300):
          picked.append(pick(quiz))
      for q in picked:
          assert q in quiz, f"pick gave {q!r}, which is not in the list"
      for q in quiz:
          assert q in picked, f"pick never gave {q!r}"
solution: |
  import random

  def pick(questions):
      return random.choice(questions)
---
::
````
3. **Create `content/week4-libraries/03-command-line.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Command-line arguments
week: 4
order: 3
minutes: 10
concepts: [command-line, lists]
---

On your own computer, you run a Python program by typing a command in a terminal, such as `python table.py 7`. The words after the program's name are **command-line arguments**. They let someone give a program its input before it starts, without any `input()`.

The `sys` module puts them in a list called `sys.argv`. For `python table.py 7`, `sys.argv` is `["table.py", "7"]`. The program's own name always comes first, and every argument is text, even `"7"`.

This page has no terminal, so the examples below set `sys.argv` themselves, to pretend the program was run with arguments. Step through this trace:

::trace
---
code: |
  import sys

  sys.argv = ["table.py", "3"]
  n = int(sys.argv[1])
  for i in range(1, 4):
      print(f"{n} x {i} = {n * i}")
---
::

To take every argument after the program's name, use a **slice**: `sys.argv[1:]` is a new list of everything from index 1 to the end.

Your turn: add up the arguments.

::exercise
---
id: w4-l3-ex1
prompt: Finish add so that, given a list like sys.argv, it returns the total of every number after the program's name. For ["add.py", "3", "4"] it returns 7.
starter: |
  def add(argv):
      total = 0
      for arg in argv:
          total += int(arg)
      return total
hints:
  - The starter also tries int("add.py"), which raises ValueError.
  - Loop over argv[1:] instead, to skip the program's name.
tests:
  - check: |
      assert add(["add.py", "3", "4", "5"]) == 12
  - check: |
      assert add(["add.py", "10"]) == 10
      assert add(["add.py"]) == 0
solution: |
  def add(argv):
      total = 0
      for arg in argv[1:]:
          total += int(arg)
      return total
---
::

What if someone forgets the argument? `sys.argv[1]` would stop with `IndexError`, which helps nobody. A good program checks `len(sys.argv)` first and explains how to run it. `sys.exit("message")` stops the program at once and shows that message. In this app, it appears as `SystemExit:` followed by your message.

Now make a program explain itself.

::exercise
---
id: w4-l3-ex2
prompt: 'Finish get_name so that it returns the one name in a list like sys.argv. If there is not exactly one name after the program''s name, it calls sys.exit("Usage: python hi.py NAME").'
starter: |
  import sys

  def get_name(argv):
      return argv[1]
hints:
  - With no name, argv[1] stops with IndexError. With two names, the second is ignored.
  - Check that len(argv) == 2. If it isn't, call sys.exit with the usage message.
tests:
  - check: |
      assert get_name(["hi.py", "Ada"]) == "Ada"
  - check: |
      try:
          get_name(["hi.py"])
          raise AssertionError("get_name with no name should call sys.exit")
      except SystemExit as e:
          assert str(e) == "Usage: python hi.py NAME", f"the message was {str(e)!r}"
  - check: |
      try:
          get_name(["hi.py", "Ada", "Lovelace"])
          raise AssertionError("get_name with two names should call sys.exit")
      except SystemExit as e:
          assert str(e) == "Usage: python hi.py NAME", f"the message was {str(e)!r}"
solution: |
  import sys

  def get_name(argv):
      if len(argv) != 2:
          sys.exit("Usage: python hi.py NAME")
      return argv[1]
---
::
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 22 lessons, 43 exercises`.
2. File sizes match:
```sh
   wc -c "content/week4-libraries/01-modules.md"   # expect 2940
   wc -c "content/week4-libraries/02-random.md"   # expect 2712
   wc -c "content/week4-libraries/03-command-line.md"   # expect 3300
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week4-libraries/01-modules.md" | shasum | cut -c1-12   # expect fccb49f3798c
   awk '/^::exercise$/,/^::$/' "content/week4-libraries/02-random.md" | shasum | cut -c1-12   # expect d6c01dd8a9ad
   awk '/^::exercise$/,/^::$/' "content/week4-libraries/03-command-line.md" | shasum | cut -c1-12   # expect 667c3e136974
```
4. `git status --short` shows only these new lesson files, apart from changes from earlier specs.
