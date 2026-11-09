---
title: Number of Islands
tier: medium
order: 71
leetcode: 200
url: https://leetcode.com/problems/number-of-islands/
companies: [Amazon, Google, Meta]
topic: Depth-first search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/09-graphs]
---

You get a grid, given as a list of rows, where each cell is the text "1" for land or "0" for water. The grid has between 0 and 200 rows and between 1 and 200 columns. Two land cells belong to the same island when they touch side by side, up, down, left or right. Count the islands. A grid with no rows has no islands.

Walk from one land cell to every land cell you can reach by side steps, and mark each one as seen. Each walk covers exactly one island, so the number of walks you start is the answer. Keep a set of seen cells so no cell is walked twice.

::exercise
---
id: iv-medium-071
prompt: Write a function count_islands(grid) that returns how many islands the grid of "1" and "0" cells contains.
starter: |
  # write your code below
  def count_islands(grid):
      pass
hints:
  - Scan every cell. When you find land that is not seen yet, you have found a new island.
  - From that cell, visit every land cell you can reach by up, down, left and right steps. A stack or a queue works, and it avoids deep recursion.
tests:
  - check: assert count_islands([["1", "1", "0"], ["0", "1", "0"], ["1", "0", "1"]]) == 3
  - check: assert count_islands([]) == 0
  - check: assert count_islands([["0"]]) == 0
  - check: assert count_islands([["1"]]) == 1
  - check: assert count_islands([["1", "0"], ["0", "1"]]) == 2
  - check: assert count_islands([["1", "0", "1"], ["1", "1", "1"]]) == 1
  - check: assert count_islands([["1"], ["1"]]) == 1
  - check: assert count_islands([["1", "1"], ["1", "1"]]) == 1
  - check: assert count_islands([["1", "0"], ["0", "0"], ["1", "1"]]) == 2
  - check: assert count_islands([["1", "0", "1"], ["0", "0", "0"], ["1", "1", "1"]]) == 3
  - check: assert count_islands([["1", "0", "1"], ["0", "0", "1"], ["1", "0", "1"]]) == 3
big: assert count_islands([["1"] * 200 for _ in range(100)]) == 1
solution: |
  def count_islands(grid):
      rows = len(grid)
      cols = len(grid[0]) if rows else 0
      seen = set()
      count = 0
      for r in range(rows):
          for c in range(cols):
              if grid[r][c] != "1" or (r, c) in seen:
                  continue
              count += 1
              seen.add((r, c))
              stack = [(r, c)]
              while stack:
                  y, x = stack.pop()
                  for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                      if 0 <= ny < rows and 0 <= nx < cols and grid[ny][nx] == "1" and (ny, nx) not in seen:
                          seen.add((ny, nx))
                          stack.append((ny, nx))
      return count
brute: |
  def count_islands(grid):
      labels = {}
      for r, row in enumerate(grid):
          for c, cell in enumerate(row):
              if cell == "1":
                  labels[(r, c)] = (r, c)
      changed = True
      while changed:
          changed = False
          for (r, c) in list(labels):
              for nb in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                  if nb in labels and labels[nb] < labels[(r, c)]:
                      labels[(r, c)] = labels[nb]
                      changed = True
      return len(set(labels.values()))
random:
  call: count_islands
  gen: |
    def gen(rng, size):
        rows = rng.randint(1, 4)
        cols = rng.randint(1, 4)
        return ([["1" if rng.random() < 0.5 else "0" for _ in range(cols)] for _ in range(rows)],)
slow:
  - |
    def count_islands(grid):
        rows = len(grid)
        cols = len(grid[0]) if rows else 0
        count = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] != "1":
                    continue
                seen = {(r, c)}
                stack = [(r, c)]
                first = True
                while stack:
                    y, x = stack.pop()
                    if (y, x) < (r, c):
                        first = False
                    for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                        if 0 <= ny < rows and 0 <= nx < cols and grid[ny][nx] == "1" and (ny, nx) not in seen:
                            seen.add((ny, nx))
                            stack.append((ny, nx))
                if first:
                    count += 1
        return count
wrong:
  - |
    def count_islands(grid):
        return sum(row.count("1") for row in grid)
  - |
    def count_islands(grid):
        count = 0
        for r in range(len(grid)):
            for c in range(len(grid[r])):
                if grid[r][c] == "1" and (r == 0 or grid[r - 1][c] != "1") and (c == 0 or grid[r][c - 1] != "1"):
                    count += 1
        return count
  - |
    def count_islands(grid):
        rows = len(grid)
        cols = len(grid[0]) if rows else 0
        seen = set()
        count = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] != "1" or (r, c) in seen:
                    continue
                count += 1
                seen.add((r, c))
                stack = [(r, c)]
                while stack:
                    y, x = stack.pop()
                    for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                        if 0 <= ny < rows - 1 and 0 <= nx < cols and grid[ny][nx] == "1" and (ny, nx) not in seen:
                            seen.add((ny, nx))
                            stack.append((ny, nx))
        return count
equivalent:
  - "cols = len(grid[-1]) if rows else 0"   # why: the grid is rectangular, so the last row has the same width as the first and the width read is identical
  - "cols = len(grid[0]) if rows else 1"   # why: with no rows the row loop never runs, so cols is never used and the default value does not change the answer
  - "cols = len(grid[0]) if rows else -1"   # why: same as above: with no rows the column loop never runs, so the default value is never read
---
::
