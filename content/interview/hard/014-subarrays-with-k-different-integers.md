---
title: Subarrays with K Different Integers
tier: hard
order: 14
leetcode: 992
url: https://leetcode.com/problems/subarrays-with-k-different-integers/
companies: [Amazon, Microsoft, Google]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list nums of 1 to 20000 whole numbers, each from 1 to 20000, and a whole number k from 1 to 20000. Return how many non-empty pieces of nums, taken from consecutive positions, contain exactly k different numbers. Two pieces count separately when they start or end at different positions, even if their numbers match. If no piece has exactly k different numbers, return 0.

Counting pieces with at most k different numbers is easy with a sliding window, and each window adds one count for every end position it holds. The pieces with exactly k different numbers are the pieces with at most k minus the pieces with at most k - 1. Subtracting one count from the other gives the answer directly.

::exercise
---
id: iv-hard-014
prompt: Write a function count_subarrays(nums, k) that returns how many non-empty consecutive pieces of nums contain exactly k different numbers.
starter: |
  # write your code below
  def count_subarrays(nums, k):
      pass
hints:
  - Count pieces with at most k different numbers, then subtract the count for at most k - 1.
  - A sliding window keeps how many times each number appears in it. When the window holds too many different numbers, move its left edge until it holds few enough, and remember that every window ending at the current position contributes one piece per start.
tests:
  - check: assert count_subarrays([1], 1) == 1
  - check: assert count_subarrays([1], 2) == 0
  - check: assert count_subarrays([1, 1, 1], 1) == 6
  - check: assert count_subarrays([1, 2, 1], 2) == 3
  - check: assert count_subarrays([1, 2, 3], 2) == 2
  - check: assert count_subarrays([1, 2, 3, 1], 3) == 3
  - check: assert count_subarrays([2, 2, 1, 3, 3, 3], 2) == 5
  - check: assert count_subarrays([1, 2, 1, 3, 4], 3) == 3
  - check: assert count_subarrays([5, 5, 5, 5], 1) == 10
  - check: assert count_subarrays([1, 2, 3], 4) == 0
solution: |
  def count_subarrays(nums, k):
      def at_most(k):
          count = {}
          left = total = 0
          for right, x in enumerate(nums):
              count[x] = count.get(x, 0) + 1
              while len(count) > k:
                  y = nums[left]
                  count[y] -= 1
                  if count[y] == 0:
                      del count[y]
                  left += 1
              total += right - left + 1
          return total
      return at_most(k) - at_most(k - 1)
brute: |
  def count_subarrays(nums, k):
      n = len(nums)
      out = 0
      for i in range(n):
          seen = set()
          for j in range(i, n):
              seen.add(nums[j])
              if len(seen) == k:
                  out += 1
              elif len(seen) > k:
                  break
      return out
random:
  call: count_subarrays
  gen: |
    def gen(rng, size):
        nums = [rng.randint(1, 4) for _ in range(rng.randint(1, size + 1))]
        return (nums, rng.randint(1, 5))
big: assert count_subarrays((rng := __import__("random").Random(14)) and [rng.randint(1, 500) for _ in range(20000)], 300) == 48880
slow:
  - |
    def count_subarrays(nums, k):
        n = len(nums)
        out = 0
        for i in range(n):
            seen = set()
            for j in range(i, n):
                seen.add(nums[j])
                if len(seen) == k:
                    out += 1
                elif len(seen) > k:
                    break
        return out
wrong:
  - |
    def count_subarrays(nums, k):
        def at_most(k):
            count = {}
            left = total = 0
            for right, x in enumerate(nums):
                count[x] = count.get(x, 0) + 1
                while len(count) > k:
                    y = nums[left]
                    count[y] -= 1
                    if count[y] == 0:
                        del count[y]
                    left += 1
                total += right - left + 1
            return total
        return at_most(k)
  - |
    def count_subarrays(nums, k):
        def at_most(k):
            count = {}
            left = total = 0
            for right, x in enumerate(nums):
                count[x] = count.get(x, 0) + 1
                while len(count) > k:
                    y = nums[left]
                    count[y] -= 1
                    left += 1
                total += right - left + 1
            return total
        return at_most(k) - at_most(k - 1)
  - |
    def count_subarrays(nums, k):
        count = {}
        left = total = 0
        for right, x in enumerate(nums):
            count[x] = count.get(x, 0) + 1
            while len(count) > k:
                y = nums[left]
                count[y] -= 1
                if count[y] == 0:
                    del count[y]
                left += 1
            if len(count) == k:
                total += 1
        return total
equivalent:
  - "14: total += right - left + 2"  # why: both at_most calls go through every right position, so a constant c per position adds n·c to each and cancels in the difference
  - "14: total += right - left + 0"  # why: both at_most calls go through every right position, so a constant c per position adds n·c to each and cancels in the difference
  - "14: total += right - left - 1"  # why: both at_most calls go through every right position, so a constant c per position adds n·c to each and cancels in the difference
---
::
