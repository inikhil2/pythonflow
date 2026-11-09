---
title: Remove Duplicates from Sorted Array
tier: easy
order: 13
leetcode: 26
url: https://leetcode.com/problems/remove-duplicates-from-sorted-array/
companies: [Google, Meta, Amazon]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list of whole numbers that is already sorted from smallest to largest, and it may hold repeats. Return a new list that keeps each value once, in the same order. The list you were given must stay the same.

::exercise
---
id: iv-easy-013
prompt: Write a function remove_duplicates(nums) that returns a new list with each value from the sorted list nums kept once, in order.
starter: |
  # write your code below
  def remove_duplicates(nums):
      pass
hints:
  - Keep a value only when it differs from the last value you kept.
  - An empty list has no last value, so check for that before you look at the last item.
tests:
  - check: assert remove_duplicates([]) == []
  - check: assert remove_duplicates([5]) == [5]
  - check: assert remove_duplicates([1, 1]) == [1]
  - check: assert remove_duplicates([1, 2, 3]) == [1, 2, 3]
  - check: assert remove_duplicates([1, 1, 2, 3, 3]) == [1, 2, 3]
  - check: assert remove_duplicates([-3, -3, 0, 0, 4]) == [-3, 0, 4]
  - check: assert remove_duplicates([2, 2, 2, 2]) == [2]
  - check: assert remove_duplicates([1, 2, 2]) == [1, 2]
  - check: assert remove_duplicates([i // 3 for i in range(3000)]) == list(range(1000))
  - check: assert remove_duplicates([1, 1, 2]) == [1, 2]
  - check: assert remove_duplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]) == [0, 1, 2, 3, 4]
solution: |
  def remove_duplicates(nums):
      result = []
      for n in nums:
          if not result or result[-1] != n:
              result.append(n)
      return result
brute: |
  def remove_duplicates(nums):
      result = []
      for n in nums:
          if n not in result:
              result.append(n)
      return result
random:
  call: remove_duplicates
  gen: |
    def gen(rng, size):
        return (sorted(rng.randint(-5, 5) for _ in range(size)),)
wrong:
  - |
    def remove_duplicates(nums):
        result = []
        for i in range(len(nums) - 1):
            if nums[i] != nums[i + 1]:
                result.append(nums[i])
        return result
  - |
    def remove_duplicates(nums):
        return list(set(nums))
---
::
