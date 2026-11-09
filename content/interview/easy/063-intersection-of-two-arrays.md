---
title: Intersection of Two Arrays
tier: easy
order: 63
leetcode: 349
url: https://leetcode.com/problems/intersection-of-two-arrays/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get two lists of whole numbers, `nums1` and `nums2`. Each list has between 1 and 30000 items, and every value is a whole number from 0 to 60000. Return a list of the values that appear in both lists. Each value must appear only once in your answer, and the answer may be in any order.

Repeats do not count twice: if a value appears three times in one list and once in the other, it goes into the answer once. If the two lists share nothing, return an empty list.

::exercise
---
id: iv-easy-063
prompt: Write a function intersection(nums1, nums2) that returns the distinct values found in both lists, in any order.
starter: |
  # write your code below
  def intersection(nums1, nums2):
      pass
hints:
  - Record the values of one list in a dictionary, so checking a value from the other list is quick.
  - Keep each shared value once by recording it in a second dictionary as you find it.
tests:
  - check: assert sorted(intersection([1, 2, 2, 1], [2, 2])) == [2]
  - check: assert sorted(intersection([4, 9, 5], [9, 4, 9, 8, 4])) == [4, 9]
  - check: assert sorted(intersection([1, 2, 3], [4, 5, 6])) == []
  - check: assert sorted(intersection([5], [5])) == [5]
  - check: assert sorted(intersection([0, 0, 0], [0])) == [0]
  - check: assert sorted(intersection([7, 8], [8, 7, 9])) == [7, 8]
  - check: assert sorted(intersection([3, 1, 2], [2, 3, 1])) == [1, 2, 3]
solution: |
  def intersection(nums1, nums2):
      in_first = {}
      for x in nums1:
          in_first[x] = True
      found = {}
      result = []
      for y in nums2:
          if in_first.get(y) and not found.get(y):
              found[y] = True
              result.append(y)
      return result
brute: |
  def intersection(nums1, nums2):
      result = []
      for x in nums1:
          if x in nums2 and x not in result:
              result.append(x)
      return result
random:
  call: intersection
  gen: |
    def gen(rng, size):
        nums1 = [rng.randint(0, 9) for _ in range(max(size, 1))]
        nums2 = [rng.randint(0, 9) for _ in range(max(size, 1))]
        return (nums1, nums2)
  same: |
    def same(args, got, want):
        return sorted(got) == sorted(want)
big: assert sorted(intersection([19999, 29999] + list(range(29998)), [19999, 29999] + list(range(30001, 59999)))) == [19999, 29999]
slow:
  - |
    def intersection(nums1, nums2):
        return [x for x in set(nums1) if x in nums2]
  - |
    def intersection(nums1, nums2):
        result = []
        for x in nums1:
            found = False
            for y in nums2:
                if y == x:
                    found = True
            if found and x not in result:
                result.append(x)
        return result
wrong:
  - |
    def intersection(nums1, nums2):
        s = set(nums2)
        return [x for x in nums1 if x in s]
  - |
    def intersection(nums1, nums2):
        for x in nums1:
            if x in nums2:
                return [x]
        return []
---
::
