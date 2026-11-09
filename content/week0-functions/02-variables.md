---
title: Variables
week: 0
order: 2
minutes: 8
concepts: [variables]
---

Welcome to your second lesson! Today we're going to learn about **variables**, which are one of the most important tools in programming.

A **variable** is a name that holds a value. When you write `name = "Ada"`, you're storing the text "Ada" under the name `name`. The equals sign `=` doesn't mean "equals" like in maths—it means "store this value here".

Let's see how it works. Type this in the editor:

```python
name = "Ada"
print(name)
```

When you run it, you'll see `Ada` on the screen. The variable `name` holds the value "Ada", and `print(name)` gives back that value to show.

Notice the difference between these two lines:
- `print(name)` prints the value stored in the variable (Ada)
- `print("name")` prints the word name itself

Your turn: make your first variable.

::exercise
---
id: w0-l2-ex1
prompt: Make a variable called name that holds the text Ada, then print it.
starter: |
  # make a variable called name here
hints:
  - 'A variable is made with an equals sign: the name on the left, the value on the right.'
  - Text needs quotes, but the variable name does not. Print the name without quotes.
tests:
  - stdin: ""
    stdout: "Ada"
  - check: assert name == "Ada"
solution: |
  name = "Ada"
  print(name)
---
::

A variable can be given a new value later, and the old one is gone. Try this trace to see it happen:

::trace
---
code: |
  name = "Ada"
  print(name)
  name = "Grace"
  print(name)
---
::

After the first `print(name)`, the screen shows `Ada`. Then we change `name` to "Grace", and the second `print(name)` shows `Grace`. The old value is replaced.

Variables have naming rules:
- They can contain letters, digits, and underscores `_`
- They cannot start with a digit
- Case matters: `name` and `Name` are different variables
- Use lowercase words joined by underscores, like `first_name` or `user_age`

A common mistake is using a name before giving it a value, or misspelling it. If you try:

```python
print(nme)
```

Python stops with `NameError: name 'nme' is not defined`. The variable `nme` doesn't exist, so Python can't find its value.

Now try a harder one. Swapping two values needs a small trick.

::exercise
---
id: w0-l2-ex2
prompt: Swap the values of a and b, so a holds 2 and b holds 1. Keep the print line as it is.
starter: |
  a = 1
  b = 2
  # swap a and b here
  print(a, b)
hints:
  - If you write a = b first, the 1 in a is gone. Keep a copy of it in a third variable.
  - 'Try three lines: temp = a, then a = b, then b = temp.'
tests:
  - stdin: ""
    stdout: "2 1"
  - check: assert (a, b) == (2, 1)
solution: |
  a = 1
  b = 2
  temp = a
  a = b
  b = temp
  print(a, b)
---
::
