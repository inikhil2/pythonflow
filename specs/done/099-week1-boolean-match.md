# 099: Week 1 lessons 03 and 04: and, or and not, match statements
Files: content/week1-conditionals/03-boolean-logic.md, content/week1-conditionals/04-match.md
Severity: med

## Problem
These are the last two week 1 lessons in plan.md. Run this spec after spec 098.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week1-conditionals/03-boolean-logic.md`** with exactly this content, and nothing before or after it.
````markdown
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
````
2. **Create `content/week1-conditionals/04-match.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: match statements
week: 1
order: 4
minutes: 8
concepts: [match, conditionals]
---

When one value can be any of several fixed options, a long chain of `elif` lines gets repetitive. Python has a tidier way to write it: the `match` statement.

```python
colour = "red"
match colour:
    case "green":
        print("go")
    case "red":
        print("stop")
```

This prints `stop`. Python compares `colour` with each `case` from the top down, runs the body of the first one that is equal, and skips the rest. It's the same as writing `if colour == "green":` and then `elif colour == "red":`.

What if none of the cases match? Then nothing runs. To catch everything else, add `case _:` at the end. The underscore matches any value, so it works like `else`. Step through this trace:

::trace
---
code: |
  colour = "blue"
  match colour:
      case "green":
          print("go")
      case "red":
          print("stop")
      case _:
          print("unknown colour")
---
::

Neither `"green"` nor `"red"` equals `"blue"`, so Python reaches `case _` and prints `unknown colour`.

A common mistake: putting `case _:` before other cases. It matches everything, so the cases below it could never run. Python spots this and stops with `SyntaxError` before running anything.

Your turn: finish a traffic light.

::exercise
---
id: w1-l4-ex1
prompt: Read a traffic light colour in lowercase. Print go for green, slow down for amber, stop for red, and unknown colour for anything else. Use match.
starter: |
  colour = input()
  match colour:
      case "green":
          print("go")
hints:
  - Add one case for amber and one for red, each with its own indented print.
  - A last case _ catches every colour the others did not.
tests:
  - stdin: "green"
    stdout: "go"
  - stdin: "amber"
    stdout: "slow down"
  - stdin: "red"
    stdout: "stop"
  - stdin: "blue"
    stdout: "unknown colour"
solution: |
  colour = input()
  match colour:
      case "green":
          print("go")
      case "amber":
          print("slow down")
      case "red":
          print("stop")
      case _:
          print("unknown colour")
---
::

One case can cover several values. Join them with a vertical bar `|`, which means "or" here:

```python
day = "sunday"
match day:
    case "saturday" | "sunday":
        print("weekend")
```

This prints `weekend`, and it would for `saturday` too.

Try one that uses `|`.

::exercise
---
id: w1-l4-ex2
prompt: Read a day of the week in lowercase, such as monday. Print weekend for saturday or sunday, and weekday for any other day. Use match.
starter: |
  day = input()
  match day:
      case "saturday":
          print("weekend")
hints:
  - The starter prints nothing for sunday. Join both weekend days in one case with |.
  - Add case _ for all the other days.
tests:
  - stdin: "saturday"
    stdout: "weekend"
  - stdin: "sunday"
    stdout: "weekend"
  - stdin: "monday"
    stdout: "weekday"
solution: |
  day = input()
  match day:
      case "saturday" | "sunday":
          print("weekend")
      case _:
          print("weekday")
---
::
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 12 lessons, 23 exercises`.
2. File sizes match:
```sh
   wc -c "content/week1-conditionals/03-boolean-logic.md"   # expect 2990
   wc -c "content/week1-conditionals/04-match.md"   # expect 3087
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week1-conditionals/03-boolean-logic.md" | shasum | cut -c1-12   # expect 26d24c25657e
   awk '/^::exercise$/,/^::$/' "content/week1-conditionals/04-match.md" | shasum | cut -c1-12   # expect 2668b517b4cb
```
4. `git status --short` shows only these new lesson files.
