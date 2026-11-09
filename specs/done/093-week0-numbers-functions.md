# 093: Week 0 lessons 06 and 07: integers and floats, defining functions
Files: content/week0-functions/06-numbers.md, content/week0-functions/07-functions.md
Severity: med

## Problem
plan.md lists eight week 0 lessons. Lessons 01 to 05 are done, but Integers and floats
and Defining functions are missing.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, and every trace runs. Copy each file exactly. Do
not reword, reorder or add anything.

## Required change
1. **Create `content/week0-functions/06-numbers.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Integers and floats
week: 0
order: 6
minutes: 10
concepts: [numbers, input]
---

So far every value we've used has been text. Python can also do maths, and today you'll meet its two kinds of number.

An **integer**, or `int`, is a whole number such as `7`, `0` or `-3`. A **float** is a number with a decimal point, such as `2.5` or `7.0`. Numbers have no quotes around them. `7` is a number, and `"7"` is text.

Python does arithmetic with these operators:

- `+` adds and `-` subtracts
- `*` multiplies
- `/` divides and always gives a float
- `//` divides and drops the remainder
- `%` gives just the remainder

```python
print(7 + 2)
print(7 / 2)
```

That prints `9` and then `3.5`. Step through this trace to see `//` and `%` at work too:

::trace
---
code: |
  apples = 7
  people = 2
  print(apples / people)
  print(apples // people)
  print(apples % people)
---
::

Seven apples shared by two people is `3.5` each. If we don't cut any apples, each person gets `3` and `1` is left over.

Here's the catch from the last few lessons: `input()` always gives back text. Adding two pieces of text joins them, so this program surprises people:

```python
x = input()
y = input()
print(x + y)
```

With `3` and `4` in the Input box, it prints `34`, not `7`. The `int()` function turns text into an integer, and `float()` turns it into a float:

```python
x = int("3")
y = int("4")
print(x + y)
```

Now it prints `7`. You can wrap the call straight around `input()`, as in `x = int(input())`.

Your turn: fix the adding program.

::exercise
---
id: w0-l6-ex1
prompt: Read two whole numbers, one per line, and print their sum.
starter: |
  x = input()
  y = input()
  print(x + y)
hints:
  - input() gives back text, so x + y joins the two pieces of text.
  - Turn each answer into an integer with int() before you add them.
tests:
  - stdin: |
      3
      4
    stdout: "7"
  - stdin: |
      10
      -2
    stdout: "8"
solution: |
  x = int(input())
  y = int(input())
  print(x + y)
---
::

Floats often have more digits than you want. `round(number, places)` gives the number rounded to that many decimal places, so `round(3.14159, 2)` gives `3.14`.

A common mistake: `int("2.5")` stops with `ValueError`, because `2.5` is not a whole number. Use `float()` when the answer may have a decimal point.

Now try one that needs a float.

::exercise
---
id: w0-l6-ex2
prompt: Read a distance in miles, which may have a decimal point, and print it in kilometres rounded to 1 decimal place. One mile is 1.609 kilometres.
starter: |
  miles = input()
hints:
  - The answer may be 3.5, so turn it into a number with float(), not int().
  - Multiply by 1.609, then use round with 1 as the second argument.
tests:
  - stdin: "10"
    stdout: "16.1"
  - stdin: "3.5"
    stdout: "5.6"
solution: |
  miles = float(input())
  print(round(miles * 1.609, 1))
---
::
````
2. **Create `content/week0-functions/07-functions.md`** with exactly this content, and nothing before or after it.
````markdown
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
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 7 lessons, 13 exercises`.
2. File sizes match:
```sh
   wc -c "content/week0-functions/06-numbers.md"   # expect 2869
   wc -c "content/week0-functions/07-functions.md"   # expect 2982
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week0-functions/06-numbers.md" | shasum | cut -c1-12   # expect da8eea2a4246
   awk '/^::exercise$/,/^::$/' "content/week0-functions/07-functions.md" | shasum | cut -c1-12   # expect 5137da8f77bc
```
4. `git status --short` shows only these new lesson files.
