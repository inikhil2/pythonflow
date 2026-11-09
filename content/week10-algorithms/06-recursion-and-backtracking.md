---
title: Recursion and backtracking
week: 10
order: 6
minutes: 14
concepts: [functions, return-values, lists]
---

A **recursive** function calls itself. Each call works on a smaller problem, until it reaches a **base case** that can be answered directly. Without a base case the calls never stop.

Here is `power(2, 3)`, which is 2 times 2 times 2:

```python
def power(base, exp):
    if exp == 0:
        return 1
    return base * power(base, exp - 1)

print(power(2, 3))
```

The base case is `exp == 0`, which returns `1`. Every other call multiplies by `base` and asks for one less power. Step through it. Each call waits for the one below it, and the answers come back up the **call stack**:

::trace
---
code: |
  def power(base, exp):
      if exp == 0:
          return 1
      return base * power(base, exp - 1)

  print(power(2, 3))
---
::

A common mistake is a missing base case, or one that a value never reaches. Then the calls keep going until Python stops them with a `RecursionError`.

## Choose, explore, undo

Some problems ask for every answer, such as every subset of a list. Build the answer one choice at a time with a shared list, the path. For each item, you choose to take it or skip it. You explore the rest of the choices, and then you **undo** your choice by removing it from the path. The undo is what lets the next branch start from a clean path. Without it, the path keeps growing with values from other branches.

```python
def subsets(nums):
    path = []
    result = []
    def explore(i):
        if i == len(nums):
            result.append(list(path))
            return
        explore(i + 1)
        path.append(nums[i])
        explore(i + 1)
        path.pop()
    explore(0)
    return result

print(subsets([1, 2]))
```

Here the first choice is to skip an item, and the second is to take it. The `list(path)` makes a copy, so later changes to `path` do not change the saved answer. Keep the inputs small, because the number of subsets doubles with each item.

Your turn: find the subsets that add up to a target.

::exercise
---
id: w10-l6-ex1
prompt: Read a whole number target, then a line of whole numbers. Print every subset of the numbers, in the order the numbers were read, whose sum is target, one subset per line with its numbers separated by spaces. Explore each item by first skipping it, then taking it. Print nothing if no subset works.
starter: |
  target = int(input())
  nums = [int(n) for n in input().split()]
hints:
  - Keep one shared path list. Write explore(i), which decides about nums[i].
  - Skip first by calling explore(i + 1), then append nums[i], call explore(i + 1) again, and pop the value off again.
  - When i equals len(nums), save a copy of the path if its sum is target. Print the saved subsets at the end.
tests:
  - stdin: |
      3
      1 2 3
    stdout: "3\n1 2"
  - stdin: |
      5
      2 3 5
    stdout: "5\n2 3"
  - stdin: |
      4
      1 1 2
    stdout: "1 1 2"
  - stdin: |
      7
      4 5
    stdout: ""
solution: |
  target = int(input())
  nums = [int(n) for n in input().split()]
  path = []
  result = []
  def explore(i):
      if i == len(nums):
          if sum(path) == target:
              result.append(list(path))
          return
      explore(i + 1)
      path.append(nums[i])
      explore(i + 1)
      path.pop()
  explore(0)
  for subset in result:
      print(" ".join(str(n) for n in subset))
---
::

Now a base case, on its own.

::exercise
---
id: w10-l6-ex2
prompt: Read a whole number n, zero or more. Using a recursive function digit_sum(n), print the sum of its digits. For example, 1234 gives 10, and 0 gives 0.
starter: |
  def digit_sum(n):
      return n % 10 + digit_sum(n // 10)
  n = int(input())
  print(digit_sum(n))
hints:
  - The base case is a single digit, when n is less than 10. Return n then.
  - Otherwise add the last digit, n % 10, to the digit sum of the rest, digit_sum(n // 10).
  - The starter has no base case, so it keeps calling itself and raises RecursionError.
tests:
  - stdin: "1234"
    stdout: "10"
  - stdin: "0"
    stdout: "0"
  - stdin: "9"
    stdout: "9"
  - stdin: "10"
    stdout: "1"
  - stdin: "505"
    stdout: "10"
solution: |
  def digit_sum(n):
      if n < 10:
          return n
      return n % 10 + digit_sum(n // 10)
  n = int(input())
  print(digit_sum(n))
---
::
