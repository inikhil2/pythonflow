---
title: Merge Intervals
tier: medium
order: 47
leetcode: 56
url: https://leetcode.com/problems/merge-intervals/
companies: [Meta, Google, Amazon]
topic: Sorting
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/04-sorting-and-heaps]
---

You get a list `intervals` of 1 to 10000 pairs. Each pair `[start, end]` is a range of whole numbers, where 0 <= start <= end <= 10000. Two ranges overlap when they share at least one number. Ranges that only touch at an end, such as [1, 4] and [4, 5], also count as overlapping.

Merge all the overlapping ranges into the fewest ranges that cover the same numbers. Return the merged ranges as a list of `[start, end]` pairs sorted by `start`.

For example, [[1, 3], [2, 6], [8, 10], [15, 18]] gives [[1, 6], [8, 10], [15, 18]], and [[1, 4], [4, 5]] gives [[1, 5]].

::exercise
---
id: iv-medium-047
prompt: Write a function merge_intervals(intervals) that merges the overlapping pairs and returns the merged pairs sorted by start.
starter: |
  # write your code below
  def merge_intervals(intervals):
      pass
hints:
  - Sort a copy of the pairs by their start, and leave the list you were given as it is. Then walk through them and compare each start with the end of the last merged range.
  - When two ranges overlap, the merged end is the larger of the two ends, not just the later one.
tests:
  - check: 'assert merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]]) == [[1, 6], [8, 10], [15, 18]]'
  - check: 'assert merge_intervals([[1, 4], [4, 5]]) == [[1, 5]]'
  - check: 'assert merge_intervals([[1, 4]]) == [[1, 4]]'
  - check: 'assert merge_intervals([[1, 4], [0, 0]]) == [[0, 0], [1, 4]]'
  - check: 'assert merge_intervals([[1, 2], [3, 4]]) == [[1, 2], [3, 4]]'
  - check: 'assert merge_intervals([[1, 10], [2, 3], [4, 5]]) == [[1, 10]]'
  - check: 'assert merge_intervals([[8, 10], [1, 3], [2, 6]]) == [[1, 6], [8, 10]]'
  - check: 'assert merge_intervals([[5, 5], [5, 5], [0, 30]]) == [[0, 30]]'
  - check: 'assert merge_intervals([[9999, 10000], [0, 1], [10000, 10000]]) == [[0, 1], [9999, 10000]]'
big: 'assert (lambda r: len(r) == 4751 and r[0] == [0, 50] and r[-1] == [9999, 10000] and sum(a * b for a, b in r) == 159511325050)(merge_intervals([[s, s + 50] if i % 1000 == 0 else [s, s + (i * 13) % 2] for i in range(10000) for s in [(i * 7919) % 10000 if i % 1000 else min((i * 7919) % 10000, 9950)]]))'
solution: |
  def merge_intervals(intervals):
      result = []
      for start, end in sorted(intervals):
          if result and start <= result[-1][1]:
              result[-1][1] = max(result[-1][1], end)
          else:
              result.append([start, end])
      return result
brute: |
  def merge_intervals(intervals):
      items = [list(p) for p in intervals]
      changed = True
      while changed:
          changed = False
          for i in range(len(items)):
              for j in range(i + 1, len(items)):
                  a, b = items[i], items[j]
                  if a[0] <= b[1] and b[0] <= a[1]:
                      items[i] = [min(a[0], b[0]), max(a[1], b[1])]
                      del items[j]
                      changed = True
                      break
              if changed:
                  break
      return sorted(items)
random:
  call: merge_intervals
  gen: |
    def gen(rng, size):
        pairs = []
        for _ in range(rng.randint(1, 3 + size)):
            start = rng.randint(0, 30)
            pairs.append([start, start + rng.randint(0, 5)])
        return (pairs,)
slow:
  - |
    def merge_intervals(intervals):
        result = []
        for start, end in intervals:
            keep = []
            for a, b in result:
                if a <= end and start <= b:
                    start, end = min(start, a), max(end, b)
                else:
                    keep.append([a, b])
            keep.append([start, end])
            result = keep
        return sorted(result)
wrong:
  - |
    def merge_intervals(intervals):
        result = []
        for start, end in intervals:
            if result and start <= result[-1][1]:
                result[-1][1] = max(result[-1][1], end)
            else:
                result.append([start, end])
        return result
  - |
    def merge_intervals(intervals):
        result = []
        for start, end in sorted(intervals):
            if result and start <= result[-1][1]:
                result[-1][1] = end
            else:
                result.append([start, end])
        return result
  - |
    def merge_intervals(intervals):
        result = []
        for start, end in sorted(intervals):
            if result and start < result[-1][1]:
                result[-1][1] = max(result[-1][1], end)
            else:
                result.append([start, end])
        return result
---
::
