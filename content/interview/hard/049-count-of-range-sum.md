---
title: Count of Range Sum
tier: hard
order: 49
leetcode: 327
url: https://leetcode.com/problems/count-of-range-sum/
companies: [Amazon, Google]
topic: Binary Search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

You are given a list of whole numbers, which may be negative, and two bounds `lower` and `upper`. Count the pairs of positions `i < j` for which the sum of the numbers from position `i` up to but not including position `j` lies between `lower` and `upper`, both included. The list has between 1 and 10000 numbers, each from -1000 to 1000, and the bounds are from -10^6 to 10^6 with `lower <= upper`.

Work with running totals. The sum over a range is the difference of two running totals, so the question becomes: for each running total, how many earlier running totals sit in a fixed window? Brute force checks every pair, which is far too slow at the largest size.

::exercise
---
id: iv-hard-049
prompt: Write a function count_range_sum(nums, lower, upper) that returns how many contiguous non-empty subarrays of nums have a sum between lower and upper, inclusive.
starter: |
  # write your code below
  def count_range_sum(nums, lower, upper):
      pass
hints:
  - Build the running totals with a leading 0. For each new total p, count the earlier totals q with p - upper <= q <= p - lower.
  - Count those totals with a Fenwick tree over the sorted distinct totals: bisect_left and bisect_right turn the window bounds into positions. A sorted list kept with insort and counted with bisect_left and bisect_right also works.
tests:
  - check: assert count_range_sum([1], 1, 1) == 1
  - check: assert count_range_sum([4, -2, 1], -1, 3) == 4
  - check: assert count_range_sum([0, 0, 0], 0, 0) == 6
  - check: assert count_range_sum([1, 2, 3], 10, 20) == 0
  - check: assert count_range_sum([5, -5], -10, 10) == 3
  - check: assert count_range_sum([-1, -1, -1], -2, -1) == 5
  - check: assert count_range_sum([3], 4, 5) == 0
  - check: assert count_range_sum([2, 2, 2], 4, 4) == 2
  - check: assert count_range_sum([-3, 1, 2], -1, 0) == 1
  - check: assert count_range_sum([1, -1, 1, -1], 0, 1) == 7
solution: |
  from bisect import bisect_left, bisect_right

  def count_range_sum(nums, lower, upper):
      prefix = [0]
      for x in nums:
          prefix.append(prefix[-1] + x)
      vals = sorted(set(prefix))
      rank = {v: i + 1 for i, v in enumerate(vals)}
      size = len(vals)
      tree = [0] * (size + 1)
      total = 0
      for p in prefix:
          lo = bisect_left(vals, p - upper)
          hi = bisect_right(vals, p - lower)
          i = hi
          while i > 0:
              total += tree[i]
              i -= i & -i
          i = lo
          while i > 0:
              total -= tree[i]
              i -= i & -i
          i = rank[p]
          while i <= size:
              tree[i] += 1
              i += i & -i
      return total
# why: the nested loop over all pairs of totals does about 50 million pairs on big, so it runs out of steps; the Fenwick reference and the bisect plus insort version from the hints are both accepted as correct and fast.
slow:
  - |
    def count_range_sum(nums, lower, upper):
        prefix = [0]
        for x in nums:
            prefix.append(prefix[-1] + x)
        n = len(prefix)
        return sum(1 for i in range(n) for j in range(i + 1, n) if lower <= prefix[j] - prefix[i] <= upper)
brute: |
  def count_range_sum(nums, lower, upper):
      total = 0
      for i in range(len(nums)):
          s = 0
          for j in range(i, len(nums)):
              s += nums[j]
              if lower <= s <= upper:
                  total += 1
      return total
big: 'assert count_range_sum([(i * 7919) % 201 - 100 for i in range(10000)], -400, 300) == 43060564'
random:
  call: count_range_sum
  gen: |
    def gen(rng, size):
        n = rng.randint(1, min(size + 3, 6))
        lower = rng.randint(-4, 2)
        return ([rng.randint(-3, 3) for _ in range(n)], lower, lower + rng.randint(0, 5))
wrong:
  - |
    from bisect import bisect_left, bisect_right, insort

    def count_range_sum(nums, lower, upper):
        prefix = [0]
        for x in nums:
            prefix.append(prefix[-1] + x)
        seen = []
        total = 0
        for p in prefix:
            total += bisect_left(seen, p - lower) - bisect_left(seen, p - upper)
            insort(seen, p)
        return total
  - |
    def count_range_sum(nums, lower, upper):
        return sum(1 for x in nums if lower <= x <= upper)
  - |
    from bisect import bisect_left, bisect_right, insort

    def count_range_sum(nums, lower, upper):
        prefix = [0]
        for x in nums:
            prefix.append(prefix[-1] + x)
        seen = []
        total = 0
        for p in prefix:
            total += bisect_right(seen, p - upper) - bisect_left(seen, p - lower)
            insort(seen, p)
        return total
equivalent:
  - 4: "prefix = [1]"   # why: every running total shifts by the same constant, so every difference of two totals is unchanged
  - 4: "prefix = [-1]"   # why: same as above; a constant shift leaves all differences unchanged
  - 10: "tree = [0] * (size + 2)"   # why: the extra top slot is never read, since every loop stops at size
---
::
