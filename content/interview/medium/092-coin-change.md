---
title: Coin Change
tier: medium
order: 92
leetcode: 322
url: https://leetcode.com/problems/coin-change/
companies: [Amazon, Google, Meta]
topic: Dynamic programming
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/10-dynamic-programming]
---

You get `coins`, a list of between 1 and 12 distinct coin values, each from 1 to 1000, and `amount`, a whole number from 0 to 10000. You have an unlimited supply of every coin.

Return the fewest coins that add up to exactly `amount`. Return 0 when `amount` is 0, and return -1 when no mix of the coins can make `amount`.

::exercise
---
id: iv-medium-092
prompt: Write a function coin_change(coins, amount) that returns the fewest coins needed to make amount, or -1 if it cannot be made.
starter: |
  # write your code below
  def coin_change(coins, amount):
      pass
hints:
  - Work out the fewest coins for each amount from 0 up to the target. Each amount is one more than the fewest coins for the amount left after one coin is taken away.
  - Start every amount at a value that is too large to be real, so an amount that cannot be made is easy to spot at the end.
tests:
  - check: assert coin_change([1, 2, 5], 11) == 3
  - check: assert coin_change([2], 3) == -1
  - check: assert coin_change([1], 0) == 0
  - check: assert coin_change([1], 1) == 1
  - check: assert coin_change([1, 3, 4], 6) == 2
  - check: assert coin_change([2, 5, 10, 1], 12) == 2
  - check: assert coin_change([3, 7], 5) == -1
  - check: assert coin_change([5, 7], 22) == 4
big: assert coin_change([186, 419, 83, 408], 9999) == 27 and coin_change([2], 9999) == -1
solution: |
  def coin_change(coins, amount):
      too_many = amount + 1
      table = [0] + [too_many] * amount
      for a in range(1, amount + 1):
          for c in coins:
              if c <= a:
                  table[a] = min(table[a], table[a - c] + 1)
      return table[amount] if table[amount] <= amount else -1
brute: |
  def coin_change(coins, amount):
      best = [None]
      def go(rem, used):
          if rem == 0:
              if best[0] is None or used < best[0]:
                  best[0] = used
              return
          for c in coins:
              if c <= rem:
                  go(rem - c, used + 1)
      go(amount, 0)
      return -1 if best[0] is None else best[0]
slow:
  - |
    def coin_change(coins, amount):
        def ways(t):
            table = [0] + [-1] * t
            for a in range(1, t + 1):
                for c in coins:
                    if c <= a and table[a - c] != -1:
                        if table[a] == -1 or table[a - c] + 1 < table[a]:
                            table[a] = table[a - c] + 1
            return table[t]
        answer = 0
        for t in range(amount + 1):
            answer = ways(t)
        return answer
random:
  call: coin_change
  gen: |
    def gen(rng, size):
        coins = rng.sample(range(1, 14), rng.randint(1, 6))
        return (coins, rng.randint(0, min(max(size, 1), 14)))
wrong:
  - |
    def coin_change(coins, amount):
        count = 0
        for c in sorted(coins, reverse=True):
            count += amount // c
            amount %= c
        return count if amount == 0 else -1
  - |
    def coin_change(coins, amount):
        too_many = amount + 1
        table = [0] + [too_many] * amount
        for a in range(1, amount + 1):
            for c in coins:
                if c <= a:
                    table[a] = min(table[a], table[a - c] + 1)
        return table[amount] if table[amount] <= amount else 0
  - |
    def coin_change(coins, amount):
        too_many = amount + 1
        table = [0] + [too_many] * amount
        for a in range(1, amount):
            for c in coins:
                if c <= a:
                    table[a] = min(table[a], table[a - c] + 1)
        return table[amount] if table[amount] <= amount else -1
equivalent:
  - "too_many = amount + 2"  # why: any sentinel above amount works, since the final check only asks whether table[amount] is at most amount
  - "for a in range(0, amount + 1):"  # why: at a = 0 no coin is at most 0, because every coin is at least 1, so the extra pass changes nothing
---
::
