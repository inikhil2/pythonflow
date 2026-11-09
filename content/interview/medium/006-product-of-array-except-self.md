---
title: Product of Array Except Self
tier: medium
order: 6
leetcode: 238
url: https://leetcode.com/problems/product-of-array-except-self/
companies: [Amazon, Google, Meta]
topic: Prefix sum
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/03-prefix-sums-and-intervals]
---

You get a list `nums` of n whole numbers, where 2 <= n <= 100000 and each value is from -30 to 30. Every prefix product and every suffix product fits in a signed 32-bit integer. Return a new list of the same length, where entry i is the product of every value in `nums` except `nums[i]`. An empty product is 1, so a list of two values gives each entry as the other value. Zeros are allowed, so a zero can make many entries 0.

Work out for each position the product of everything before it and the product of everything after it, using two passes over the list.

::exercise
---
id: iv-medium-006
prompt: Write a function product_except_self(nums) that returns a list whose entry i is the product of all values in nums except nums[i], without dividing.
starter: |
  # write your code below
  def product_except_self(nums):
      pass
hints:
  - Make one pass from the left that stores the running product before each position, and one from the right for the products after it.
  - Multiply the two stored products together at each position, and do not include the value at that position.
  - Do not divide: dividing by the value at each position fails on zeros.
tests:
  - check: assert product_except_self([1, 2, 3, 4]) == [24, 12, 8, 6]
  - check: assert product_except_self([-1, 1, 0, -3, 3]) == [0, 0, 9, 0, 0]
  - check: assert product_except_self([2, 3]) == [3, 2]
  - check: assert product_except_self([0, 0]) == [0, 0]
  - check: assert product_except_self([5, 0, 2]) == [0, 10, 0]
  - check: assert product_except_self([-2, -3]) == [-3, -2]
  - check: assert product_except_self([1, 1, 1]) == [1, 1, 1]
big: 'assert (lambda v: product_except_self(v) == [16 if i == 30000 else 0 for i in range(100000)])([0 if i == 30000 else (2 if i in (1000, 20000, 60000, 90000) else (-1 if i % 2 else 1)) for i in range(100000)]) and (lambda v: product_except_self(v) == [0] * 100000)([0 if i in (30000, 70000) else (2 if i in (1000, 20000, 60000, 90000) else (-1 if i % 2 else 1)) for i in range(100000)])'
solution: |
  def product_except_self(nums):
      n = len(nums)
      result = [1] * n
      prefix = 1
      for i in range(n):
          result[i] = prefix
          prefix *= nums[i]
      suffix = 1
      for i in range(n - 1, -1, -1):
          result[i] *= suffix
          suffix *= nums[i]
      return result
slow:
  - |
    def product_except_self(nums):
        result = []
        for i in range(len(nums)):
            p = 1
            for j in range(len(nums)):
                if j != i:
                    p *= nums[j]
            result.append(p)
        return result
  - |
    def product_except_self(nums):
        import math
        return [math.prod(nums[:i]) * math.prod(nums[i + 1:]) for i in range(len(nums))]
brute: |
  def product_except_self(nums):
      result = []
      for i in range(len(nums)):
          p = 1
          for j in range(len(nums)):
              if j != i:
                  p *= nums[j]
          result.append(p)
      return result
random:
  call: product_except_self
  gen: |
    def gen(rng, size):
        return ([rng.randint(-5, 5) for _ in range(max(size, 2) + 1)],)
wrong:
  - |
    def product_except_self(nums):
        total = 1
        for x in nums:
            total *= x
        return [total // x for x in nums]
  - |
    def product_except_self(nums):
        n = len(nums)
        result = [1] * n
        prefix = 1
        for i in range(n):
            result[i] = prefix
            prefix *= nums[i]
        return result
  - |
    def product_except_self(nums):
        n = len(nums)
        result = [1] * n
        prefix = 1
        for i in range(n):
            prefix *= nums[i]
            result[i] = prefix
        suffix = 1
        for i in range(n - 1, -1, -1):
            result[i] *= suffix
            suffix *= nums[i]
        return result
equivalent:
  - "result = [2] * n"  # why: the first pass assigns every entry before it is read, so the starting value never shows
  - "result = [0] * n"  # why: the first pass assigns every entry before it is read, so the starting value never shows
---
::
