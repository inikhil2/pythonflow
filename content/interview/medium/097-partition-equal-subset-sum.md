---
title: Partition Equal Subset Sum
tier: medium
order: 97
leetcode: 416
url: https://leetcode.com/problems/partition-equal-subset-sum/
companies: [Amazon, Google, Meta]
topic: Dynamic programming
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/10-dynamic-programming]
---

You get a list `nums` of between 1 and 100 whole numbers, each from 1 to 100.

Return `True` if you can split the numbers into two groups whose sums are equal. Every number must go into exactly one group. Return `False` otherwise.

::exercise
---
id: iv-medium-097
prompt: Write a function can_partition(nums) that returns True if nums can be split into two groups with equal sums, and False otherwise.
starter: |
  # write your code below
  def can_partition(nums):
      pass
hints:
  - If the total is odd, the two groups cannot have equal sums, so the answer is False straight away.
  - Otherwise, ask whether some group of numbers adds up to half the total. Keep a true or false flag for every sum up to half, and use each number at most once.
  - Walk the numbers in turn, and count each sum downwards from half, so a number cannot be used twice. A Python integer can also serve as a row of flags, where bit s is set when sum s can be reached.
tests:
  - check: assert can_partition([1, 5, 11, 5]) == True
  - check: assert can_partition([1, 2, 3, 5]) == False
  - check: assert can_partition([1]) == False
  - check: assert can_partition([1, 1]) == True
  - check: assert can_partition([2, 2, 3, 5]) == False
  - check: assert can_partition([3, 3, 3, 4, 5]) == True
  - check: assert can_partition([1, 2, 5]) == False
  - check: assert can_partition([2, 2]) == True
big: assert can_partition([(i * 7919) % 100 + 1 for i in range(100)]) == True and can_partition([4 * ((i * 7919) % 25 + 1) for i in range(99)] + [8]) == False and can_partition([6] * 99 + [2]) == False
solution: |
  def can_partition(nums):
      total = sum(nums)
      if total % 2:
          return False
      half = total // 2
      dp = [True] + [False] * half
      for x in nums:
          for s in range(half, x - 1, -1):
              dp[s] = dp[s] or dp[s - x]
      return dp[half]
brute: |
  def can_partition(nums):
      total = sum(nums)
      if total % 2:
          return False
      for mask in range(1 << len(nums)):
          if sum(nums[i] for i in range(len(nums)) if mask >> i & 1) * 2 == total:
              return True
      return False
slow:
  - |
    def can_partition(nums):
        total = sum(nums)
        if total % 2:
            return False
        target = total // 2
        def go(i, rem):
            if rem == 0:
                return True
            if rem < 0 or i == len(nums):
                return False
            return go(i + 1, rem - nums[i]) or go(i + 1, rem)
        return go(0, target)
random:
  call: can_partition
  gen: |
    def gen(rng, size):
        return ([rng.randint(1, 9) for _ in range(min(max(size, 1), 8))],)
wrong:
  - |
    def can_partition(nums):
        return sum(nums) % 2 == 0
  - |
    def can_partition(nums):
        total = sum(nums)
        if total % 2:
            return False
        reach = 0
        for x in nums:
            reach |= reach << x
        return (reach >> (total // 2)) & 1 == 1
  - |
    def can_partition(nums):
        total = sum(nums)
        if total % 2:
            return False
        target = total // 2
        dp = [False] * (target + 1)
        dp[0] = True
        for x in nums:
            for s in range(x, target + 1):
                dp[s] = dp[s] or dp[s - x]
        return dp[target]
equivalent:
  - "for s in range(half, x - 2, -1):"  # why: the extra step is s = x - 2; for x = 1 that is s = 0, already True, so nothing changes; for x >= 2 it reads dp[-2], which is dp[half - 1] and True only when earlier items reach at least half - 1, leaving too little for the items after x to lift that bit to half
---
::
