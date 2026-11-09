---
title: Find Minimum in Rotated Sorted Array II
tier: hard
order: 48
leetcode: 154
url: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/
companies: [Google, Amazon, Meta]
topic: Binary Search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

Take a list that was sorted in ascending order and then rotated: some prefix was moved to the end. The list may contain repeated values, and it has between 1 and 100000 numbers, each from -10000 to 10000. You are given such a list and must find its smallest value.

With repeated values you cannot always tell which half holds the break. For example, `[3, 1, 3, 3]` and `[3, 3, 3, 1]` look alike at the ends, so the search has to shrink the range by one step when the middle matches the right end.

::exercise
---
id: iv-hard-048
prompt: Write a function find_min(nums) that returns the smallest value in a rotated sorted list that may contain duplicates.
starter: |
  # write your code below
  def find_min(nums):
      pass
hints:
  - Compare the middle value with the right end. If the middle is larger, the minimum is to its right. If it is smaller, the minimum is at the middle or to its left.
  - When the middle equals the right end, you cannot tell which side holds the break, so drop the right end by one and keep going.
tests:
  - check: assert find_min([1]) == 1
  - check: assert find_min([1, 2]) == 1
  - check: assert find_min([2, 1]) == 1
  - check: assert find_min([1, 3, 5]) == 1
  - check: assert find_min([3, 4, 5, 1, 2]) == 1
  - check: assert find_min([2, 2, 2, 0, 2]) == 0
  - check: assert find_min([3, 1, 3, 3]) == 1
  - check: assert find_min([3, 3, 3, 1]) == 1
  - check: assert find_min([1, 1, 1, 1]) == 1
  - check: assert find_min([10, 1, 10, 10, 10]) == 1
  - check: assert find_min([-5, -5, 0, 1, -5]) == -5
  - check: assert find_min([4, 5, 6, 7, 0, 1, 2]) == 0
solution: |
  def find_min(nums):
      lo, hi = 0, len(nums) - 1
      while lo < hi:
          mid = (lo + hi) // 2
          if nums[mid] > nums[hi]:
              lo = mid + 1
          elif nums[mid] < nums[hi]:
              hi = mid
          else:
              hi -= 1
      return nums[lo]
slow:
  - |
    def find_min(nums):
        for x in nums:
            if all(x <= y for y in nums):
                return x
brute: |
  def find_min(nums):
      return min(nums)
big: 'assert find_min([5] * 99999 + [1]) == 1'
random:
  call: find_min
  gen: |
    def gen(rng, size):
        n = rng.randint(1, min(size + 3, 9))
        base = sorted(rng.randint(-3, 3) for _ in range(n))
        k = rng.randint(0, n - 1)
        return (base[k:] + base[:k],)
wrong:
  - |
    def find_min(nums):
        return nums[0]
  - |
    def find_min(nums):
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] > nums[hi]:
                lo = mid + 1
            else:
                hi = mid
        return nums[lo]
  - |
    def find_min(nums):
        return nums[-1]
equivalent:
  - 2: "lo, hi = (-1, len(nums) - 1)"   # why: while lo is -1 the range is the prefix nums[0..hi], which is still rotated sorted, so each step keeps the minimum value in it; index -1 is probed only when hi is 0, and then nums[-1] cannot be below nums[0] (nums[0] is the minimum), so the returned value is the same, and once lo reaches 0 the usual argument applies
  - 3: "while lo <= hi:"   # why: when lo equals hi the middle equals the right end, so the only change is hi -= 1 and lo, the returned index, is unchanged
---
::
