---
title: Unique Paths III
tier: hard
order: 26
leetcode: 980
url: https://leetcode.com/problems/unique-paths-iii/
companies: [Google, Amazon, Meta]
topic: Backtracking
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/06-numbers, /learn/week10-algorithms/06-recursion-and-backtracking]
---

You get a grid as a list of rows. Each cell holds 1 for the start, 2 for the end, 0 for an empty square you may walk on, or -1 for a wall. There is exactly one start and exactly one end. The grid has at least 1 row and 1 column, and rows times columns is at most 20.

A walk begins at the start, moves one cell at a time up, down, left or right, never steps onto a wall, never steps onto the same cell twice, and finishes at the end. Count the walks that step on every cell that is not a wall, the start and the end included. Return that count, which is 0 if there is no such walk.

::exercise
---
id: iv-hard-026
prompt: Write a function unique_paths_iii(grid) that returns how many walks go from the 1 to the 2 and step on every non-wall cell exactly once.
starter: |
  # write your code below
  def unique_paths_iii(grid):
      pass
hints:
  - Count the cells you must visit first. A walk that reaches the 2 only counts when every other open cell has been used.
  - Mark a cell as used before you try its neighbours, and unmark it afterwards so other walks can use it.
tests:
  - check: assert unique_paths_iii([[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 2, -1]]) == 2
  - check: assert unique_paths_iii([[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 2]]) == 4
  - check: assert unique_paths_iii([[0, 1], [2, 0]]) == 0
  - check: assert unique_paths_iii([[1, 2]]) == 1
  - check: assert unique_paths_iii([[1, -1, 2]]) == 0
  - check: assert unique_paths_iii([[1], [0], [2]]) == 1
  - check: assert unique_paths_iii([[2, 0, 1]]) == 1
  - check: assert unique_paths_iii([[1, 0], [2, 0]]) == 1
  - check: assert unique_paths_iii([[1, 0, 0], [0, 0, 0], [0, 0, 2]]) == 2
  - check: assert unique_paths_iii([[1, 0, 0], [0, -1, 0], [0, 0, 2]]) == 0
  - check: assert unique_paths_iii([[1, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 2]]) == 8
  - check: assert unique_paths_iii([[1, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 2]]) == 4
solution: |
  def unique_paths_iii(grid):
      rows, cols = len(grid), len(grid[0])
      todo = 0
      for r in range(rows):
          for c in range(cols):
              if grid[r][c] == 1:
                  start = (r, c)
              if grid[r][c] != -1:
                  todo += 1
      seen = set()

      def walk(r, c, left):
          if grid[r][c] == 2:
              return 1 if left == 0 else 0
          seen.add((r, c))
          total = 0
          for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
              nr, nc = r + dr, c + dc
              if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != -1 and (nr, nc) not in seen:
                  total += walk(nr, nc, left - 1)
          seen.discard((r, c))
          return total

      return walk(start[0], start[1], todo - 1)
brute: |
  def unique_paths_iii(grid):
      cells = [(r, c) for r in range(len(grid)) for c in range(len(grid[0])) if grid[r][c] != -1]
      n = len(cells)
      start = [i for i, (r, c) in enumerate(cells) if grid[r][c] == 1][0]
      end = [i for i, (r, c) in enumerate(cells) if grid[r][c] == 2][0]
      ways = [[0] * n for _ in range(1 << n)]
      ways[1 << start][start] = 1
      for mask in range(1 << n):
          for v in range(n):
              if ways[mask][v] and v != end:
                  for w in range(n):
                      near = abs(cells[v][0] - cells[w][0]) + abs(cells[v][1] - cells[w][1]) == 1
                      if near and not mask >> w & 1:
                          ways[mask | 1 << w][w] += ways[mask][v]
      return ways[(1 << n) - 1][end]
valid: |
  def valid(grid):
      if not 1 <= len(grid) or not grid[0] or any(len(row) != len(grid[0]) for row in grid):
          return False
      if len(grid) * len(grid[0]) > 20:
          return False
      cells = [v for row in grid for v in row]
      return all(v in (-1, 0, 1, 2) for v in cells) and cells.count(1) == 1 and cells.count(2) == 1
