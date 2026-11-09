---
title: K Closest Points to Origin
tier: medium
order: 53
leetcode: 973
url: https://leetcode.com/problems/k-closest-points-to-origin/
companies: [Meta, Amazon, Google]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/06-numbers, /learn/week10-algorithms/04-sorting-and-heaps]
---

You get a list of points, where each point is a pair [x, y] of whole numbers, and a whole number k. The list has between 1 and 20000 points, each coordinate is from -10000 to 10000, and k is from 1 up to the number of points. Distance here means the straight-line distance from the point to the origin [0, 0]. Return the k points that are closest to the origin. Return them in any order. If several points are the same distance away, you may pick any of them, but you must return exactly k points, and each one must come from the list.

Comparing squared distances (x * x + y * y) gives the same ranking without decimals, so you can skip the square root.

::exercise
---
id: iv-medium-053
prompt: Write a function k_closest(points, k) that returns the k points closest to [0, 0] as a list of [x, y] pairs, in any order.
starter: |
  # write your code below
  def k_closest(points, k):
      pass
hints:
  - Sort the points by x * x + y * y, then keep the first k.
  - Return the points themselves, not their distances.
tests:
  - check: assert sorted(k_closest([[1, 3], [-2, 2]], 1)) == [[-2, 2]]
  - check: assert sorted(k_closest([[3, 3], [5, -1], [-2, 4]], 2)) == [[-2, 4], [3, 3]]
  - check: assert sorted(k_closest([[1, 1], [0, 3], [2, 2]], 2)) == [[1, 1], [2, 2]]
  - check: assert k_closest([[0, 1]], 1) == [[0, 1]]
  - check: assert sorted(k_closest([[1, 0], [0, 1]], 2)) == [[0, 1], [1, 0]]
  - check: assert sorted(k_closest([[-1, -1], [1, 1], [2, 0]], 2)) == [[-1, -1], [1, 1]]
  - check: assert sorted(k_closest([[4, 0], [0, 0], [-5, 1]], 3)) == [[-5, 1], [0, 0], [4, 0]]
  - check: assert sorted(k_closest([[7, 7], [-3, 0], [0, 6], [2, -2]], 1)) == [[2, -2]]
big: 'assert (lambda r: len(r) == 5000 and sum(p[0] * p[0] + p[1] * p[1] for p in r) == 79582834324 and max(p[0] * p[0] + p[1] * p[1] for p in r) == 31818020)(k_closest([[(i * 7919) % 20001 - 10000, (i * 104729) % 20001 - 10000] for i in range(20000)], 5000))'
solution: |
  def k_closest(points, k):
      ranked = sorted(points, key=lambda p: p[0] * p[0] + p[1] * p[1])
      return ranked[:k]
brute: |
  def k_closest(points, k):
      rest = list(points)
      chosen = []
      for _ in range(k):
          best = 0
          for idx in range(1, len(rest)):
              if rest[idx][0] ** 2 + rest[idx][1] ** 2 < rest[best][0] ** 2 + rest[best][1] ** 2:
                  best = idx
          chosen.append(rest.pop(best))
      return chosen
random:
  call: k_closest
  gen: |
    def gen(rng, size):
        points = [[rng.randint(-3, 3), rng.randint(-3, 3)] for _ in range(max(size, 1))]
        return (points, rng.randint(1, len(points)))
  same: |
    def same(args, got, want):
        points, k = args
        def d(p):
            return p[0] * p[0] + p[1] * p[1]
        return (
            isinstance(got, list) and len(got) == k
            and sorted(map(d, got)) == sorted(map(d, want))
            and all(got.count(p) <= points.count(p) for p in got)
        )
slow:
  - |
    def k_closest(points, k):
        rest = list(points)
        chosen = []
        for _ in range(k):
            best = 0
            for idx in range(1, len(rest)):
                if rest[idx][0] ** 2 + rest[idx][1] ** 2 < rest[best][0] ** 2 + rest[best][1] ** 2:
                    best = idx
            chosen.append(rest.pop(best))
        return chosen
  - |
    def k_closest(points, k):
        rest = list(points)
        chosen = []
        for _ in range(k):
            chosen.append(rest.pop(rest.index(min(rest, key=lambda p: p[0] * p[0] + p[1] * p[1]))))
        return chosen
wrong:
  - |
    def k_closest(points, k):
        return sorted(points)[:k]
  - |
    def k_closest(points, k):
        ranked = sorted(points, key=lambda p: p[0] * p[0] + p[1] * p[1])
        return ranked[:k - 1]
  - |
    def k_closest(points, k):
        ranked = sorted(points, key=lambda p: abs(p[0]) + abs(p[1]))
        return ranked[:k]
  - |
    def k_closest(points, k):
        ranked = sorted(points, key=lambda p: p[0] * p[0] + p[1] * p[1], reverse=True)
        return ranked[:k]
---
::
