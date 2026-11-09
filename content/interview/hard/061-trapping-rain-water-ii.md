---
title: Trapping Rain Water II
tier: hard
order: 61
leetcode: 407
url: https://leetcode.com/problems/trapping-rain-water-ii/
companies: [Google, Amazon, Meta]
topic: Heap
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/09-graphs]
---

You get a grid of heights, with m rows and n columns. Both m and n are between 1 and 50. Each height is a whole number from 0 to 20000. Think of each cell as a block column with that height, standing on flat ground. When rain falls, water collects in a low cell only if it is walled in on every side by taller ground. Water can escape over the edge of the grid through any boundary cell, and a boundary cell can never hold water.

For each cell, the water it holds is the level the water reaches there minus that cell's height, where the level is the lowest height at which the cell can escape to the boundary. Add up the water held by every cell and return the total. A grid with no interior cells holds no water, so its answer is 0.

The answer can be found by starting from the boundary and growing inward. Always expand from the lowest frontier cell first, since that is the first place water can escape from a basin. A plain scan that compares only neighbours in a single row or column misses water that spreads across the grid.

::exercise
---
id: iv-hard-061
prompt: Write a function trap_water(height) that returns the total amount of rain water the grid of heights holds.
starter: |
  # write your code below
  def trap_water(height):
      pass
hints:
  - Put every boundary cell into a min-heap by height, and mark them as seen.
  - Pop the lowest cell, and for each unseen neighbour, count the water above it up to the popped cell's level, then push it with the larger of the two heights.
tests:
  - check: assert trap_water([[5]]) == 0
  - check: assert trap_water([[3, 1, 2]]) == 0
  - check: assert trap_water([[3, 3, 3], [3, 1, 3], [3, 3, 3]]) == 2
  - check: assert trap_water([[1, 1, 1], [1, 0, 1], [1, 1, 1]]) == 1
  - check: assert trap_water([[9, 9, 9, 9], [9, 0, 0, 9], [9, 9, 9, 9]]) == 18
  - check: assert trap_water([[0, 0, 0], [0, 9, 0], [0, 0, 0]]) == 0
  - check: assert trap_water([[5, 5, 5, 5, 5], [5, 1, 9, 1, 5], [5, 5, 5, 5, 5]]) == 8
  - check: assert trap_water([[2, 9, 2], [9, 1, 9], [2, 9, 2]]) == 8
  - check: assert trap_water([[9, 9, 9, 9, 9], [9, 1, 9, 2, 9], [9, 9, 9, 9, 9]]) == 15
  - check: assert trap_water([[4, 4], [4, 4]]) == 0
  - check: assert trap_water([[2, 1, 1], [6, 5, 0], [2, 4, 3], [4, 0, 2]]) == 0
