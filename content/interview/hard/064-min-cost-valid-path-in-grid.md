---
title: Minimum Cost to Make a Valid Path in a Grid
tier: hard
order: 64
leetcode: 1368
url: https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/
companies: [Google, Amazon]
topic: Graph
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/01-while-loops, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/09-graphs]
---

You get a grid with m rows and n columns, where m and n are each between 1 and 100. Each cell holds a digit from 1 to 4 that names the direction of the arrow in that cell: 1 points right, 2 points left, 3 points down, and 4 points up. You start at the top left cell and want to reach the bottom right cell. From any cell you may step to a neighbor above, below, left or right, as long as you stay inside the grid, and you may pass through a cell more than once.

A step in the direction the arrow points costs 0. A step in any other direction costs 1. Return the smallest total cost of a walk from the top left cell to the bottom right cell. If the grid has one cell, return 0.

Changing the arrows costs something, and walking along them is free, so the cheapest route mixes free steps with paid steps. Treat each cell as a point with up to four moves, and find the cheapest route with a method that handles costs of 0 and 1.

::exercise
---
id: iv-hard-064
prompt: Write a function min_cost_path(grid) that returns the smallest total cost to walk from the top left cell to the bottom right cell, where a step in the arrow's direction costs 0 and any other step costs 1.
starter: |
  # write your code below
  def min_cost_path(grid):
      pass
hints:
  - Use a double-ended queue. Push zero-cost steps to the front and one-cost steps to the back.
  - Keep the best cost found so far for each cell, and only push a cell again when you improve that cost.

tests:
  - check: assert min_cost_path([[1, 1, 1, 1], [2, 2, 2, 2], [1, 1, 1, 1], [2, 2, 2, 2]]) == 3
  - check: assert min_cost_path([[1, 2], [4, 3]]) == 1
  - check: assert min_cost_path([[1]]) == 0
  - check: assert min_cost_path([[2, 2], [2, 2]]) == 2
  - check: assert min_cost_path([[4, 4, 4], [4, 4, 4], [4, 4, 4]]) == 4
  - check: assert min_cost_path([[1, 2, 1], [4, 4, 4], [3, 3, 3]]) == 3
  - check: assert min_cost_path([[1, 1], [1, 1]]) == 1
  - check: assert min_cost_path([[1, 1, 3], [3, 2, 2], [1, 1, 4]]) == 0
  - check: assert min_cost_path([[1, 3], [3, 2], [1, 1]]) == 0
big: assert min_cost_path([[(((r * 100 + c) * 1103515245 + 12345) >> 16) % 4 + 1 for c in range(100)] for r in range(100)]) == 62
solution: |
  from collections import deque
  def min_cost_path(grid):
      m, n = len(grid), len(grid[0])
      dirs = {1: (0, 1), 2: (0, -1), 3: (1, 0), 4: (-1, 0)}
      dist = [[float("inf")] * n for _ in range(m)]
      dist[0][0] = 0
      dq = deque([(0, 0)])
      while dq:
          r, c = dq.popleft()
          for d, (dr, dc) in dirs.items():
              nr, nc = r + dr, c + dc
              if 0 <= nr < m and 0 <= nc < n:
                  cost = 0 if grid[r][c] == d else 1
                  if dist[r][c] + cost < dist[nr][nc]:
                      dist[nr][nc] = dist[r][c] + cost
                      if cost == 0:
                          dq.appendleft((nr, nc))
                      else:
                          dq.append((nr, nc))
      return dist[m - 1][n - 1]
brute: |
  def min_cost_path(grid):
      m, n = len(grid), len(grid[0])
      dirs = {1: (0, 1), 2: (0, -1), 3: (1, 0), 4: (-1, 0)}
      INF = 10 ** 9
      dist = [[INF] * n for _ in range(m)]
      dist[0][0] = 0
      changed = True
      while changed:
          changed = False
          for r in range(m):
              for c in range(n):
                  for d, (dr, dc) in dirs.items():
                      nr, nc = r + dr, c + dc
                      if 0 <= nr < m and 0 <= nc < n:
                          w = 0 if grid[r][c] == d else 1
                          if dist[r][c] + w < dist[nr][nc]:
                              dist[nr][nc] = dist[r][c] + w
                              changed = True
      return dist[m - 1][n - 1]
random:
  call: min_cost_path
  gen: |
    def gen(rng, size):
        m = rng.randint(1, min(max(size, 1), 4))
        n = rng.randint(1, min(max(size, 1), 4))
        return ([[rng.randint(1, 4) for _ in range(n)] for _ in range(m)],)
slow:
  - |
    def min_cost_path(grid):
        m, n = len(grid), len(grid[0])
        dirs = {1: (0, 1), 2: (0, -1), 3: (1, 0), 4: (-1, 0)}
        INF = 10 ** 9
        dist = [[INF] * n for _ in range(m)]
        dist[0][0] = 0
        changed = True
        while changed:
            changed = False
            for r in range(m):
                for c in range(n):
                    for d, (dr, dc) in dirs.items():
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < m and 0 <= nc < n:
                            w = 0 if grid[r][c] == d else 1
                            if dist[r][c] + w < dist[nr][nc]:
                                dist[nr][nc] = dist[r][c] + w
                                changed = True
        return dist[m - 1][n - 1]
wrong:
  - |
    from collections import deque
    def min_cost_path(grid):
        m, n = len(grid), len(grid[0])
        dirs = {1: (0, 1), 2: (0, -1), 3: (1, 0), 4: (-1, 0)}
        dist = [[float("inf")] * n for _ in range(m)]
        dist[0][0] = 0
        dq = deque([(0, 0)])
        while dq:
            r, c = dq.popleft()
            for d, (dr, dc) in dirs.items():
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n:
                    cost = 1 if grid[r][c] == d else 0
                    if dist[r][c] + cost < dist[nr][nc]:
                        dist[nr][nc] = dist[r][c] + cost
                        if cost == 0:
                            dq.appendleft((nr, nc))
                        else:
                            dq.append((nr, nc))
        return dist[m - 1][n - 1]
  - |
    from collections import deque
    def min_cost_path(grid):
        m, n = len(grid), len(grid[0])
        dist = [[-1] * n for _ in range(m)]
        dist[0][0] = 0
        dq = deque([(0, 0)])
        while dq:
            r, c = dq.popleft()
            for dr, dc in ((0, 1), (0, -1), (1, 0), (-1, 0)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and dist[nr][nc] == -1:
                    dist[nr][nc] = dist[r][c] + 1
                    dq.append((nr, nc))
        return dist[m - 1][n - 1]
  - |
    from collections import deque
    def min_cost_path(grid):
        m, n = len(grid), len(grid[0])
        dirs = {1: (0, 1), 3: (1, 0)}
        dist = [[float("inf")] * n for _ in range(m)]
        dist[0][0] = 0
        dq = deque([(0, 0)])
        while dq:
            r, c = dq.popleft()
            for d, (dr, dc) in dirs.items():
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n:
                    cost = 0 if grid[r][c] == d else 1
                    if dist[r][c] + cost < dist[nr][nc]:
                        dist[nr][nc] = dist[r][c] + cost
                        if cost == 0:
                            dq.appendleft((nr, nc))
                        else:
                            dq.append((nr, nc))
        return dist[m - 1][n - 1]
equivalent:
  - "4: m, n = (len(grid), len(grid[-1]))"   # why: every row of a rectangular grid has the same length, so grid[-1] gives the same width as grid[0]

---
::
