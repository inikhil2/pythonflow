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
