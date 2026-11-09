---
title: House Robber
tier: medium
order: 89
leetcode: 198
url: https://leetcode.com/problems/house-robber/
companies: [Amazon, Microsoft, Google]
topic: Dynamic programming
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/10-dynamic-programming]
---

A robber walks along a street of houses. `nums` is a list of between 1 and 100000 values, and `nums[i]` is the money in house `i`. Each value is from 0 to 400.

The robber cannot rob two houses that sit next to each other, because the alarm goes off. Return the largest total money the robber can take without robbing two neighbouring houses.

::exercise
---
id: iv-medium-089
prompt: Write a function house_robber(nums) that returns the largest sum of values from houses where no two chosen houses are next to each other.
starter: |
  # write your code below
  def house_robber(nums):
      pass
hints:
  - For each house, the best total is either the best total up to the house before, or this house's money plus the best total up to two houses before.
  - Keep only the last two best totals as you walk along the list, so the whole thing takes one pass.
tests:
  - check: assert house_robber([1, 2, 3, 1]) == 4
  - check: assert house_robber([2, 7, 9, 3, 1]) == 12
  - check: assert house_robber([2, 1, 1, 2]) == 4
  - check: assert house_robber([5]) == 5
  - check: assert house_robber([0]) == 0
  - check: assert house_robber([3, 10, 3, 1, 2]) == 12
  - check: assert house_robber([2, 1]) == 2
big: assert house_robber([(i * 7919) % 401 for i in range(99998)] + [0, 400]) == 12469450 and house_robber([400] * 10000) == 2000000
solution: |
  def house_robber(nums):
      take, skip = 0, 0
      for money in nums:
          take, skip = skip + money, max(skip, take)
      return max(take, skip)
brute: |
  def house_robber(nums):
      best = 0
      for mask in range(1 << len(nums)):
          chosen = [i for i in range(len(nums)) if mask >> i & 1]
          if all(b - a > 1 for a, b in zip(chosen, chosen[1:])):
              best = max(best, sum(nums[i] for i in chosen))
      return best
slow:
  - |
    def house_robber(nums):
        best = [0] * (len(nums) + 1)
        for i in range(1, len(nums) + 1):
            best[i] = best[i - 1]
            for j in range(0, i - 1):
                best[i] = max(best[i], best[j] + nums[i - 1])
            best[i] = max(best[i], nums[i - 1])
        return best[len(nums)]
  - |
    def house_robber(nums):
        dp = [0] * (len(nums) + 1)
        for i in range(1, len(nums) + 1):
            dp[i] = max(dp[i - 1], nums[i - 1] + max(dp[:i - 1], default=0))
        return dp[len(nums)]
random:
  call: house_robber
  gen: |
    def gen(rng, size):
        return ([rng.randint(0, 50) for _ in range(max(size, 1))],)
wrong:
  - |
    def house_robber(nums):
        return sum(nums[::2])
  - |
    def house_robber(nums):
        return max(nums)
  - |
    def house_robber(nums):
        take, skip = 0, 0
        for money in nums[:-1]:
            take, skip = skip + money, max(skip, take)
        return max(take, skip)
equivalent:
  - "take, skip = (-1, 0)"  # why: the first house overwrites take, and skip becomes max(skip, take) which is 0 for a starting take of 0 or -1, so the starting take never changes the answer
---
::
