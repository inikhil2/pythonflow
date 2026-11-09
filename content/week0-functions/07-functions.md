---
title: Defining functions
week: 0
order: 7
minutes: 10
concepts: [functions]
---

You've been calling functions since your first lesson: `print`, `input`, `int` and `round`. Today we'll write our own.

A function gives a name to a few lines of code, so you can run them whenever you like by calling that name. You make one with `def`:

```python
def hello():
    print("hello, world")
```

Let's read it piece by piece:

- `def` tells Python that a new function starts here
- `hello` is the function's name, followed by parentheses
- the colon `:` ends the first line
- every line of the function's **body** is indented by four spaces

Running that code prints nothing yet. Defining a function only teaches Python the name. To run the body, you **call** the function by writing its name with parentheses: `hello()`. Then it prints `hello, world`.

A function becomes more useful when you hand it a value. A **parameter** is a name inside the parentheses that holds whatever value the caller passes in:

```python
def hello(name):
    print("hello,", name)

hello("Ada")
```

This prints `hello, Ada`. Each call can pass a different value. Step through this trace and watch `name` change on each call:

::trace
---
code: |
  def hello(name):
      print("hello,", name)

  hello("Ada")
  hello("Grace")
---
::

The trace jumps into the function's body on each call, then comes back to the line after the call.

Your turn: write your first function.

::exercise
---
id: w0-l7-ex1
prompt: Define a function hello that takes a name and prints hello, followed by the name. Then call it with Ada.
starter: |
  def hello(name):
      ...
hints:
  - Replace the ... with a print line, indented by four spaces like the rest of the body.
  - Defining the function is not enough. Call it on a line of its own, with no indent, as hello("Ada").
tests:
  - stdin: ""
    stdout: "hello, Ada"
  - check: assert callable(hello)
solution: |
  def hello(name):
      print("hello,", name)

  hello("Ada")
---
::

Two mistakes are common here. One is calling a function before Python has read its `def`. Python runs from the top down, so the call stops with `NameError`. Define first, then call.

The other is a body line without its indent. Python stops with `IndentationError`, because the colon promises a body that never comes.

You can call a function with any value, including what `input()` gives back. Try that next.

::exercise
---
id: w0-l7-ex2
prompt: Define a function shout that takes some text and prints it in capitals with an exclamation mark at the end. The last line already calls it with what the user types.
starter: |
  def shout(text):
      print(text)

  shout(input())
hints:
  - The upper method gives back the text in capitals.
  - 'An f-string can add the mark for you: f"{text.upper()}!"'
tests:
  - stdin: "hello"
    stdout: "HELLO!"
  - stdin: "go team"
    stdout: "GO TEAM!"
solution: |
  def shout(text):
      print(f"{text.upper()}!")

  shout(input())
---
::
