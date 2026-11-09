---
title: Set Intersection Size At Least Two
tier: hard
order: 40
leetcode: 757
url: https://leetcode.com/problems/set-intersection-size-at-least-two/
companies: [Amazon, Google, Microsoft]
topic: Greedy
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/04-sorting-and-heaps]
---

You get a list of intervals, each written as [start, end] and including both ends. Choose a set of whole numbers so that every interval contains at least two of the chosen numbers. Return the smallest possible size of such a set.

There are between 1 and 3000 intervals, with 0 <= start < end <= 100000000. Trying sets of numbers one by one is far too slow.

::exercise
---
id: iv-hard-040
prompt: Write a function intersection_size_two(intervals) that returns the smallest size of a set having at least two numbers inside every interval.
starter: |
  # write your code below
  def intersection_size_two(intervals):
      pass
hints:
  - Sort by end (and for equal ends, the larger start first), then go through the intervals keeping the two largest numbers chosen so far.
  - If both chosen numbers are inside the next interval do nothing; if one is, add its end; if none is, add its end and the number before it.
tests:
  - check: assert intersection_size_two([[1, 3], [3, 7], [8, 9]]) == 5
  - check: assert intersection_size_two([[1, 3], [1, 4], [2, 5], [3, 5]]) == 3
  - check: assert intersection_size_two([[1, 2], [2, 3], [2, 4], [4, 5]]) == 5
  - check: assert intersection_size_two([[0, 1]]) == 2
  - check: assert intersection_size_two([[0, 5], [0, 5]]) == 2
  - check: assert intersection_size_two([[0, 2], [1, 3], [2, 4]]) == 3
  - check: assert intersection_size_two([[0, 6], [1, 2], [5, 6]]) == 4
  - check: assert intersection_size_two([[2, 3], [0, 8], [4, 7]]) == 4
  - check: assert intersection_size_two([[0, 3], [3, 6], [6, 8]]) == 4
  - check: assert intersection_size_two([[1, 4], [2, 5], [3, 6], [4, 7]]) == 3
  - check: assert intersection_size_two([[0, 4], [1, 2], [2, 3], [3, 4]]) == 4
  - check: assert intersection_size_two([[0, 8], [0, 2], [6, 8]]) == 4
  - check: assert intersection_size_two([[5, 7], [2, 3], [4, 5], [3, 5]]) == 5
  - check: assert intersection_size_two([[3, 5], [4, 5], [2, 3], [5, 7]]) == 5
solution: |
  def intersection_size_two(intervals):
      a = b = -1
      count = 0
      for start, end in sorted(intervals, key=lambda x: (x[1], -x[0])):
          if start > b:
              a, b = end - 1, end
              count += 2
          elif start > a:
              a, b = b, end
              count += 1
      return count
brute: |
  from itertools import combinations

  def intersection_size_two(intervals):
      top = max(e for s, e in intervals)
      points = range(top + 1)
      for size in range(2, len(points) + 1):
          for chosen in combinations(points, size):
              if all(sum(s <= p <= e for p in chosen) >= 2 for s, e in intervals):
                  return size
valid: |
  def valid(intervals):
      return 1 <= len(intervals) <= 3000 and all(0 <= s < e <= 10 ** 8 for s, e in intervals)
random:
  call: intersection_size_two
  gen: |
    def gen(rng, size):
        out = []
        for _ in range(rng.randint(1, min(size + 1, 6))):
            s = rng.randint(0, 7)
            out.append([s, rng.randint(s + 1, 8)])
        return (out,)
big: 'assert intersection_size_two([[i * 7919 * 1301 % 99400000, i * 7919 * 1301 % 99400000 + 1 + i * 104729 % 500000] for i in range(3000)]) == 1366'
slow:
  - |
    def intersection_size_two(intervals):
        chosen = []
        for start, end in sorted(intervals, key=lambda x: (x[1], -x[0])):
            inside = 0
            for p in chosen:
                if start <= p <= end:
                    inside += 1
            p = end
            while inside < 2:
                if p not in chosen:
                    chosen.append(p)
                    inside += 1
                p -= 1
        return len(chosen)
equivalent:
  - "a = b = -2"  # why: every start is 0 or more, so -1 and -2 are both below every start and mean the same: no point chosen yet
wrong:
  - |
    def intersection_size_two(intervals):
        a = b = -1
        count = 0
        for start, end in sorted(intervals, key=lambda x: (x[1], x[0])):
            if start > b:
                a, b = end - 1, end
                count += 2
            elif start > a:
                a, b = b, end
                count += 1
        return count
  - |
    def intersection_size_two(intervals):
        a = b = -1
        count = 0
        for start, end in sorted(intervals, key=lambda x: (x[1], -x[0])):
            if start >= b:
                a, b = end - 1, end
                count += 2
            elif start > a:
                a, b = b, end
                count += 1
        return count
  - |
    def intersection_size_two(intervals):
        a = b = -1
        count = 0
        for start, end in sorted(intervals):
            if start > b:
                a, b = end - 1, end
                count += 2
            elif start > a:
                a, b = b, end
                count += 1
        return count
  - |
    def intersection_size_two(intervals):
        a = b = -1
        count = 0
        for start, end in sorted(intervals, key=lambda x: (x[1], -x[0])):
            if start > a:
                a, b = end - 1, end
                count += 2
        return count
---
::
