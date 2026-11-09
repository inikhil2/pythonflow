---
title: Set Mismatch
tier: easy
order: 73
leetcode: 645
url: https://leetcode.com/problems/set-mismatch/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week0-functions/06-numbers]
---

You get a list `nums` with between 2 and 20000 whole numbers. The list should hold each number from 1 to n once, where n is the length of the list. Because of a copying error, one number appears twice and one number from 1 to n is missing.

Return a list of two numbers: first the number that appears twice, then the number that is missing. The numbers in `nums` may come in any order.

::exercise
---
id: iv-easy-073
prompt: Write a function find_error(nums) that returns [duplicate, missing], the number that appears twice and the number that is missing.
starter: |
  # write your code below
  def find_error(nums):
      pass
hints:
  - Count how often each number from 1 to n appears. One count is 2 and one count is 0.
  - A dictionary of the values you have seen tells you which number from 1 to n never showed up.
tests:
  - check: assert find_error([1, 2, 2, 4]) == [2, 3]
  - check: assert find_error([1, 1]) == [1, 2]
  - check: assert find_error([2, 2]) == [2, 1]
  - check: assert find_error([1, 2, 3, 3]) == [3, 4]
  - check: assert find_error([3, 2, 2]) == [2, 1]
  - check: assert find_error([1, 3, 3]) == [3, 2]
  - check: assert find_error([4, 3, 6, 2, 1, 1]) == [1, 5]
big: assert find_error([(i * 7919) % 20000 + 1 for i in range(19999)] + [1]) == [1, 12082]
solution: |
  def find_error(nums):
      n = len(nums)
      seen = {}
      duplicate = 0
      for x in nums:
          if seen.get(x):
              duplicate = x
          seen[x] = True
      missing = 0
      for k in range(1, n + 1):
          if not seen.get(k):
              missing = k
      return [duplicate, missing]
brute: |
  def find_error(nums):
      n = len(nums)
      duplicate = 0
      missing = 0
      for k in range(1, n + 1):
          count = nums.count(k)
          if count == 2:
              duplicate = k
          if count == 0:
              missing = k
      return [duplicate, missing]
random:
  call: find_error
  gen: |
    def gen(rng, size):
        n = max(size, 2)
        missing = rng.randint(1, n)
        duplicate = rng.choice([v for v in range(1, n + 1) if v != missing])
        nums = [v for v in range(1, n + 1) if v != missing] + [duplicate]
        rng.shuffle(nums)
        return (nums,)
slow:
  - |
    def find_error(nums):
        duplicate = missing = 0
        for k in range(1, len(nums) + 1):
            count = nums.count(k)
            if count == 2:
                duplicate = k
            elif count == 0:
                missing = k
        return [duplicate, missing]
  - |
    def find_error(nums):
        n = len(nums)
        duplicate = 0
        missing = 0
        for k in range(1, n + 1):
            count = 0
            for x in nums:
                if x == k:
                    count += 1
            if count == 2:
                duplicate = k
            if count == 0:
                missing = k
        return [duplicate, missing]
wrong:
  - |
    def find_error(nums):
        n = len(nums)
        seen = {}
        duplicate = 0
        for x in nums:
            if x in seen:
                duplicate = x
            seen[x] = True
        return [duplicate, n]
  - |
    def find_error(nums):
        n = len(nums)
        seen = {}
        duplicate = 0
        for x in nums:
            if x in seen:
                duplicate = x
            seen[x] = True
        for k in range(1, n + 1):
            if k not in seen:
                return [k, duplicate]
        return [duplicate, 0]
  - |
    def find_error(nums):
        ordered = sorted(nums)
        for i in range(1, len(ordered)):
            if ordered[i] == ordered[i - 1]:
                return [ordered[i], ordered[i] + 1]
        return [0, 0]
equivalent:
  - duplicate = 1  # why: every input contains a repeated number, so the loop always overwrites the starting value
  - duplicate = -1  # why: every input contains a repeated number, so the loop always overwrites the starting value
  - missing = 1  # why: exactly one number from 1 to n is missing, so the loop always overwrites the starting value
  - missing = -1  # why: exactly one number from 1 to n is missing, so the loop always overwrites the starting value
  - "for k in range(0, n + 1):"  # why: k = 0 is never in seen, so it sets missing = 0 first, and the real missing number from 1 to n always overwrites it later
---
::
