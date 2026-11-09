---
title: Operator overloading
week: 8
order: 6
minutes: 10
concepts: [methods]
---

`+` adds numbers, joins strings and joins lists. It does a different job for each type, because each type says what `+` means for it. Your classes can do the same, with more special methods.

When Python sees `a + b`, it calls `a.__add__(b)` and uses what it returns. When it sees `a == b`, it calls `a.__eq__(b)`. Writing these methods is called **operator overloading**. Step through this trace:

::trace
---
code: |
  class Money:
      def __init__(self, cents):
          self.cents = cents

      def __add__(self, other):
          return Money(self.cents + other.cents)

  total = Money(150) + Money(275)
  print(total.cents)
---
::

`__add__` returns a **new** object. Neither of the two amounts changes, just as `2 + 3` doesn't change the `2`.

Without `__eq__`, `==` asks whether both sides are the very same object. Two separate `Money(100)` objects are then not equal, even though they hold the same amount. An `__eq__` method can compare what's inside instead:

```python
def __eq__(self, other):
    return self.cents == other.cents
```

A common mistake: changing `self` in `__add__` and returning it. Then `a + b` quietly changes `a` as well, which nobody expects from `+`.

Your turn: add two vectors.

::exercise
---
id: w8-l6-ex1
prompt: Fix __add__ so that a + b returns a new Vector whose x and y are the sums of a's and b's, and leaves a and b unchanged.
starter: |
  class Vector:
      def __init__(self, x, y):
          self.x = x
          self.y = y

      def __add__(self, other):
          self.x += other.x
          self.y += other.y
          return self
hints:
  - The starter changes self, so after a + b, a has changed too.
  - Return Vector(self.x + other.x, self.y + other.y) instead.
tests:
  - check: |
      total = Vector(1, 2) + Vector(3, 4)
      assert total.x == 4 and total.y == 6, f"the sum is ({total.x}, {total.y})"
  - check: |
      a = Vector(1, 2)
      b = Vector(3, 4)
      a + b
      assert a.x == 1 and a.y == 2, f"a + b changed a to ({a.x}, {a.y})"
solution: |
  class Vector:
      def __init__(self, x, y):
          self.x = x
          self.y = y

      def __add__(self, other):
          return Vector(self.x + other.x, self.y + other.y)
---
::

Now make two equal vectors compare equal.

::exercise
---
id: w8-l6-ex2
prompt: Add an __eq__ method, so that Vector(1, 2) == Vector(1, 2) is True and Vector(1, 2) == Vector(2, 1) is False.
starter: |
  class Vector:
      def __init__(self, x, y):
          self.x = x
          self.y = y
hints:
  - Without __eq__, == is only True for the very same object.
  - Define __eq__(self, other) and return self.x == other.x and self.y == other.y.
tests:
  - check: |
      assert Vector(1, 2) == Vector(1, 2), "two vectors with the same x and y should be equal"
  - check: |
      assert not Vector(1, 2) == Vector(2, 1)
      assert not Vector(1, 2) == Vector(1, 3)
solution: |
  class Vector:
      def __init__(self, x, y):
          self.x = x
          self.y = y

      def __eq__(self, other):
          return self.x == other.x and self.y == other.y
---
::
