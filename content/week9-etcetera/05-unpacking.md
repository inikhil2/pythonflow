---
title: Unpacking, *args and **kwargs
week: 9
order: 5
minutes: 10
concepts: [functions, lists]
---

**Unpacking** takes the items out of a collection in one go. `first, last = "Ada Lovelace".split(" ")` puts each part of the list into its own variable. There must be exactly as many names as items.

A `*` unpacks a list into separate arguments when you call a function. `print(*["a", "b"])` is the same as `print("a", "b")`. A `**` unpacks a dict into keyword arguments, so `f(**{"size": "L"})` is the same as `f(size="L")`.

The same signs work the other way round in a `def`. A parameter written `*numbers` collects every extra positional argument into a tuple. One written `**details` collects every extra keyword argument into a dict. By custom they're often called `*args` and `**kwargs`. Step through this trace:

::trace
---
code: |
  def total(*numbers):
      result = 0
      for number in numbers:
          result += number
      return result

  coins = [1, 5, 10]
  print(total(2, 3))
  print(total(*coins))
---
::

`total` now takes any number of arguments, as `print` does. Inside it, `numbers` is a tuple of all of them.

A common mistake: calling `total(coins)` without the `*`. That passes one argument, the whole list, so `numbers` is `([1, 5, 10],)`, and `result += number` stops with `TypeError`.

Your turn: take any number of arguments.

::exercise
---
id: w9-l5-ex1
prompt: Change largest so that it takes any number of separate arguments. largest(3, 9, 4) returns 9, and largest(7) returns 7.
starter: |
  def largest(numbers):
      return max(numbers)
hints:
  - With one parameter, largest(3, 9, 4) gets three arguments but takes one, so it stops with TypeError.
  - Put a * in front of the parameter, so it collects all the arguments into a tuple.
tests:
  - check: |
      result = largest(3, 9, 4)
      assert result == 9, f"largest returned {result}"
  - check: |
      assert largest(7) == 7
solution: |
  def largest(*numbers):
      return max(numbers)
---
::

Now unpack a dict into keyword arguments.

::exercise
---
id: w9-l5-ex2
prompt: Fix from_dict so that it passes the dict's items to label as keyword arguments. from_dict({"name" with "Tea" and "size" with "large"}) returns "Tea (large)".
starter: |
  def label(name, size):
      return f"{name} ({size})"

  def from_dict(info):
      return label(info)
hints:
  - label(info) passes the whole dict as name, and nothing as size, so it stops with TypeError.
  - Write label(**info), so each key becomes a keyword argument.
tests:
  - check: |
      result = from_dict({"name": "Tea", "size": "large"})
      assert result == "Tea (large)", f"from_dict returned {result!r}"
  - check: |
      assert from_dict({"size": "S", "name": "Jam"}) == "Jam (S)"
solution: |
  def label(name, size):
      return f"{name} ({size})"

  def from_dict(info):
      return label(**info)
---
::
