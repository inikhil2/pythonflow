---
title: The Skyline Problem
tier: hard
order: 36
leetcode: 218
url: https://leetcode.com/problems/the-skyline-problem/
companies: [Amazon, Google, Meta]
topic: Divide and conquer
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week10-algorithms/04-sorting-and-heaps]
---

Each building in a city is a rectangle standing on flat ground, written as [left, right, height]: it covers the ground from x = left up to (but not including) x = right, and is height tall. You get a list of buildings, already sorted by left. Several buildings may overlap, share a left or right edge, or even sit exactly on top of each other.

Looking at the city from far away, you only see the outline of all the buildings together: the skyline. Return it as a list of key points [x, height], from left to right. A key point is the left end of a flat stretch of the outline, so its height is the height of the outline starting at that x. The last key point is where the last building ends, and its height is 0. Two neighbouring key points never have the same height, and no key point is listed for a stretch of ground at height 0 before the first building.

There are between 1 and 10000 buildings. Every left is below its right, positions and heights are whole numbers from 0 up to 2147483647 (heights from 1). Checking every building at every position is too slow for the largest cities.

::exercise
---
id: iv-hard-036
prompt: Write a function get_skyline(buildings) that returns the list of key points [x, height] of the skyline.
starter: |
  # write your code below
  def get_skyline(buildings):
      pass
hints:
  - Only the left and right edges of buildings can change the outline. Go through those x values from left to right.
  - Keep the buildings that have started in a max-heap by height. Before reading the tallest, throw away any top whose right edge is at or before x, and add a key point only when the height changes.
tests:
  - check: assert get_skyline([[2, 9, 10], [3, 7, 15], [5, 12, 12], [15, 20, 10], [19, 24, 8]]) == [[2, 10], [3, 15], [7, 12], [12, 0], [15, 10], [20, 8], [24, 0]]
  - check: assert get_skyline([[0, 2, 3], [2, 5, 3]]) == [[0, 3], [5, 0]]
  - check: assert get_skyline([[1, 2, 1], [1, 2, 2], [1, 2, 3]]) == [[1, 3], [2, 0]]
  - check: assert get_skyline([[0, 5, 4]]) == [[0, 4], [5, 0]]
  - check: assert get_skyline([[0, 3, 2], [1, 2, 5]]) == [[0, 2], [1, 5], [2, 2], [3, 0]]
  - check: assert get_skyline([[0, 2, 1], [2, 4, 2], [4, 6, 1]]) == [[0, 1], [2, 2], [4, 1], [6, 0]]
  - check: assert get_skyline([[0, 10, 3], [1, 9, 4], [2, 8, 3], [3, 7, 2]]) == [[0, 3], [1, 4], [9, 3], [10, 0]]
  - check: assert get_skyline([[1, 4, 2], [2, 5, 2], [3, 6, 2]]) == [[1, 2], [6, 0]]
  - check: assert get_skyline([[0, 2147483647, 2147483647]]) == [[0, 2147483647], [2147483647, 0]]
  - check: assert get_skyline([[1, 3, 3], [2, 4, 6], [3, 5, 4], [3, 6, 1], [6, 8, 2]]) == [[1, 3], [2, 6], [4, 4], [5, 1], [6, 2], [8, 0]]
  - check: assert get_skyline([[0, 4, 2], [0, 4, 5], [1, 3, 9]]) == [[0, 5], [1, 9], [3, 5], [4, 0]]
  - check: assert get_skyline([[1, 2, 4], [3, 4, 4]]) == [[1, 4], [2, 0], [3, 4], [4, 0]]
solution: |
  import heapq

  def get_skyline(buildings):
      xs = sorted({x for b in buildings for x in b[:2]})
      heap = []
      i = 0
      out = []
      last = 0
      for x in xs:
          while i < len(buildings) and buildings[i][0] <= x:
              heapq.heappush(heap, (-buildings[i][2], buildings[i][1]))
              i += 1
          while heap and heap[0][1] <= x:
              heapq.heappop(heap)
          h = -heap[0][0] if heap else 0
          if h != last:
              out.append([x, h])
              last = h
      return out
brute: |
  def get_skyline(buildings):
      xs = sorted({x for b in buildings for x in b[:2]})
      out = []
      last = 0
      for x in xs:
          h = 0
          for left, right, height in buildings:
              if left <= x < right and height > h:
                  h = height
          if h != last:
              out.append([x, h])
              last = h
      return out
