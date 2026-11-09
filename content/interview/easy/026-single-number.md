---
title: Single Number
tier: easy
order: 26
leetcode: 136
url: https://leetcode.com/problems/single-number/
companies: [Google, Meta, Amazon]
topic: Bit manipulation
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/06-numbers]
---

You get a list of whole numbers. The list has at least one number, and every number in it appears exactly twice except for one number, which appears only once. Each number is between -20 and 20. Return the number that appears only once.

::exercise
---
id: iv-easy-026
prompt: Write a function single_number(nums) that returns the one number that appears only once in nums.
starter: |
  # write your code below
  def single_number(nums):
      pass
hints:
  - Pairs of equal numbers cancel out when you combine them with the same operation.
  - After every pair has cancelled, only the single number is left.
tests:
  - check: assert single_number([2, 2, 1]) == 1
  - check: assert single_number([4, 1, 2, 1, 2]) == 4
  - check: assert single_number([1]) == 1
  - check: assert single_number([-3, 5, -3]) == 5
  - check: assert single_number([7, 9, 7, 9, 0, 0, 6]) == 6
  - check: assert single_number([10, 20, 10]) == 20
solution: |
  def single_number(nums):
      result = 0
      for x in nums:
          result ^= x
      return result
brute: |
  def single_number(nums):
      for x in nums:
          if nums.count(x) == 1:
              return x
random:
  call: single_number
  gen: |
    def gen(rng, size):
        values = rng.sample(range(-20, 21), size // 2 + 1)
        nums = values[:-1] * 2 + [values[-1]]
        rng.shuffle(nums)
        return (nums,)
wrong:
  - |
    def single_number(nums):
        return nums[0]
  - |
    def single_number(nums):
        return max(nums)
---
::
