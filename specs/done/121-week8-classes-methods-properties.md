# 121: Week 8 lessons 01 to 03: classes and objects, methods, properties
Files: content/week8-objects/01-classes.md, content/week8-objects/02-methods.md, content/week8-objects/03-properties.md
Severity: med

## Problem
Week 7 is committed. plan.md lists week 8 as object-oriented programming: classes, `self`,
`__init__`, `__str__`, properties, class methods, inheritance and operator overloading. No week 8
lessons exist yet. This spec adds the first three, in a new folder `content/week8-objects/`. The
concept ids `classes`, `methods`, `properties` and `inheritance` already exist in
`content/concepts.yml`, and week 8 already exists in `content/weeks.yml`, so neither file changes.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week8-objects/01-classes.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Classes and objects
week: 8
order: 1
minutes: 10
concepts: [classes]
---

Welcome to week 8! You've used plenty of types: `str`, `int`, `list`, `dict`. Each value of a type is an **object**, and it carries both data and things it can do, like `"hi".upper()`. This week you'll make types of your own.

A **class** is the blueprint for a new type. Calling the class, as in `Book("Dune", "Frank Herbert")`, makes a new object from it. Python then runs the class's `__init__` method to set the object up:

::trace
---
code: |
  class Book:
      def __init__(self, title, author):
          self.title = title
          self.author = author

  book = Book("Dune", "Frank Herbert")
  print(book.title, "by", book.author)
---
::

`self` is the new object itself. Python passes it to `__init__` for you, so you only pass the other arguments. `self.title = title` stores the title **on the object**, as an **attribute**. Afterwards, `book.title` reads it back.

Each object has its own attributes. `Book("Emma", "Jane Austen")` makes a second book with its own title, and the first book doesn't change.

In the trace, `book` shows as something like `<__main__.Book object at 0x...>`. That's how Python shows an object until you tell it how. You'll do that in the next lesson.

A common mistake: writing `title = title` instead of `self.title = title`. That only sets a variable inside `__init__`, which is gone as soon as `__init__` ends. Reading `book.title` then stops with `AttributeError`.

Your turn: make a class that keeps its data.

::exercise
---
id: w8-l1-ex1
prompt: Fix __init__ so that a Book keeps its title and author as attributes. Book("Dune", "Frank Herbert").title is then "Dune".
starter: |
  class Book:
      def __init__(self, title, author):
          title = title
          author = author
hints:
  - Without self., the values are only stored in variables inside __init__, so the object has no title attribute.
  - Write self.title = title and self.author = author.
tests:
  - check: |
      book = Book("Dune", "Frank Herbert")
      assert book.title == "Dune"
      assert book.author == "Frank Herbert"
  - check: |
      first = Book("Dune", "Frank Herbert")
      second = Book("Emma", "Jane Austen")
      assert first.title == "Dune" and second.title == "Emma", "each book keeps its own title"
solution: |
  class Book:
      def __init__(self, title, author):
          self.title = title
          self.author = author
---
::

`__init__` is also the place to refuse bad data. If it raises an exception, as you did in week 3, no object is made at all.

Now make a book refuse an empty title.

::exercise
---
id: w8-l1-ex2
prompt: Change __init__ so that Book raises ValueError if title is an empty string. A book with a title is made as before.
starter: |
  class Book:
      def __init__(self, title, author):
          self.title = title
          self.author = author
hints:
  - The tests try Book("", "Jane Austen") and expect ValueError.
  - At the start of __init__, write if not title, then raise ValueError("a book needs a title").
tests:
  - check: |
      book = Book("Emma", "Jane Austen")
      assert book.title == "Emma"
  - check: |
      try:
          Book("", "Jane Austen")
          raise AssertionError("Book with an empty title should raise ValueError")
      except ValueError:
          pass
solution: |
  class Book:
      def __init__(self, title, author):
          if not title:
              raise ValueError("a book needs a title")
          self.title = title
          self.author = author
---
::
````

2. **Create `content/week8-objects/02-methods.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Methods
week: 8
order: 2
minutes: 10
concepts: [methods, classes]
---

A **method** is a function written inside a class. Every method takes `self` first, so it can read and change the object's attributes. You call it with a dot, as in `counter.add()`, and Python passes the object as `self`. Step through this trace:

::trace
---
code: |
  class Counter:
      def __init__(self):
          self.count = 0

      def add(self):
          self.count += 1

  counter = Counter()
  counter.add()
  counter.add()
  print(counter.count)
---
::

Some method names are special. Python calls them for you at the right moment. You've met `__init__`, which runs when an object is made. Another is `__str__`. When you `print` an object or call `str` on it, Python calls its `__str__` method and uses the string it **returns**:

```python
class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    def __str__(self):
        return f"{self.title} by {self.author}"

