---
title: Longest Subarray of 1's After Deleting One Element
tier: medium
order: 100
leetcode: 1493
url: https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/
companies: [Google, Meta, Amazon]
topic: Dynamic programming
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/10-dynamic-programming]
---

You get a list `nums` of between 1 and 100000 values, each either 0 or 1.

You must delete exactly one element from the list. Then return the length of the longest run of 1s that is left, or 0 if no 1s are left. A run is a block of 1s that stays together after the deletion.

::exercise
---
id: iv-medium-100
prompt: Write a function longest_after_deletion(nums) that deletes exactly one element of nums and returns the length of the longest run of 1s left, or 0 if none is left.
starter: |
  # write your code below
  def longest_after_deletion(nums):
      pass
hints:
  - Find the longest stretch that contains at most one 0. Deleting that 0 leaves a run of 1s of the same length, minus the 0 you removed.
  - Slide a window along the list. Move the left end forward whenever the window holds more than one 0.
tests:
  - check: assert longest_after_deletion([1, 1, 0, 1]) == 3
  - check: assert longest_after_deletion([0, 1, 1, 1, 0, 1, 1, 0, 1]) == 5
  - check: assert longest_after_deletion([1, 1, 1]) == 2
  - check: assert longest_after_deletion([0]) == 0
  - check: assert longest_after_deletion([1]) == 0
  - check: assert longest_after_deletion([0, 0]) == 0
  - check: assert longest_after_deletion([1, 0, 1]) == 2
  - check: assert longest_after_deletion([1, 1, 0, 0, 1, 1, 1, 0, 1]) == 4
big: assert longest_after_deletion([0 if (i * 7919) % 20 == 0 else 1 for i in range(100000)]) == 38 and longest_after_deletion([1] * 10000) == 9999 and longest_after_deletion([1, 0] * 5000) == 2
solution: |
  def longest_after_deletion(nums):
      left = 0
      zeros = 0
      best = 0
      for right, x in enumerate(nums):
          if x == 0:
              zeros += 1
          while zeros > 1:
              if nums[left] == 0:
                  zeros -= 1
              left += 1
          best = max(best, right - left)
      return best
brute: |
  def longest_after_deletion(nums):
      best = 0
      for d in range(len(nums)):
          rest = nums[:d] + nums[d + 1:]
          run = cur = 0
          for x in rest:
              cur = cur + 1 if x == 1 else 0
              run = max(run, cur)
          best = max(best, run)
      return best
slow:
  - |
    def longest_after_deletion(nums):
        best = 0
        n = len(nums)
        for i in range(n):
            zeros = 0
            for j in range(i, n):
                if nums[j] == 0:
                    zeros += 1
                if zeros <= 1:
                    best = max(best, j - i)
        return best
  - |
    def longest_after_deletion(nums):
        best = 0
        for d in range(len(nums)):
            rest = nums[:d] + nums[d + 1:]
            run = cur = 0
            for x in rest:
                cur = cur + 1 if x == 1 else 0
                run = max(run, cur)
            best = max(best, run)
        return best
random:
  call: longest_after_deletion
  gen: |
    def gen(rng, size):
        return ([rng.randint(0, 1) for _ in range(min(max(size, 1), 10))],)
wrong:
  - |
    def longest_after_deletion(nums):
        best = cur = 0
        for x in nums:
            cur = cur + 1 if x == 1 else 0
            best = max(best, cur)
        return best
  - |
    def longest_after_deletion(nums):
        left = 0
        zeros = 0
        best = 0
        for right, x in enumerate(nums):
            if x == 0:
                zeros += 1
            while zeros > 1:
                if nums[left] == 0:
                    zeros -= 1
                left += 1
            best = max(best, right - left + 1)
        return best
  - |
    def longest_after_deletion(nums):
        left = 0
        zeros = 0
        best = 0
        for right, x in enumerate(nums):
            if x == 0:
                zeros += 1
            while zeros > 2:
                if nums[left] == 0:
                    zeros -= 1
                left += 1
            best = max(best, right - left)
        return best
equivalent:
  - "best = -1"  # why: the first element always sets best to right - left, which is 0 on the first step, so the starting value never reaches the answer
---
::
