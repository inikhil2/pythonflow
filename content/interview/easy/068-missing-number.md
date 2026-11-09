---
title: Missing Number
tier: easy
order: 68
leetcode: 268
url: https://leetcode.com/problems/missing-number/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/06-numbers, /learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list `nums` of n distinct whole numbers, where n is the length of the list and between 1 and 50000. Every number in `nums` is from 0 to n, and the list is in no particular order. Exactly one number from 0 to n is missing from the list. Return that missing number.

The list is never empty, and the answer is always one of the numbers from 0 to n. Think about what the numbers from 0 to n add up to.

::exercise
---
id: iv-easy-068
prompt: Write a function missing_number(nums) that returns the one number from 0 to len(nums) that is not in nums.
starter: |
  # write your code below
  def missing_number(nums):
      pass
hints:
  - The numbers from 0 to n add up to n times n + 1 divided by 2.
  - Subtract the sum of the list from that total, and the difference is the missing number.
tests:
  - check: assert missing_number([3, 0, 1]) == 2
  - check: assert missing_number([0, 1]) == 2
  - check: assert missing_number([9, 6, 4, 2, 3, 5, 7, 0, 1]) == 8
  - check: assert missing_number([0]) == 1
  - check: assert missing_number([1]) == 0
  - check: assert missing_number([1, 0]) == 2
  - check: assert missing_number([0, 2]) == 1
solution: |
  def missing_number(nums):
      n = len(nums)
      return n * (n + 1) // 2 - sum(nums)
brute: |
  def missing_number(nums):
      for k in range(len(nums) + 1):
          if k not in nums:
              return k
random:
  call: missing_number
  gen: |
    def gen(rng, size):
        n = max(size, 1)
        values = list(range(n + 1))
        values.remove(rng.randint(0, n))
        rng.shuffle(values)
        return (values,)
big: assert missing_number([v for v in ((i * 7919) % 50001 for i in range(50001)) if v != 31337]) == 31337
slow:
  - |
    def missing_number(nums):
        for k in range(len(nums) + 1):
            if k not in nums:
                return k
  - |
    def missing_number(nums):
        for k in range(len(nums) + 1):
            found = False
            for x in nums:
                if x == k:
                    found = True
            if not found:
                return k
wrong:
  - |
    def missing_number(nums):
        return len(nums)
  - |
    def missing_number(nums):
        n = len(nums)
        return n * (n - 1) // 2 - sum(nums)
  - |
    def missing_number(nums):
        for i in range(len(nums)):
            if nums[i] != i:
                return i
        return len(nums)
---
::