print(Book("Dune", "Frank Herbert"))
```

That prints `Dune by Frank Herbert` instead of `<__main__.Book object at 0x...>`.

A common mistake: writing `count += 1` in a method instead of `self.count += 1`. Without `self.`, Python looks for a variable called `count` inside the method, finds none, and stops with `UnboundLocalError`.

Your turn: fix a method.

::exercise
---
id: w8-l2-ex1
prompt: Fix add so that each call adds 1 to the counter's count. After three calls to add, count is 3.
starter: |
  class Counter:
      def __init__(self):
          self.count = 0

      def add(self):
          count += 1
hints:
  - count on its own is a variable inside add, not the counter's attribute.
  - Write self.count += 1.
tests:
  - check: |
      counter = Counter()
      counter.add()
      counter.add()
      counter.add()
      assert counter.count == 3, f"count is {counter.count}"
  - check: |
      first = Counter()
      second = Counter()
      first.add()
      assert first.count == 1 and second.count == 0, "each counter keeps its own count"
solution: |
  class Counter:
      def __init__(self):
          self.count = 0

      def add(self):
          self.count += 1
---
::

Now tell Python how to show a book.

::exercise
---
id: w8-l2-ex2
prompt: Fix __str__ so that str(Book("Dune", "Frank Herbert")) is "Dune by Frank Herbert", and print shows the same text.
starter: |
  class Book:
      def __init__(self, title, author):
          self.title = title
          self.author = author

      def __str__(self):
          print(f"{self.title} by {self.author}")
hints:
  - __str__ must return a string. This one prints and returns None, so Python stops with TypeError.
  - Change print( to return and drop the closing bracket.
tests:
  - check: |
      shown = str(Book("Dune", "Frank Herbert"))
      assert shown == "Dune by Frank Herbert", f"str gave {shown!r}"
  - check: |
      shown = str(Book("Emma", "Jane Austen"))
      assert shown == "Emma by Jane Austen", f"str gave {shown!r}"
solution: |
  class Book:
      def __init__(self, title, author):
          self.title = title
          self.author = author

      def __str__(self):
          return f"{self.title} by {self.author}"
---
::
````

3. **Create `content/week8-objects/03-properties.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Properties
week: 8
order: 3
minutes: 10
concepts: [properties]
---

Checking data in `__init__` protects a new object. But anyone can change an attribute later, as in `temperature.celsius = -500`, and nothing checks that. A **property** fixes this. It looks like an attribute from the outside, but reading or setting it runs a method.

You write a property in two parts. `@property` marks the method that runs when the value is read. `@celsius.setter` marks the method that runs when a value is set. The real value is stored under a slightly different name, by custom with `_` in front:

::trace
---
code: |
  class Temperature:
      def __init__(self, celsius):
          self.celsius = celsius

      @property
      def celsius(self):
          return self._celsius

      @celsius.setter
      def celsius(self, value):
          if value < -273.15:
              raise ValueError("colder than absolute zero")
          self._celsius = value

  temperature = Temperature(20)
  temperature.celsius = 25
  print(temperature.celsius)
---
::

Notice that `__init__` sets `self.celsius`, not `self._celsius`. That runs the setter, so even a brand new object is checked.

A property with no setter can't be set at all, which suits a value worked out from others. A `fahrenheit` property could return `self.celsius * 9 / 5 + 32`. Setting it would raise `AttributeError`.

The `_` in `_celsius` is a polite sign that says "don't touch this from outside the class". Python doesn't enforce it.

A common mistake: storing the value as `self.celsius` inside the setter. That calls the setter again, which calls it again, until Python stops with `RecursionError`.

Your turn: protect an attribute.

::exercise
---
id: w8-l3-ex1
prompt: Make celsius a property, so that setting it to anything below -273.15 raises ValueError, whether in Temperature(...) or later with temperature.celsius = .... Keep the fahrenheit property working.
starter: |
  class Temperature:
      def __init__(self, celsius):
          self.celsius = celsius

      @property
      def fahrenheit(self):
          return self.celsius * 9 / 5 + 32
hints:
  - celsius is a plain attribute here, so nothing checks it when it is set.
  - Add a celsius method with @property that returns self._celsius, and one with @celsius.setter that checks value, then sets self._celsius.
tests:
  - check: |
      temperature = Temperature(20)
      assert temperature.celsius == 20
      assert temperature.fahrenheit == 68
  - check: |
      try:
          Temperature(-300)
          raise AssertionError("Temperature(-300) should raise ValueError")
      except ValueError:
          pass
  - check: |
      temperature = Temperature(20)
      try:
          temperature.celsius = -500
          raise AssertionError("setting celsius to -500 should raise ValueError")
      except ValueError:
          pass
      assert temperature.celsius == 20, "a refused value must not be kept"
solution: |
  class Temperature:
      def __init__(self, celsius):
          self.celsius = celsius

      @property
      def celsius(self):
          return self._celsius

      @celsius.setter
      def celsius(self, value):
          if value < -273.15:
              raise ValueError("colder than absolute zero")
          self._celsius = value

      @property
      def fahrenheit(self):
          return self.celsius * 9 / 5 + 32
---
::
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 39 lessons, 71 exercises`.
2. File sizes match:
```sh
   wc -c "content/week8-objects/01-classes.md"   # expect 3567
   wc -c "content/week8-objects/02-methods.md"   # expect 3244
   wc -c "content/week8-objects/03-properties.md"   # expect 3392
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week8-objects/01-classes.md" | shasum | cut -c1-12   # expect c25d39cba092
   awk '/^::exercise$/,/^::$/' "content/week8-objects/02-methods.md" | shasum | cut -c1-12   # expect 13b8678ada87
   awk '/^::exercise$/,/^::$/' "content/week8-objects/03-properties.md" | shasum | cut -c1-12   # expect af5d849c0c6f
```
4. `git status --short` shows only these new lesson files, apart from changes from earlier specs.
