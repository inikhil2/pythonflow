---
title: 3Sum Closest
tier: medium
order: 52
leetcode: 16
url: https://leetcode.com/problems/3sum-closest/
companies: [Google, Amazon, Meta]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/01-two-pointers, /learn/week10-algorithms/04-sorting-and-heaps]
---

You get a list of whole numbers and one target number. The list has between 3 and 500 values, each from -1000 to 1000, and the target is from -1000 to 1000 too. Pick three different positions and add their values. Return the sum that is closest to the target. If two sums are the same distance from the target, return the smaller sum.

Sorting the list first lets you fix one value and move two pointers inward, so you check each pair once instead of every pair of pairs.

::exercise
---
id: iv-medium-052
prompt: Write a function three_sum_closest(nums, target) that returns the sum of three values at different positions that is closest to the target. On a tie, return the smaller sum.
starter: |
  # write your code below
  def three_sum_closest(nums, target):
      pass
hints:
  - Sort the list, then for each first value move a left pointer and a right pointer toward each other.
  - Remember the closest sum so far, and replace it only when the new sum is closer, or equally close and smaller.
tests:
  - check: assert three_sum_closest([-1, 2, 1, -4], 1) == 2
  - check: assert three_sum_closest([0, 0, 0], 1) == 0
  - check: assert three_sum_closest([1, 1, 1, 0], -100) == 2
  - check: assert three_sum_closest([1, 2, 3], 0) == 6
  - check: assert three_sum_closest([-3, -2, -5, 3, -4], -1) == -2
  - check: assert three_sum_closest([0, 2, 4, 6], 7) == 6
  - check: assert three_sum_closest([-5, -4, -3], 0) == -12
  - check: assert three_sum_closest([2, 2, 2, 2], 6) == 6
  - check: assert three_sum_closest([0, 1, 3, 4], 6) == 5
big: assert three_sum_closest([(i * 37) % 201 * 10 - 1000 for i in range(500)], 997) == 1000
solution: |
  def three_sum_closest(nums, target):
      nums = sorted(nums)
      best = nums[0] + nums[1] + nums[2]
      for i in range(len(nums) - 2):
          lo, hi = i + 1, len(nums) - 1
          while lo < hi:
              total = nums[i] + nums[lo] + nums[hi]
              if total == target:
                  return total
              if abs(total - target) < abs(best - target) or (abs(total - target) == abs(best - target) and total < best):
                  best = total
              if total < target:
                  lo += 1
              else:
                  hi -= 1
      return best
brute: |
  def three_sum_closest(nums, target):
      best = None
      n = len(nums)
      for i in range(n):
          for j in range(i + 1, n):
              for k in range(j + 1, n):
                  total = nums[i] + nums[j] + nums[k]
                  if best is None or abs(total - target) < abs(best - target) or (abs(total - target) == abs(best - target) and total < best):
                      best = total
      return best
random:
  call: three_sum_closest
  gen: |
    def gen(rng, size):
        nums = [rng.randint(-5, 5) for _ in range(max(size, 3))]
        return (nums, rng.randint(-12, 12))
slow:
  - |
    def three_sum_closest(nums, target):
        best = None
        n = len(nums)
        for i in range(n):
            for j in range(i + 1, n):
                for k in range(j + 1, n):
                    total = nums[i] + nums[j] + nums[k]
                    if best is None or abs(total - target) < abs(best - target) or (abs(total - target) == abs(best - target) and total < best):
                        best = total
        return best
  - |
    def three_sum_closest(nums, target):
        from itertools import combinations
        from bisect import bisect_left
        sums = sorted(map(sum, combinations(nums, 3)))
        k = bisect_left(sums, target)
        options = sums[max(k - 1, 0):k + 1]
        return min(options, key=lambda s: (abs(s - target), s))
wrong:
  - |
    def three_sum_closest(nums, target):
        nums = sorted(nums)
        best = 0
        for i in range(len(nums) - 2):
            lo, hi = i + 1, len(nums) - 1
            while lo < hi:
                total = nums[i] + nums[lo] + nums[hi]
                if abs(total - target) < abs(best - target):
                    best = total
                if total < target:
                    lo += 1
                else:
                    hi -= 1
        return best
  - |
    def three_sum_closest(nums, target):
        nums = sorted(nums)
        best = nums[0] + nums[1] + nums[2]
        for i in range(len(nums) - 2):
            lo, hi = i + 1, len(nums) - 1
            while lo < hi:
                total = nums[i] + nums[lo] + nums[hi]
                if total < target and abs(total - target) < abs(best - target):
                    best = total
                if total < target:
                    lo += 1
                else:
                    hi -= 1
        return best
  - |
    def three_sum_closest(nums, target):
        nums = sorted(nums)
        best = nums[0] + nums[1] + nums[2]
        for i in range(len(nums) - 2):
            lo, hi = i + 1, len(nums) - 1
            while lo < hi:
                total = nums[i] + nums[lo] + nums[hi]
                if total == target:
                    return total
                if abs(total - target) <= abs(best - target):
                    best = total
                if total < target:
                    lo += 1
                else:
                    hi -= 1
        return best
equivalent:
  - "for i in range(len(nums) - 1):"   # why: at i = len - 2 the pointers start at the same index, so the while loop never runs and the extra pass changes nothing
  - "if abs(total - target) < abs(best - target) or (abs(total - target) == abs(best - target) and total <= best):"   # why: when total equals best the assignment writes the same value, so <= changes nothing
  - "if total <= target:"   # why: an exact match has already returned above, so total is never equal to target at this line
  - "for i in range(len(nums) + 2):"   # why: for i at or past len - 2 the left pointer is already past the right one, so the while loop never runs
---
::
