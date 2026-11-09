---
title: Minimum Size Subarray Sum
tier: medium
order: 69
leetcode: 209
url: https://leetcode.com/problems/minimum-size-subarray-sum/
companies: [Google, Meta, Amazon]
topic: Sliding window
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

You get a whole number target from 1 to 1000000000 and a list of positive whole numbers, with between 1 and 20000 values, each from 1 to 10000. A subarray is a run of values that sit next to each other in the list. Find the length of the shortest subarray whose values add up to at least the target. If no subarray reaches the target, return 0.

Keep a window that moves to the right. Add each new value to the window's sum. While the sum is at least the target, record the window's length and remove values from the left. Because every value is positive, the sum only grows as the window grows, so this finds the shortest window for each right edge.

::exercise
---
id: iv-medium-069
prompt: Write a function min_subarray_len(target, nums) that returns the length of the shortest contiguous run of values whose sum is at least target, or 0 if no run reaches it.
starter: |
  # write your code below
  def min_subarray_len(target, nums):
      pass
hints:
  - Keep a running sum for the window, and move the left edge forward while the sum still reaches the target.
  - Record the window length each time the sum reaches the target, before you shrink it.
tests:
  - check: assert min_subarray_len(7, [2, 3, 1, 2, 4, 3]) == 2
  - check: assert min_subarray_len(4, [1, 4, 4]) == 1
  - check: assert min_subarray_len(11, [1, 1, 1, 1, 1, 1, 1, 1]) == 0
  - check: assert min_subarray_len(1, [1]) == 1
  - check: assert min_subarray_len(5, [1, 2]) == 0
  - check: assert min_subarray_len(3, [1, 1, 1, 1]) == 3
  - check: assert min_subarray_len(6, [1, 2, 3]) == 3
  - check: assert min_subarray_len(5, [2, 3, 1, 1, 1, 1]) == 2
big: assert min_subarray_len(sum([(i * 7919) % 10000 + 1 for i in range(20000)]) // 2, [(i * 7919) % 10000 + 1 for i in range(20000)]) == 10000
solution: |
  def min_subarray_len(target, nums):
      best = len(nums) + 1
      left = 0
      total = 0
      for right, value in enumerate(nums):
          total += value
          while total >= target:
              best = min(best, right - left + 1)
              total -= nums[left]
              left += 1
      return best if best <= len(nums) else 0
brute: |
  def min_subarray_len(target, nums):
      best = 0
      for start in range(len(nums)):
          total = 0
          for end in range(start, len(nums)):
              total += nums[end]
              if total >= target:
                  length = end - start + 1
                  if best == 0 or length < best:
                      best = length
                  break
      return best
random:
  call: min_subarray_len
  gen: |
    def gen(rng, size):
        nums = [rng.randint(1, 5) for _ in range(max(size, 1))]
        return (rng.randint(1, 20), nums)
slow:
  - |
    def min_subarray_len(target, nums):
        best = 0
        for start in range(len(nums)):
            total = 0
            for end in range(start, len(nums)):
                total += nums[end]
                if total >= target:
                    length = end - start + 1
                    if best == 0 or length < best:
                        best = length
                    break
        return best
wrong:
  - |
    def min_subarray_len(target, nums):
        total = 0
        for value in nums:
            total += value
        return len(nums) if total >= target else 0
  - |
    def min_subarray_len(target, nums):
        left = 0
        total = 0
        best = 0
        for right, value in enumerate(nums):
            total += value
            while total > target:
                total -= nums[left]
                left += 1
            if total == target:
                best = right - left + 1
        return best
  - |
    def min_subarray_len(target, nums):
        left = 0
        total = 0
        best = 0
        for right, value in enumerate(nums):
            total += value
            if total >= target and best == 0:
                best = right - left + 1
            while total >= target:
                total -= nums[left]
                left += 1
        return best
equivalent:
  - "best = len(nums) + 2"   # why: any real window is at most len(nums) long, so the starting value only needs to exceed it for the no-window check to give 0
---
::
