---
title: Contains Duplicate
tier: easy
order: 58
leetcode: 217
url: https://leetcode.com/problems/contains-duplicate/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list nums of 1 to 70000 whole numbers, each between -1000000000 and 1000000000. Return True if some value appears at least twice in nums. Return False if every value is different.

::exercise
---
id: iv-easy-058
prompt: Write a function contains_duplicate(nums) that returns True if any value appears more than once in nums, and False otherwise.
starter: |
  # write your code below
  def contains_duplicate(nums):
      pass
hints:
  - A set keeps each value once, so compare its size with the size of the list.
  - A list of one number has no repeat.
tests:
  - check: assert contains_duplicate([1, 2, 3, 1]) == True
  - check: assert contains_duplicate([1, 2, 3, 4]) == False
  - check: assert contains_duplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]) == True
  - check: assert contains_duplicate([1]) == False
  - check: assert contains_duplicate([1, 1]) == True
  - check: assert contains_duplicate([0, -1000000000, 1000000000]) == False
  - check: assert contains_duplicate([5, 9, 5]) == True
  - check: assert contains_duplicate([7, 1, 2, 2]) == True
big: assert contains_duplicate([(i * 7919) % 100003 if i != 69999 else (15000 * 7919) % 100003 for i in range(70000)]) == True
solution: |
  def contains_duplicate(nums):
      return len(set(nums)) != len(nums)
brute: |
  def contains_duplicate(nums):
      for i in range(len(nums)):
          for j in range(i + 1, len(nums)):
              if nums[i] == nums[j]:
                  return True
      return False
random:
  call: contains_duplicate
  gen: |
    def gen(rng, size):
        return ([rng.randint(-3, 3) for _ in range(rng.randint(1, size + 4))],)
slow:
  - |
    def contains_duplicate(nums):
        seen = []
        for x in nums:
            for y in seen:
                if x == y:
                    return True
            seen.append(x)
        return False
  - |
    def contains_duplicate(nums):
        for i in range(len(nums)):
            if nums[i] in nums[i + 1:]:
                return True
        return False
wrong:
  - |
    def contains_duplicate(nums):
        return any(nums[i] == nums[i + 1] for i in range(len(nums) - 1))
  - |
    def contains_duplicate(nums):
        return nums.count(nums[0]) > 1
---
::
