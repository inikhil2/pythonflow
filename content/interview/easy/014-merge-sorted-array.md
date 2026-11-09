---
title: Merge Sorted Array
tier: easy
order: 14
leetcode: 88
url: https://leetcode.com/problems/merge-sorted-array/
companies: [Google, Amazon, Apple]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get two lists of whole numbers, and each list is already sorted from smallest to largest. Build one new sorted list that holds every value from both lists. Either list may be empty.

::exercise
---
id: iv-easy-014
prompt: Write a function merge_sorted_array(nums1, nums2) that returns one new sorted list with every value from the two sorted lists.
starter: |
  # write your code below
  def merge_sorted_array(nums1, nums2):
      pass
hints:
  - Keep one position in each list, and always take the smaller of the two values at those positions.
  - When one list runs out, the rest of the other list is already in order, so add it to the end.
tests:
  - check: assert merge_sorted_array([], []) == []
  - check: assert merge_sorted_array([], [1, 2]) == [1, 2]
  - check: assert merge_sorted_array([1, 2, 3], []) == [1, 2, 3]
  - check: assert merge_sorted_array([1, 3, 5], [2, 4, 6]) == [1, 2, 3, 4, 5, 6]
  - check: assert merge_sorted_array([1, 2, 3], [4, 5]) == [1, 2, 3, 4, 5]
  - check: assert merge_sorted_array([4, 5], [1, 2, 3]) == [1, 2, 3, 4, 5]
  - check: assert merge_sorted_array([1, 1, 2], [1, 3]) == [1, 1, 1, 2, 3]
  - check: assert merge_sorted_array([-5, 0], [-3]) == [-5, -3, 0]
  - check: assert merge_sorted_array([1, 2, 3], [2, 5, 6]) == [1, 2, 2, 3, 5, 6]
  - check: assert merge_sorted_array([1], []) == [1]
  - check: assert merge_sorted_array([0], [1]) == [0, 1]
solution: |
  def merge_sorted_array(nums1, nums2):
      result = []
      i = 0
      j = 0
      while i < len(nums1) and j < len(nums2):
          if nums1[i] <= nums2[j]:
              result.append(nums1[i])
              i += 1
          else:
              result.append(nums2[j])
              j += 1
      return result + nums1[i:] + nums2[j:]
brute: |
  def merge_sorted_array(nums1, nums2):
      return sorted(nums1 + nums2)
random:
  call: merge_sorted_array
  gen: |
    def gen(rng, size):
        a = sorted(rng.randint(-5, 9) for _ in range(rng.randint(0, size)))
        b = sorted(rng.randint(-5, 9) for _ in range(rng.randint(0, size)))
        return (a, b)
equivalent:
  - "if nums1[i] < nums2[j]:"  # why: both branches add the same value when the two are equal, so the merged values are identical either way
wrong:
  - |
    def merge_sorted_array(nums1, nums2):
        result = []
        i = 0
        j = 0
        while i < len(nums1) and j < len(nums2):
            if nums1[i] <= nums2[j]:
                result.append(nums1[i])
                i += 1
            else:
                result.append(nums2[j])
                j += 1
        return result
  - |
    def merge_sorted_array(nums1, nums2):
        return sorted(nums1) + sorted(nums2)
---
::
