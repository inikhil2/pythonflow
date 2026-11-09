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
