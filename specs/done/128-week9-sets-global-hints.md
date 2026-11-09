# 128: Week 9 lessons 01 to 03: sets, global variables and constants, type hints and docstrings
Files: content/week9-etcetera/01-sets.md, content/week9-etcetera/02-global.md, content/week9-etcetera/03-hints-docstrings.md
Severity: med

## Problem
Week 8 and the trace attributes work are committed. plan.md lists week 9, Et cetera, as type
hints, docstrings, `argparse`, unpacking, `*args` and `**kwargs`, `map` and `filter`,
comprehensions, generators, `set`, constants and `global`. No week 9 lessons exist yet. This spec
adds the first three, in a new folder `content/week9-etcetera/`. The concept ids `sets`,
`functions`, `type-hints` and `docstrings` already exist in `content/concepts.yml`, and week 9
already exists in `content/weeks.yml`, so neither file changes.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week9-etcetera/01-sets.md`** with exactly this content, and nothing before or after it.
````markdown
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
````

2. **Create `content/week9-etcetera/02-global.md`** with exactly this content, and nothing before or after it.
````markdown
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
````

3. **Create `content/week9-etcetera/03-hints-docstrings.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Type hints and docstrings
week: 9
order: 3
minutes: 10
concepts: [type-hints, docstrings]
---

As programs grow, it helps to say what each function expects and what it does. Python has two tools for that.

A **type hint** says what type a value should be. Write it after a parameter's name with a colon, and after the brackets with `->` for what the function returns:

```python
def meow(times: int) -> str:
    return "meow " * times
```

Python itself **doesn't check** hints. `meow("2")` still runs, and stops with `TypeError` only because `"meow " * "2"` makes no sense. Hints are for people, and for tools such as `mypy`, which reads your code and warns you before you run it that `"2"` isn't an `int`.

A **docstring** is a string in triple quotes on the first line inside a function. It says what the function does:

::trace
---
code: |
  def meow(times: int) -> str:
      """Return the word meow, the given number of times."""
      return "meow " * times

  print(meow(3))
  print(meow.__doc__)
---
::

Python keeps the docstring in the function's `__doc__` attribute. `help(meow)` and code editors show it to anyone using the function, which a comment can't do.

A common mistake: writing the description as a `#` comment above the `def`. Comments are thrown away when the code runs, so the function has no docstring, and `meow.__doc__` is `None`.

Your turn: add type hints.

::exercise
---
id: w9-l3-ex1
prompt: Add type hints to double, so that its parameter n is marked as an int and its return value as an int.
starter: |
  def double(n):
      return n * 2
hints:
  - The tests read double.__annotations__, which is empty until the function has hints.
  - "Change the first line to def double(n: int) -> int: and keep the rest."
tests:
  - check: |
      assert double(4) == 8
      assert double.__annotations__ == {"n": int, "return": int}, f"the hints are {double.__annotations__}"
solution: |
  def double(n: int) -> int:
      return n * 2
---
::

Now turn a comment into a docstring.

::exercise
---
id: w9-l3-ex2
prompt: Turn the comment above area into a docstring inside it, so that area.__doc__ describes the function.
starter: |
  # Return the area of a rectangle.
  def area(width: float, height: float) -> float:
      return width * height
hints:
  - A comment is not kept, so area.__doc__ is None.
  - Move the text to the first line inside area, between triple quotes, and remove the comment.
tests:
  - check: |
      assert area.__doc__ is not None, "area has no docstring"
      assert "area" in area.__doc__.lower()
  - check: |
      assert area(3, 4) == 12
solution: |
  def area(width: float, height: float) -> float:
      """Return the area of a rectangle."""
      return width * height
---
::
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 45 lessons, 83 exercises`.
2. File sizes match:
```sh
   wc -c "content/week9-etcetera/01-sets.md"   # expect 2641
   wc -c "content/week9-etcetera/02-global.md"   # expect 2843
   wc -c "content/week9-etcetera/03-hints-docstrings.md"   # expect 2748
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week9-etcetera/01-sets.md" | shasum | cut -c1-12   # expect 972db77302be
   awk '/^::exercise$/,/^::$/' "content/week9-etcetera/02-global.md" | shasum | cut -c1-12   # expect 78323fecee6d
   awk '/^::exercise$/,/^::$/' "content/week9-etcetera/03-hints-docstrings.md" | shasum | cut -c1-12   # expect 7a356b848fbd
```
4. `git status --short` shows only these new lesson files, apart from changes from earlier specs.
