---
title: First Missing Positive
tier: hard
order: 10
leetcode: 41
url: https://leetcode.com/problems/first-missing-positive/
companies: [Google, Amazon, Microsoft]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list nums of 0 to 100000 whole numbers, each from -1000000000 to 1000000000. Repeats and negative numbers are allowed, and the list is in no particular order. You may rearrange the values in nums. Return the smallest positive whole number (1, 2, 3, ...) that is not in nums. An empty list gives 1.

::exercise
---
id: iv-hard-010
prompt: Write a function first_missing_positive(nums) that returns the smallest positive integer not in nums. You may rearrange nums.
starter: |
  # write your code below
  def first_missing_positive(nums):
      pass
hints:
  - Only the numbers from 1 up to len(nums) + 1 can be the answer. Everything else in the list can be ignored.
  - Put each value v between 1 and len(nums) into position v - 1 by swapping. Then scan from the start for the first position that does not hold its own number.
  - A set works in O(n) time and memory, but the interview answer uses no extra memory: it reuses the list itself.
tests:
  - check: assert first_missing_positive([1, 2, 0]) == 3
  - check: assert first_missing_positive([3, 4, -1, 1]) == 2
  - check: assert first_missing_positive([7, 8, 9, 11, 12]) == 1
  - check: assert first_missing_positive([]) == 1
  - check: assert first_missing_positive([1]) == 2
  - check: assert first_missing_positive([2]) == 1
  - check: assert first_missing_positive([1, 1]) == 2
  - check: assert first_missing_positive([-1, -2]) == 1
  - check: assert first_missing_positive([0]) == 1
  - check: assert first_missing_positive([2, 1]) == 3
solution: |
  def first_missing_positive(nums):
      n = len(nums)
      for i in range(n):
          while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
              j = nums[i] - 1
              nums[i], nums[j] = nums[j], nums[i]
      for i in range(n):
          if nums[i] != i + 1:
              return i + 1
      return n + 1
brute: |
  def first_missing_positive(nums):
      for k in range(1, len(nums) + 2):
          if k not in nums:
              return k
random:
  call: first_missing_positive
  gen: |
    def gen(rng, size):
        return ([rng.randint(-3, size + 3) for _ in range(rng.randint(0, size))],)
big: assert first_missing_positive((rng := __import__("random").Random(10)) and (A := [x for x in range(1, 99999) if x != 60000] + [-5, 0, 10 ** 9]) and (rng.shuffle(A) or A)) == 60000
slow:
  - |
    def first_missing_positive(nums):
        k = 1
        while True:
            for x in nums:
                if x == k:
                    break
            else:
                return k
            k += 1
  - |
    def first_missing_positive(nums):
        for k in range(1, len(nums) + 2):
            if k not in nums:
                return k
equivalent:
  - "4: while 1 <= nums[i] < n and nums[nums[i] - 1] != nums[i]:"  # why: checked exhaustively for every list of length 0 to 5 with values -1 to n+2, with the same output; a value n that is left unplaced only blocks a slot the final scan already reports as missing
wrong:
  - |
    def first_missing_positive(nums):
        return len(nums) + 1
  - |
    def first_missing_positive(nums):
        k = 1
        for x in nums:
            if x == k:
                k += 1
        return k
  - |
    def first_missing_positive(nums):
        n = len(nums)
        for i in range(n):
            while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                j = nums[i] - 1
                nums[i], nums[j] = nums[j], nums[i]
        for i in range(n):
            if nums[i] != i:
                return i
        return n + 1
---
::
