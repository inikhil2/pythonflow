---
title: Contains Duplicate III
tier: hard
order: 39
leetcode: 220
url: https://leetcode.com/problems/contains-duplicate-iii/
companies: [Google, Meta, Amazon]
topic: Sliding window
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week10-algorithms/01-two-pointers, /learn/week10-algorithms/04-sorting-and-heaps]
---

You get a list of whole numbers nums and two whole numbers index_diff and value_diff. Return True if there are two different places i and j in the list such that the two places are at most index_diff apart (abs(i - j) <= index_diff) and the two numbers there are at most value_diff apart (abs(nums[i] - nums[j]) <= value_diff). Return False if there are no such two places.

There are between 1 and 100000 numbers, each between -1000000000 and 1000000000. index_diff is between 1 and the length of nums, and value_diff is between 0 and 1000000000. Comparing every number with all its neighbours is too slow when index_diff is large.

::exercise
---
id: iv-hard-039
prompt: Write a function contains_nearby_almost_duplicate(nums, index_diff, value_diff) that returns True if two different places at most index_diff apart hold numbers at most value_diff apart.
starter: |
  # write your code below
  def contains_nearby_almost_duplicate(nums, index_diff, value_diff):
      pass
hints:
  - Only the last index_diff numbers matter at any moment, so keep them in a window and remove the oldest one as you move.
  - Put every number in a bucket of width value_diff + 1 (use // to find it). Two numbers in the same bucket are always close enough, and only the two neighbouring buckets need a direct check.
tests:
  - check: assert contains_nearby_almost_duplicate([1, 2, 3, 1], 3, 0) is True
  - check: assert contains_nearby_almost_duplicate([1, 0, 1, 1], 1, 2) is True
  - check: assert contains_nearby_almost_duplicate([1, 5, 9, 1, 5, 9], 2, 3) is False
  - check: assert contains_nearby_almost_duplicate([1], 1, 0) is False
  - check: assert contains_nearby_almost_duplicate([5, 5], 1, 0) is True
  - check: assert contains_nearby_almost_duplicate([5, 7], 1, 1) is False
  - check: assert contains_nearby_almost_duplicate([5, 7], 1, 2) is True
  - check: assert contains_nearby_almost_duplicate([-3, 3], 1, 6) is True
  - check: assert contains_nearby_almost_duplicate([-3, 3], 1, 5) is False
  - check: assert contains_nearby_almost_duplicate([1, 2, 3, 4, 5, 6], 2, 0) is False
  - check: assert contains_nearby_almost_duplicate([10, 100, 11, 9, 100, 10], 2, 1) is True
  - check: assert contains_nearby_almost_duplicate([1000000000, -1000000000], 1, 1000000000) is False
  - check: assert contains_nearby_almost_duplicate([4, 1, 8, 2, 7], 3, 0) is False
  - check: assert contains_nearby_almost_duplicate([0, 10, 0], 1, 0) is False
  - check: assert contains_nearby_almost_duplicate([0, 10, 0], 2, 0) is True
  - check: assert contains_nearby_almost_duplicate([2, 0, -2, 2], 2, 1) is False
  - check: assert contains_nearby_almost_duplicate([8, 4, -3, 0, 5], 2, 2) is False
solution: |
  def contains_nearby_almost_duplicate(nums, index_diff, value_diff):
      width = value_diff + 1
      buckets = {}
      for i, v in enumerate(nums):
          b = v // width
          if b in buckets:
              return True
          if b - 1 in buckets and v - buckets[b - 1] <= value_diff:
              return True
          if b + 1 in buckets and buckets[b + 1] - v <= value_diff:
              return True
          buckets[b] = v
          if i >= index_diff:
              del buckets[nums[i - index_diff] // width]
      return False
brute: |
  def contains_nearby_almost_duplicate(nums, index_diff, value_diff):
      for i in range(len(nums)):
          for j in range(i + 1, min(len(nums), i + index_diff + 1)):
              if abs(nums[i] - nums[j]) <= value_diff:
                  return True
      return False
valid: |
  def valid(nums, index_diff, value_diff):
      return 1 <= len(nums) <= 100000 and all(-10 ** 9 <= v <= 10 ** 9 for v in nums) and 1 <= index_diff <= len(nums) and 0 <= value_diff <= 10 ** 9
random:
  call: contains_nearby_almost_duplicate
  gen: |
    def gen(rng, size):
        n = rng.randint(1, min(size + 2, 10))
        return ([rng.randint(-12, 12) for _ in range(n)], rng.randint(1, n), rng.randint(0, 5))
big: 'assert (lambda a: contains_nearby_almost_duplicate(a, 47317, 19000) is False)([i * 7919 % 100003 * 19000 - 10 ** 9 for i in range(100000)])'
slow:
  - |
    def contains_nearby_almost_duplicate(nums, index_diff, value_diff):
        for i in range(len(nums)):
            for j in range(max(0, i - index_diff), i):
                if abs(nums[i] - nums[j]) <= value_diff:
                    return True
        return False
wrong:
  - |
    def contains_nearby_almost_duplicate(nums, index_diff, value_diff):
        width = value_diff
        buckets = {}
        for i, v in enumerate(nums):
            b = v // width
            if b in buckets:
                return True
            if b - 1 in buckets and v - buckets[b - 1] <= value_diff:
                return True
            if b + 1 in buckets and buckets[b + 1] - v <= value_diff:
                return True
            buckets[b] = v
            if i >= index_diff:
                del buckets[nums[i - index_diff] // width]
        return False
  - |
    def contains_nearby_almost_duplicate(nums, index_diff, value_diff):
        width = value_diff + 1
        buckets = {}
        for i, v in enumerate(nums):
            b = v // width
            if b in buckets:
                return True
            if b - 1 in buckets and v - buckets[b - 1] <= value_diff:
                return True
            if b + 1 in buckets and buckets[b + 1] - v <= value_diff:
                return True
            buckets[b] = v
        return False
  - |
    def contains_nearby_almost_duplicate(nums, index_diff, value_diff):
        width = value_diff + 1
        buckets = {}
        for i, v in enumerate(nums):
            b = v // width
            if b in buckets:
                return True
            if b - 1 in buckets and v - buckets[b - 1] <= value_diff:
                return True
            if b + 1 in buckets and buckets[b + 1] - v <= value_diff:
                return True
            buckets[b] = v
            if i > index_diff:
                del buckets[nums[i - index_diff - 1] // width]
        return False
  - |
    def contains_nearby_almost_duplicate(nums, index_diff, value_diff):
        width = value_diff + 1
        buckets = {}
        for i, v in enumerate(nums):
            b = v // width
            if b in buckets or b - 1 in buckets or b + 1 in buckets:
                return True
            buckets[b] = v
            if i >= index_diff:
                del buckets[nums[i - index_diff] // width]
        return False
---
::
