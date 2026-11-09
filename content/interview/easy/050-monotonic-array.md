---
title: Monotonic Array
tier: easy
order: 50
leetcode: 896
url: https://leetcode.com/problems/monotonic-array/
companies: [Meta, Google, Amazon]
topic: Array
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list nums of 1 to 100 whole numbers, each between -100 and 100. Return True if the list never goes down from one number to the next, or if it never goes up. Equal neighbours are allowed. Return False otherwise.

::exercise
---
id: iv-easy-050
prompt: Write a function is_monotonic(nums) that returns True if nums never goes down or never goes up, and False otherwise.
starter: |
  # write your code below
  def is_monotonic(nums):
      pass
hints:
  - Check each pair of neighbours in one pass, once for going up and once for going down.
  - A list of one number always passes, because it neither goes up nor down.
tests:
  - check: assert is_monotonic([1, 2, 2, 3]) == True
  - check: assert is_monotonic([6, 5, 4, 4]) == True
  - check: assert is_monotonic([1, 3, 2]) == False
  - check: assert is_monotonic([1]) == True
  - check: assert is_monotonic([2, 2]) == True
  - check: assert is_monotonic([1, 1, 2, 1]) == False
  - check: assert is_monotonic([3, 2, 1, 0, -1]) == True
solution: |
  def is_monotonic(nums):
      increasing = all(nums[i] <= nums[i + 1] for i in range(len(nums) - 1))
      decreasing = all(nums[i] >= nums[i + 1] for i in range(len(nums) - 1))
      return increasing or decreasing
brute: |
  def is_monotonic(nums):
      n = len(nums)
      up = all(nums[i] <= nums[j] for i in range(n) for j in range(i + 1, n))
      down = all(nums[i] >= nums[j] for i in range(n) for j in range(i + 1, n))
      return up or down
random:
  call: is_monotonic
  gen: |
    def gen(rng, size):
        return ([rng.randint(-3, 3) for _ in range(rng.randint(1, size + 4))],)
wrong:
  - |
    def is_monotonic(nums):
        return nums == sorted(nums)
  - |
    def is_monotonic(nums):
        return nums[0] <= nums[-1]
---
::
