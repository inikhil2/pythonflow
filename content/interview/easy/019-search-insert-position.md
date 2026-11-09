---
title: Search Insert Position
tier: easy
order: 19
leetcode: 35
url: https://leetcode.com/problems/search-insert-position/
companies: [Google, Amazon, Meta]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a sorted list of different whole numbers and a target number. Return the index of the target if it is in the list. If it is not, return the index where it would go to keep the list sorted. The list may be empty.

::exercise
---
id: iv-easy-019
prompt: Write a function search_insert(nums, target) that returns the index of target in the sorted list nums, or the index where target would be inserted to keep the list sorted.
starter: |
  # write your code below
  def search_insert(nums, target):
      pass
hints:
  - Keep a low and a high position for the part of the list that could still hold the answer, and look at the middle of it.
  - If the middle value is smaller than the target, the answer is to the right of the middle, otherwise it is at the middle or to the left.
tests:
  - check: assert search_insert([1, 3, 5, 6], 5) == 2
  - check: assert search_insert([1, 3, 5, 6], 2) == 1
  - check: assert search_insert([1, 3, 5, 6], 7) == 4
  - check: assert search_insert([1, 3, 5, 6], 0) == 0
  - check: assert search_insert([1], 1) == 0
  - check: assert search_insert([1], 0) == 0
  - check: assert search_insert([1], 2) == 1
  - check: assert search_insert([], 5) == 0
  - check: assert search_insert([-5, -1, 4], -3) == 1
solution: |
  def search_insert(nums, target):
      lo, hi = 0, len(nums)
      while lo < hi:
          mid = (lo + hi) // 2
          if nums[mid] < target:
              lo = mid + 1
          else:
              hi = mid
      return lo
brute: |
  def search_insert(nums, target):
      return sum(1 for n in nums if n < target)
random:
  call: search_insert
  gen: |
    def gen(rng, size):
        nums = sorted(rng.sample(range(-10, 11), rng.randint(0, size + 3)))
        if nums and rng.random() < 0.4:
            target = rng.choice(nums)
        else:
            target = rng.randint(-11, 11)
        return (nums, target)
wrong:
  - |
    def search_insert(nums, target):
        for i in range(len(nums)):
            if nums[i] >= target:
                return i
  - |
    def search_insert(nums, target):
        for i in range(len(nums)):
            if nums[i] > target:
                return i
        return len(nums)
---
::
