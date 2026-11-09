---
title: Running Sum of 1d Array
tier: easy
order: 29
leetcode: 1480
url: https://leetcode.com/problems/running-sum-of-1d-array/
companies: [Google, Amazon, Meta]
topic: Prefix sum
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list of whole numbers. The list has at least one number and up to 1000 numbers, and each number is between -1000000 and 1000000. Return a new list whose item at each position is the sum of all the numbers up to and including that position.

::exercise
---
id: iv-easy-029
prompt: Write a function running_sum(nums) that returns a new list whose item at each position is the sum of the numbers up to that position.
starter: |
  # write your code below
  def running_sum(nums):
      pass
hints:
  - Keep one running total, and add each number to it as you go.
  - The first item of the answer is just the first number.
tests:
  - check: assert running_sum([1, 2, 3, 4]) == [1, 3, 6, 10]
  - check: assert running_sum([1, 1, 1, 1, 1]) == [1, 2, 3, 4, 5]
  - check: assert running_sum([3, 1, 2, 10, 1]) == [3, 4, 6, 16, 17]
  - check: assert running_sum([7]) == [7]
  - check: assert running_sum([-1, 2, -3]) == [-1, 1, -2]
  - check: assert running_sum([0, 0]) == [0, 0]
solution: |
  def running_sum(nums):
      result = []
      total = 0
      for x in nums:
          total += x
          result.append(total)
      return result
brute: |
  def running_sum(nums):
      return [sum(nums[:i + 1]) for i in range(len(nums))]
random:
  call: running_sum
  gen: |
    def gen(rng, size):
        return ([rng.randint(-5, 5) for _ in range(rng.randint(1, size + 3))],)
wrong:
  - |
    def running_sum(nums):
        return [sum(nums[:i]) for i in range(len(nums))]
  - |
    def running_sum(nums):
        result = [nums[0]]
        for x in nums[1:]:
            result.append(x)
        return result
---
::
