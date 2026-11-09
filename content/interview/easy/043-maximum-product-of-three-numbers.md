---
title: Maximum Product of Three Numbers
tier: easy
order: 43
leetcode: 628
url: https://leetcode.com/problems/maximum-product-of-three-numbers/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/06-numbers]
---

You get a list nums of 3 to 10000 whole numbers, each between -1000 and 1000. Pick any three different positions and multiply the three numbers there. Return the largest product you can make. Two negative numbers multiply to a positive, so negatives can matter.

::exercise
---
id: iv-easy-043
prompt: Write a function maximum_product(nums) that returns the largest product of any three numbers in nums.
starter: |
  # write your code below
  def maximum_product(nums):
      pass
hints:
  - Sort the list first, then the best product uses either the three biggest numbers or two very small negatives with the biggest number.
  - Check both of those choices and return the larger product.
tests:
  - check: assert maximum_product([1, 2, 3]) == 6
  - check: assert maximum_product([1, 2, 3, 4]) == 24
  - check: assert maximum_product([-1, -2, -3]) == -6
  - check: assert maximum_product([-100, -2, -1, 3]) == 600
  - check: assert maximum_product([-4, -3, -2, -1, 60]) == 720
  - check: assert maximum_product([0, 0, 0]) == 0
  - check: assert maximum_product([1000, 1000, 1000]) == 1000000000
big: assert maximum_product([-1000 if i == 0 else -999 if i == 1 else 1000 if i == 2 else (i * 7919) % 201 - 100 for i in range(10000)]) == 999000000
solution: |
  def maximum_product(nums):
      a = sorted(nums)
      return max(a[-1] * a[-2] * a[-3], a[0] * a[1] * a[-1])
brute: |
  def maximum_product(nums):
      from itertools import combinations
      return max(x * y * z for x, y, z in combinations(nums, 3))
random:
  call: maximum_product
  gen: |
    def gen(rng, size):
        return ([rng.randint(-10, 10) for _ in range(rng.randint(3, size + 4))],)
slow:
  - |
    def maximum_product(nums):
        best = None
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                for k in range(j + 1, len(nums)):
                    p = nums[i] * nums[j] * nums[k]
                    if best is None or p > best:
                        best = p
        return best
wrong:
  - |
    def maximum_product(nums):
        a = sorted(nums)
        return a[-1] * a[-2] * a[-3]
  - |
    def maximum_product(nums):
        a = sorted(nums)
        return a[0] * a[1] * a[-1]
---
::
