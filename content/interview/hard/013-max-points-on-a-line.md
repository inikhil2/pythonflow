---
title: Max Points on a Line
tier: hard
order: 13
leetcode: 149
url: https://leetcode.com/problems/max-points-on-a-line/
companies: [Meta, Google, Amazon]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week0-functions/06-numbers]
---

You get a list points of pairs [x, y], where x and y are whole numbers. The list has between 1 and 300 points. Every x and y is from -10000 to 10000, and no two pairs are the same. Return the largest number of points that lie on one straight line. A single point counts as one point on a line, so with one point in the list the answer is 1.

Two points always lie on exactly one straight line. Fix one point and look at the direction from it to every later point. Points on the same line through the fixed point have the same direction, so counting directions finds the largest line that passes through that point. Directions must be compared as reduced fractions, so that a direction and its double count as the same one.

::exercise
---
id: iv-hard-013
prompt: Write a function max_points(points) that returns the largest number of points that lie on one straight line, where points is a list of [x, y] pairs.
starter: |
  # write your code below
  def max_points(points):
      pass
hints:
  - Fix one point. The direction from it to another point, divided by the greatest common divisor of its two parts, names the line through both points.
  - Keep each direction with its sign fixed, so that a direction and its opposite count together, then count how many points share each direction.
tests:
  - check: assert max_points([[1, 1]]) == 1
  - check: assert max_points([[1, 1], [2, 2]]) == 2
  - check: assert max_points([[0, 0], [1, 1], [2, 2]]) == 3
  - check: assert max_points([[0, 0], [1, 1], [2, 3]]) == 2
  - check: assert max_points([[0, 0], [-1, -1], [1, 1], [5, 0]]) == 3
  - check: assert max_points([[0, 5], [0, 6], [1, 0], [2, 0], [3, 0]]) == 3
  - check: assert max_points([[0, 0], [1, 2], [2, 4], [3, 6], [-1, -2], [4, 5]]) == 5
  - check: assert max_points([[2, 2], [2, 3], [2, 1], [1, 1], [3, 4]]) == 3
  - check: assert max_points([[0, 0], [-3, -3], [3, 3]]) == 3
  - check: assert max_points([[0, 0], [4, 2], [2, 1], [1, 5]]) == 3
solution: |
  from math import gcd

  def max_points(points):
      best = 1
      for i, (x1, y1) in enumerate(points):
          count = {}
          for x2, y2 in points[i + 1:]:
              dx, dy = x2 - x1, y2 - y1
              g = gcd(dx, dy)
              dx, dy = dx // g, dy // g
              if dx < 0 or (dx == 0 and dy < 0):
                  dx, dy = -dx, -dy
              count[(dx, dy)] = count.get((dx, dy), 0) + 1
          best = max(best, 1 + max(count.values(), default=0))
      return best
brute: |
  def max_points(points):
      n = len(points)
      best = min(n, 1)
      for i in range(n):
          for j in range(i + 1, n):
              count = 0
              for k in range(n):
                  (x1, y1), (x2, y2), (x3, y3) = points[i], points[j], points[k]
                  if (x2 - x1) * (y3 - y1) == (y2 - y1) * (x3 - x1):
                      count += 1
              best = max(best, count)
      return best
random:
  call: max_points
  gen: |
    def gen(rng, size):
        cells = [[x, y] for x in range(-3, 4) for y in range(-3, 4)]
        return (rng.sample(cells, rng.randint(1, min(size + 3, 49))),)
big: assert max_points((rng := __import__("random").Random(13)) and (LINE := [[3 * t, 2 * t] for t in range(-30, 31)]) and (REST := [[x, y] for x in range(-100, 101) for y in range(-100, 101) if [x, y] not in LINE]) and (PTS := LINE + rng.sample(REST, 239)) and (rng.shuffle(PTS) or PTS)) == 61
slow:
  - |
    def max_points(points):
        n = len(points)
        best = min(n, 1)
        for i in range(n):
            for j in range(i + 1, n):
                count = 0
                for k in range(n):
                    (x1, y1), (x2, y2), (x3, y3) = points[i], points[j], points[k]
                    if (x2 - x1) * (y3 - y1) == (y2 - y1) * (x3 - x1):
                        count += 1
                best = max(best, count)
        return best
wrong:
  - |
    from math import gcd

    def max_points(points):
        best = 1
        for i, (x1, y1) in enumerate(points):
            count = {}
            for x2, y2 in points[i + 1:]:
                dx, dy = x2 - x1, y2 - y1
                g = gcd(dx, dy)
                key = (dx // g, dy // g)
                count[key] = count.get(key, 0) + 1
            best = max(best, 1 + max(count.values(), default=0))
        return best
  - |
    from math import gcd

    def max_points(points):
        best = 1
        for i, (x1, y1) in enumerate(points):
            count = {}
            for x2, y2 in points[i + 1:]:
                dx, dy = x2 - x1, y2 - y1
                g = gcd(dx, dy)
                dx, dy = dx // g, dy // g
                if dx < 0 or (dx == 0 and dy < 0):
                    dx, dy = -dx, -dy
                count[(dx, dy)] = count.get((dx, dy), 0) + 1
            best = max(best, max(count.values(), default=0))
        return best
  - |
    from math import gcd

    def max_points(points):
        best = 1
        for i, (x1, y1) in enumerate(points[:1]):
            count = {}
            for x2, y2 in points[i + 1:]:
                dx, dy = x2 - x1, y2 - y1
                g = gcd(dx, dy)
                dx, dy = dx // g, dy // g
                if dx < 0 or (dx == 0 and dy < 0):
                    dx, dy = -dx, -dy
                count[(dx, dy)] = count.get((dx, dy), 0) + 1
            best = max(best, 1 + max(count.values(), default=0))
        return best
equivalent:
  - "4: best = 0"  # why: best is 1 after the loop on any non-empty list, because the last point has no later points and its count is empty, so 1 + 0 is 1
  - "11: if dx < 0 or (dx == 0 and dy < 1):"  # why: dx == 0 and dy == 0 means two equal points, and the statement says no two pairs are the same
  - "11: if dx < 0 or (dx == 0 and dy <= 0):"  # why: same as above, a zero direction needs two equal points
  - "14: best = max(best, 1 + max(count.values(), default=-1))"  # why: an empty count gives 0, and best already starts at 1, so the max never changes the answer
---
::
