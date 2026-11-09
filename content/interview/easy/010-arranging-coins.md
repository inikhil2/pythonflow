---
title: Arranging Coins
tier: easy
order: 10
leetcode: 441
url: https://leetcode.com/problems/arranging-coins/
companies: [Microsoft, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You have n coins, n ≥ 0, and build a staircase with them: row 1 has 1 coin, row 2 has 2 coins, row k has k coins. The last row may be left unfinished. Return how many rows are complete.

::exercise
---
id: iv-easy-010
prompt: Write a function arrange_coins(n) that returns the number of complete rows you can build with n coins.
starter: |
  # write your code below
  def arrange_coins(n):
      pass
hints:
  - Lay rows one at a time and take each row's coins from n.
  - Stop when the coins left are not enough for the next row.
tests:
  - check: assert arrange_coins(0) == 0
  - check: assert arrange_coins(1) == 1
  - check: assert arrange_coins(2) == 1
  - check: assert arrange_coins(5) == 2
  - check: assert arrange_coins(6) == 3
  - check: assert arrange_coins(8) == 3
  - check: assert arrange_coins(10) == 4
  - check: assert arrange_coins(1804289383) == 60070
solution: |
  def arrange_coins(n):
      row = 0
      while n > row:
          row += 1
          n -= row
      return row
brute: |
  def arrange_coins(n):
      rows, used = 0, 0
      while used + rows + 1 <= n:
          rows += 1
          used += rows
      return rows
random:
  call: arrange_coins
  gen: |
    def gen(rng, size):
        if rng.random() < 0.5:
            k = rng.randint(0, 10 * size + 3)
            n = k * (k + 1) // 2 + rng.choice([0, -1, 1])
        else:
            n = rng.randint(0, 10 ** (size // 2 + 1))
        return (max(n, 0),)
wrong:
  - |
    def arrange_coins(n):
        return n // 2
  - |
    def arrange_coins(n):
        return int((2 * n) ** 0.5)
  - |
    def arrange_coins(n):
        row = 0
        while n > 0:
            row += 1
            n -= row
        return row
equivalent:
  - row = -1  # why: the first loop step lifts row to 0 and takes no coins, then it runs as if row started at 0
---
::
