---
title: Hello, world
week: 0
order: 1
minutes: 5
concepts: [print, strings]
---

Welcome to your first lesson! Today we're going to write your very first line of code.

In programming, a **function** is a named piece of code that does one specific job. You hand it values inside its parentheses, called **arguments**, and it does its job with them.

The `print()` function is special. It takes whatever you put inside the parentheses and shows it on the screen. The quotes around the text tell Python: "This is text, not a command."

Let's try it together. Type this exactly:

```python
print("hello, world")
```

Notice the opening quote `"` and the closing quote `"`? They wrap the text. Without them, Python would try to read `hello, world` as code instead of text, and it would show you an error.

Here's what happens when you run it:
- Python sees `print(` and knows to show something
- It reads `"hello, world"` as text
- It displays `hello, world` on your screen

A common mistake: forgetting the closing quote. If you type:

```python
print("hello, world
```

Python stops before running anything and shows `SyntaxError: unterminated string literal`. The text has no closing quote, so Python can't tell where it ends. Always match your opening and closing quotes.

Python runs a program one line at a time, from the top down. Press **Run and trace**, then **Step**, to watch it happen:

::trace
---
code: |
  print("hello, world")
  print("Python runs one line at a time.")
---
::

Now it's your turn. Type your first program in the box below. Don't worry about making mistakes—that's how we learn.

::exercise
---
id: w0-l1-ex1
prompt: Print the text hello, world on one line.
starter: |
  # write your code below
hints:
  - Use the print function and put the text inside its parentheses.
  - 'Text needs quotes around it: "hello, world".'
tests:
  - stdin: ""
    stdout: "hello, world"
solution: |
  print("hello, world")
---
::
