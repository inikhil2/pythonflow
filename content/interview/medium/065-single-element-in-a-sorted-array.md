---
title: Single Element in a Sorted Array
tier: medium
order: 65
leetcode: 540
url: https://leetcode.com/problems/single-element-in-a-sorted-array/
companies: [Amazon, Google, Meta]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

You get a list of whole numbers sorted from smallest to largest. Every value appears exactly twice, except one value that appears exactly once. The list has an odd length between 1 and 199999, and each value is from 0 to 100000. Return the value that appears only once. Your method must take a number of steps that grows like the logarithm of the list length.

Before the single value, each pair starts at an even position. After it, each pair starts at an odd position. So at any middle position, you can check whether the pair there starts at an even or an odd position and tell which side holds the single value.

::exercise
---
id: iv-medium-065
prompt: Write a function single_element(nums) that returns the one value in the sorted list that does not have a partner. Use a method that takes about logarithmic time.
starter: |
  # write your code below
  def single_element(nums):
      pass
hints:
  - Make the middle index even, so that it starts a pair. Compare it with the next value.
  - If the pair matches, the single value is further right. Otherwise it is at or to the left of the middle.
tests:
  - check: assert single_element([1]) == 1
  - check: assert single_element([1, 1, 2]) == 2
  - check: assert single_element([1, 2, 2]) == 1
  - check: assert single_element([1, 1, 2, 3, 3]) == 2
  - check: assert single_element([0, 0, 1, 2, 2, 3, 3]) == 1
  - check: assert single_element([0, 0, 1, 1, 2, 3, 3]) == 2
  - check: assert single_element([3, 3, 7, 7, 10, 11, 11]) == 10
big: assert single_element([v for v in range(50000) for _ in (0, 1)] + [50000] + [v for v in range(50001, 100000) for _ in (0, 1)]) == 50000
solution: |
  def single_element(nums):
      lo, hi = 0, len(nums) - 1
      while lo < hi:
          mid = (lo + hi) // 2
          if mid % 2 == 1:
              mid -= 1
          if nums[mid] == nums[mid + 1]:
              lo = mid + 2
          else:
              hi = mid
      return nums[lo]
brute: |
  def single_element(nums):
      result = 0
      for value in nums:
          result ^= value
      return result
random:
  call: single_element
  gen: |
    def gen(rng, size):
        m = max(size, 0)
        single = rng.randint(0, m)
        nums = []
        for v in range(m + 1):
            if v == single:
                nums.append(v)
            else:
                nums += [v, v]
        return (nums,)
slow:
  - |
    def single_element(nums):
        for i in range(len(nums)):
            count = 0
            for j in range(len(nums)):
                if nums[j] == nums[i]:
                    count += 1
            if count == 1:
                return nums[i]
  - |
    def single_element(nums):
        for x in nums:
            if nums.count(x) == 1:
                return x
wrong:
  - |
    def single_element(nums):
        return nums[len(nums) // 2]
  - |
    def single_element(nums):
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] == nums[mid + 1]:
                lo = mid + 2
            else:
                hi = mid
        return nums[lo]
  - |
    def single_element(nums):
        for i in range(1, len(nums) - 1, 2):
            if nums[i] != nums[i + 1]:
                return nums[i]
        return nums[0]
equivalent:
  - "lo, hi = (0, len(nums) - 2)"   # why: if the single value is last, every probed pair matches, so the search climbs to the last index and returns it
---
::
