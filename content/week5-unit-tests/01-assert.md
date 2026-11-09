---
title: Testing with assert
week: 5
order: 1
minutes: 10
concepts: [assert, functions]
---

Welcome to week 5! So far you've checked your programs by running them and reading the output. That works for a small program, once. But every time you change the code, you'd have to check everything again by hand. This week you'll write code that checks your code for you: **tests**.

The simplest tool is `assert`. It takes a condition. If the condition is true, nothing happens. If it's false, Python stops with `AssertionError`:

```python
assert 2 + 2 == 4
assert 2 + 2 == 5
```

The first line passes quietly. The second stops the program.

A **test** is a function that calls your code with inputs you chose and asserts the answers are right. By custom, its name starts with `test_`. Step through this trace:

::trace
---
code: |
  def square(n):
      return n * n

  def test_square():
      assert square(2) == 4
      assert square(3) == 9
      assert square(-2) == 4

  test_square()
  print("all tests passed")
---
::

If any assert fails, the test stops there and `print` never runs.

Why test `square(3)` when `square(2)` passed? Because one check can be fooled. Imagine `square` was written as `n + n` by mistake. Then `square(2)` is `4`, which is right by luck. `square(3)` is `6`, and that assert catches the mistake.

A common mistake: testing only one easy value. Good tests also try other values, negative numbers and zero.

Your turn: make a test catch that mistake. The tests for this exercise run your `test_square` twice: once with a correct `square`, and once with `n + n`.

::exercise
---
id: w5-l1-ex1
prompt: Improve test_square so that it passes when square is correct, but fails with AssertionError when square is written as n + n.
starter: |
  def square(n):
      return n * n

  def test_square():
      assert square(2) == 4
hints:
  - square(2) is 4 for both n * n and n + n, so this one assert cannot tell them apart.
  - Add an assert that a correct square passes and n + n fails, such as assert square(3) == 9.
tests:
  - check: |
      test_square()
  - check: |
      def square(n):
          return n + n
      try:
          test_square()
          raise RuntimeError("test_square passed, but square was n + n")
      except AssertionError:
          pass
solution: |
  def square(n):
      return n * n

  def test_square():
      assert square(2) == 4
      assert square(3) == 9
      assert square(-2) == 4
      assert square(0) == 0
---
::

Now write a test from scratch. The tests run it against a correct `initials` and two broken ones.

::exercise
---
id: w5-l1-ex2
prompt: Write test_initials. It must pass for the initials function given, and fail if initials forgets to use capital letters, or uses only the first name.
starter: |
  def initials(name):
      first, last = name.split(" ")
      return (first[0] + last[0]).upper()

  def test_initials():
      pass
hints:
  - With only pass, the test can never fail, so it cannot catch a bug.
  - Try assert initials("Ada Lovelace") == "AL", and a name typed in lowercase, such as "grace hopper".
tests:
  - check: |
      test_initials()
  - check: |
      def initials(name):
          first, last = name.split(" ")
          return first[0] + last[0]
      try:
          test_initials()
          raise RuntimeError("test_initials passed, but initials did not use capitals")
      except AssertionError:
          pass
  - check: |
      def initials(name):
          return name[0].upper()
      try:
          test_initials()
          raise RuntimeError("test_initials passed, but initials used only the first name")
      except AssertionError:
          pass
solution: |
  def initials(name):
      first, last = name.split(" ")
      return (first[0] + last[0]).upper()

  def test_initials():
      assert initials("Ada Lovelace") == "AL"
      assert initials("grace hopper") == "GH"
---
::
