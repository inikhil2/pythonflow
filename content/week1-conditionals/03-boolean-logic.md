---
title: and, or and not
week: 1
order: 3
minutes: 10
concepts: [boolean-logic, conditionals]
---

Some decisions depend on more than one question. Is the shop open and is it a weekday? Did the person type y or yes? Python joins conditions with three words: `and`, `or` and `not`.

- `a and b` is `True` only when both sides are `True`
- `a or b` is `True` when at least one side is `True`
- `not a` flips `True` to `False`, and `False` to `True`

```python
age = 15
print(age >= 13 and age <= 19)
```

This prints `True`, because 15 is at least 13 and at most 19. Step through this trace to see all three words:

::trace
---
code: |
  age = 15
  print(age >= 13 and age <= 19)
  print(age < 13 or age > 19)
  print(not age > 18)
---
::

The second line is `False`, because neither side is `True`. The third line is `True`: `age > 18` is `False`, and `not` flips it.

Checking that a number sits between two limits is so common that Python has a shorter way to write it. `13 <= age <= 19` means the same as `age >= 13 and age <= 19`.

Your turn: fix the opening hours.

::exercise
---
id: w1-l3-ex1
prompt: A shop opens at 9 and closes at 17. Read the hour as a whole number from 0 to 23, and print open if the shop is open at that hour, or closed if it is not. At 17 it has just closed.
starter: |
  hour = int(input())
  if hour >= 9:
      print("open")
  else:
      print("closed")
hints:
  - The starter only checks the opening time, so it says open at 17 and at 22 too.
  - 'The hour must be at least 9 and also less than 17. Join the two tests with and.'
tests:
  - stdin: "9"
    stdout: "open"
  - stdin: "16"
    stdout: "open"
  - stdin: "17"
    stdout: "closed"
  - stdin: "3"
    stdout: "closed"
solution: |
  hour = int(input())
  if 9 <= hour < 17:
      print("open")
  else:
      print("closed")
---
::

A common mistake with `or` looks like this:

```python
answer = "no"
if answer == "y" or "yes":
    print("agreed")
```

It prints `agreed`, even though the answer was `no`. Python reads this as two separate tests: `answer == "y"`, or just `"yes"`. Text that isn't empty counts as `True` on its own, so the second side is always true. Each side of `or` needs its own full comparison: `answer == "y" or answer == "yes"`.

Now fix that exact bug.

::exercise
---
id: w1-l3-ex2
prompt: Read an answer and print agreed if it is y or yes, in any capitals. Print not agreed for anything else.
starter: |
  answer = input().lower()
  if answer == "y" or "yes":
      print("agreed")
  else:
      print("not agreed")
hints:
  - The starter says agreed even for no. Look at what stands on the right of or.
  - Each side of or needs its own comparison with answer.
tests:
  - stdin: "Y"
    stdout: "agreed"
  - stdin: "yes"
    stdout: "agreed"
  - stdin: "no"
    stdout: "not agreed"
  - stdin: "maybe"
    stdout: "not agreed"
solution: |
  answer = input().lower()
  if answer == "y" or answer == "yes":
      print("agreed")
  else:
      print("not agreed")
---
::
