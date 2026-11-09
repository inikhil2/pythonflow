---
title: Range Sum Query - Immutable
tier: easy
order: 72
leetcode: 303
url: https://leetcode.com/problems/range-sum-query-immutable/
companies: [Amazon, Google, Meta]
topic: Design
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list `nums` of between 1 and 100000 whole numbers, each from -100 to 100, and a list `queries` of between 1 and 100000 queries. Each query is a pair `[left, right]` of positions in `nums`, with `0 <= left <= right < len(nums)`. Both ends are included.

For each query, return the sum of the values from position `left` to position `right`. Return the sums in the same order as the queries. The list `nums` does not change between queries.

::exercise
---
id: iv-easy-072
prompt: Write a function range_sums(nums, queries) that returns, for each [left, right] query, the sum of nums from left to right inclusive.
starter: |
  # write your code below
  def range_sums(nums, queries):
      pass
hints:
  - Build a running total once, where entry k holds the sum of the first k values.
  - The sum from left to right is the running total at right plus one, minus the running total at left.
tests:
  - check: assert range_sums([-2, 0, 3, -5, 2, -1], [[0, 2], [2, 5], [0, 5]]) == [1, -1, -3]
  - check: assert range_sums([5], [[0, 0]]) == [5]
  - check: assert range_sums([1, 2, 3], [[1, 1], [0, 0]]) == [2, 1]
  - check: assert range_sums([0, 0, 0], [[0, 2]]) == [0]
  - check: assert range_sums([-1, -1], [[0, 1], [1, 1]]) == [-2, -1]
  - check: assert range_sums([4, 4, 4], [[0, 2], [0, 0], [1, 2], [2, 2]]) == [12, 4, 8, 4]
  - check: assert range_sums([10, -10], [[0, 1]]) == [0]
big: assert (r := range_sums([((i * 7919) % 201) - 100 for i in range(100000)], [[min((i * 7919) % 100000, (i * 104729) % 100000), max((i * 7919) % 100000, (i * 104729) % 100000)] for i in range(100000)])) and sum(r) == -100 and r[0] == -100 and r[1] == 214 and r[500] == 429 and r[50000] == 0 and r[-1] == -214
solution: |
  def range_sums(nums, queries):
      prefix = [0]
      for x in nums:
          prefix.append(prefix[-1] + x)
      answer = []
      for left, right in queries:
          answer.append(prefix[right + 1] - prefix[left])
      return answer
brute: |
  def range_sums(nums, queries):
      answer = []
      for left, right in queries:
          total = 0
          for i in range(left, right + 1):
              total += nums[i]
          answer.append(total)
      return answer
random:
  call: range_sums
  gen: |
    def gen(rng, size):
        n = max(size, 1)
        nums = [rng.randint(-10, 10) for _ in range(n)]
        queries = []
        for _ in range(rng.randint(1, size + 3)):
            left = rng.randint(0, n - 1)
            queries.append([left, rng.randint(left, n - 1)])
        return (nums, queries)
slow:
  - |
    def range_sums(nums, queries):
        return [sum(nums[l:r + 1]) for l, r in queries]
  - |
    def range_sums(nums, queries):
        answer = []
        for left, right in queries:
            total = 0
            for i in range(left, right + 1):
                total += nums[i]
            answer.append(total)
        return answer
wrong:
  - |
    def range_sums(nums, queries):
        answer = []
        for left, right in queries:
            answer.append(nums[right])
        return answer
  - |
    def range_sums(nums, queries):
        prefix = [0]
        for x in nums:
            prefix.append(prefix[-1] + x)
        answer = []
        for left, right in queries:
            answer.append(prefix[right] - prefix[left])
        return answer
  - |
    def range_sums(nums, queries):
        answer = []
        for left, right in queries:
            total = 0
            for i in range(left, right):
                total += nums[i]
            answer.append(total)
        return answer
equivalent:
  - "prefix = [1]"  # why: every prefix value is one higher, and the difference of two prefixes cancels that
  - "prefix = [-1]"  # why: every prefix value is one lower, and the difference of two prefixes cancels that
---
::
