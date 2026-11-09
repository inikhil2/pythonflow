# 098: Week 1 lessons 01 and 02: comparisons, if, elif and else
Files: content/week1-conditionals/01-comparisons.md, content/week1-conditionals/02-if-elif-else.md
Severity: med

## Problem
Week 0 is complete. plan.md lists week 1 as `if/elif/else`, comparison, boolean logic and
`match`, and no week 1 lessons exist yet. This spec adds the first two, in a new folder
`content/week1-conditionals/`. The app and the lesson checker pick up week folders on their
own, so no code changes.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week1-conditionals/01-comparisons.md`** with exactly this content, and nothing before or after it.
````markdown
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
````
2. **Create `content/week1-conditionals/02-if-elif-else.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: if, elif and else
week: 1
order: 2
minutes: 10
concepts: [conditionals, comparisons]
---

Now that you can ask a yes-or-no question, let's make the program act on the answer.

An `if` statement runs some lines only when a condition is `True`:

```python
x = 12
if x > 10:
    print("big")
```

This prints `big`. If `x` were `5`, it would print nothing at all. Notice the same shape as `def` in week 0: a colon at the end of the line, then a body indented by four spaces.

Add `else` to say what happens when the condition is `False`:

```python
x = 5
if x > 10:
    print("big")
else:
    print("small")
```

This prints `small`. Exactly one of the two bodies runs, never both.

Your turn: write your first decision. The `%` operator from week 0 helps here, because a number is even when `n % 2` is `0`.

::exercise
---
id: w1-l2-ex1
prompt: Read a whole number and print even if it is even, or odd if it is not.
starter: |
  n = int(input())
hints:
  - n % 2 gives the remainder after dividing by 2. Even numbers leave 0.
  - 'Use if with the comparison n % 2 == 0, then else for the odd case.'
tests:
  - stdin: "4"
    stdout: "even"
  - stdin: "7"
    stdout: "odd"
  - stdin: "0"
    stdout: "even"
solution: |
  n = int(input())
  if n % 2 == 0:
      print("even")
  else:
      print("odd")
---
::

When there are more than two choices, use `elif`, short for "else if". Python checks each condition from the top down and runs only the first body whose condition is `True`. It skips the rest, even if they would be `True` too. Step through this trace to watch it skip:

::trace
---
code: |
  x = 5
  if x > 10:
      print("big")
  elif x > 3:
      print("medium")
  else:
      print("small")
---
::

`x > 10` is `False`, so Python moves on. `x > 3` is `True`, so it prints `medium` and jumps past the `else`.

Because only the first match runs, order matters. If you test `x > 3` before `x > 10`, a value like `50` stops at the first test and prints `medium`.

A common mistake: forgetting the colon at the end of an `if`, `elif` or `else` line. Python stops with `SyntaxError` before running anything.

Now fix a chain that checks in the wrong order.

::exercise
---
id: w1-l2-ex2
prompt: Read a temperature in Celsius as a whole number. Print hot for 30 or more, warm for 20 or more, mild for 10 or more, and cold for anything lower.
starter: |
  temp = int(input())
  if temp >= 10:
      print("mild")
  elif temp >= 20:
      print("warm")
  elif temp >= 30:
      print("hot")
hints:
  - With 35, the first test temp >= 10 is already True, so the chain stops there. Put the highest limit first.
  - Nothing prints for cold temperatures yet. An else at the end catches everything left.
tests:
  - stdin: "35"
    stdout: "hot"
  - stdin: "25"
    stdout: "warm"
  - stdin: "12"
    stdout: "mild"
  - stdin: "3"
    stdout: "cold"
solution: |
  temp = int(input())
  if temp >= 30:
      print("hot")
  elif temp >= 20:
      print("warm")
  elif temp >= 10:
      print("mild")
  else:
      print("cold")
---
::
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 10 lessons, 19 exercises`.
2. File sizes match:
```sh
   wc -c "content/week1-conditionals/01-comparisons.md"   # expect 2840
   wc -c "content/week1-conditionals/02-if-elif-else.md"   # expect 3041
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week1-conditionals/01-comparisons.md" | shasum | cut -c1-12   # expect b25018cd5c6a
   awk '/^::exercise$/,/^::$/' "content/week1-conditionals/02-if-elif-else.md" | shasum | cut -c1-12   # expect 743882abf315
```
4. `git status --short` shows only these new lesson files.
