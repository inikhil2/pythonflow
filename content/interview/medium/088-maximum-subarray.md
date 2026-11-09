---
title: Maximum Subarray
tier: medium
order: 88
leetcode: 53
url: https://leetcode.com/problems/maximum-subarray/
companies: [Amazon, Microsoft, Google]
topic: Divide and conquer
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/10-dynamic-programming]
---

You get a list `nums` of between 1 and 100000 whole numbers, each from -10000 to 10000. Negative numbers are allowed.

A subarray is a run of numbers that stays together and is not empty. Return the largest sum of any subarray. If every number is negative, the answer is the largest single number, since a subarray must hold at least one number.

::exercise
---
id: iv-medium-088
prompt: Write a function max_subarray(nums) that returns the largest sum of any non-empty contiguous run of numbers in nums.
starter: |
  # write your code below
  def max_subarray(nums):
      pass
hints:
  - Walk the list once and keep the best sum of a run that ends at the current number.
  - At each number, either start a new run there or extend the run before it, whichever gives the larger sum.
tests:
  - check: assert max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6
  - check: assert max_subarray([1]) == 1
  - check: assert max_subarray([5, 4, -1, 7, 8]) == 23
  - check: assert max_subarray([-1]) == -1
  - check: assert max_subarray([-2, -1]) == -1
  - check: assert max_subarray([-3, -1, -2]) == -1
  - check: assert max_subarray([1, -2, 3]) == 3
  - check: assert max_subarray([0, -1, 0]) == 0
big: assert max_subarray([((i * 7919) % 20001) - 10000 for i in range(100000)]) == 77468 and max_subarray([-3] * 9999) == -3
solution: |
  def max_subarray(nums):
      best = cur = nums[0]
      for x in nums[1:]:
          cur = max(x, cur + x)
          best = max(best, cur)
      return best
brute: |
  def max_subarray(nums):
      best = nums[0]
      for i in range(len(nums)):
          for j in range(i + 1, len(nums) + 1):
              best = max(best, sum(nums[i:j]))
      return best
slow:
  - |
    def max_subarray(nums):
        best = None
        for i in range(len(nums)):
            total = 0
            for j in range(i, len(nums)):
                total += nums[j]
                if best is None or total > best:
                    best = total
        return best
  - |
    from itertools import accumulate
    def max_subarray(nums):
        return max(max(accumulate(nums[i:])) for i in range(len(nums)))
random:
  call: max_subarray
  gen: |
    def gen(rng, size):
        return ([rng.randint(-5, 5) for _ in range(max(size, 1))],)
wrong:
  - |
    def max_subarray(nums):
        return sum(nums)
  - |
    def max_subarray(nums):
        best = cur = 0
        for x in nums:
            cur = max(0, cur + x)
            best = max(best, cur)
        return best
  - |
    def max_subarray(nums):
        return max(nums)
---
::
