---
title: Shortest Path in Binary Matrix
tier: medium
order: 79
leetcode: 1091
url: https://leetcode.com/problems/shortest-path-in-binary-matrix/
companies: [Meta, Google, Amazon]
topic: Breadth first search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/09-graphs]
---

You get a square grid with between 1 and 100 rows and columns. Each cell holds 0 for an open cell or 1 for a blocked cell.

Return the number of cells on the shortest path from the top-left cell to the bottom-right cell. A step may go to any of the eight neighbouring cells, including the diagonal ones, and the path may use only open cells. Both the first and the last cell count. Return -1 if no such path exists, including when the top-left or the bottom-right cell is blocked.

::exercise
---
id: iv-medium-079
prompt: Write a function shortest_path(grid) that returns the number of cells on the shortest clear path from the top-left corner to the bottom-right corner, or -1 if there is none.
starter: |
  # write your code below
  def shortest_path(grid):
      pass
hints:
  - Explore the open cells one ring of steps at a time, starting from the top-left cell.
  - Store the number of cells on the path for each cell you reach, and stop when you reach the bottom-right cell.
tests:
  - check: assert shortest_path([[0]]) == 1
  - check: assert shortest_path([[1]]) == -1
  - check: assert shortest_path([[0, 1], [1, 0]]) == 2
  - check: assert shortest_path([[0, 0], [0, 0]]) == 2
  - check: assert shortest_path([[0, 0], [1, 1]]) == -1
  - check: assert shortest_path([[0, 0, 0], [1, 1, 0], [1, 1, 0]]) == 4
  - check: assert shortest_path([[0, 0, 0], [0, 1, 0], [0, 0, 0]]) == 4
  - check: assert shortest_path([[0, 1, 1], [1, 1, 0], [1, 0, 0]]) == -1
  - check: assert shortest_path([[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 0, 1], [0, 1, 0, 0]]) == 6
  - check: assert shortest_path([[0, 1, 0], [1, 1, 0], [0, 0, 0]]) == -1
big: assert shortest_path([[1 if x == 50 and y != 0 else 0 for x in range(100)] for y in range(100)]) == 150
solution: |
  def shortest_path(grid):
      n = len(grid)
      if grid[0][0] == 1 or grid[n - 1][n - 1] == 1:
          return -1
      dist = {(0, 0): 1}
      queue = [(0, 0)]
      for y, x in queue:
          if (y, x) == (n - 1, n - 1):
              return dist[(y, x)]
          for dy in (-1, 0, 1):
              for dx in (-1, 0, 1):
                  ny, nx = y + dy, x + dx
                  if 0 <= ny < n and 0 <= nx < n and grid[ny][nx] == 0 and (ny, nx) not in dist:
                      dist[(ny, nx)] = dist[(y, x)] + 1
                      queue.append((ny, nx))
      return -1
brute: |
  def shortest_path(grid):
      n = len(grid)
      INF = float("inf")
      dist = [[INF] * n for _ in range(n)]
      if grid[0][0] == 0:
          dist[0][0] = 1
      for _ in range(n * n):
          for y in range(n):
              for x in range(n):
                  if grid[y][x] == 1:
                      continue
                  for dy in (-1, 0, 1):
                      for dx in (-1, 0, 1):
                          ny, nx = y + dy, x + dx
                          if 0 <= ny < n and 0 <= nx < n and grid[ny][nx] == 0 and dist[ny][nx] + 1 < dist[y][x]:
                              dist[y][x] = dist[ny][nx] + 1
      d = dist[n - 1][n - 1]
      return -1 if d == INF else int(d)
slow:
  - |
    def shortest_path(grid):
        n = len(grid)
        INF = float("inf")
        dist = [[INF] * n for _ in range(n)]
        if grid[0][0] == 0:
            dist[0][0] = 1
        for _ in range(n * n):
            for y in range(n):
                for x in range(n):
                    if grid[y][x] == 1:
                        continue
                    for dy in (-1, 0, 1):
                        for dx in (-1, 0, 1):
                            ny, nx = y + dy, x + dx
                            if 0 <= ny < n and 0 <= nx < n and grid[ny][nx] == 0 and dist[ny][nx] + 1 < dist[y][x]:
                                dist[y][x] = dist[ny][nx] + 1
        d = dist[n - 1][n - 1]
        return -1 if d == INF else int(d)
random:
  call: shortest_path
  gen: |
    def gen(rng, size):
        n = rng.randint(1, min(max(size, 1), 6))
        grid = [[1 if rng.random() < 0.3 else 0 for _ in range(n)] for _ in range(n)]
        return (grid,)
wrong:
  - |
    def shortest_path(grid):
        n = len(grid)
        if grid[0][0] == 1 or grid[n - 1][n - 1] == 1:
            return -1
        dist = {(0, 0): 1}
        queue = [(0, 0)]
        for y, x in queue:
            if (y, x) == (n - 1, n - 1):
                return dist[(y, x)] - 1
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < n and 0 <= nx < n and grid[ny][nx] == 0 and (ny, nx) not in dist:
                        dist[(ny, nx)] = dist[(y, x)] + 1
                        queue.append((ny, nx))
        return -1
  - |
    def shortest_path(grid):
        n = len(grid)
        if grid[0][0] == 1 or grid[n - 1][n - 1] == 1:
            return -1
        dist = {(0, 0): 1}
        queue = [(0, 0)]
        for y, x in queue:
            if (y, x) == (n - 1, n - 1):
                return dist[(y, x)]
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < n and 0 <= nx < n and grid[ny][nx] == 0 and (ny, nx) not in dist:
                    dist[(ny, nx)] = dist[(y, x)] + 1
                    queue.append((ny, nx))
        return -1
  - |
    def shortest_path(grid):
        n = len(grid)
        dist = {(0, 0): 1}
        queue = [(0, 0)]
        for y, x in queue:
            if (y, x) == (n - 1, n - 1):
                return dist[(y, x)]
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < n and 0 <= nx < n and grid[ny][nx] == 0 and (ny, nx) not in dist:
                        dist[(ny, nx)] = dist[(y, x)] + 1
                        queue.append((ny, nx))
        return -1
equivalent:
  - "if grid[0][0] == 1 or grid[n - 1][n - 1] == 2:"  # why: the grid only ever holds 0 or 1, so comparing a cell to 2 is never true
  - "ny, nx = (y - dy, x + dx)"  # why: the offsets are -1, 0 and 1, so negating dy covers the same eight neighbours
  - "ny, nx = (y + dy, x - dx)"  # why: the offsets are -1, 0 and 1, so negating dx covers the same eight neighbours
---
::
