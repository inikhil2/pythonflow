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
