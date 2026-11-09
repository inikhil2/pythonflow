---
title: Dynamic programming
week: 10
order: 10
minutes: 15
concepts: [functions, dictionaries, for-loops]
---

Some recursive functions do the same work again and again. Take the number of ways to climb `n` stairs, taking 1 or 2 steps at a time. To climb 5 stairs, you climb 4 and take 1, or climb 3 and take 2. Both of those branches then ask for the ways to climb 3 stairs, and the same smaller answers come back over and over.

Start with the recursive version. Its base cases are the smallest answers, which you can write down directly: 1 way to climb 0 stairs and 1 way to climb 1 stair.

```python
def ways(n):
    if n <= 1:
        return 1
    return ways(n - 1) + ways(n - 2)
```

This is correct, but it gets very slow as `n` grows, because it recomputes the same values.

## Memoisation

**Memoisation** means saving each answer the first time you work it out, then reusing it. You can do this with a dict. Look the answer up first, and only work it out if it is missing. The standard library gives you the same thing with `@cache` from `functools`:

```python
from functools import cache

@cache
def ways(n):
    if n <= 1:
        return 1
    return ways(n - 1) + ways(n - 2)

print(ways(30))
```

This prints `1346269` at once. Each `n` is worked out only once.

## A bottom-up table

The same answers can be built without recursion. Start from the base cases in a list, and fill in each answer from the ones before it:

```python
ways_table = [1, 1]
for i in range(2, 31):
    ways_table.append(ways_table[i - 1] + ways_table[i - 2])
print(ways_table[30])
```

This is the usual final form of dynamic programming. Choose the table order so that each entry needs only entries you have already filled.

## Two dimensions

The same idea works on a grid. Count the paths from the top left to the bottom right of a grid, moving only right or down. Every cell on the top row and left column has exactly one path. Any other cell is reached from the cell above it or the cell to its left, so add those two counts:

::trace
---
code: |
  rows, cols = 3, 3
  table = [[1] * cols for _ in range(rows)]
  for r in range(1, rows):
      for c in range(1, cols):
          table[r][c] = table[r - 1][c] + table[r][c - 1]
  print(table[-1][-1])
---
::

The bottom right cell holds `6`, the number of paths in a 3 by 3 grid.

Your turn: write the base case and the table.

::exercise
---
id: w10-l10-ex1
prompt: Read a whole number n, zero or more. You can climb stairs taking 1 or 2 steps at a time. Print the number of different ways to climb n stairs. Climbing 0 stairs is one way.
starter: |
  def ways(n):
      return ways(n - 1) + ways(n - 2)
  n = int(input())
  print(ways(n))
hints:
  - The starter has no base case, so every call calls itself and never stops. It raises RecursionError.
  - The base cases are ways(0) = 1 and ways(1) = 1. Return 1 when n is 0 or 1.
  - Check your answer against the small values 1, 1, 2, 3, 5 and so on. Each entry is the sum of the two before it.
tests:
  - stdin: "0\n"
    stdout: "1"
  - stdin: "1\n"
    stdout: "1"
  - stdin: "2\n"
    stdout: "2"
  - stdin: "4\n"
    stdout: "5"
  - stdin: "10\n"
    stdout: "89"
solution: |
  n = int(input())
  ways_table = [1, 1]
  for i in range(2, n + 1):
      ways_table.append(ways_table[i - 1] + ways_table[i - 2])
  print(ways_table[n])
---
::

Now a coin problem, where the answer may not exist.

::exercise
---
id: w10-l10-ex2
prompt: Read a whole number amount, then a line of coin values. You may use each coin as many times as you like. Print the fewest coins that add up to amount, or -1 if no mix of coins can make it. Making 0 needs 0 coins.
starter: |
  amount = int(input())
  coins = [int(c) for c in input().split()]
  print(-1)
hints:
  - Make a list best with best[0] = 0 and the rest set to infinity, float("inf").
  - For each amount a from 1 up to amount, try each coin c that is at most a. Use best[a] = min(best[a], best[a - c] + 1).
  - At the end, print -1 if best[amount] is still infinity. Do not greedily take the biggest coin first. With coins 1, 3 and 4 and amount 6, greedy gives 3 coins, but 3 + 3 is 2.
tests:
  - stdin: "0\n1 2\n"
    stdout: "0"
  - stdin: "11\n1 2 5\n"
    stdout: "3"
  - stdin: "3\n2\n"
    stdout: "-1"
  - stdin: "6\n1 3 4\n"
    stdout: "2"
  - stdin: "7\n2 4\n"
    stdout: "-1"
solution: |
  amount = int(input())
  coins = [int(c) for c in input().split()]
  best = [0] + [float("inf")] * amount
  for a in range(1, amount + 1):
      for c in coins:
          if c <= a and best[a - c] + 1 < best[a]:
              best[a] = best[a - c] + 1
  print(best[amount] if best[amount] != float("inf") else -1)
---
::
