---
title: Shuffle the Array
tier: easy
order: 40
leetcode: 1470
url: https://leetcode.com/problems/shuffle-the-array/
companies: [Google, Meta, Amazon]
topic: Array
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list nums with 2 times n numbers, and a whole number n. Split nums into two halves of n numbers each. Return a new list that takes the first half's number at position i, then the second half's number at position i, for i from the start to the end. Each number is between 1 and 1000, and n is between 1 and 500.

::exercise
---
id: iv-easy-040
prompt: Write a function shuffle_array(nums, n) that returns the numbers of nums interleaved, alternating between the two halves.
starter: |
  # write your code below
  def shuffle_array(nums, n):
      pass
hints:
  - The first n numbers are the first half, and each one pairs with the number n places after it in the second half.
  - Put each first-half number into the answer, followed by its partner from the second half.
tests:
  - check: assert shuffle_array([2, 5, 1, 3, 4, 7], 3) == [2, 3, 5, 4, 1, 7]
  - check: assert shuffle_array([1, 2, 3, 4, 4, 3, 2, 1], 4) == [1, 4, 2, 3, 3, 2, 4, 1]
  - check: assert shuffle_array([1, 1, 2, 2], 2) == [1, 2, 1, 2]
  - check: assert shuffle_array([7, 9], 1) == [7, 9]
  - check: assert shuffle_array([1, 2, 3, 4, 5, 6], 3) == [1, 4, 2, 5, 3, 6]
  - check: assert shuffle_array([9, 8, 7, 6], 2) == [9, 7, 8, 6]
solution: |
  def shuffle_array(nums, n):
      result = []
      for i in range(n):
          result.append(nums[i])
          result.append(nums[i + n])
      return result
brute: |
  def shuffle_array(nums, n):
      return [nums[i // 2] if i % 2 == 0 else nums[n + i // 2] for i in range(2 * n)]
random:
  call: shuffle_array
  gen: |
    def gen(rng, size):
        n = rng.randint(1, size + 1)
        return ([rng.randint(1, 10) for _ in range(2 * n)], n)
wrong:
  - |
    def shuffle_array(nums, n):
        return nums
  - |
    def shuffle_array(nums, n):
        result = []
        for i in range(n):
            result.append(nums[n + i])
            result.append(nums[i])
        return result
equivalent:
  - "result.append(nums[i - n])"  # why: nums has 2 times n items, so the negative index i - n lands on the same item as i + n
---
::
