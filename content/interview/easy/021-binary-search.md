---
title: Binary Search
tier: easy
order: 21
leetcode: 704
url: https://leetcode.com/problems/binary-search/
companies: [Google, Amazon, Microsoft]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a sorted list of different whole numbers and a target number. Return the index of the target, or -1 if the target is not in the list. The list may be empty, and it can be long, so cut the search range in half at each step instead of checking every item.

::exercise
---
id: iv-easy-021
prompt: Write a function binary_search(nums, target) that returns the index of target in the sorted list nums, or -1 if it is not there.
starter: |
  # write your code below
  def binary_search(nums, target):
      pass
hints:
  - Look at the middle item, and if it is too small or too big, drop the half where the target cannot be.
  - Keep going while the range still has at least one item, so a range of one item is still checked.
tests:
  - check: assert binary_search([-1, 0, 3, 5, 9, 12], 9) == 4
  - check: assert binary_search([-1, 0, 3, 5, 9, 12], 2) == -1
  - check: assert binary_search([-1, 0, 3, 5, 9, 12], -1) == 0
  - check: assert binary_search([-1, 0, 3, 5, 9, 12], 12) == 5
  - check: assert binary_search([5], 5) == 0
  - check: assert binary_search([5], 1) == -1
  - check: assert binary_search([], 3) == -1
  - check: assert binary_search([1, 2], 2) == 1
  - check: assert binary_search(list(range(0, 200, 2)), 150) == 75
solution: |
  def binary_search(nums, target):
      lo, hi = 0, len(nums) - 1
      while lo <= hi:
          mid = (lo + hi) // 2
          if nums[mid] == target:
              return mid
          if nums[mid] < target:
              lo = mid + 1
          else:
              hi = mid - 1
      return -1
brute: |
  def binary_search(nums, target):
      return nums.index(target) if target in nums else -1
random:
  call: binary_search
  gen: |
    def gen(rng, size):
        nums = sorted(rng.sample(range(-10, 11), rng.randint(0, size + 3)))
        if nums and rng.random() < 0.5:
            target = rng.choice(nums)
        else:
            target = rng.randint(-11, 11)
        return (nums, target)
wrong:
  - |
    def binary_search(nums, target):
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return -1
  - |
    def binary_search(nums, target):
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return lo
equivalent:
  - "if nums[mid] <= target:"  # why: the equal case has already returned above, so <= and < behave the same here
  - "mid = (lo + hi) // 1"  # why: lo stays 0, because a raised lo is hi + 1 and ends the loop, so mid is hi and the search walks down to the same answer, only slower
---
::
