# 155: Interview problem easy 010 Arranging Coins
Files: content/interview/easy/010-arranging-coins.md
Severity: medium

## Problem
Easy order 10 (Arranging Coins, LeetCode 441) has no problem file yet. The format is in docs/interview-format.md.
The text below is the finished file, already checked, so this spec is a copy, not a design task.

## Required change
Create content/interview/easy/010-arranging-coins.md with exactly the text below, from the first `---` to the last `::`.
Copy it character for character. Keep the 2-space and 4-space indents as they are. Change no other file.

````markdown
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
````

## Acceptance gates
1. `grep -cF "id: iv-easy-010" content/interview/easy/010-arranging-coins.md` prints `1`
2. `grep -cF "same:" content/interview/easy/010-arranging-coins.md` prints `0`
3. `grep -cF "    while n > row:" content/interview/easy/010-arranging-coins.md` prints `1`
4. `grep -cF "    while n > 0:" content/interview/easy/010-arranging-coins.md` prints `1`
5. `grep -cF "  - row = -1  # why:" content/interview/easy/010-arranging-coins.md` prints `1`
6. `wc -l content/interview/easy/010-arranging-coins.md` prints `68 content/interview/easy/010-arranging-coins.md`
7. Run by hand: `node scripts/check-interview.ts` prints a mutant line for 010-arranging-coins and ends with `interview ok`. If it names this file, send the PE the exact message. Do not patch it by hand. Then commit this file and this spec with the message "Interview: easy 010 Arranging Coins".