big: assert trap_water([[(r * 131 + c * 977) % 997 for c in range(50)] for r in range(50)]) == 21756 and trap_water([[1 if (r == 0 and c == 1) else (20000 if (r in (0, 49) or c in (0, 49) or (r % 2 == 0 and c != (48 if (r // 2) % 2 else 1))) else 0) for c in range(50)] for r in range(50)]) == 1176
solution: |
  import heapq
  def trap_water(height):
      m, n = len(height), len(height[0])
      seen = [[False] * n for _ in range(m)]
      heap = []
      for r in range(m):
          for c in range(n):
              if r in (0, m - 1) or c in (0, n - 1):
                  heapq.heappush(heap, (height[r][c], r, c))
                  seen[r][c] = True
      total = 0
      while heap:
          level, r, c = heapq.heappop(heap)
          for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
              if 0 <= nr < m and 0 <= nc < n and not seen[nr][nc]:
                  seen[nr][nc] = True
                  total += max(0, level - height[nr][nc])
                  heapq.heappush(heap, (max(level, height[nr][nc]), nr, nc))
      return total
brute: |
  def trap_water(height):
      m, n = len(height), len(height[0])
      INF = 10 ** 9
      level = [[INF] * n for _ in range(m)]
      for r in range(m):
          for c in range(n):
              if r in (0, m - 1) or c in (0, n - 1):
                  level[r][c] = height[r][c]
      changed = True
      while changed:
          changed = False
          for r in range(1, m - 1):
              for c in range(1, n - 1):
                  best = min(level[r + 1][c], level[r - 1][c], level[r][c + 1], level[r][c - 1])
                  cand = max(height[r][c], best)
                  if cand < level[r][c]:
                      level[r][c] = cand
                      changed = True
      return sum(level[r][c] - height[r][c] for r in range(m) for c in range(n))
random:
  call: trap_water
  gen: |
    def gen(rng, size):
        m = rng.randint(1, min(max(size, 1), 4) + 1)
        n = rng.randint(1, min(max(size, 1), 4) + 1)
        return ([[rng.randint(0, 4) for _ in range(n)] for _ in range(m)],)
slow:
  - |
    def trap_water(height):
        m, n = len(height), len(height[0])
        INF = 10 ** 9
        level = [[INF] * n for _ in range(m)]
        for r in range(m):
            for c in range(n):
                if r in (0, m - 1) or c in (0, n - 1):
                    level[r][c] = height[r][c]
        for _ in range(m * n):
            for r in range(1, m - 1):
                for c in range(1, n - 1):
                    best = min(level[r + 1][c], level[r - 1][c], level[r][c + 1], level[r][c - 1])
                    level[r][c] = min(level[r][c], max(height[r][c], best))
        return sum(level[r][c] - height[r][c] for r in range(m) for c in range(n))
  - |
    def trap_water(height):
        m, n = len(height), len(height[0])
        INF = 10 ** 9
        level = [[INF] * n for _ in range(m)]
        for r in range(m):
            for c in range(n):
                if r in (0, m - 1) or c in (0, n - 1):
                    level[r][c] = height[r][c]
        changed = True
        while changed:
            changed = False
            for r in range(1, m - 1):
                for c in range(1, n - 1):
                    best = min(level[r + 1][c], level[r - 1][c], level[r][c + 1], level[r][c - 1])
                    cand = max(height[r][c], best)
                    if cand < level[r][c]:
                        level[r][c] = cand
                        changed = True
        return sum(level[r][c] - height[r][c] for r in range(m) for c in range(n))
wrong:
  - |
    import heapq
    def trap_water(height):
        m, n = len(height), len(height[0])
        seen = [[False] * n for _ in range(m)]
        heap = []
        for r in range(m):
            for c in range(n):
                if r in (0, m - 1) or c in (0, n - 1):
                    heapq.heappush(heap, (height[r][c], r, c))
                    seen[r][c] = True
        total = 0
        while heap:
            level, r, c = heapq.heappop(heap)
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < m and 0 <= nc < n and not seen[nr][nc]:
                    seen[nr][nc] = True
                    total += max(0, level - height[nr][nc])
                    heapq.heappush(heap, (height[nr][nc], nr, nc))
        return total
  - |
    import heapq
    def trap_water(height):
        m, n = len(height), len(height[0])
        seen = [[False] * n for _ in range(m)]
        heap = []
        for r in range(m):
            for c in range(n):
                if r in (0, m - 1):
                    heapq.heappush(heap, (height[r][c], r, c))
                    seen[r][c] = True
        total = 0
        while heap:
            level, r, c = heapq.heappop(heap)
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < m and 0 <= nc < n and not seen[nr][nc]:
                    seen[nr][nc] = True
                    total += max(0, level - height[nr][nc])
                    heapq.heappush(heap, (max(level, height[nr][nc]), nr, nc))
        return total
  - |
    def trap_water(height):
        total = 0
        for row in height:
            left = [0] * len(row)
            right = [0] * len(row)
            for i in range(len(row)):
                left[i] = max(row[:i + 1])
            for i in range(len(row) - 1, -1, -1):
                right[i] = max(row[i:])
            total += sum(min(left[i], right[i]) - row[i] for i in range(len(row)))
        return total
equivalent:
  - "16: if 0 <= nr < m and 1 <= nc < n and (not seen[nr][nc]):"   # why: column bounds only decide whether a boundary cell can be reached, and every boundary cell is already seen before the search starts
  - "16: if 0 <= nr < m and -1 <= nc < n and (not seen[nr][nc]):"   # why: column bounds only decide whether a boundary cell can be reached, and every boundary cell is already seen before the search starts
  - "16: if 0 <= nr < m and 0 < nc < n and (not seen[nr][nc]):"   # why: column bounds only decide whether a boundary cell can be reached, and every boundary cell is already seen before the search starts
  - "16: if 1 <= nr < m and 0 <= nc < n and (not seen[nr][nc]):"   # why: row bounds only decide whether a boundary cell can be reached, and every boundary cell is already seen before the search starts
  - "16: if -1 <= nr < m and 0 <= nc < n and (not seen[nr][nc]):"   # why: row bounds only decide whether a boundary cell can be reached, and every boundary cell is already seen before the search starts
  - "16: if 0 < nr < m and 0 <= nc < n and (not seen[nr][nc]):"   # why: row bounds only decide whether a boundary cell can be reached, and every boundary cell is already seen before the search starts
  - "4: m, n = (len(height), len(height[-1]))"   # why: every row has the same length, so the last row gives the same column count
---
::
