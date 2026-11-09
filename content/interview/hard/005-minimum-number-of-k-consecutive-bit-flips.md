---
title: Minimum Number of K Consecutive Bit Flips
tier: hard
order: 5
leetcode: 995
url: https://leetcode.com/problems/minimum-number-of-k-consecutive-bit-flips/
companies: [Google, Meta]
topic: Bit manipulation
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/06-numbers, /learn/week10-algorithms/03-prefix-sums-and-intervals]
---

You get a list nums of 0s and 1s, and a whole number k. One move picks a starting position and flips the k values that begin there: every 0 becomes 1 and every 1 becomes 0. The window must fit inside the list. Return the fewest moves needed to make every value 1. If it cannot be done, return -1.

The list has between 1 and 100000 values, and k is between 1 and the length of the list. A move that starts at an earlier position and then one that starts later can overlap, and moving the same window twice undoes itself. Keeping track of whether the current value is flipped an odd number of times, as you go from left to right, is enough.

::exercise
---
id: iv-hard-005
prompt: Write a function min_k_bit_flips(nums, k) that returns the fewest moves that make every value 1, or -1 if that is impossible.
starter: |
  # write your code below
  def min_k_bit_flips(nums, k):
      pass
hints:
  - Go from left to right. When a value is still 0 after the flips that cover it, a flip must start at this position.
  - Remember where each flip started. A flip stops covering positions k places later, so remove its effect then.
tests:
  - check: assert min_k_bit_flips([0, 1, 0], 1) == 2
  - check: assert min_k_bit_flips([1, 1, 0], 2) == -1
  - check: assert min_k_bit_flips([0, 0, 0, 1, 0, 1, 1, 0], 3) == 3
  - check: assert min_k_bit_flips([1], 1) == 0
  - check: assert min_k_bit_flips([0], 1) == 1
  - check: assert min_k_bit_flips([1, 1, 1], 3) == 0
  - check: assert min_k_bit_flips([0, 0], 2) == 1
  - check: assert min_k_bit_flips([0, 1, 1, 0], 2) == 3
  - check: assert min_k_bit_flips([0, 0, 1, 1, 1, 0], 4) == -1
solution: |
  def min_k_bit_flips(nums, k):
      n = len(nums)
      flipped = [0] * n
      active = 0
      moves = 0
      for i in range(n):
          if i >= k:
              active ^= flipped[i - k]
          if nums[i] ^ active == 0:
              if i + k > n:
                  return -1
              flipped[i] = 1
              active ^= 1
              moves += 1
      return moves
brute: |
  def min_k_bit_flips(nums, k):
      n = len(nums)
      starts = range(n - k + 1)
      best = -1
      for mask in range(1 << len(starts)):
          values = list(nums)
          count = 0
          for s in starts:
              if mask >> s & 1:
                  count += 1
                  for j in range(s, s + k):
                      values[j] ^= 1
          if all(v == 1 for v in values) and (best == -1 or count < best):
              best = count
      return best
random:
  call: min_k_bit_flips
  gen: |
    def gen(rng, size):
        n = rng.randint(1, size + 4)
        k = rng.randint(1, min(n, 4)) if rng.random() < 0.5 else rng.randint(max(1, n - 2), n)
        return ([rng.randint(0, 1) for _ in range(n)], k)
# why: start 66667 (= n - k, the last legal start) is forced into S, so the flip at the very end of the list is needed
big: assert min_k_bit_flips((rng := __import__("random").Random(7)) and (S := sorted(rng.sample(range(66667), 29999) + [66667])) and (SS := set(S)) and (A := [1 ^ (c & 1) for c in __import__("itertools").accumulate((i in SS) - (i - 33333 in SS) for i in range(100000))]), 33333) == 30000 and min_k_bit_flips(A[:-1] + [1 - A[-1]], 33333) == -1
slow:
  - |
    def min_k_bit_flips(nums, k):
        arr = list(nums)
        moves = 0
        for i in range(len(arr)):
            if arr[i] == 0:
                if i + k > len(arr):
                    return -1
                moves += 1
                for j in range(i, i + k):
                    arr[j] ^= 1
        return moves
  - |
    def min_k_bit_flips(nums, k):
        arr = list(nums)
        moves = 0
        for i in range(len(arr)):
            if arr[i] == 0:
                if i + k > len(arr):
                    return -1
                moves += 1
                arr[i:i+k] = [x ^ 1 for x in arr[i:i+k]]
        return moves
wrong:
  - |
    def min_k_bit_flips(nums, k):
        moves = 0
        for i in range(len(nums) - k + 1):
            if nums[i] == 0:
                moves += 1
                for j in range(i, i + k):
                    nums[j] ^= 1
        return moves
  - |
    def min_k_bit_flips(nums, k):
        n = len(nums)
        flipped = [0] * n
        active = 0
        moves = 0
        for i in range(n):
            if i >= k:
                active ^= flipped[i - k]
            if nums[i] ^ active == 0:
                if i + k >= n:
                    return -1
                flipped[i] = 1
                active ^= 1
                moves += 1
        return moves
  - |
    def min_k_bit_flips(nums, k):
        n = len(nums)
        flipped = [0] * n
        active = 0
        moves = 0
        for i in range(n):
            if i >= k:
                active ^= flipped[i - k]
            if nums[i] ^ active == 0:
                if i + k > n:
                    return -1
                flipped[i] = 1
                moves += 1
        return moves
---
::
