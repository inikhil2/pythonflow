---
title: Contains Duplicate II
tier: easy
order: 66
leetcode: 219
url: https://leetcode.com/problems/contains-duplicate-ii/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list `nums` of between 1 and 100000 whole numbers, from -1000000 to 1000000, and a whole number `k` from 0 to 100000. Return `True` if there are two different positions `i` and `j` where `nums[i]` equals `nums[j]` and the distance between the positions, `j - i`, is at most `k`. Otherwise return `False`.

Two positions at the same index do not count, so with `k` equal to 0 the answer is always `False`. The distance is measured between the two positions, not between their values.

::exercise
---
id: iv-easy-066
prompt: Write a function contains_nearby_duplicate(nums, k) that returns True if two equal values sit at most k positions apart, and False otherwise.
starter: |
  # write your code below
  def contains_nearby_duplicate(nums, k):
      pass
hints:
  - Remember the most recent position of each value as you walk the list.
  - When you see a value again, compare its new position with the remembered one.
tests:
  - check: assert contains_nearby_duplicate([1, 2, 3, 1], 3) == True
  - check: assert contains_nearby_duplicate([1, 0, 1, 1], 1) == True
  - check: assert contains_nearby_duplicate([1, 2, 3, 1, 2, 3], 2) == False
  - check: assert contains_nearby_duplicate([1], 0) == False
  - check: assert contains_nearby_duplicate([1, 1], 0) == False
  - check: assert contains_nearby_duplicate([1, 1], 1) == True
  - check: assert contains_nearby_duplicate([99, 5, 99], 1) == False
  - check: assert contains_nearby_duplicate([4, 4, 4], 2) == True
solution: |
  def contains_nearby_duplicate(nums, k):
      last = {}
      for i, x in enumerate(nums):
          if x in last and i - last[x] <= k:
              return True
          last[x] = i
      return False
brute: |
  def contains_nearby_duplicate(nums, k):
      for i in range(len(nums)):
          for j in range(i + 1, min(len(nums), i + k + 1)):
              if nums[i] == nums[j]:
                  return True
      return False
random:
  call: contains_nearby_duplicate
  gen: |
    def gen(rng, size):
        nums = [rng.randint(-3, 3) for _ in range(max(size, 1))]
        return (nums, rng.randint(0, 5))
big: assert contains_nearby_duplicate([(i * 7919) % 1000003 - 500000 for i in range(99999)] + [-500000], 99999) and not contains_nearby_duplicate([(i * 7919) % 1000003 - 500000 for i in range(99999)] + [-500000], 99998)
slow:
  - |
    def contains_nearby_duplicate(nums, k):
        for i in range(len(nums)):
            if nums[i] in nums[i + 1:i + k + 1]:
                return True
        return False
  - |
    def contains_nearby_duplicate(nums, k):
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if j - i <= k and nums[i] == nums[j]:
                    return True
        return False
wrong:
  - |
    def contains_nearby_duplicate(nums, k):
        seen = {}
        for x in nums:
            if x in seen:
                return True
            seen[x] = True
        return False
  - |
    def contains_nearby_duplicate(nums, k):
        last = {}
        for i, x in enumerate(nums):
            if x in last and i - last[x] < k:
                return True
            last[x] = i
        return False
  - |
    def contains_nearby_duplicate(nums, k):
        if k < 1:
            return False
        for i in range(len(nums) - 1):
            if nums[i] == nums[i + 1]:
                return True
        return False
---
::
