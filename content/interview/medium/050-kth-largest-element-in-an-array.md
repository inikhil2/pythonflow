---
title: Kth Largest Element in an Array
tier: medium
order: 50
leetcode: 215
url: https://leetcode.com/problems/kth-largest-element-in-an-array/
companies: [Meta, Amazon, Google]
topic: Heap
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/04-sorting-and-heaps]
---

You get a list `nums` of 1 to 100000 whole numbers, each from -10000 to 10000. Numbers may repeat. Return the `k`th largest number in the list, where `k` is a whole number from 1 to the length of `nums`. Count repeated numbers separately, so in [3, 2, 3, 1, 2, 4, 5, 5, 6] the 4th largest is 4, because the numbers from largest to smallest are 6, 5, 5, 4, 3, 3, 2, 2, 1.

::exercise
---
id: iv-medium-050
prompt: Write a function find_kth_largest(nums, k) that returns the kth largest number in nums, counting repeats separately.
starter: |
  # write your code below
  def find_kth_largest(nums, k):
      pass
hints:
  - Sorting the list from largest to smallest puts the answer at position k minus 1.
  - A heap of the k largest numbers seen so far also works, and it is the faster method for long lists.
tests:
  - check: 'assert find_kth_largest([3, 2, 1, 5, 6, 4], 2) == 5'
  - check: 'assert find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) == 4'
  - check: 'assert find_kth_largest([1], 1) == 1'
  - check: 'assert find_kth_largest([7, 7, 7], 2) == 7'
  - check: 'assert find_kth_largest([-1, -5, -3], 3) == -5'
  - check: 'assert find_kth_largest([10, 9, 8, 7, 6, 5], 6) == 5'
  - check: 'assert find_kth_largest([2, 1], 1) == 2'
  - check: 'assert find_kth_largest([4, 4, 3, 3, 2, 2], 5) == 2'
big: assert find_kth_largest([(i * 7919) % 20001 - 10000 for i in range(100000)], 8000) == 8401
solution: |
  def find_kth_largest(nums, k):
      return sorted(nums, reverse=True)[k - 1]
brute: |
  def find_kth_largest(nums, k):
      items = list(nums)
      for _ in range(k - 1):
          items.remove(max(items))
      return max(items)
random:
  call: find_kth_largest
  gen: |
    def gen(rng, size):
        nums = [rng.randint(-20, 20) for _ in range(rng.randint(1, 3 + size))]
        return (nums, rng.randint(1, len(nums)))
slow:
  - |
    def find_kth_largest(nums, k):
        items = list(nums)
        for _ in range(k - 1):
            items.remove(max(items))
        return max(items)
  - |
    def find_kth_largest(nums, k):
        items = list(nums)
        for _ in range(k - 1):
            best = 0
            for i in range(len(items)):
                if items[i] > items[best]:
                    best = i
            items.pop(best)
        return max(items)
wrong:
  - |
    def find_kth_largest(nums, k):
        return sorted(nums)[k - 1]
  - |
    def find_kth_largest(nums, k):
        return sorted(set(nums), reverse=True)[k - 1]
  - |
    def find_kth_largest(nums, k):
        return sorted(nums)[-k - 1]
---
::
