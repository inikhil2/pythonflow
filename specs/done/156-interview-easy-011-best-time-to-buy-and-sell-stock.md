# 156: Interview problem easy 011 Best Time to Buy and Sell Stock
Files: content/interview/easy/011-best-time-to-buy-and-sell-stock.md
Severity: medium

## Problem
Easy order 11 (Best Time to Buy and Sell Stock, LeetCode 121) has no problem file yet. The format is in docs/interview-format.md.
The text below is the finished file, already checked, so this spec is a copy, not a design task.

## Required change
Create content/interview/easy/011-best-time-to-buy-and-sell-stock.md with exactly the text below, from the first `---` to the last `::`.
Copy it character for character. Keep the 2-space and 4-space indents as they are. Change no other file.

````markdown
---
title: Best Time to Buy and Sell Stock
tier: easy
order: 11
leetcode: 121
url: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
companies: [Amazon, Google, Meta]
topic: Arrays
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list of at least one price, where prices[i] is a stock's price on day i. Buy on one day and sell on a later day. Return the most money you can make. If no trade makes money, return 0.

::exercise
---
id: iv-easy-011
prompt: Write a function max_profit(prices) that returns the largest profit from buying on one day and selling on a later day, or 0.
starter: |
  # write your code below
  def max_profit(prices):
      pass
hints:
  - Walk the days once and remember the lowest price so far.
  - On each day, the best sale is today's price minus that lowest price.
tests:
  - check: assert max_profit([7, 1, 5, 3, 6, 4]) == 5
  - check: assert max_profit([7, 6, 4, 3, 1]) == 0
  - check: assert max_profit([5]) == 0
  - check: assert max_profit([1, 2]) == 1
  - check: assert max_profit([2, 4, 1]) == 2
  - check: assert max_profit([3, 8, 1]) == 5
  - check: assert max_profit([2, 1, 2, 1, 0, 1, 2]) == 2
solution: |
  def max_profit(prices):
      lowest = prices[0]
      best = 0
      for price in prices:
          lowest = min(lowest, price)
          best = max(best, price - lowest)
      return best
random:
  call: max_profit
  gen: |
    def gen(rng, size):
        return ([rng.randint(0, 20) for _ in range(size + 1)],)
wrong:
  - |
    def max_profit(prices):
        return max(prices) - min(prices)
  - |
    def max_profit(prices):
        i = prices.index(min(prices))
        return max(prices[i:]) - prices[i]
  - |
    def max_profit(prices):
        best = 0
        for i in range(len(prices) - 1):
            best = max(best, prices[i + 1] - prices[i])
        return best
equivalent:
  - best = -1  # why: on the first day price - lowest is 0, so best becomes 0 before it is used
---
::
````

## Acceptance gates
1. `grep -cF "id: iv-easy-011" content/interview/easy/011-best-time-to-buy-and-sell-stock.md` prints `1`
2. `grep -cF "same:" content/interview/easy/011-best-time-to-buy-and-sell-stock.md` prints `0`
3. `grep -cF "best = max(best, price - lowest)" content/interview/easy/011-best-time-to-buy-and-sell-stock.md` prints `1`
4. `grep -cF "prices.index(min(prices))" content/interview/easy/011-best-time-to-buy-and-sell-stock.md` prints `1`
5. `grep -cF "  - best = -1  # why:" content/interview/easy/011-best-time-to-buy-and-sell-stock.md` prints `1`
6. `wc -l content/interview/easy/011-best-time-to-buy-and-sell-stock.md` prints `63 content/interview/easy/011-best-time-to-buy-and-sell-stock.md`
7. Run by hand: `node scripts/check-interview.ts` prints a mutant line for 011-best-time-to-buy-and-sell-stock and ends with `interview ok`. If it names this file, send the PE the exact message. Do not patch it by hand. Then commit this file and this spec with the message "Interview: easy 011 Best Time to Buy and Sell Stock".
