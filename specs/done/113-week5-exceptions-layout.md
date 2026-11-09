# 113: Week 5 lessons 03 and 04: testing for exceptions, laying out tests
Files: content/week5-unit-tests/03-testing-exceptions.md, content/week5-unit-tests/04-test-layout.md
Severity: med

## Problem
These are the last two week 5 lessons. Run this spec after 111 and 112. Lesson 03 uses
`import pytest` and `pytest.raises`, which load only once spec 111 is in place. With 111
missing, gate 1 fails with `w5-l3-ex1: the solution fails test 1`.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week5-unit-tests/03-testing-exceptions.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Testing for exceptions
week: 5
order: 3
minutes: 10
concepts: [pytest, raise]
---

In week 3, you wrote functions that `raise ValueError` when given bad input. That's part of what the function promises, so it deserves a test too. But how do you assert that something goes wrong?

pytest has a tool for exactly this: `pytest.raises`. You use it with `with`, and put the call that should fail inside:

```python
import pytest

def test_too_high():
    with pytest.raises(ValueError):
        make_score(101)
```

The test passes only if the code inside raises `ValueError`. If nothing is raised, `pytest.raises` makes the test fail with `DID NOT RAISE`. If a different exception is raised, the test fails with that one.

This page can run pytest's tools too, so `import pytest` works in the exercises here.

Testing the good inputs still matters. A function that always raised `ValueError` would pass `test_too_high`, so keep a test that a normal score comes back unchanged.

A common mistake: calling the function before the `with` line, as in `score = make_score(101)`. The exception happens outside `pytest.raises`, so the test stops with `ValueError` instead of passing.

Your turn: test both sides of `make_score`.

::exercise
---
id: w5-l3-ex1
prompt: make_score returns a score from 0 to 100 and raises ValueError for anything else. Finish test_bad_scores so that it uses pytest.raises to check that make_score(101) and make_score(-1) both raise ValueError.
starter: |
  import pytest

  def make_score(n):
      if n < 0 or n > 100:
          raise ValueError("score must be from 0 to 100")
      return n

  def test_good_scores():
      assert make_score(0) == 0
      assert make_score(100) == 100

  def test_bad_scores():
      pass
hints:
  - Put each bad call inside its own with pytest.raises(ValueError) block.
  - The tests also try a make_score that never raises, and your test must fail for that one.
tests:
  - check: |
      test_good_scores()
      test_bad_scores()
  - check: |
      def make_score(n):
          return n
      try:
          test_bad_scores()
          failed = False
      except BaseException:
          failed = True
      assert failed, "test_bad_scores passed, but make_score(101) raised nothing"
  - check: |
      def make_score(n):
          if n > 100:
              raise ValueError("score must be from 0 to 100")
          return n
      try:
          test_bad_scores()
          failed = False
      except BaseException:
          failed = True
      assert failed, "test_bad_scores passed, but make_score(-1) raised nothing"
solution: |
  import pytest

  def make_score(n):
      if n < 0 or n > 100:
          raise ValueError("score must be from 0 to 100")
      return n

  def test_good_scores():
      assert make_score(0) == 0
      assert make_score(100) == 100

  def test_bad_scores():
      with pytest.raises(ValueError):
          make_score(101)
      with pytest.raises(ValueError):
          make_score(-1)
---
::
````
2. **Create `content/week5-unit-tests/04-test-layout.md`** with exactly this content, and nothing before or after it.
````markdown
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
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 28 lessons, 51 exercises`.
2. File sizes match:
```sh
   wc -c "content/week5-unit-tests/03-testing-exceptions.md"   # expect 2997
   wc -c "content/week5-unit-tests/04-test-layout.md"   # expect 2617
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week5-unit-tests/03-testing-exceptions.md" | shasum | cut -c1-12   # expect 3f962214a737
   awk '/^::exercise$/,/^::$/' "content/week5-unit-tests/04-test-layout.md" | shasum | cut -c1-12   # expect 2304bd101d77
```
4. `git status --short` shows only these new lesson files, apart from changes from earlier specs.
