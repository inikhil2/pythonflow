---
title: Maximum Average Subarray I
tier: easy
order: 32
leetcode: 643
url: https://leetcode.com/problems/maximum-average-subarray-i/
companies: [Amazon, Google, Microsoft]
topic: Sliding window
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list of whole numbers and a whole number k. The list has at least k and at most 100000 numbers, k is at least 1, and each number is between -10000 and 10000. Find the group of k numbers that sit side by side in the list and have the largest average, and return that average as a decimal number. An answer within 0.00001 of the true average is correct.

::exercise
---
id: iv-easy-032
prompt: Write a function find_max_average(nums, k) that returns the largest average of any k numbers that sit side by side in nums.
starter: |
  # write your code below
  def find_max_average(nums, k):
      pass
hints:
  - Keep a window of k numbers and slide it one step at a time.
  - Each slide adds one number and drops one, so you never need to add up the whole window again.
tests:
  - check: assert abs(find_max_average([1, 12, -5, -6, 50, 3], 4) - 12.75) < 1e-5
  - check: assert abs(find_max_average([5], 1) - 5.0) < 1e-5
  - check: assert abs(find_max_average([0, 4, 0, 3, 2], 1) - 4.0) < 1e-5
  - check: assert abs(find_max_average([1, 2], 1) - 2.0) < 1e-5
  - check: assert abs(find_max_average([-1, -2, -3], 2) - (-1.5)) < 1e-5
  - check: assert abs(find_max_average([4, 4, 4, 4], 4) - 4.0) < 1e-5
big: assert abs(find_max_average([(i * 7919) % 20001 - 10000 for i in range(50000)] + [5000 + (i * 7919) % 5001 for i in range(50000)], 50000) - 7500.00906) < 1e-5
solution: |
  def find_max_average(nums, k):
      window = sum(nums[:k])
      best = window
      for i in range(k, len(nums)):
          window += nums[i] - nums[i - k]
          best = max(best, window)
      return best / k
brute: |
  def find_max_average(nums, k):
      return max(sum(nums[i:i + k]) for i in range(len(nums) - k + 1)) / k
random:
  call: find_max_average
  gen: |
    def gen(rng, size):
        nums = [rng.randint(-5, 5) for _ in range(size + 2)]
        return (nums, rng.randint(1, len(nums)))
  same: |
    def same(args, got, want):
        return abs(got - want) < 1e-5
slow:
  - |
    def find_max_average(nums, k):
        best = None
        for i in range(len(nums) - k + 1):
            total = 0
            for j in range(i, i + k):
                total += nums[j]
            if best is None or total > best:
                best = total
        return best / k
  - |
    def find_max_average(nums, k):
        return max(sum(nums[i:i + k]) for i in range(len(nums) - k + 1)) / k
wrong:
  - |
    def find_max_average(nums, k):
        return max(sum(nums[i:i + k]) for i in range(len(nums) - k + 1))
  - |
    def find_max_average(nums, k):
        return max(sum(nums[i:i + k]) for i in range(len(nums) - k)) / k
---
::
