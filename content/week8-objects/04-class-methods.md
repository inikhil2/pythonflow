---
title: Class attributes and class methods
week: 8
order: 4
minutes: 10
concepts: [methods, classes]
---

So far, every attribute has belonged to one object. A **class attribute** belongs to the class itself, and all its objects share it. You write it inside the class but outside any method:

::trace
---
code: |
  class Point:
      made = 0

      def __init__(self, x, y):
          self.x = x
          self.y = y
          Point.made += 1

  Point(1, 2)
  Point(3, 4)
  print(Point.made, "points made")
---
::

`Point.made += 1` changes the one shared value, so it counts every point ever made.

A **class method** works on the class instead of on one object. Mark it with `@classmethod`. Its first argument is the class, called `cls` by custom, instead of `self`. Class methods are often used as another way to make objects:

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    @classmethod
    def from_string(cls, text):
        x, y = text.split(",")
        return cls(int(x), int(y))

point = Point.from_string("3,4")
```

`cls(int(x), int(y))` is the same as `Point(int(x), int(y))` here, and calls `__init__` as usual.

A common mistake: changing a class attribute with `self.made += 1`. That reads the shared value, but then stores the result on that one object, as a new attribute of its own. `Point.made` never changes.

Your turn: count every object made.

::exercise
---
id: w8-l4-ex1
prompt: Fix Point so that Point.made counts every Point ever made. After two more points are made, Point.made has gone up by 2.
starter: |
  class Point:
      made = 0

      def __init__(self, x, y):
          self.x = x
          self.y = y
          self.made += 1
hints:
  - self.made += 1 gives each point its own made attribute, so Point.made stays 0.
  - Write Point.made += 1, so the shared class attribute changes.
tests:
  - check: |
      before = Point.made
      Point(1, 2)
      Point(3, 4)
      assert Point.made == before + 2, f"Point.made went from {before} to {Point.made}"
solution: |
  class Point:
      made = 0

      def __init__(self, x, y):
          self.x = x
          self.y = y
          Point.made += 1
---
::

Now give a class another way to make objects.

::exercise
---
id: w8-l4-ex2
prompt: Fix from_string so that Point.from_string("3,4") returns a Point with x 3 and y 4.
starter: |
  class Point:
      def __init__(self, x, y):
          self.x = x
          self.y = y

      def from_string(self, text):
          x, y = text.split(",")
          return Point(int(x), int(y))
hints:
  - Called on the class, Point.from_string("3,4") puts "3,4" into self and has nothing left for text, so Python stops with TypeError.
  - Put @classmethod above it, name the first argument cls, and return cls(int(x), int(y)).
tests:
  - check: |
      point = Point.from_string("3,4")
      assert isinstance(point, Point)
      assert point.x == 3 and point.y == 4, f"the point is ({point.x}, {point.y})"
  - check: |
      point = Point.from_string("-1,10")
      assert point.x == -1 and point.y == 10
solution: |
  class Point:
      def __init__(self, x, y):
          self.x = x
          self.y = y

      @classmethod
      def from_string(cls, text):
          x, y = text.split(",")
          return cls(int(x), int(y))
---
::
