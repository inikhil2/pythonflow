---
title: Sets
week: 9
order: 1
minutes: 10
concepts: [sets]
---

Welcome to week 9, the last week! This week is a tour of tools that didn't fit anywhere else, starting with a new data structure.

A **set** is a collection with no repeats. Adding something that's already there changes nothing. You write a set with curly brackets, as in `{"red", "blue"}`, or make one from a list with `set(...)`, which drops the repeats. Step through this trace:

::trace
---
code: |
  colours = ["red", "blue", "red", "green", "blue"]
  different = set(colours)
  different.add("red")
  print(len(different), "different colours")
  print("green" in different)
---
::

A set doesn't keep things in order, so it has no index: `different[0]` stops with `TypeError`. When you need an order, `sorted(different)` gives a sorted list. Checking `in` a set is very fast, even for a huge set.

Two sets can be combined:

- `a | b` is everything in either set.
- `a & b` is only what is in both.
- `a - b` is what is in `a` but not in `b`.

A common mistake: making an empty set with `{}`. Empty curly brackets make an empty **dict**, so `.add` then stops with `AttributeError`. An empty set is `set()`.

Your turn: count without repeats.

::exercise
---
id: w9-l1-ex1
prompt: Fix different so that it returns how many different words are in the list. For ["tea", "jam", "tea"] it returns 2.
starter: |
  def different(words):
      seen = {}
      for word in words:
          seen.add(word)
      return len(seen)
hints:
  - Empty curly brackets make a dict, and a dict has no add method.
  - Start with seen = set() instead.
tests:
  - check: |
      count = different(["tea", "jam", "tea"])
      assert count == 2, f"different returned {count}"
  - check: |
      assert different([]) == 0
      assert different(["a", "b", "c"]) == 3
solution: |
  def different(words):
      seen = set()
      for word in words:
          seen.add(word)
      return len(seen)
---
::

Now find what two lists share.

::exercise
---
id: w9-l1-ex2
prompt: Fix in_both so that it returns a sorted list of the items that appear in both lists, with no repeats.
starter: |
  def in_both(first, second):
      return sorted(set(first) | set(second))
hints:
  - The | operator gives everything in either set. You want only what is in both.
  - Use & instead of |.
tests:
  - check: |
      shared = in_both(["tea", "jam", "toast"], ["jam", "eggs", "tea", "jam"])
      assert shared == ["jam", "tea"], f"in_both returned {shared}"
  - check: |
      assert in_both([1, 2], [3, 4]) == []
solution: |
  def in_both(first, second):
      return sorted(set(first) & set(second))
---
::
