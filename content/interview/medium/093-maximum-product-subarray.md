---
title: Maximum Product Subarray
tier: medium
order: 93
leetcode: 152
url: https://leetcode.com/problems/maximum-product-subarray/
companies: [Amazon, Google, Microsoft]
topic: Dynamic programming
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/10-dynamic-programming]
---

You get a list `nums` of between 1 and 10000 whole numbers, each from -10 to 10. Negative numbers and zeros are allowed.

A subarray is a run of numbers that stays together and is not empty. Return the largest product of any subarray. Two negative numbers multiply to a positive, so a run with an even count of negatives can have a large product. The answer can be very large, but Python integers hold it exactly, so you do not need to worry about overflow.

::exercise
---
id: iv-medium-093
prompt: Write a function max_product(nums) that returns the largest product of any non-empty contiguous run of numbers in nums.
starter: |
  # write your code below
  def max_product(nums):
      pass
hints:
  - A very negative product can turn into a very large positive one when it meets another negative number, so track the smallest product as well as the largest.
  - At each number, the new largest is the biggest of that number, the largest so far times it, and the smallest so far times it. The new smallest is the least of those same three.
tests:
  - check: assert max_product([2, 3, -2, 4]) == 6
  - check: assert max_product([-2, 0, -1]) == 0
  - check: assert max_product([-2]) == -2
  - check: assert max_product([-2, 3, -4]) == 24
  - check: assert max_product([0, 2]) == 2
  - check: assert max_product([2, -5, -2, -4, 3]) == 24
  - check: assert max_product([-1, -2, -3, 0]) == 6
  - check: assert max_product([-10, 10]) == 10
big: assert max_product([x for b in range(70) for x in [7 if ((b * 131 + j) * 7919) % 20 == 10 else ((b * 131 + j) * 7919) % 20 - 10 for j in range(99)] + [0]] + [-10 if j % 3 == 0 else 10 for j in range(2001)]) == 10 ** 2000 and max_product([2, 0] * 5000) == 2
solution: |
  def max_product(nums):
      best = cur_max = cur_min = nums[0]
      for x in nums[1:]:
          candidates = (x, cur_max * x, cur_min * x)
          cur_max, cur_min = max(candidates), min(candidates)
          best = max(best, cur_max)
      return best
brute: |
  def max_product(nums):
      best = nums[0]
      for i in range(len(nums)):
          for j in range(i + 1, len(nums) + 1):
              product = 1
              for x in nums[i:j]:
                  product *= x
              best = max(best, product)
      return best
slow:
  - |
    def max_product(nums):
        best = nums[0]
        for i in range(len(nums)):
            for j in range(i + 1, len(nums) + 1):
                product = 1
                for x in nums[i:j]:
                    product *= x
                if product > best:
                    best = product
        return best
random:
  call: max_product
  gen: |
    def gen(rng, size):
        return ([rng.choice([-10, -3, -1, 0, 1, 2, 3, 10]) for _ in range(max(size, 1))],)
wrong:
  - |
    def max_product(nums):
        best = cur = nums[0]
        for x in nums[1:]:
            cur = max(x, cur + x)
            best = max(best, cur)
        return best
  - |
    def max_product(nums):
        best = cur = nums[0]
        for x in nums[1:]:
            cur = max(x, cur * x)
            best = max(best, cur)
        return best
  - |
    def max_product(nums):
        best = cur = nums[0]
        for x in nums[1:]:
            cur = max(x, cur * x, min(cur, 0) * x)
            best = max(best, cur)
        return best
---
::
