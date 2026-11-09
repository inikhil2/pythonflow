---
title: Diagonal Traverse
tier: medium
order: 16
leetcode: 498
url: https://leetcode.com/problems/diagonal-traverse/
companies: [Meta, Google, Microsoft]
topic: Matrix
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a grid `matrix` with m rows and n columns, where 1 <= m, n <= 100 and each value is a whole number from 0 to 9. Group the cells into diagonals, where diagonal number d holds every cell whose row number plus column number equals d. Walk the diagonals in order, starting with diagonal 0, which is just the top-left cell. On an odd-numbered diagonal, list its cells from the top row down to the bottom row. On an even-numbered diagonal, list its cells from the bottom row up to the top row. Return all the values, in that order, as one list.

For example, a 3 by 3 grid with rows [1, 2, 3], [4, 5, 6], [7, 8, 9] gives [1, 2, 4, 7, 5, 3, 6, 8, 9].

::exercise
---
id: iv-medium-016
prompt: Write a function diagonal_order(matrix) that returns the values of the grid in the diagonal order described above.
starter: |
  # write your code below
  def diagonal_order(matrix):
      pass
hints:
  - For each diagonal number d, the cells are the ones where the row plus the column equals d, and the row must be between 0 and the last row.
  - Build each diagonal from the top row down, then reverse it when d is even.
tests:
  - check: assert diagonal_order([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) == [1, 2, 4, 7, 5, 3, 6, 8, 9]
  - check: assert diagonal_order([[1]]) == [1]
  - check: assert diagonal_order([[1, 2], [3, 4]]) == [1, 2, 3, 4]
  - check: assert diagonal_order([[1, 2]]) == [1, 2]
  - check: assert diagonal_order([[1], [2]]) == [1, 2]
  - check: assert diagonal_order([[1, 2, 3, 4]]) == [1, 2, 3, 4]
  - check: assert diagonal_order([[1, 2], [3, 4], [5, 6]]) == [1, 2, 3, 5, 4, 6]
  - check: assert diagonal_order([[1, 2, 3], [4, 5, 6]]) == [1, 2, 4, 5, 3, 6]
no_slow: "The grid is at most 100 by 100 cells, so every method finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def diagonal_order(matrix):
      rows, cols = len(matrix), len(matrix[0])
      result = []
      for d in range(rows + cols - 1):
          cells = []
          for r in range(rows):
              c = d - r
              if 0 <= c < cols:
                  cells.append(matrix[r][c])
          if d % 2 == 0:
              cells.reverse()
          result.extend(cells)
      return result
brute: |
  def diagonal_order(matrix):
      cells = []
      for r in range(len(matrix)):
          for c in range(len(matrix[0])):
              d = r + c
              key_row = r if d % 2 == 1 else -r
              cells.append((d, key_row, matrix[r][c]))
      cells.sort()
      return [value for _, _, value in cells]
random:
  call: diagonal_order
  gen: |
    def gen(rng, size):
        rows, cols = rng.randint(1, 4), rng.randint(1, 4)
        return ([[rng.randint(0, 9) for _ in range(cols)] for _ in range(rows)],)
wrong:
  - |
    def diagonal_order(matrix):
        rows, cols = len(matrix), len(matrix[0])
        result = []
        for d in range(rows + cols - 1):
            for r in range(rows):
                c = d - r
                if 0 <= c < cols:
                    result.append(matrix[r][c])
        return result
  - |
    def diagonal_order(matrix):
        rows, cols = len(matrix), len(matrix[0])
        result = []
        for d in range(rows + cols - 1):
            cells = []
            for r in range(rows):
                c = d - r
                if 0 <= c < cols:
                    cells.append(matrix[r][c])
            if d % 2 == 1:
                cells.reverse()
            result.extend(cells)
        return result
  - |
    def diagonal_order(matrix):
        rows, cols = len(matrix), len(matrix[0])
        result = []
        for d in range(rows + cols - 1):
            cells = []
            for r in range(rows):
                c = d - r
                if 0 <= c < cols:
                    cells.append(matrix[r][c])
                    cells.reverse()
            result.extend(cells)
        return result
equivalent:
  - "for d in range(rows + cols + 1):"  # why: the largest row plus column is rows + cols - 2, so the extra diagonals are empty and add nothing
  - "for d in range(rows + cols - 0):"  # why: diagonal rows + cols - 1 is past the last cell (row rows - 1, column cols - 1), so the extra pass adds nothing
  - "rows, cols = (len(matrix), len(matrix[-1]))"  # why: the grid is rectangular, so the last row has the same length as the first
---
::
