---
title: Permutations
tier: medium
order: 39
leetcode: 46
url: https://leetcode.com/problems/permutations/
companies: [Amazon, Google, Meta]
topic: Backtracking
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/06-recursion-and-backtracking]
---

You get a list `nums` of 1 to 6 whole numbers. Every number in it is different, and each is from -10 to 10. A permutation is a re-ordering of all the numbers in `nums`, using each one exactly once. Return every permutation. The permutations can come back in any order.

For example, nums = [1, 2, 3] has six permutations, including [1, 3, 2] and [3, 1, 2].

::exercise
---
id: iv-medium-039
prompt: Write a function permute(nums) that returns a list of every permutation of nums, each one a list.
starter: |
  # write your code below
  def permute(nums):
      pass
hints:
  - Build the permutations one number at a time. Each new number can go into any of the places in every permutation made so far.
  - A list of n numbers has n factorial permutations, so check the count for small inputs.
tests:
  - check: 'assert sorted(permute([1, 2, 3])) == sorted([[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]])'
  - check: 'assert permute([1]) == [[1]]'
  - check: 'assert sorted(permute([0, 1])) == sorted([[0, 1], [1, 0]])'
  - check: 'assert sorted(permute([-1, 2])) == sorted([[-1, 2], [2, -1]])'
  - check: 'assert sorted(permute([3, 1])) == sorted([[3, 1], [1, 3]])'
  - check: 'assert len(permute([1, 2, 3, 4, 5, 6])) == 720'
  - check: 'assert len(set(map(tuple, permute([4, 5, 6, 7])))) == 24'
  - check: 'assert [1, 2, 3] in permute([1, 2, 3]) and [3, 2, 1] in permute([1, 2, 3])'
no_slow: "There are at most 6 numbers, so there are at most 720 permutations and every method finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def permute(nums):
      result = [[]]
      for x in nums:
          result = [p[:i] + [x] + p[i:] for p in result for i in range(len(p) + 1)]
      return result
brute: |
  def permute(nums):
      from itertools import permutations
      return [list(p) for p in permutations(nums)]
random:
  call: permute
  gen: |
    def gen(rng, size):
        return (rng.sample(range(-5, 6), rng.randint(1, min(size + 1, 6))),)
  same: |
    def same(args, got, want):
        return sorted(got) == sorted(want)
wrong:
  - |
    def permute(nums):
        result = [[]]
        for x in nums:
            result = [p[:i] + [x] + p[i:] for p in result for i in range(len(p))]
        return result
  - |
    def permute(nums):
        result = [[]]
        for x in nums:
            result = [p + [x] for p in result]
        return result
  - |
    def permute(nums):
        return [nums[i:] + nums[:i] for i in range(len(nums))]
---
::
