---
title: Subsets
tier: medium
order: 38
leetcode: 78
url: https://leetcode.com/problems/subsets/
companies: [Amazon, Google, Meta]
topic: Backtracking
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/06-recursion-and-backtracking]
---

You get a list `nums` of 0 to 10 whole numbers. Every number in it is different, and each is from -10 to 10. A subset is any list you can make by keeping some of the numbers in `nums` and dropping the rest. Return every subset, including the empty list and the whole of `nums` itself.

Inside each subset, keep the numbers in the same order they have in `nums`. The subsets can come back in any order.

For example, nums = [1, 2] has four subsets: [], [1], [2] and [1, 2].

::exercise
---
id: iv-medium-038
prompt: Write a function subsets(nums) that returns a list of every subset of nums, each subset as a list that keeps the order of nums.
starter: |
  # write your code below
  def subsets(nums):
      pass
hints:
  - Start with the list holding just the empty subset. For each number, add a copy of every subset so far with that number added at the end.
  - A list of n numbers has 2 to the power n subsets, so check the count for small inputs.
tests:
  - check: 'assert sorted(subsets([])) == [[]]'
  - check: 'assert sorted(subsets([0])) == sorted([[], [0]])'
  - check: 'assert sorted(subsets([1, 2])) == sorted([[], [1], [2], [1, 2]])'
  - check: 'assert sorted(subsets([-1, 0])) == sorted([[], [-1], [0], [-1, 0]])'
  - check: 'assert sorted(subsets([1, 2, 3])) == sorted([[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]])'
  - check: 'assert len(subsets([1, 2, 3, 4])) == 16'
  - check: 'assert [2, 1] not in subsets([1, 2])'
  - check: 'assert len(subsets(list(range(10)))) == 1024'
  - check: 'assert sorted(subsets([5, -5, 10])) == sorted([[], [5], [-5], [10], [5, -5], [5, 10], [-5, 10], [5, -5, 10]])'
no_slow: "There are at most 2 to the power 10 subsets, so every method that builds them finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def subsets(nums):
      result = [[]]
      for x in nums:
          result += [s + [x] for s in result]
      return result
brute: |
  def subsets(nums):
      out = []
      for mask in range(1 << len(nums)):
          out.append([nums[i] for i in range(len(nums)) if mask >> i & 1])
      return out
random:
  call: subsets
  gen: |
    def gen(rng, size):
        return (rng.sample(range(-10, 11), rng.randint(0, min(size + 1, 8))),)
  same: |
    def same(args, got, want):
        return sorted(got) == sorted(want)
wrong:
  - |
    def subsets(nums):
        result = []
        for x in nums:
            result += [[x]] + [s + [x] for s in result]
        return result
  - |
    def subsets(nums):
        result = [[]]
        for x in nums:
            for s in list(result):
                s.append(x)
                result.append(s)
        return result
  - |
    def subsets(nums):
        result = [[]]
        for x in nums:
            result += [s + [x] for s in result if len(s) < 2]
        return result
---
::
