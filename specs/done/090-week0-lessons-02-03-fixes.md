# 090: Fix week 0 lessons 02 and 03 after review (spec 087)
Files: content/week0-functions/02-variables.md, content/week0-functions/03-input.md
Severity: med

## Problem
Spec 087 passed its gates, but review of the text found two problems.

- `03-input.md` copied an instruction from the spec into the lesson: "Say that the values
  stand in for what `input()` would return." Learners would read an instruction to the
  writer.
- `03-input.md` says "you type your answer, press Enter". In PythonFlow, the Input box
  supplies the lines. It also defines "prompt" twice.
- In both lessons, the exercises are at the end. Spec 087 placed exercise 1 after the
  first idea it practises, and exercise 2 later.

Both files below are corrected. The exercise blocks are byte for byte the same as before.

## Required change
1. **Replace the whole of `content/week0-functions/02-variables.md`** with exactly this content. Delete everything in the file first.
````markdown
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
````
2. **Replace the whole of `content/week0-functions/03-input.md`** with exactly this content. Delete everything in the file first.
````markdown
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
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 3 lessons, 5 exercises`.
2. File sizes match:
```sh
   wc -c "content/week0-functions/02-variables.md"   # expect 2726
   wc -c "content/week0-functions/03-input.md"   # expect 2662
```
3. The exercise blocks are unchanged:
```sh
   awk '/^::exercise$/,/^::$/' "content/week0-functions/02-variables.md" | shasum | cut -c1-12   # expect 98a67fbf7dcd
   awk '/^::exercise$/,/^::$/' "content/week0-functions/03-input.md" | shasum | cut -c1-12   # expect 1307dd51cba8
```
4. `grep -c -E "Say that|Put exercise|the trace goes" content/week0-functions/0[23]-*.md` gives 0 for each file.
5. `git status --short` lists only these two lesson files as changed or new.
