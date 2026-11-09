---
title: Set Matrix Zeroes
tier: medium
order: 31
leetcode: 73
url: https://leetcode.com/problems/set-matrix-zeroes/
companies: [Amazon, Meta, Google]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a grid `matrix` with m rows and n columns, where 1 <= m, n <= 200. Each value is a whole number from -1000 to 1000. For every cell that holds a 0 in the original grid, every value in its row and every value in its column must become 0. Cells that are not in such a row or column keep their value.

Work from the original grid. A new 0 must not cause more zeros to appear: a row or column is cleared only when it holds a 0 in the original grid. Return the new grid, and leave the grid you were given unchanged.

For example, [[1, 1, 1], [1, 0, 1], [1, 1, 1]] becomes [[1, 0, 1], [0, 0, 0], [1, 0, 1]].

::exercise
---
id: iv-medium-031
prompt: Write a function set_zeroes(matrix) that returns a new grid where every row and column that held a 0 in matrix is cleared to 0.
starter: |
  # write your code below
  def set_zeroes(matrix):
      pass
hints:
  - First find which rows and which columns hold a 0, and keep them in two sets.
  - Then build the new grid, setting a cell to 0 when its row or its column is in one of the sets.
tests:
  - check: assert set_zeroes([[1, 1, 1], [1, 0, 1], [1, 1, 1]]) == [[1, 0, 1], [0, 0, 0], [1, 0, 1]]
  - check: assert set_zeroes([[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]) == [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]
  - check: assert set_zeroes([[1]]) == [[1]]
  - check: assert set_zeroes([[0]]) == [[0]]
  - check: assert set_zeroes([[1, 2], [3, 4]]) == [[1, 2], [3, 4]]
  - check: assert set_zeroes([[5, 0]]) == [[0, 0]]
  - check: assert set_zeroes([[1], [0]]) == [[0], [0]]
  - check: assert set_zeroes([[2, 3, 4], [5, 0, 7], [8, 9, 10]]) == [[2, 0, 4], [0, 0, 0], [8, 0, 10]]
big: 'assert __import__("hashlib").sha256(str(set_zeroes([[0 if (i * 200 + j) in {(k * 7919) % 40000 for k in range(8)} else (i * 31 + j * 17) % 9 + 1 for j in range(200)] for i in range(200)])).encode()).hexdigest() == "7fd0fa9f98df5c39755f9185a2afb3fa0573b64d403dcb71bd1f3808d54a81a4"'
slow:
  - |
    def set_zeroes(matrix):
        rows, cols = len(matrix), len(matrix[0])
        result = [row[:] for row in matrix]
        for r in range(rows):
            for c in range(cols):
                for k in range(rows):
                    for m in range(cols):
                        if matrix[k][m] == 0 and (k == r or m == c):
                            result[r][c] = 0
        return result
solution: |
  def set_zeroes(matrix):
      zero_rows = set()
      zero_cols = set()
      for r, row in enumerate(matrix):
          for c, v in enumerate(row):
              if v == 0:
                  zero_rows.add(r)
                  zero_cols.add(c)
      return [
          [0 if (r in zero_rows or c in zero_cols) else v for c, v in enumerate(row)]
          for r, row in enumerate(matrix)
      ]
brute: |
  def set_zeroes(matrix):
      rows, cols = len(matrix), len(matrix[0])
      result = [row[:] for row in matrix]
      for r in range(rows):
          for c in range(cols):
              if matrix[r][c] == 0:
                  for k in range(cols):
                      result[r][k] = 0
                  for k in range(rows):
                      result[k][c] = 0
      return result
random:
  call: set_zeroes
  gen: |
    def gen(rng, size):
        rows, cols = rng.randint(1, 4), rng.randint(1, 4)
        return ([[rng.choice([0, 1, 2, 3]) for _ in range(cols)] for _ in range(rows)],)
wrong:
  - |
    def set_zeroes(matrix):
        zero_rows = set()
        for r, row in enumerate(matrix):
            for c, v in enumerate(row):
                if v == 0:
                    zero_rows.add(r)
        return [
            [0 if r in zero_rows else v for v in row]
            for r, row in enumerate(matrix)
        ]
  - |
    def set_zeroes(matrix):
        grid = [row[:] for row in matrix]
        for r, row in enumerate(grid):
            for c, v in enumerate(row):
                if v == 0:
                    for k in range(len(row)):
                        grid[r][k] = 0
                    for k in range(len(grid)):
                        grid[k][c] = 0
        return grid
  - |
    def set_zeroes(matrix):
        zero_rows = set()
        zero_cols = set()
        for r, row in enumerate(matrix):
            for c, v in enumerate(row):
                if v == 0:
                    zero_rows.add(r)
                    zero_cols.add(c)
        return [
            [0 if (r in zero_rows and c in zero_cols) else v for c, v in enumerate(row)]
            for r, row in enumerate(matrix)
        ]
---
::
