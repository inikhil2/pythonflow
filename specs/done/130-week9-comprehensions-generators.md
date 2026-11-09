# 130: Week 9 lessons 06 and 07: comprehensions, map and filter, generators
Files: content/week9-etcetera/06-comprehensions.md, content/week9-etcetera/07-generators.md
Severity: med

## Problem
Specs 128 and 129 add week 9 lessons 01 to 05. This spec adds the last two, in the same folder
`content/week9-etcetera/`. They cover list and dict comprehensions with `map` and `filter`, and
generators with `yield`. Lesson 07 ends the course. Do specs 128 and 129 first.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week9-etcetera/06-comprehensions.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Comprehensions, map and filter
week: 9
order: 6
minutes: 10
concepts: [comprehensions]
---

You've often built a list with a loop: start empty, then `append` in a `for` loop. A **list comprehension** does that in one line. `[word.upper() for word in words]` reads as "each word, upper-cased, for every word in words".

Add an `if` at the end to keep only some items. A **dict comprehension** uses curly brackets and a `key: value` pair. Step through this trace:

::trace
---
code: |
  words = ["cat", "dog", "emu"]
  shouting = [word.upper() for word in words]
  kept = [word for word in words if word != "dog"]
  lengths = {word: len(word) for word in words}
  print(shouting)
  print(kept)
  print(lengths)
---
::

Python also has two older functions for the same jobs:

- `map(function, items)` calls the function on each item. `map(str.upper, words)` upper-cases every word.
- `filter(function, items)` keeps the items for which the function returns `True`.

Both give back an object that hands out values one at a time, not a list. Wrap them in `list(...)` to get a list. Most Python programmers find a comprehension easier to read.

A common mistake: returning `map(...)` from a function that should return a list. Printing it shows `<map object at 0x...>`, and comparing it with a list gives `False`.

Your turn: keep only some items.

::exercise
---
id: w9-l6-ex1
prompt: Fix evens so that it returns a list of only the even numbers, in their order. For [1, 2, 3, 4] it returns [2, 4].
starter: |
  def evens(numbers):
      return [n for n in numbers]
hints:
  - The comprehension keeps every number. It needs an if at the end.
  - Write [n for n in numbers if n % 2 == 0].
tests:
  - check: |
      result = evens([1, 2, 3, 4])
      assert result == [2, 4], f"evens returned {result}"
  - check: |
      assert evens([7, 9]) == []
      assert evens([10, 3, 6]) == [10, 6]
solution: |
  def evens(numbers):
      return [n for n in numbers if n % 2 == 0]
---
::

Now return a real list.

::exercise
---
id: w9-l6-ex2
prompt: Fix shout so that it returns a list of the words in capitals. For ["hi", "there"] it returns ["HI", "THERE"].
starter: |
  def shout(words):
      return map(str.upper, words)
hints:
  - map gives back a map object, not a list, so it is not equal to ["HI", "THERE"].
  - Wrap it in list(...), or write the comprehension [word.upper() for word in words].
tests:
  - check: |
      result = shout(["hi", "there"])
      assert result == ["HI", "THERE"], f"shout returned {result!r}"
  - check: |
      assert shout([]) == []
solution: |
  def shout(words):
      return [word.upper() for word in words]
---
::
````

2. **Create `content/week9-etcetera/07-generators.md`** with exactly this content, and nothing before or after it.
````markdown
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
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 49 lessons, 91 exercises`.
2. File sizes match:
```sh
   wc -c "content/week9-etcetera/06-comprehensions.md"   # expect 2655
   wc -c "content/week9-etcetera/07-generators.md"   # expect 3015
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week9-etcetera/06-comprehensions.md" | shasum | cut -c1-12   # expect 4984d4c5f282
   awk '/^::exercise$/,/^::$/' "content/week9-etcetera/07-generators.md" | shasum | cut -c1-12   # expect 4565d96b00a7
```
4. `git status --short` shows only these new lesson files, apart from changes from earlier specs.
