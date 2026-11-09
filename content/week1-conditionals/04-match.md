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