valid: |
  def valid(buildings):
      return 1 <= len(buildings) <= 10000 and all(0 <= l < r <= 2 ** 31 - 1 and 1 <= h <= 2 ** 31 - 1 for l, r, h in buildings) and all(buildings[i][0] <= buildings[i + 1][0] for i in range(len(buildings) - 1))
random:
  call: get_skyline
  gen: |
    def gen(rng, size):
        n = rng.randint(1, min(size + 2, 9))
        out = []
        for _ in range(n):
            l = rng.randint(0, 12)
            out.append([l, l + rng.randint(1, 8), rng.randint(1, 6)])
        out.sort()
        return (out,)
big: 'assert (lambda r: len(r) == 2262 and r[0] == [0, 1] and r[-1] == [1000977, 0] and sum(x * h for x, h in r) == 763612390365 and r[1000] == [445001, 874] and r[1131] == [502721, 679])(get_skyline(sorted([[(i * 7919) % 1000000, (i * 7919) % 1000000 + 1 + (i * 104729) % 2000, 1 + (i * 31337) % 1000] for i in range(10000)])))'
slow:
  - |
    def get_skyline(buildings):
        xs = sorted({x for b in buildings for x in b[:2]})
        out = []
        last = 0
        for x in xs:
            h = 0
            for left, right, height in buildings:
                if left <= x < right and height > h:
                    h = height
            if h != last:
                out.append([x, h])
                last = h
        return out
equivalent:
  - "xs = sorted({x for b in buildings for x in b[:3]})"  # why: the extra x values are heights, and looking at an extra position never changes the outline, so no extra key point appears
  - "last = -1"  # why: the first x is always the smallest left edge, where the height is above 0 anyway, so the first key point is added either way
wrong:
  - |
    import heapq

    def get_skyline(buildings):
        xs = sorted({x for b in buildings for x in b[:2]})
        heap = []
        i = 0
        out = []
        last = 0
        for x in xs:
            while i < len(buildings) and buildings[i][0] <= x:
                heapq.heappush(heap, (-buildings[i][2], buildings[i][1]))
                i += 1
            while heap and heap[0][1] < x:
                heapq.heappop(heap)
            h = -heap[0][0] if heap else 0
            if h != last:
                out.append([x, h])
                last = h
        return out
  - |
    import heapq

    def get_skyline(buildings):
        xs = sorted({x for b in buildings for x in b[:2]})
        heap = []
        i = 0
        out = []
        for x in xs:
            while i < len(buildings) and buildings[i][0] <= x:
                heapq.heappush(heap, (-buildings[i][2], buildings[i][1]))
                i += 1
            while heap and heap[0][1] <= x:
                heapq.heappop(heap)
            h = -heap[0][0] if heap else 0
            out.append([x, h])
        return out
  - |
    import heapq

    def get_skyline(buildings):
        xs = sorted({b[0] for b in buildings})
        heap = []
        i = 0
        out = []
        last = 0
        for x in xs:
            while i < len(buildings) and buildings[i][0] <= x:
                heapq.heappush(heap, (-buildings[i][2], buildings[i][1]))
                i += 1
            while heap and heap[0][1] <= x:
                heapq.heappop(heap)
            h = -heap[0][0] if heap else 0
            if h != last:
                out.append([x, h])
                last = h
        return out
  - |
    import heapq

    def get_skyline(buildings):
        xs = sorted({x for b in buildings for x in b[:2]})
        heap = []
        i = 0
        out = []
        last = 0
        for x in xs:
            while i < len(buildings) and buildings[i][0] < x:
                heapq.heappush(heap, (-buildings[i][2], buildings[i][1]))
                i += 1
            while heap and heap[0][1] <= x:
                heapq.heappop(heap)
            h = -heap[0][0] if heap else 0
            if h != last:
                out.append([x, h])
                last = h
        return out
  - |
    import heapq

    def get_skyline(buildings):
        xs = sorted({x for b in buildings for x in b[:2]})
        heap = []
        i = 0
        out = []
        last = 0
        for x in xs:
            while i < len(buildings) and buildings[i][0] <= x:
                heapq.heappush(heap, (buildings[i][1], -buildings[i][2]))
                i += 1
            while heap and heap[0][0] <= x:
                heapq.heappop(heap)
            h = -heap[0][1] if heap else 0
            if h != last:
                out.append([x, h])
                last = h
        return out
---
::
