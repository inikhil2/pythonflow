---
title: Remove Element
tier: easy
order: 22
leetcode: 27
url: https://leetcode.com/problems/remove-element/
companies: [Google, Amazon, Meta]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list of whole numbers and one value to remove. Return a new list with every copy of that value taken out, and the other numbers kept in their original order. The list you were given must stay the same, and the list may be empty.

::exercise
---
id: iv-easy-022
prompt: Write a function remove_element(nums, val) that returns a new list with every copy of val removed, keeping the other values in order.
starter: |
  # write your code below
  def remove_element(nums, val):
      pass
hints:
  - Go through the list once, and keep each value that is not the one to remove.
  - Every copy has to go, so do not stop after the first match.
tests:
  - check: assert remove_element([], 1) == []
  - check: assert remove_element([3], 3) == []
  - check: assert remove_element([3], 1) == [3]
  - check: assert remove_element([3, 2, 2, 3], 3) == [2, 2]
  - check: assert remove_element([0, 1, 2, 2, 3, 0, 4, 2], 2) == [0, 1, 3, 0, 4]
  - check: assert remove_element([1, 1, 1], 1) == []
  - check: assert remove_element([-1, -1, 4], -1) == [4]
  - check: assert remove_element([7] * 20 + [8] * 5, 7) == [8] * 5
solution: |
  def remove_element(nums, val):
      result = []
      for n in nums:
          if n != val:
              result.append(n)
      return result
brute: |
  def remove_element(nums, val):
      result = list(nums)
      while val in result:
          result.remove(val)
      return result
random:
  call: remove_element
  gen: |
    def gen(rng, size):
        nums = [rng.randint(-2, 3) for _ in range(rng.randint(0, size + 3))]
        return (nums, rng.randint(-2, 3))
wrong:
  - |
    def remove_element(nums, val):
        result = list(nums)
        if val in result:
            result.remove(val)
        return result
  - |
    def remove_element(nums, val):
        result = []
        for n in nums[1:]:
            if n != val:
                result.append(n)
        return result
---
::
