---
title: Kth Missing Positive Number
tier: easy
order: 35
leetcode: 1539
url: https://leetcode.com/problems/kth-missing-positive-number/
companies: [Google, Amazon, Meta]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a sorted list arr of different positive whole numbers, which has at least one number, and a whole number k that is at least 1. Each number in arr is between 1 and 1000, and k is between 1 and 1000. The positive whole numbers that are not in arr are called missing. Return the kth missing positive number, counting from 1.

::exercise
---
id: iv-easy-035
prompt: Write a function find_kth_missing(arr, k) that returns the kth positive whole number that is not in arr.
starter: |
  # write your code below
  def find_kth_missing(arr, k):
      pass
hints:
  - Before each position in arr, count how many positive numbers are missing so far.
  - Find the first position where that count reaches k. The answer is that position plus k.
tests:
  - check: assert find_kth_missing([2, 3, 4, 7, 11], 5) == 9
  - check: assert find_kth_missing([1, 2, 3, 4], 2) == 6
  - check: assert find_kth_missing([1], 1) == 2
  - check: assert find_kth_missing([2], 1) == 1
  - check: assert find_kth_missing([1, 3], 1) == 2
  - check: assert find_kth_missing([1, 3], 2) == 4
  - check: assert find_kth_missing([5, 6, 7], 3) == 3
solution: |
  def find_kth_missing(arr, k):
      lo, hi = 0, len(arr)
      while lo < hi:
          mid = (lo + hi) // 2
          if arr[mid] - (mid + 1) < k:
              lo = mid + 1
          else:
              hi = mid
      return lo + k
brute: |
  def find_kth_missing(arr, k):
      missing = 0
      x = 0
      while True:
          x += 1
          if x not in arr:
              missing += 1
              if missing == k:
                  return x
random:
  call: find_kth_missing
  gen: |
    def gen(rng, size):
        arr = sorted(rng.sample(range(1, 30), rng.randint(1, size + 3)))
        return (arr, rng.randint(1, 20))
wrong:
  - |
    def find_kth_missing(arr, k):
        lo, hi = 0, len(arr)
        while lo < hi:
            mid = (lo + hi) // 2
            if arr[mid] - (mid + 1) < k:
                lo = mid + 1
            else:
                hi = mid
        return lo + k - 1
  - |
    def find_kth_missing(arr, k):
        count = 0
        for x in range(1, arr[-1]):
            if x not in arr:
                count += 1
                if count == k:
                    return x
        return -1
---
::
