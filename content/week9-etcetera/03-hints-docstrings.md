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
