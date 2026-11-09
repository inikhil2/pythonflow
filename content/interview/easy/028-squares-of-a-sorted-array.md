---
title: Squares of a Sorted Array
tier: easy
order: 28
leetcode: 977
url: https://leetcode.com/problems/squares-of-a-sorted-array/
companies: [Google, Amazon, Meta]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list of whole numbers sorted from smallest to largest. The list has at least one number, and each number is between -10000 and 10000. Return a new list of the squares of those numbers, sorted from smallest to largest.

::exercise
---
id: iv-easy-028
prompt: Write a function sorted_squares(nums) that returns a new sorted list of the squares of the numbers in nums.
starter: |
  # write your code below
  def sorted_squares(nums):
      pass
hints:
  - The largest square is always at one of the two ends, because the list is sorted.
  - Fill the answer from the back, so the largest square goes last.
tests:
  - check: assert sorted_squares([-4, -1, 0, 3, 10]) == [0, 1, 9, 16, 100]
  - check: assert sorted_squares([-7, -3, 2, 3, 11]) == [4, 9, 9, 49, 121]
  - check: assert sorted_squares([5]) == [25]
  - check: assert sorted_squares([-5]) == [25]
  - check: assert sorted_squares([-2, -1]) == [1, 4]
  - check: assert sorted_squares([0, 0]) == [0, 0]
  - check: assert sorted_squares([-3, -1, 0, 1, 2]) == [0, 1, 1, 4, 9]
solution: |
  def sorted_squares(nums):
      result = []
      i, j = 0, len(nums) - 1
      while i <= j:
          if abs(nums[i]) > abs(nums[j]):
              result.append(nums[i] * nums[i])
              i += 1
          else:
              result.append(nums[j] * nums[j])
              j -= 1
      return result[::-1]
brute: |
  def sorted_squares(nums):
      return sorted(x * x for x in nums)
random:
  call: sorted_squares
  gen: |
    def gen(rng, size):
        nums = sorted(rng.randint(-6, 6) for _ in range(rng.randint(1, size + 3)))
        return (nums,)
wrong:
  - |
    def sorted_squares(nums):
        return [x * x for x in nums]
  - |
    def sorted_squares(nums):
        return sorted(nums)
equivalent:
  - "if abs(nums[i]) >= abs(nums[j]):"  # why: when the two absolute values are equal the two squares are equal, so either side may be taken
---
::
