---
title: Island Perimeter
tier: easy
order: 42
leetcode: 463
url: https://leetcode.com/problems/island-perimeter/
companies: [Amazon, Meta, Google]
topic: Depth-first search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a grid as a list of rows, and every row has the same length. Each row is a list of 0s and 1s, where 1 is land and 0 is water. The grid has between 1 and 50 rows and between 1 and 50 columns, and at least one cell is land. The land forms exactly one island, which is connected. Count the sides of land cells that touch water or the edge of the grid. Return that count.

::exercise
---
id: iv-easy-042
prompt: Write a function island_perimeter(grid) that returns the perimeter of the one island of 1s in grid.
starter: |
  # write your code below
  def island_perimeter(grid):
      pass
hints:
  - Give each land cell four sides, then take off one side for every neighbour that is also land.
  - Two touching land cells each lose a side, so count each touching pair once.
tests:
  - check: assert island_perimeter([[1]]) == 4
  - check: assert island_perimeter([[1, 0]]) == 4
  - check: assert island_perimeter([[1, 1], [1, 1]]) == 8
  - check: assert island_perimeter([[1], [1]]) == 6
  - check: assert island_perimeter([[1, 1, 1]]) == 8
  - check: assert island_perimeter([[0, 1, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [1, 1, 0, 0]]) == 16
solution: |
  def island_perimeter(grid):
      land = 0
      touching = 0
      for r, row in enumerate(grid):
          for c, cell in enumerate(row):
              if cell == 1:
                  land += 1
                  if r + 1 < len(grid) and grid[r + 1][c] == 1:
                      touching += 1
                  if c + 1 < len(row) and row[c + 1] == 1:
                      touching += 1
      return 4 * land - 2 * touching
brute: |
  def island_perimeter(grid):
      total = 0
      for r in range(len(grid)):
          for c in range(len(grid[0])):
              if grid[r][c] == 1:
                  for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                      nr, nc = r + dr, c + dc
                      if not (0 <= nr < len(grid) and 0 <= nc < len(grid[0])) or grid[nr][nc] == 0:
                          total += 1
      return total
random:
  call: island_perimeter
  gen: |
    def gen(rng, size):
        rows, cols = rng.randint(1, 4), rng.randint(1, 4)
        land = {(rng.randrange(rows), rng.randrange(cols))}
        for _ in range(rng.randint(0, rows * cols - 1)):
            r, c = rng.choice(sorted(land))
            dr, dc = rng.choice(((1, 0), (-1, 0), (0, 1), (0, -1)))
            if 0 <= r + dr < rows and 0 <= c + dc < cols:
                land.add((r + dr, c + dc))
        return ([[1 if (r, c) in land else 0 for c in range(cols)] for r in range(rows)],)
wrong:
  - |
    def island_perimeter(grid):
        land = sum(sum(row) for row in grid)
        return 4 * land
  - |
    def island_perimeter(grid):
        land = 0
        touching = 0
        for r in range(len(grid)):
            for c in range(len(grid[0])):
                if grid[r][c] == 1:
                    land += 1
                    if c + 1 < len(grid[0]) and grid[r][c + 1] == 1:
                        touching += 1
        return 4 * land - 2 * touching
---
::
