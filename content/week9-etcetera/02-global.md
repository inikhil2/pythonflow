---
title: Global variables and constants
week: 9
order: 2
minutes: 10
concepts: [functions]
---

A variable made outside every function is a **global** variable. Any function can read it. But as soon as a function **assigns** to a name, Python treats that name as a new local variable inside the function. So `count += 1` in a function stops with `UnboundLocalError`, because the local `count` has no value yet.

To change the global variable from inside a function, say so first with `global`. Step through this trace:

::trace
---
code: |
  count = 0

  def add():
      global count
      count += 1

  add()
  add()
  print(count)
---
::

Use `global` sparingly. When any function can change a variable, it gets hard to tell which one did. Passing values in and returning them, or keeping them on an object as in week 8, is usually clearer.

A **constant** is a global value that never changes, such as the number of guesses a game allows. By custom, its name is in capitals, as in `MAX_GUESSES = 3`. Python doesn't stop you from changing it. The capitals are a sign to people reading the code. Giving the number a name means it is written once, so changing the rule means changing one line.

A common mistake: forgetting `global` and expecting the function to change the global variable. Without it, the function's assignment is local, or it stops with `UnboundLocalError`.

Your turn: change a global total.

::exercise
---
id: w9-l2-ex1
prompt: Fix deposit so that it adds amount to the global variable total. After deposit(5), total has gone up by 5.
starter: |
  total = 0

  def deposit(amount):
      total += amount
hints:
  - Because deposit assigns to total, Python treats total as a local variable, so it stops with UnboundLocalError.
  - Write global total as the first line of deposit.
tests:
  - check: |
      before = total
      deposit(5)
      assert total == before + 5, f"total went from {before} to {total}"
  - check: |
      before = total
      deposit(2)
      deposit(3)
      assert total == before + 5
solution: |
  total = 0

  def deposit(amount):
      global total
      total += amount
---
::

Now use a constant instead of a number.

::exercise
---
id: w9-l2-ex2
prompt: Change allowed so that it uses the constant MAX_GUESSES instead of the number 3. Then changing MAX_GUESSES changes the rule.
starter: |
  MAX_GUESSES = 3

  def allowed(guesses):
      return guesses < 3
hints:
  - The tests change MAX_GUESSES to 5, but allowed still compares with 3.
  - Write return guesses < MAX_GUESSES.
tests:
  - check: |
      assert allowed(2) is True
      assert allowed(3) is False
  - check: |
      MAX_GUESSES = 5
      assert allowed(4) is True, "with MAX_GUESSES set to 5, 4 guesses should be allowed"
solution: |
  MAX_GUESSES = 3

  def allowed(guesses):
      return guesses < MAX_GUESSES
---
::
