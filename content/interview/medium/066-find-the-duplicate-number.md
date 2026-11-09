---
title: Find the Duplicate Number
tier: medium
order: 66
leetcode: 287
url: https://leetcode.com/problems/find-the-duplicate-number/
companies: [Google, Amazon, Meta]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

You get a list of n + 1 whole numbers, where n is from 1 to 100000. Every value is from 1 to n. Exactly one value appears more than once, and it may appear several times, so some values from 1 to n may be missing. Return that repeated value.

Count how many values are at most a middle number. If more values are at or below the middle than the middle number itself, two of them must match, so the repeated value is at or below the middle. Otherwise the repeated value is above it. Narrow the range of values the same way a binary search narrows indexes.

::exercise
---
id: iv-medium-066
prompt: Write a function find_duplicate(nums) that returns the value that appears more than once in the list of n + 1 values from 1 to n, without changing the list.
starter: |
  # write your code below
  def find_duplicate(nums):
      pass
hints:
  - Search over the values 1 to n, not over positions.
  - Count the values that are at most the middle value. Compare that count with the middle value itself.
  - Do not change the list while you work.
tests:
  - check: assert find_duplicate([1, 3, 4, 2, 2]) == 2
  - check: assert find_duplicate([3, 1, 3, 4, 2]) == 3
  - check: assert find_duplicate([3, 3, 3, 3, 3]) == 3
  - check: assert find_duplicate([1, 1]) == 1
  - check: assert find_duplicate([1, 1, 2]) == 1
  - check: assert find_duplicate([2, 2, 2, 1]) == 2
  - check: assert find_duplicate([1, 2, 3, 4, 4]) == 4
  - check: assert find_duplicate([2, 5, 9, 6, 9, 3, 8, 9, 7, 1]) == 9
big: assert find_duplicate(list(range(1, 100001)) + [50000]) == 50000
solution: |
  def find_duplicate(nums):
      slow = fast = nums[0]
      while True:
          slow = nums[slow]
          fast = nums[nums[fast]]
          if slow == fast:
              break
      slow = nums[0]
      while slow != fast:
          slow = nums[slow]
          fast = nums[fast]
      return slow
brute: |
  def find_duplicate(nums):
      seen = set()
      for value in nums:
          if value in seen:
              return value
          seen.add(value)
random:
  call: find_duplicate
  gen: |
    def gen(rng, size):
        n = max(size, 1)
        dup = rng.randint(1, n)
        copies = rng.randint(2, n + 1)
        others = rng.sample([v for v in range(1, n + 1) if v != dup], n + 1 - copies)
        nums = others + [dup] * copies
        rng.shuffle(nums)
        return (nums,)
slow:
  - |
    def find_duplicate(nums):
        for i in range(len(nums)):
            for j in range(len(nums)):
                if i != j and nums[i] == nums[j]:
                    return nums[i]
  - |
    def find_duplicate(nums):
        for x in nums:
            if nums.count(x) > 1:
                return x
wrong:
  - |
    def find_duplicate(nums):
        return max(nums)
  - |
    def find_duplicate(nums):
        return sum(nums) - sum(set(nums))
  - |
    def find_duplicate(nums):
        n = len(nums) - 1
        lo, hi = 1, n
        while lo < hi:
            mid = (lo + hi) // 2
            count = 0
            for value in nums:
                if value <= mid:
                    count += 1
            if count >= mid:
                hi = mid
            else:
                lo = mid + 1
        return lo
equivalent:
  - "n = len(nums) - 0"   # why: the search only probes middles below hi, so a top of n + 1 is never tested and the predicate still finds the duplicate
  - "lo, hi = (0, n)"   # why: the middle 0 never satisfies count > middle, so the search moves past it and returns the same value
---
::
