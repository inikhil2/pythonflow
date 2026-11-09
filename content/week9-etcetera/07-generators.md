---
title: Generators
week: 9
order: 7
minutes: 10
concepts: [functions, comprehensions]
---

A function that builds a whole list before returning it holds every item in memory at once. For a million items, that's a lot of memory, and the first item can't be used until the last one is made.

A **generator** hands out its values one at a time, as they're needed. To write one, use `yield` instead of `return`. Each `yield` gives back one value and **pauses** the function. When the next value is wanted, the function carries on from where it paused. Step through this trace, and watch `countdown` pause and carry on:

::trace
---
code: |
  def countdown(n):
      while n > 0:
          yield n
          n -= 1

  for number in countdown(3):
      print(number)
  print("Liftoff!")
---
::

Calling `countdown(3)` doesn't run the body at all. It gives back a generator object. The `for` loop then asks it for one value at a time, until the function ends. `list(countdown(3))` collects every value into a list, `[3, 2, 1]`.

`range` works this way too. `range(1_000_000_000)` doesn't make a billion numbers up front, which is why it's fine in a `for` loop.

A common mistake: writing `return n` where `yield n` belongs. `return` ends the function at the first value, so it gives back a plain number, and `for` then stops with `TypeError`, because a number can't be looped over.

Your turn: count down.

::exercise
---
id: w9-l7-ex1
prompt: Fix countdown so that it is a generator. list(countdown(3)) is then [3, 2, 1], and list(countdown(0)) is [].
starter: |
  def countdown(n):
      while n > 0:
          return n
          n -= 1
hints:
  - return ends the function at once, so countdown(3) gives back 3, and list(3) stops with TypeError.
  - Change return to yield.
tests:
  - check: |
      result = list(countdown(3))
      assert result == [3, 2, 1], f"countdown gave {result}"
  - check: |
      assert list(countdown(0)) == []
solution: |
  def countdown(n):
      while n > 0:
          yield n
          n -= 1
---
::

Now make one value at a time instead of a list.

::exercise
---
id: w9-l7-ex2
prompt: Rewrite squares as a generator that yields the square of each number from 1 to n, instead of building a list.
starter: |
  def squares(n):
      result = []
      for i in range(1, n + 1):
          result.append(i * i)
      return result
hints:
  - The tests check that squares(3) gives back a generator, but this version gives back a list.
  - Inside the loop, write yield i * i, and remove result and the return line.
tests:
  - check: |
      import types
      assert isinstance(squares(3), types.GeneratorType), "squares should be a generator, using yield"
  - check: |
      result = list(squares(4))
      assert result == [1, 4, 9, 16], f"squares gave {result}"
solution: |
  def squares(n):
      for i in range(1, n + 1):
          yield i * i
---
::

That's every week of CS50P! You've gone from printing a line to writing your own types. Try a project next, and put it all together.
