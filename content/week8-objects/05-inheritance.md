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
