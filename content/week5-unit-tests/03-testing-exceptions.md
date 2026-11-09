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