random:
  call: unique_paths_iii
  gen: |
    def gen(rng, size):
        rows = rng.randint(1, 3)
        cols = rng.randint(max(1, 2 // rows), 3)
        cells = [(r, c) for r in range(rows) for c in range(cols)]
        grid = [[rng.choice([0, 0, -1]) for _ in range(cols)] for _ in range(rows)]
        a, b = rng.sample(cells, 2)
        grid[a[0]][a[1]] = 1
        grid[b[0]][b[1]] = 2
        return (grid,)
big: assert unique_paths_iii([[1, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [2, 0, 0, 0, 0]]) == 23
slow:
  - |
    def unique_paths_iii(grid):
        cells = [(r, c) for r in range(len(grid)) for c in range(len(grid[0])) if grid[r][c] != -1]
        n = len(cells)
        start = [i for i, (r, c) in enumerate(cells) if grid[r][c] == 1][0]
        end = [i for i, (r, c) in enumerate(cells) if grid[r][c] == 2][0]
        ways = [[0] * n for _ in range(1 << n)]
        ways[1 << start][start] = 1
        for mask in range(1 << n):
            for v in range(n):
                if ways[mask][v] and v != end:
                    for w in range(n):
                        near = abs(cells[v][0] - cells[w][0]) + abs(cells[v][1] - cells[w][1]) == 1
                        if near and not mask >> w & 1:
                            ways[mask | 1 << w][w] += ways[mask][v]
        return ways[(1 << n) - 1][end]
equivalent:
  - "rows, cols = (len(grid), len(grid[-1]))"  # why: every row has the same length, so the last row is as wide as the first
  - "nr, nc = (r - dr, c + dc)"  # why: the four directions are symmetric, so flipping the sign of dr only changes the order the neighbours are tried in, and the total is a sum
  - "nr, nc = (r + dr, c - dc)"  # why: same as above for dc; the set of neighbours is unchanged and the order does not affect the sum
wrong:
  - |
    def unique_paths_iii(grid):
        rows, cols = len(grid), len(grid[0])
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 1:
                    start = (r, c)
        seen = set()

        def walk(r, c):
            if grid[r][c] == 2:
                return 1
            seen.add((r, c))
            total = 0
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != -1 and (nr, nc) not in seen:
                    total += walk(nr, nc)
            seen.discard((r, c))
            return total

        return walk(start[0], start[1])
  - |
    def unique_paths_iii(grid):
        rows, cols = len(grid), len(grid[0])
        todo = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 1:
                    start = (r, c)
                if grid[r][c] != -1:
                    todo += 1
        seen = set()

        def walk(r, c, left):
            if grid[r][c] == 2:
                return 1 if left == 0 else 0
            seen.add((r, c))
            total = 0
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != -1 and (nr, nc) not in seen:
                    total += walk(nr, nc, left - 1)
            return total

        return walk(start[0], start[1], todo - 1)
  - |
    def unique_paths_iii(grid):
        rows, cols = len(grid), len(grid[0])
        todo = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 1:
                    start = (r, c)
                if grid[r][c] != -1:
                    todo += 1
        seen = set()

        def walk(r, c, left):
            if grid[r][c] == 2:
                return 1 if left == 0 else 0
            total = 0
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != -1 and (nr, nc) not in seen:
                    seen.add((nr, nc))
                    total += walk(nr, nc, left - 1)
                    seen.discard((nr, nc))
            return total

        return walk(start[0], start[1], todo - 1)
  - |
    def unique_paths_iii(grid):
        rows, cols = len(grid), len(grid[0])
        todo = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 1:
                    start = (r, c)
                if grid[r][c] != -1:
                    todo += 1
        seen = set()

        def walk(r, c, left):
            if grid[r][c] == 2:
                return 1 if left == 0 else 0
            seen.add((r, c))
            total = 0
            for dr, dc in ((1, 0), (0, 1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != -1 and (nr, nc) not in seen:
                    total += walk(nr, nc, left - 1)
            seen.discard((r, c))
            return total

        return walk(start[0], start[1], todo - 1)
---
::
