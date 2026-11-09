# 122: Week 8 lessons 04 to 06: class methods, inheritance, operator overloading
Files: content/week8-objects/04-class-methods.md, content/week8-objects/05-inheritance.md, content/week8-objects/06-operators.md
Severity: med

## Problem
Spec 121 adds week 8 lessons 01 to 03. This spec adds the last three, in the same folder
`content/week8-objects/`. They cover class attributes and `@classmethod`, inheritance with
`super()` and overriding, and operator overloading with `__add__` and `__eq__`. Do spec 121 first.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week8-objects/04-class-methods.md`** with exactly this content, and nothing before or after it.
````markdown
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
````

2. **Create `content/week8-objects/05-inheritance.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Inheritance
week: 8
order: 5
minutes: 10
concepts: [inheritance]
---

Different classes often share a lot. A student and a teacher both have a name, and both can be greeted. Instead of writing the shared part twice, you can write it once in a **parent class**. Other classes then **inherit** from it, and get all its methods for free.

Put the parent's name in brackets after the new class's name. Inside the child class, `super()` reaches the parent, so `super().__init__(name)` runs the parent's `__init__` to set up the shared part. Step through this trace:

::trace
---
code: |
  class Person:
      def __init__(self, name):
          self.name = name

      def greet(self):
          return f"Hello, {self.name}"

  class Student(Person):
      def __init__(self, name, school):
          super().__init__(name)
          self.school = school

  student = Student("Ada", "Lakeside")
  print(student.greet(), "from", student.school)
---
::

`Student` never defines `greet`, so Python looks in `Person` and finds it there. A child class can also define a method with the same name as one in the parent. Its own version is then used instead. That's called **overriding**.

`isinstance(student, Person)` is `True`. A student is a kind of person, so it works anywhere a person does.

A common mistake: giving the child its own `__init__` and forgetting `super().__init__(...)`. The child's `__init__` replaces the parent's, so the parent's part is never set up. Here, `student.name` would stop with `AttributeError`.

Your turn: set up the parent's part.

::exercise
---
id: w8-l5-ex1
prompt: Fix Student.__init__ so that a Student has both a name and a school, and greet works. Student("Ada", "Lakeside").greet() returns "Hello, Ada".
starter: |
  class Person:
      def __init__(self, name):
          self.name = name

      def greet(self):
          return f"Hello, {self.name}"

  class Student(Person):
      def __init__(self, name, school):
          self.school = school
hints:
  - Student's __init__ replaces Person's, so self.name is never set.
  - Call super().__init__(name) at the start of Student's __init__.
tests:
  - check: |
      student = Student("Ada", "Lakeside")
      assert student.school == "Lakeside"
      assert student.name == "Ada"
      assert student.greet() == "Hello, Ada"
  - check: |
      assert isinstance(Student("Bo", "Hilltop"), Person)
      assert Person("Cy").greet() == "Hello, Cy"
solution: |
  class Person:
      def __init__(self, name):
          self.name = name

      def greet(self):
          return f"Hello, {self.name}"

  class Student(Person):
      def __init__(self, name, school):
          super().__init__(name)
          self.school = school
---
::

Now override a method.

::exercise
---
id: w8-l5-ex2
prompt: Give Teacher its own greet method, so that Teacher("Grace").greet() returns "Good morning, Grace". Person greets as before.
starter: |
  class Person:
      def __init__(self, name):
          self.name = name

      def greet(self):
          return f"Hello, {self.name}"

  class Teacher(Person):
      pass
hints:
  - Teacher has no greet of its own, so it uses Person's and says Hello.
  - Inside Teacher, define greet(self) and return f"Good morning, {self.name}".
tests:
  - check: |
      greeting = Teacher("Grace").greet()
      assert greeting == "Good morning, Grace", f"greet returned {greeting!r}"
  - check: |
      assert Person("Ada").greet() == "Hello, Ada"
      assert Teacher("Bo").name == "Bo"
solution: |
  class Person:
      def __init__(self, name):
          self.name = name

      def greet(self):
          return f"Hello, {self.name}"

  class Teacher(Person):
      def greet(self):
          return f"Good morning, {self.name}"
---
::
````

3. **Create `content/week8-objects/06-operators.md`** with exactly this content, and nothing before or after it.
````markdown
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
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 42 lessons, 77 exercises`.
2. File sizes match:
```sh
   wc -c "content/week8-objects/04-class-methods.md"   # expect 3316
   wc -c "content/week8-objects/05-inheritance.md"   # expect 3760
   wc -c "content/week8-objects/06-operators.md"   # expect 3162
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week8-objects/04-class-methods.md" | shasum | cut -c1-12   # expect 457c804cf3ad
   awk '/^::exercise$/,/^::$/' "content/week8-objects/05-inheritance.md" | shasum | cut -c1-12   # expect d4eff1e1900e
   awk '/^::exercise$/,/^::$/' "content/week8-objects/06-operators.md" | shasum | cut -c1-12   # expect 4594d9ada26a
```
4. `git status --short` shows only these new lesson files, apart from changes from earlier specs.
