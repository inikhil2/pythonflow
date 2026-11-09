---
title: Find Pivot Index
tier: easy
order: 46
leetcode: 724
url: https://leetcode.com/problems/find-pivot-index/
companies: [Google, Amazon, Apple]
topic: Prefix sum
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list nums of 1 to 80000 whole numbers, each between -1000 and 1000. Find an index where the sum of the numbers before it equals the sum of the numbers after it. The number at that index is in neither sum. An empty sum counts as 0. If several indexes work, return the smallest. If none works, return -1.

::exercise
---
id: iv-easy-046
prompt: Write a function pivot_index(nums) that returns the smallest index whose left sum equals its right sum, or -1 if there is none.
starter: |
  # write your code below
  def pivot_index(nums):
      pass
hints:
  - Add up the whole list once, then walk forward while keeping the sum of the numbers already passed.
  - At each index the right sum is the total, minus the left sum, minus the number at that index.
tests:
  - check: assert pivot_index([1, 7, 3, 6, 5, 6]) == 3
  - check: assert pivot_index([1, 2, 3]) == -1
  - check: assert pivot_index([2, 1, -1]) == 0
  - check: assert pivot_index([1]) == 0
  - check: assert pivot_index([0, 0]) == 0
  - check: assert pivot_index([1, 1, 1]) == 1
big: assert pivot_index((rng := __import__("random").Random(925)) and (L := [rng.randint(-1000, 1000) for _ in range(61000)]) and (R := [rng.randint(-1000, 1000) for _ in range(17999)]) and L + [0] + R + [sum(L) - sum(R)]) == 17016
solution: |
  def pivot_index(nums):
      total = sum(nums)
      left = 0
      for i, x in enumerate(nums):
          if left == total - left - x:
              return i
          left += x
      return -1
brute: |
  def pivot_index(nums):
      for i in range(len(nums)):
          if sum(nums[:i]) == sum(nums[i + 1:]):
              return i
      return -1
random:
  call: pivot_index
  gen: |
    def gen(rng, size):
        return ([rng.randint(-3, 3) for _ in range(rng.randint(1, size + 4))],)
slow:
  - |
    def pivot_index(nums):
        for i in range(len(nums)):
            left = 0
            for j in range(i):
                left += nums[j]
            right = 0
            for j in range(i + 1, len(nums)):
                right += nums[j]
            if left == right:
                return i
        return -1
  - |
    def pivot_index(nums):
        for i in range(len(nums)):
            if sum(nums[:i]) == sum(nums[i + 1:]):
                return i
        return -1
wrong:
  - |
    def pivot_index(nums):
        total = sum(nums)
        left = 0
        for i, x in enumerate(nums):
            if left == total - left:
                return i
            left += x
        return -1
  - |
    def pivot_index(nums):
        total = sum(nums)
        left = 0
        found = -1
        for i, x in enumerate(nums):
            if left == total - left - x:
                found = i
            left += x
        return found
---
::
