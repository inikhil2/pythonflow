---
title: Max Consecutive Ones III
tier: medium
order: 64
leetcode: 1004
url: https://leetcode.com/problems/max-consecutive-ones-iii/
companies: [Amazon, Meta, Google]
topic: Sliding window
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

You get a list that holds only the values 0 and 1, with between 1 and 20000 values. You are also given k, a whole number from 0 up to the length of the list. You may change up to k of the 0 values into 1 values. Return the length of the longest run of consecutive 1 values you can make this way.

Keep a window that stretches across the list. Grow it on the right, and whenever it holds more than k zeros, shrink it from the left until it holds k or fewer. The longest window seen is the answer.

::exercise
---
id: iv-medium-064
prompt: Write a function max_consecutive_ones(nums, k) that returns the length of the longest run of 1 values that remains after changing at most k zeros to ones.
starter: |
  # write your code below
  def max_consecutive_ones(nums, k):
      pass
hints:
  - Keep a count of the zeros inside the window and a left edge that you move forward when the count goes over k.
  - The window length is the right index minus the left index plus one.
tests:
  - check: assert max_consecutive_ones([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2) == 6
  - check: assert max_consecutive_ones([0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3) == 10
  - check: assert max_consecutive_ones([1], 0) == 1
  - check: assert max_consecutive_ones([0], 0) == 0
  - check: assert max_consecutive_ones([0], 1) == 1
  - check: assert max_consecutive_ones([1, 0, 1], 0) == 1
  - check: assert max_consecutive_ones([1, 0, 1], 1) == 3
  - check: assert max_consecutive_ones([0, 0, 0], 3) == 3
  - check: assert max_consecutive_ones([0, 1, 0, 1, 0], 1) == 3
big: assert max_consecutive_ones([1 if (i * 7919) % 10007 % 4 == 0 else 0 for i in range(20000)], 10000) == 13338
solution: |
  def max_consecutive_ones(nums, k):
      best = 0
      left = 0
      zeros = 0
      for right, value in enumerate(nums):
          if value == 0:
              zeros += 1
          while zeros > k:
              if nums[left] == 0:
                  zeros -= 1
              left += 1
          best = max(best, right - left + 1)
      return best
brute: |
  def max_consecutive_ones(nums, k):
      best = 0
      for start in range(len(nums)):
          zeros = 0
          for end in range(start, len(nums)):
              if nums[end] == 0:
                  zeros += 1
              if zeros > k:
                  break
              best = max(best, end - start + 1)
      return best
random:
  call: max_consecutive_ones
  gen: |
    def gen(rng, size):
        nums = [rng.randint(0, 1) for _ in range(max(size, 1))]
        return (nums, rng.randint(0, len(nums)))
slow:
  - |
    def max_consecutive_ones(nums, k):
        best = 0
        for start in range(len(nums)):
            zeros = 0
            for end in range(start, len(nums)):
                if nums[end] == 0:
                    zeros += 1
                if zeros > k:
                    break
                best = max(best, end - start + 1)
        return best
wrong:
  - |
    def max_consecutive_ones(nums, k):
        best = 0
        left = 0
        zeros = 0
        for right, value in enumerate(nums):
            if value == 0:
                zeros += 1
            while zeros > k + 1:
                if nums[left] == 0:
                    zeros -= 1
                left += 1
            best = max(best, right - left + 1)
        return best
  - |
    def max_consecutive_ones(nums, k):
        best = 0
        run = 0
        for value in nums:
            run = run + 1 if value == 1 else 0
            best = max(best, run)
        return min(len(nums), best + k)
  - |
    def max_consecutive_ones(nums, k):
        best = 0
        left = 0
        zeros = 0
        for right, value in enumerate(nums):
            if value == 0:
                zeros += 1
            while zeros > k:
                if nums[left] == 0:
                    zeros -= 1
                left += 1
            if value == 1:
                best = max(best, right - left + 1)
        return best
equivalent:
  - "best = -1"   # why: the window length is never negative, so the first window always replaces the starting value
---
::
