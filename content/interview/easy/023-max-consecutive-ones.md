---
title: Max Consecutive Ones
tier: easy
order: 23
leetcode: 485
url: https://leetcode.com/problems/max-consecutive-ones/
companies: [Google, Amazon, Meta]
topic: Array
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list where every item is 0 or 1. Return the length of the longest run of 1s that sit side by side in the list. The list may be empty, and it may hold no 1s at all, in which case the answer is 0.

::exercise
---
id: iv-easy-023
prompt: Write a function max_consecutive_ones(nums) that returns the length of the longest run of 1s in the list nums of 0s and 1s.
starter: |
  # write your code below
  def max_consecutive_ones(nums):
      pass
hints:
  - Count the current run of 1s, and reset that count to 0 whenever you see a 0.
  - Remember the biggest count you have seen, because the longest run may end before the list does.
tests:
  - check: assert max_consecutive_ones([]) == 0
  - check: assert max_consecutive_ones([0]) == 0
  - check: assert max_consecutive_ones([1]) == 1
  - check: assert max_consecutive_ones([1, 1, 0, 1, 1, 1]) == 3
  - check: assert max_consecutive_ones([1, 0, 1, 0, 1]) == 1
  - check: assert max_consecutive_ones([0, 1, 1]) == 2
  - check: assert max_consecutive_ones([1, 1, 1, 1]) == 4
  - check: assert max_consecutive_ones([0, 0, 0]) == 0
  - check: assert max_consecutive_ones([1] * 15 + [0] + [1] * 7) == 15
  - check: assert max_consecutive_ones([1, 0, 1, 1, 0, 1]) == 2
solution: |
  def max_consecutive_ones(nums):
      best = 0
      run = 0
      for n in nums:
          if n == 1:
              run += 1
          else:
              run = 0
          best = max(best, run)
      return best
brute: |
  def max_consecutive_ones(nums):
      best = 0
      for start in range(len(nums)):
          for end in range(start, len(nums)):
              if all(n == 1 for n in nums[start:end + 1]):
                  best = max(best, end - start + 1)
      return best
random:
  call: max_consecutive_ones
  gen: |
    def gen(rng, size):
        return ([rng.randint(0, 1) for _ in range(rng.randint(0, size + 3))],)
wrong:
  - |
    def max_consecutive_ones(nums):
        total = 0
        for n in nums:
            total += n
        return total
  - |
    def max_consecutive_ones(nums):
        run = 0
        for n in nums:
            if n == 1:
                run += 1
            else:
                run = 0
        return run
---
::
