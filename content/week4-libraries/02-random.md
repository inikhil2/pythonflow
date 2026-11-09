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
