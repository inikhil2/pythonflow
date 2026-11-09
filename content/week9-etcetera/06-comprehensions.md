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
