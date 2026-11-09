---
title: Max Area of Island
tier: medium
order: 85
leetcode: 695
url: https://leetcode.com/problems/max-area-of-island/
companies: [Meta, Amazon, Google]
topic: Depth first search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/09-graphs]
---

You get a grid of 0s and 1s. The grid has between 1 and 20 rows and between 1 and 25 columns. A 1 is land and a 0 is water.

An island is a group of land cells that touch each other up, down, left or right. Its area is the number of cells in the group. Return the largest island area in the grid, or 0 if there is no land.

::exercise
---
id: iv-medium-085
prompt: Write a function max_area_of_island(grid) that returns the area of the largest island, where islands touch only up, down, left or right, or 0 if the grid has no land.
starter: |
  # write your code below
  def max_area_of_island(grid):
      pass
hints:
  - Start from a land cell you have not counted yet, and visit every land cell that connects to it.
  - Mark each cell you visit so the same island is not counted twice.
tests:
  - check: assert max_area_of_island([[0, 0, 1, 0], [1, 1, 1, 0], [0, 1, 0, 0]]) == 5
  - check: assert max_area_of_island([[0, 0], [0, 0]]) == 0
  - check: assert max_area_of_island([[1]]) == 1
  - check: assert max_area_of_island([[1, 0, 1]]) == 1
  - check: assert max_area_of_island([[1, 1, 0], [0, 0, 0], [1, 1, 1]]) == 3
  - check: assert max_area_of_island([[1, 0], [0, 1]]) == 1
  - check: assert max_area_of_island([[1, 1], [0, 1]]) == 3
  - check: assert max_area_of_island([[1, 1, 1], [1, 0, 1], [1, 1, 1]]) == 8
  - check: assert max_area_of_island([[1, 0, 1], [1, 1, 1]]) == 5
big: assert max_area_of_island([[1 if x == 0 or x == 24 or y == 19 else 0 for x in range(25)] for y in range(20)]) == 63 and max_area_of_island([[1 if (y + x) % 2 == 0 else 0 for x in range(25)] for y in range(20)]) == 1
solution: |
  def max_area_of_island(grid):
      rows, cols = len(grid), len(grid[0])
      seen = set()
      best = 0
      for y in range(rows):
          for x in range(cols):
              if grid[y][x] == 1 and (y, x) not in seen:
                  seen.add((y, x))
                  stack = [(y, x)]
                  area = 0
                  while stack:
                      cy, cx = stack.pop()
                      area += 1
                      for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                          if 0 <= ny < rows and 0 <= nx < cols and grid[ny][nx] == 1 and (ny, nx) not in seen:
                              seen.add((ny, nx))
                              stack.append((ny, nx))
                  best = max(best, area)
      return best
brute: |
  def max_area_of_island(grid):
      rows, cols = len(grid), len(grid[0])
      seen = set()
      def area(y, x):
          if not (0 <= y < rows and 0 <= x < cols) or grid[y][x] == 0 or (y, x) in seen:
              return 0
          seen.add((y, x))
          return 1 + area(y + 1, x) + area(y - 1, x) + area(y, x + 1) + area(y, x - 1)
      return max([area(y, x) for y in range(rows) for x in range(cols)] + [0])
no_slow: "The grid holds at most 500 cells, so any flood fill finishes far inside the time limit and no slower correct method can fail big."
random:
  call: max_area_of_island
  gen: |
    def gen(rng, size):
        rows = rng.randint(1, min(size, 6) or 1)
        cols = rng.randint(1, min(size, 6) or 1)
        return ([[rng.randint(0, 1) for _ in range(cols)] for _ in range(rows)],)
wrong:
  - |
    def max_area_of_island(grid):
        rows, cols = len(grid), len(grid[0])
        seen = set()
        total = 0
        for y in range(rows):
            for x in range(cols):
                if grid[y][x] == 1 and (y, x) not in seen:
                    seen.add((y, x))
                    stack = [(y, x)]
                    while stack:
                        cy, cx = stack.pop()
                        total += 1
                        for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                            if 0 <= ny < rows and 0 <= nx < cols and grid[ny][nx] == 1 and (ny, nx) not in seen:
                                seen.add((ny, nx))
                                stack.append((ny, nx))
        return total
  - |
    def max_area_of_island(grid):
        rows, cols = len(grid), len(grid[0])
        seen = set()
        best = 0
        for y in range(rows):
            for x in range(cols):
                if grid[y][x] == 1 and (y, x) not in seen:
                    seen.add((y, x))
                    stack = [(y, x)]
                    area = 0
                    while stack:
                        cy, cx = stack.pop()
                        area += 1
                        for ny, nx in ((cy + 1, cx), (cy, cx + 1), (cy, cx - 1)):
                            if 0 <= ny < rows and 0 <= nx < cols and grid[ny][nx] == 1 and (ny, nx) not in seen:
                                seen.add((ny, nx))
                                stack.append((ny, nx))
                    best = max(best, area)
        return best
  - |
    def max_area_of_island(grid):
        best = 0
        for row in grid:
            best = max(best, sum(row))
        return best
equivalent:
  - "rows, cols = (len(grid), len(grid[-1]))"  # why: every row of the grid has the same length, so the last row gives the same column count
---
::
