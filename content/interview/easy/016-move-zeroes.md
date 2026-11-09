---
title: Move Zeroes
tier: easy
order: 16
leetcode: 283
url: https://leetcode.com/problems/move-zeroes/
companies: [Amazon, Google, Meta]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list of whole numbers, and zero may appear any number of times. Return a new list that keeps the non-zero numbers in their original order and puts all the zeros at the end. The list you were given must stay the same.

::exercise
---
id: iv-easy-016
prompt: Write a function move_zeroes(nums) that returns a new list with the non-zero values in their original order, followed by all the zeros.
starter: |
  # write your code below
  def move_zeroes(nums):
      pass
hints:
  - Collect the non-zero values in order first, then count how many zeros there were.
  - The zeros go at the end, so add that many zeros after the collected values.
tests:
  - check: assert move_zeroes([]) == []
  - check: assert move_zeroes([0]) == [0]
  - check: assert move_zeroes([1]) == [1]
  - check: assert move_zeroes([0, 1, 0, 3, 12]) == [1, 3, 12, 0, 0]
  - check: assert move_zeroes([0, 0, 0]) == [0, 0, 0]
  - check: assert move_zeroes([1, 2, 3]) == [1, 2, 3]
  - check: assert move_zeroes([-1, 0, -2, 0]) == [-1, -2, 0, 0]
  - check: assert move_zeroes([4, 0, 0, 5]) == [4, 5, 0, 0]
solution: |
  def move_zeroes(nums):
      result = []
      for n in nums:
          if n != 0:
              result.append(n)
      return result + [0] * (len(nums) - len(result))
brute: |
  def move_zeroes(nums):
      return [n for n in nums if n != 0] + [n for n in nums if n == 0]
random:
  call: move_zeroes
  gen: |
    def gen(rng, size):
        return ([rng.randint(-2, 2) for _ in range(rng.randint(0, size + 3))],)
wrong:
  - |
    def move_zeroes(nums):
        result = []
        for n in nums:
            if n != 0:
                result.append(n)
        return result
  - |
    def move_zeroes(nums):
        result = []
        for n in nums:
            if n != 0:
                result.append(n)
        return [0] * (len(nums) - len(result)) + result
---
::
