---
title: Laying out tests
week: 5
order: 4
minutes: 10
concepts: [pytest, modules]
---

In a real project, tests live in their own file, next to the code they test. For a module called `units.py`, the tests go in `test_units.py`:

```python
from units import km_to_miles

def test_ten():
    assert round(km_to_miles(10), 1) == 6.2
```

Running `pytest test_units.py` imports `units.py` and then runs each test. Two habits from earlier weeks make this work.

First, the `if __name__ == "__main__":` check from week 4. Importing a file runs every line in it. Without the check, importing `units.py` would run `main()`, which might sit waiting for `input()` forever.

Second, functions that **return** their answers instead of printing them. A test can compare what a function returns. It can't easily see what a function printed. So keep `print` and `input` in `main`, and do the real work in functions that return a value:

::trace
---
code: |
  def greet(name):
      return f"Hello, {name}!"

  def main():
      name = input()
      print(greet(name))

  assert greet("Ada") == "Hello, Ada!"
  print("greet works")
---
::

Bigger projects put many test files in a folder called `tests`. pytest finds every `test_` file in it when you run `pytest` with no file name.

A common mistake: writing `assert greet("Ada") == "Hello, Ada!"` when `greet` prints instead of returning. A function with no `return` gives back `None`, so the test fails even though the right words appeared on screen.

Your turn: make a function testable.

::exercise
---
id: w5-l4-ex1
prompt: greet prints its message, so test_greet fails. Change greet so that it returns the message instead, and make main print it. The program still prints a line like Hello, Ada! for the name it reads, and test_greet must pass.
starter: |
  def greet(name):
      print(f"Hello, {name}!")

  def main():
      name = input()
      greet(name)

  def test_greet():
      assert greet("Ada") == "Hello, Ada!"

  if __name__ == "__main__":
      main()
hints:
  - greet has no return, so greet("Ada") gives back None, and the assert compares None with "Hello, Ada!".
  - In greet, change print to return. In main, write print(greet(name)).
tests:
  - stdin: "Ada"
    stdout: "Hello, Ada!"
  - stdin: "Bo"
    stdout: "Hello, Bo!"
  - stdin: "Ada"
    check: |
      test_greet()
      assert greet("Cy") == "Hello, Cy!"
solution: |
  def greet(name):
      return f"Hello, {name}!"

  def main():
      name = input()
      print(greet(name))

  def test_greet():
      assert greet("Ada") == "Hello, Ada!"

  if __name__ == "__main__":
      main()
---
::
