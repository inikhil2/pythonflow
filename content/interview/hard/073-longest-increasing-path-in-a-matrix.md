---
title: Longest Increasing Path in a Matrix
tier: hard
order: 73
leetcode: 329
url: https://leetcode.com/problems/longest-increasing-path-in-a-matrix/
companies: [Google, Meta, Amazon]
topic: Dynamic programming
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/09-graphs, /learn/week10-algorithms/10-dynamic-programming]
---

You get a grid of whole numbers with between 1 and 200 rows and between 1 and 200 columns. Each value is from 0 to 1000000000. A path moves from a cell to one of its four neighbours (up, down, left or right), and it may not visit the same cell twice. A path is increasing when each value is strictly larger than the one before it.

Return the number of cells in the longest increasing path. A single cell counts as a path of length 1. Equal neighbours do not extend a path. Note that a grid of 40000 cells can have a path through almost all of them, so a method that tries every path one cell at a time would take far too long, and a method that calls itself once per cell can run out of room. A simpler order of work helps: handle the cells from the largest value down, since a cell's answer only depends on neighbours with larger values.

::exercise
---
id: iv-hard-073
prompt: Write a function longest_increasing_path(matrix) that returns the number of cells in the longest strictly increasing path through the grid, moving up, down, left or right.
starter: |
  # write your code below
  def longest_increasing_path(matrix):
      pass
hints:
  - A cell's best path is one more than the best path from a neighbour with a larger value, so work from the largest value down.
  - Sort the cells by value once, then fill in a table of answers in that order.
tests:
  - check: assert longest_increasing_path([[9, 9, 4], [6, 6, 8], [2, 1, 1]]) == 4
  - check: assert longest_increasing_path([[3, 4, 5], [3, 2, 6], [2, 2, 1]]) == 4
  - check: assert longest_increasing_path([[1]]) == 1
  - check: assert longest_increasing_path([[1, 2], [4, 3]]) == 4
  - check: assert longest_increasing_path([[7, 7], [7, 7]]) == 1
  - check: assert longest_increasing_path([[1, 2, 3]]) == 3
  - check: assert longest_increasing_path([[3], [2], [1]]) == 3
  - check: assert longest_increasing_path([[0, 0, 0], [0, 1, 0]]) == 2
  - check: assert longest_increasing_path([[5, 1], [2, 4]]) == 3
big: assert (lambda g: longest_increasing_path(g) == 40000)([[r * 200 + (c if r % 2 == 0 else 199 - c) for c in range(200)] for r in range(200)]) and longest_increasing_path([[r * 200 + c for c in range(200)] for r in range(200)]) == 399
solution: |
  def longest_increasing_path(matrix):
      m, n = len(matrix), len(matrix[0])
      cells = sorted(((matrix[r][c], r, c) for r in range(m) for c in range(n)), reverse=True)
      best = [[1] * n for _ in range(m)]
      for v, r, c in cells:
          for dr, dc in ((0, 1), (0, -1), (1, 0), (-1, 0)):
              nr, nc = r + dr, c + dc
              if 0 <= nr < m and 0 <= nc < n and matrix[nr][nc] > v:
                  best[r][c] = max(best[r][c], best[nr][nc] + 1)
      return max(max(row) for row in best)
brute: |
  def longest_increasing_path(matrix):
      m, n = len(matrix), len(matrix[0])
      def walk(r, c):
          best = 1
          for dr, dc in ((0, 1), (0, -1), (1, 0), (-1, 0)):
              nr, nc = r + dr, c + dc
              if 0 <= nr < m and 0 <= nc < n and matrix[nr][nc] > matrix[r][c]:
                  best = max(best, 1 + walk(nr, nc))
          return best
      return max(walk(r, c) for r in range(m) for c in range(n))
random:
  call: longest_increasing_path
  gen: |
    def gen(rng, size):
        m = rng.randint(1, min(max(size, 1), 4))
        n = rng.randint(1, min(max(size, 1), 4))
        return ([[rng.randint(0, 4) for _ in range(n)] for _ in range(m)],)
slow:
  - |
    def longest_increasing_path(matrix):
        m, n = len(matrix), len(matrix[0])
        best = [[1] * n for _ in range(m)]
        changed = True
        while changed:
            changed = False
            for r in range(m):
                for c in range(n):
                    for dr, dc in ((0, 1), (0, -1), (1, 0), (-1, 0)):
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < m and 0 <= nc < n and matrix[nr][nc] > matrix[r][c] and best[nr][nc] + 1 > best[r][c]:
                            best[r][c] = best[nr][nc] + 1
                            changed = True
        return max(max(row) for row in best)
wrong:
  - |
    def longest_increasing_path(matrix):
        m, n = len(matrix), len(matrix[0])
        cells = sorted(((matrix[r][c], r, c) for r in range(m) for c in range(n)), reverse=True)
        best = [[1] * n for _ in range(m)]
        for v, r, c in cells:
            for dr, dc in ((0, 1), (1, 0)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and matrix[nr][nc] > v:
                    best[r][c] = max(best[r][c], best[nr][nc] + 1)
        return max(max(row) for row in best)
  - |
    def longest_increasing_path(matrix):
        m, n = len(matrix), len(matrix[0])
        cells = sorted(((matrix[r][c], r, c) for r in range(m) for c in range(n)), reverse=True)
        best = [[1] * n for _ in range(m)]
        for v, r, c in cells:
            for dr, dc in ((0, 1), (0, -1), (1, 0), (-1, 0)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and matrix[nr][nc] >= v:
                    best[r][c] = max(best[r][c], best[nr][nc] + 1)
        return max(max(row) for row in best)
  - |
    def longest_increasing_path(matrix):
        m, n = len(matrix), len(matrix[0])
        cells = sorted(((matrix[r][c], r, c) for r in range(m) for c in range(n)), reverse=True)
        best = [[1] * n for _ in range(m)]
        for v, r, c in cells:
            for dr, dc in ((0, 1), (0, -1), (1, 0), (-1, 0)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and matrix[nr][nc] > v:
                    best[r][c] = max(best[r][c], best[nr][nc] + 1)
        return best[0][0]
equivalent: []
---
::
