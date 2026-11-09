---
title: Longest Harmonious Subsequence
tier: easy
order: 75
leetcode: 594
url: https://leetcode.com/problems/longest-harmonious-subsequence/
companies: [Amazon, Meta, Google]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list `nums` of between 1 and 20000 whole numbers, each from -1000000000 to 1000000000. A subsequence is made by taking some of the items in their original order, and you may skip any of them. A subsequence is harmonious when its largest value is exactly 1 more than its smallest value.

Return the length of the longest harmonious subsequence. If no harmonious subsequence exists, for example when every value in `nums` is the same, return 0.

::exercise
---
id: iv-easy-075
prompt: Write a function find_lhs(nums) that returns the length of the longest subsequence whose largest value is exactly 1 more than its smallest value, or 0.
starter: |
  # write your code below
  def find_lhs(nums):
      pass
hints:
  - Count how many times each value appears. A harmonious subsequence uses only two values that differ by 1, and it can take every copy of both.
  - For each value x, check whether x + 1 also appears, and add the two counts.
tests:
  - check: assert find_lhs([1, 3, 2, 2, 5, 2, 3, 7]) == 5
  - check: assert find_lhs([1, 2, 3, 4]) == 2
  - check: assert find_lhs([1, 1, 1, 1]) == 0
  - check: assert find_lhs([1]) == 0
  - check: assert find_lhs([5, 5, 6, 6, 6]) == 5
  - check: assert find_lhs([-1, 0]) == 2
  - check: assert find_lhs([1, 3]) == 0
  - check: assert find_lhs([10, 9, 8]) == 2
big: assert find_lhs([(i * 7919) % 10000 for i in range(20000)]) == 4
solution: |
  def find_lhs(nums):
      counts = {}
      for x in nums:
          counts[x] = counts.get(x, 0) + 1
      best = 0
      for x in counts:
          if x + 1 in counts:
              best = max(best, counts[x] + counts[x + 1])
      return best
brute: |
  def find_lhs(nums):
      best = 0
      for a in nums:
          for b in nums:
              if b == a + 1:
                  best = max(best, nums.count(a) + nums.count(b))
      return best
random:
  call: find_lhs
  gen: |
    def gen(rng, size):
        return ([rng.randint(0, 4) for _ in range(max(size, 1))],)
slow:
  - |
    def find_lhs(nums):
        best = 0
        for a in set(nums):
            if a + 1 in nums:
                best = max(best, nums.count(a) + nums.count(a + 1))
        return best
  - |
    def find_lhs(nums):
        best = 0
        for a in nums:
            for b in nums:
                if b == a + 1:
                    total = 0
                    for x in nums:
                        if x == a or x == b:
                            total += 1
                    best = max(best, total)
        return best
wrong:
  - |
    def find_lhs(nums):
        counts = {}
        for x in nums:
            counts[x] = counts.get(x, 0) + 1
        best = 0
        for x in counts:
            best = max(best, counts[x])
        return best
  - |
    def find_lhs(nums):
        counts = {}
        for x in nums:
            counts[x] = counts.get(x, 0) + 1
        best = 0
        for x in counts:
            if x + 1 in counts:
                best = max(best, counts[x])
        return best
  - |
    def find_lhs(nums):
        counts = {}
        for x in nums:
            counts[x] = counts.get(x, 0) + 1
        best = 0
        for x in counts:
            if x + 2 in counts:
                best = max(best, counts[x] + counts[x + 2])
        return best
---
::
