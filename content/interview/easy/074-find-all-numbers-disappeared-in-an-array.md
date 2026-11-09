---
title: Find All Numbers Disappeared in an Array
tier: easy
order: 74
leetcode: 448
url: https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list `nums` of n whole numbers, where n is between 1 and 100000. Every number in `nums` is from 1 to n, and some numbers may appear more than once. Some numbers from 1 to n do not appear at all.

Return a list of all the numbers from 1 to n that do not appear in `nums`, in increasing order. If every number from 1 to n appears, return an empty list.

::exercise
---
id: iv-easy-074
prompt: Write a function find_disappeared(nums) that returns, in increasing order, every number from 1 to len(nums) that is missing from nums.
starter: |
  # write your code below
  def find_disappeared(nums):
      pass
hints:
  - Record which numbers appear, then check each number from 1 to n against that record.
  - Walking 1 to n in order gives you the answer already sorted.
tests:
  - check: assert find_disappeared([4, 3, 2, 7, 8, 2, 3, 1]) == [5, 6]
  - check: assert find_disappeared([1, 1]) == [2]
  - check: assert find_disappeared([1]) == []
  - check: assert find_disappeared([2, 2]) == [1]
  - check: assert find_disappeared([1, 2, 3]) == []
  - check: assert find_disappeared([3, 3, 3]) == [1, 2]
  - check: assert find_disappeared([5, 5, 5, 5, 5]) == [1, 2, 3, 4]
big: assert find_disappeared([((i * 7919) % 50000) + 1 for i in range(100000)]) == list(range(50001, 100001))
solution: |
  def find_disappeared(nums):
      n = len(nums)
      present = {}
      for x in nums:
          present[x] = True
      answer = []
      for k in range(1, n + 1):
          if not present.get(k):
              answer.append(k)
      return answer
brute: |
  def find_disappeared(nums):
      answer = []
      for k in range(1, len(nums) + 1):
          if k not in nums:
              answer.append(k)
      return answer
random:
  call: find_disappeared
  gen: |
    def gen(rng, size):
        n = max(size, 1)
        return ([rng.randint(1, n) for _ in range(n)],)
slow:
  - |
    def find_disappeared(nums):
        return [k for k in range(1, len(nums) + 1) if k not in nums]
  - |
    def find_disappeared(nums):
        answer = []
        for k in range(1, len(nums) + 1):
            found = False
            for x in nums:
                if x == k:
                    found = True
            if not found:
                answer.append(k)
        return answer
wrong:
  - |
    def find_disappeared(nums):
        answer = []
        for k in range(len(nums)):
            if k not in nums:
                answer.append(k)
        return answer
  - |
    def find_disappeared(nums):
        present = set(nums)
        return [k for k in range(1, max(nums) + 1) if k not in present]
  - |
    def find_disappeared(nums):
        for k in range(1, len(nums) + 1):
            if k not in nums:
                return [k]
        return []
---
::
