---
title: Spiral Matrix
tier: medium
order: 7
leetcode: 54
url: https://leetcode.com/problems/spiral-matrix/
companies: [Google, Amazon, Microsoft]
topic: Matrix
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a grid `matrix` with m rows and n columns, where 1 <= m, n <= 10 and each value is from -100 to 100. Walk the grid in a spiral: start at the top-left cell, go right along the top row, then down the right column, then left along the bottom row, then up the left column. Then turn inward and keep going until every cell has been visited. Return the values in the order you visit them, as one flat list.

A grid with one row or one column is a special case of the same walk. Each inner ring of the grid is a smaller version of the outer one, so a loop that shrinks the boundaries on each lap is a clean way to go.

::exercise
---
id: iv-medium-007
prompt: Write a function spiral_order(matrix) that returns every value of the grid in clockwise spiral order, starting at the top-left, as a flat list.
starter: |
  # write your code below
  def spiral_order(matrix):
      pass
hints:
  - Keep four boundaries: top, bottom, left and right. After each side is walked, move that boundary inward.
  - Check the boundaries again before walking the bottom row and the left column, because a single row or column would walk those cells twice.
tests:
  - check: assert spiral_order([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) == [1, 2, 3, 6, 9, 8, 7, 4, 5]
  - check: assert spiral_order([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]) == [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
  - check: assert spiral_order([[1]]) == [1]
  - check: assert spiral_order([[1, 2, 3]]) == [1, 2, 3]
  - check: assert spiral_order([[1], [2], [3]]) == [1, 2, 3]
  - check: assert spiral_order([[1, 2], [3, 4]]) == [1, 2, 4, 3]
  - check: assert spiral_order([[1, 2, 3], [4, 5, 6]]) == [1, 2, 3, 6, 5, 4]
  - check: assert spiral_order([[-5, 0, 7]]) == [-5, 0, 7]
no_slow: "The grid has at most 100 cells, so every method finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def spiral_order(matrix):
      result = []
      top, bottom = 0, len(matrix) - 1
      left, right = 0, len(matrix[0]) - 1
      while top <= bottom and left <= right:
          for c in range(left, right + 1):
              result.append(matrix[top][c])
          top += 1
          for r in range(top, bottom + 1):
              result.append(matrix[r][right])
          right -= 1
          if top <= bottom:
              for c in range(right, left - 1, -1):
                  result.append(matrix[bottom][c])
              bottom -= 1
          if left <= right:
              for r in range(bottom, top - 1, -1):
                  result.append(matrix[r][left])
              left += 1
      return result
brute: |
  def spiral_order(matrix):
      m, n = len(matrix), len(matrix[0])
      seen = [[False] * n for _ in range(m)]
      steps = [(0, 1), (1, 0), (0, -1), (-1, 0)]
      r = c = d = 0
      result = []
      for _ in range(m * n):
          result.append(matrix[r][c])
          seen[r][c] = True
          nr, nc = r + steps[d][0], c + steps[d][1]
          if not (0 <= nr < m and 0 <= nc < n and not seen[nr][nc]):
              d = (d + 1) % 4
              nr, nc = r + steps[d][0], c + steps[d][1]
          r, c = nr, nc
      return result
random:
  call: spiral_order
  gen: |
    def gen(rng, size):
        m, n = rng.randint(1, 10), rng.randint(1, 10)
        return ([[rng.randint(-100, 100) for _ in range(n)] for _ in range(m)],)
wrong:
  - |
    def spiral_order(matrix):
        return [x for row in matrix for x in row]
  - |
    def spiral_order(matrix):
        result = []
        top, bottom = 0, len(matrix) - 1
        left, right = 0, len(matrix[0]) - 1
        while top <= bottom and left <= right:
            for c in range(left, right + 1):
                result.append(matrix[top][c])
            top += 1
            for r in range(top, bottom + 1):
                result.append(matrix[r][right])
            right -= 1
            for c in range(right, left - 1, -1):
                result.append(matrix[bottom][c])
            bottom -= 1
            for r in range(bottom, top - 1, -1):
                result.append(matrix[r][left])
            left += 1
        return result
  - |
    def spiral_order(matrix):
        result = []
        top, bottom = 0, len(matrix) - 1
        left, right = 0, len(matrix[0]) - 1
        if top <= bottom and left <= right:
            for c in range(left, right + 1):
                result.append(matrix[top][c])
            top += 1
            for r in range(top, bottom + 1):
                result.append(matrix[r][right])
            right -= 1
            for c in range(right, left - 1, -1):
                result.append(matrix[bottom][c])
            for r in range(bottom - 1, top - 1, -1):
                result.append(matrix[r][left])
        return result
equivalent:
  - "left, right = (0, len(matrix[-1]) - 1)"  # why: every row has the same length, so matrix[-1] and matrix[0] give the same width
---
::
