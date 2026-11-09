---
title: Best Time to Buy and Sell Stock II
tier: medium
order: 94
leetcode: 122
url: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/
companies: [Amazon, Meta, Google]
topic: Dynamic programming
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/10-dynamic-programming]
---

You get `prices`, a list of between 1 and 100000 whole numbers, where `prices[i]` is the price of one share on day `i`. Each price is from 0 to 10000.

You may buy one share and sell it on a later day, then buy again and sell again, as many times as you like. You may hold at most one share at a time, and you can buy and sell on the same day.

Return the largest total profit you can make.

::exercise
---
id: iv-medium-094
prompt: Write a function max_profit(prices) that returns the largest total profit from buying and selling any number of times, holding at most one share at a time.
starter: |
  # write your code below
  def max_profit(prices):
      pass
hints:
  - Every rise from one day to the next is profit you could capture on its own, so think about adding up the rises.
  - Walk through the list once, and add the gain each time the price goes up from the day before.
tests:
  - check: assert max_profit([7, 1, 5, 3, 6, 4]) == 7
  - check: assert max_profit([1, 2, 3, 4, 5]) == 4
  - check: assert max_profit([7, 6, 4, 3, 1]) == 0
  - check: assert max_profit([1]) == 0
  - check: assert max_profit([2, 1, 2, 0, 1]) == 2
  - check: assert max_profit([1, 2]) == 1
  - check: assert max_profit([3, 3, 3]) == 0
  - check: assert max_profit([5, 1, 4, 2, 9]) == 10
big: assert max_profit([(i * 7919) % 10001 for i in range(100000)]) == 164857742 and max_profit([1, 2] * 5000) == 5000
solution: |
  def max_profit(prices):
      total = 0
      for yesterday, today in zip(prices, prices[1:]):
          if today > yesterday:
              total += today - yesterday
      return total
brute: |
  def max_profit(prices):
      best = 0
      def go(day, holding, cash):
          nonlocal best
          if day == len(prices):
              if not holding:
                  best = max(best, cash)
              return
          go(day + 1, holding, cash)
          if holding:
              go(day + 1, False, cash + prices[day])
          else:
              go(day + 1, True, cash - prices[day])
      go(0, False, 0)
      return best
slow:
  - |
    def max_profit(prices):
        n = len(prices)
        best = [0] * (n + 1)
        for i in range(n - 1, -1, -1):
            best[i] = max(best[i + 1], max((prices[j] - prices[i] + best[j + 1] for j in range(i + 1, n) if prices[j] > prices[i]), default=0))
        return best[0]
random:
  call: max_profit
  gen: |
    def gen(rng, size):
        return ([rng.randint(0, 9) for _ in range(min(max(size, 1), 8))],)
wrong:
  - |
    def max_profit(prices):
        low = prices[0]
        best = 0
        for p in prices:
            low = min(low, p)
            best = max(best, p - low)
        return best
  - |
    def max_profit(prices):
        return prices[-1] - prices[0] if prices[-1] > prices[0] else 0
  - |
    def max_profit(prices):
        total = 0
        for yesterday, today in zip(prices, prices[1:]):
            total += today - yesterday
        return max(total, 0)
equivalent:
  - "if today >= yesterday:"  # why: when the two prices are equal the gain is 0, so adding it changes nothing
---
::
