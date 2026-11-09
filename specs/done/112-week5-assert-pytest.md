# 112: Week 5 lessons 01 and 02: testing with assert, running tests with pytest
Files: content/week5-unit-tests/01-assert.md, content/week5-unit-tests/02-pytest.md
Severity: med

## Problem
Week 4 is committed. plan.md lists week 5 as `assert`, `pytest`, testing for exceptions and
test layout, and no week 5 lessons exist yet. This spec adds the first two, in a new folder
`content/week5-unit-tests/`. The app and the lesson checker pick up week folders on their own.
In these exercises, the learner writes test functions, and the tests run them against a correct
function and against broken ones.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week5-unit-tests/01-assert.md`** with exactly this content, and nothing before or after it.
````markdown
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
````
2. **Create `content/week5-unit-tests/02-pytest.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Running tests with pytest
week: 5
order: 2
minutes: 10
concepts: [pytest]
---

Calling every test by hand gets tiring, and a program stops at the first failed `assert`. **pytest** is a popular package that fixes both. It finds your tests, runs every one of them, and reports which failed and why.

On your own computer, you install it once with `pip install pytest`. Then you put your tests in a file whose name starts with `test_`, and run them from a terminal:

```sh
pytest test_square.py
```

pytest runs every function whose name starts with `test_`. You don't call them yourself. If one fails, it reports the failure and moves on to the next. The report ends with a summary line, such as:

```text
1 failed, 2 passed in 0.01s
```

For each failed test, pytest shows the `assert` line and the values it compared, such as `assert 6 == 9`. That tells you exactly where to look.

A test function stops at its first failed `assert`, just like any code. So pytest users write **several small tests**, each about one kind of input. Then one failure doesn't hide the others, and each test's name says what broke:

```python
def test_positive():
    assert square(3) == 9

def test_negative():
    assert square(-3) == 9

def test_zero():
    assert square(0) == 0
```

A common mistake: naming a test `check_square` or `square_test`. pytest only finds functions whose names start with `test_`, so it would skip them without any warning.

Your turn: split tests up by kind of input.

::exercise
---
id: w5-l2-ex1
prompt: sign returns "positive", "negative" or "zero". Write three tests, test_positive, test_negative and test_zero, each checking one kind of number. Each must pass for this sign, and fail for a sign that gets its own kind of number wrong.
starter: |
  def sign(n):
      if n > 0:
          return "positive"
      if n < 0:
          return "negative"
      return "zero"

  def test_all():
      assert sign(5) == "positive"
      assert sign(-5) == "negative"
      assert sign(0) == "zero"
hints:
  - The tests call test_positive, test_negative and test_zero by name, and the starter has none of them.
  - Move each assert into its own function. For example, test_zero holds assert sign(0) == "zero".
tests:
  - check: |
      test_positive()
      test_negative()
      test_zero()
  - check: |
      def sign(n):
          return "positive" if n >= 0 else "negative"
      test_positive()
      test_negative()
      try:
          test_zero()
          raise RuntimeError("test_zero passed, but sign(0) was not zero")
      except AssertionError:
          pass
  - check: |
      def sign(n):
          if n > 0:
              return "positive"
          return "zero"
      test_positive()
      test_zero()
      try:
          test_negative()
          raise RuntimeError("test_negative passed, but sign(-5) was not negative")
      except AssertionError:
          pass
solution: |
  def sign(n):
      if n > 0:
          return "positive"
      if n < 0:
          return "negative"
      return "zero"

  def test_positive():
      assert sign(5) == "positive"

  def test_negative():
      assert sign(-5) == "negative"

  def test_zero():
      assert sign(0) == "zero"
---
::
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 26 lessons, 49 exercises`.
2. File sizes match:
```sh
   wc -c "content/week5-unit-tests/01-assert.md"   # expect 3905
   wc -c "content/week5-unit-tests/02-pytest.md"   # expect 3218
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week5-unit-tests/01-assert.md" | shasum | cut -c1-12   # expect 78532625e6cd
   awk '/^::exercise$/,/^::$/' "content/week5-unit-tests/02-pytest.md" | shasum | cut -c1-12   # expect 0aa8ac42bdf5
```
4. `git status --short` shows only these new lesson files, apart from changes from earlier specs.
