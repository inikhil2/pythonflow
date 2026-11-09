---
title: Reading input
week: 0
order: 3
minutes: 8
concepts: [input, variables]
---

Welcome to your third lesson! Today we're going to learn how to **read input** from the user.

The `input()` function pauses the program, waits for one line of text, and gives that line back. You store it in a variable to use later.

Try this in the editor:

```python
name = input("What's your name? ")
print("hello,", name)
```

When you run it, you'll see `What's your name? ` on the screen. That's the **prompt** from `input()`. Whatever the person types next is stored in `name`, and the `print` line shows `hello,` followed by that name.

End the prompt with a space. Otherwise the answer runs straight into the question.

`print` with commas puts one space between the parts, so `print("hello,", name)` shows `hello, Ada`.

Your turn: greet someone by name.

::exercise
---
id: w0-l3-ex1
prompt: Ask "What's your name? " and then greet the person as hello, followed by their name.
starter: |
  name = input("What's your name? ")
hints:
  - The starter already stores the answer in name. Now print a greeting with it.
  - 'print("hello,", name) puts a space between the two parts for you.'
tests:
  - stdin: "Ada"
    stdout: "What's your name? hello, Ada"
  - stdin: "Grace"
    stdout: "What's your name? hello, Grace"
solution: |
  name = input("What's your name? ")
  print("hello,", name)
---
::

In PythonFlow, nobody types while your program runs. Instead, the **Input** box under the editor plays the person typing. Put one line there for each `input()` call, in order. If the program asks for more lines than the box has, Python stops with `EOFError`.

Each `input()` call reads the next line, so two calls give you two separate values. Try it with a first and last name.

::exercise
---
id: w0-l3-ex2
prompt: Read a first name, then a last name, each on its own line, and print the full name on one line.
starter: |
  first = input()
hints:
  - Each call to input() reads the next line, so you need a second one.
  - Store the last name in its own variable, then print both with a comma between them.
tests:
  - stdin: |
      Ada
      Lovelace
    stdout: "Ada Lovelace"
  - stdin: |
      Alan
      Turing
    stdout: "Alan Turing"
solution: |
  first = input()
  last = input()
  print(first, last)
---
::

One more thing to know: `input()` always gives back text, even when someone types `42`. A later lesson shows how to turn that text into a number.

A trace can't read input, so the one below uses fixed values. Imagine they are what two `input()` calls gave back:

::trace
---
code: |
  first = "Ada"
  last = "Lovelace"
  print(first, last)
---
::
