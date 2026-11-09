---
title: Two Sum
tier: easy
order: 57
leetcode: 1
url: https://leetcode.com/problems/two-sum/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list of whole numbers and one target number. Find two different positions in the list whose values add up to the target. Return any such pair of positions as a list, in either order.

An input may have more than one such pair, so any valid pair is correct. You may not use the same position twice. A plain pair of loops works, but it checks every pair. A dictionary that remembers the positions you have already seen finds the partner in one step.

::exercise
---
id: iv-easy-057
prompt: Write a function two_sum(nums, target) that returns the positions of two values that add up to the target, as a list. Return any such pair.
starter: |
  # write your code below
  def two_sum(nums, target):
      pass
hints:
  - For each number, the partner you need is target minus that number.
  - Store each number and its position in a dictionary as you go, so you can look up a partner quickly.
tests:
  - check: assert sorted(two_sum([2, 7, 11, 15], 9)) == [0, 1]
  - check: assert sorted(two_sum([3, 2, 4], 6)) == [1, 2]
  - check: assert sorted(two_sum([3, 3], 6)) == [0, 1]
  - check: assert sorted(two_sum([1, 5, 8], 13)) == [1, 2]
  - check: assert sorted(two_sum([4, 9, 2, 3], 7)) == [0, 3]
  - check: assert sorted(two_sum([-3, 4, 3, 90], 0)) == [0, 2]
  - check: assert sorted(two_sum([1, 2, 3, 9], 12)) == [2, 3]
solution: |
  def two_sum(nums, target):
      seen = {}
      for i, n in enumerate(nums):
          if target - n in seen:
              return [seen[target - n], i]
          seen[n] = i
brute: |
  def two_sum(nums, target):
      for i in range(len(nums)):
          for j in range(i + 1, len(nums)):
              if nums[i] + nums[j] == target:
                  return [i, j]
random:
  call: two_sum
  gen: |
    def gen(rng, size):
        nums = [rng.randint(-10, 10) for _ in range(max(size, 2))]
        i, j = sorted(rng.sample(range(len(nums)), 2))
        return (nums, nums[i] + nums[j])
  same: |
    def same(args, got, want):
        nums, target = args
        return (
            isinstance(got, list) and len(got) == 2 and got[0] != got[1]
            and 0 <= min(got) and max(got) < len(nums)
            and nums[got[0]] + nums[got[1]] == target
        )
wrong:
  - |
    def two_sum(nums, target):
        for i in range(len(nums)):
            for j in range(len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
  - |
    def two_sum(nums, target):
        for i in range(len(nums) - 1):
            if nums[i] + nums[i + 1] == target:
                return [i, i + 1]
---
::
