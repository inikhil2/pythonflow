---
title: Non-overlapping Intervals
tier: medium
order: 98
leetcode: 435
url: https://leetcode.com/problems/non-overlapping-intervals/
companies: [Amazon, Meta, Google]
topic: Dynamic programming
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/04-sorting-and-heaps, /learn/week10-algorithms/10-dynamic-programming]
---

You get `intervals`, a list of between 1 and 10000 intervals. Each interval is a pair `[start, end]` with `start < end`, and every number is from -1000 to 1000.

Two intervals overlap when one starts before the other ends. Intervals that only touch, where one ends at the exact point the next starts, do not overlap.

Return the fewest intervals you must remove so that the rest do not overlap.

::exercise
---
id: iv-medium-098
prompt: Write a function erase_overlap(intervals) that returns the fewest intervals to remove so that no two remaining intervals overlap. Intervals that only touch at an endpoint do not overlap.
starter: |
  # write your code below
  def erase_overlap(intervals):
      pass
hints:
  - Sort the intervals by where they end. Keeping the one that ends earliest leaves the most room for the rest.
  - Walk through the sorted intervals and keep an interval only when it starts at or after the end of the last one you kept. Every interval you skip is one removal.
tests:
  - check: assert erase_overlap([[1, 2], [2, 3], [3, 4], [1, 3]]) == 1
  - check: assert erase_overlap([[1, 2], [1, 2], [1, 2]]) == 2
  - check: assert erase_overlap([[1, 2], [2, 3]]) == 0
  - check: assert erase_overlap([[1, 2]]) == 0
  - check: assert erase_overlap([[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]]) == 2
  - check: assert erase_overlap([[1, 100], [2, 3], [3, 4]]) == 1
  - check: assert erase_overlap([[1, 2], [7, 8], [1, 9]]) == 1
big: assert erase_overlap([[(k * 7919) % 1991 - 1000, (k * 7919) % 1991 - 1000 + 1 + (k * 31) % 10] for k in range(9999)] + [[-1000, 1000]]) == 8801 and erase_overlap([[0, 1]] * 10000) == 9999
solution: |
  def erase_overlap(intervals):
      kept = 0
      last_end = None
      for start, end in sorted(intervals, key=lambda p: p[1]):
          if last_end is None or start >= last_end:
              kept += 1
              last_end = end
      return len(intervals) - kept
brute: |
  def erase_overlap(intervals):
      n = len(intervals)
      most = 0
      for mask in range(1 << n):
          chosen = [intervals[i] for i in range(n) if mask >> i & 1]
          chosen.sort()
          if all(a[1] <= b[0] for a, b in zip(chosen, chosen[1:])):
              most = max(most, len(chosen))
      return n - most
slow:
  - |
    def erase_overlap(intervals):
        items = sorted(intervals, key=lambda p: p[1])
        best = []
        for i, (start, end) in enumerate(items):
            best.append(1 + max((best[j] for j in range(i) if items[j][1] <= start), default=0))
        return len(items) - max(best)
random:
  call: erase_overlap
  gen: |
    def gen(rng, size):
        intervals = []
        for _ in range(min(max(size, 1), 8)):
            start = rng.randint(0, 9)
            intervals.append([start, start + rng.randint(1, 4)])
        return (intervals,)
wrong:
  - |
    def erase_overlap(intervals):
        kept = 0
        last_end = None
        for start, end in sorted(intervals):
            if last_end is None or start >= last_end:
                kept += 1
                last_end = end
        return len(intervals) - kept
  - |
    def erase_overlap(intervals):
        kept = 0
        last_end = None
        for start, end in sorted(intervals, key=lambda p: p[1]):
            if last_end is None or start > last_end:
                kept += 1
                last_end = end
        return len(intervals) - kept
  - |
    def erase_overlap(intervals):
        return 1 if len(intervals) > 1 else 0
---
::
