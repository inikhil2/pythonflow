---
title: Comparisons
week: 1
order: 1
minutes: 8
concepts: [comparisons]
---

Welcome to week 1! So far your programs have done the same thing every time they run. This week we'll teach them to make decisions, and every decision starts with a question that has a yes-or-no answer.

In Python, that answer is a **boolean**: either `True` or `False`. Both start with a capital letter and have no quotes, because they are values, not text.

You get a boolean by **comparing** two values. Python has six comparison operators:

- `==` is equal to
- `!=` is not equal to
- `<` is less than, and `>` is greater than
- `<=` is less than or equal to
- `>=` is greater than or equal to

```python
print(3 < 5)
print(3 == 5)
```

That prints `True` and then `False`. Step through this trace to see the others:

::trace
---
code: |
  x = 7
  print(x == 7)
  print(x != 7)
  print(x <= 10)
  print("cat" == "Cat")
---
::

The last line prints `False`. Text comparisons look at every character, and a capital `C` is not the same character as `c`.

A common mistake: writing `=` when you mean `==`. One equals sign stores a value in a variable. Two equals signs ask whether two values are the same.

Comparisons need values of the right kind. `input()` gives back text, so turn numbers into numbers first, just as you did in week 0:

```python
x = int(input())
print(x > 0)
```

With `5` in the Input box, this prints `True`.

Your turn: compare two numbers.

::exercise
---
id: w1-l1-ex1
prompt: Read two whole numbers, one per line. Print True if the first is bigger than the second, and False if it is not.
starter: |
  x = int(input())
  y = int(input())
hints:
  - A comparison gives back True or False, and print can show it directly.
  - Bigger means greater than, which is the > operator.
tests:
  - stdin: |
      5
      3
    stdout: "True"
  - stdin: |
      2
      9
    stdout: "False"
  - stdin: |
      4
      4
    stdout: "False"
solution: |
  x = int(input())
  y = int(input())
  print(x > y)
---
::

Because text comparisons care about capitals and spaces, people often tidy text before comparing it. The string methods from week 0 do that job: `answer.strip().lower()` removes the spaces and makes every letter lowercase.

Now compare some text.

::exercise
---
id: w1-l1-ex2
prompt: Read an answer and print True if it is the word yes, whatever its capitals and however many spaces surround it. Print False otherwise.
starter: |
  answer = input()
  print(answer == "yes")
hints:
  - The starter works for yes, but prints False for Yes because the capital Y differs.
  - Tidy the answer with strip and lower before you compare it.
tests:
  - stdin: "yes"
    stdout: "True"
  - stdin: "  YES "
    stdout: "True"
  - stdin: "no"
    stdout: "False"
solution: |
  answer = input()
  print(answer.strip().lower() == "yes")
---
::
