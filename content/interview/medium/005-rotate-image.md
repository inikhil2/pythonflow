---
title: Rotate Image
tier: medium
order: 5
leetcode: 48
url: https://leetcode.com/problems/rotate-image/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/06-numbers]
---

You get a square grid `matrix`: a list of n rows, each with n whole numbers, where 1 <= n <= 20 and every value is from -1000 to 1000. Turn the grid a quarter turn clockwise, so the first row becomes the last column, read from top to bottom. Return the turned grid.

A 1 by 1 grid stays the same. For a 2 by 2 grid, the top-left value moves to the top-right corner.

::exercise
---
id: iv-medium-005
prompt: Write a function rotate_matrix(matrix) that returns the square matrix turned 90 degrees clockwise.
starter: |
  # write your code below
  def rotate_matrix(matrix):
      pass
hints:
  - Swapping across the main diagonal turns rows into columns. Reversing each row after that finishes the turn.
  - Keep a separate result grid while you work if the in-place steps get confusing.
  - Work with the grid's cells directly: swap them in place, or copy them into a new grid.
tests:
  - check: assert rotate_matrix([[1]]) == [[1]]
  - check: assert rotate_matrix([[1, 2], [3, 4]]) == [[3, 1], [4, 2]]
  - check: assert rotate_matrix([[-1, 0], [2, -3]]) == [[2, -1], [-3, 0]]
  - check: assert rotate_matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) == [[7, 4, 1], [8, 5, 2], [9, 6, 3]]
  - check: assert rotate_matrix([[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]) == [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]
  - check: assert rotate_matrix([[-1, -2, -3], [-4, -5, -6], [-7, -8, -9]]) == [[-7, -4, -1], [-8, -5, -2], [-9, -6, -3]]
  - check: assert rotate_matrix([[0, 0, 0], [0, 9, 0], [0, 0, 0]]) == [[0, 0, 0], [0, 9, 0], [0, 0, 0]]
no_slow: "n is at most 20, so the grid has at most 400 cells and every method finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def rotate_matrix(matrix):
      n = len(matrix)
      for i in range(n):
          for j in range(i + 1, n):
              matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
      for row in matrix:
          row.reverse()
      return matrix
brute: |
  def rotate_matrix(matrix):
      n = len(matrix)
      result = [[0] * n for _ in range(n)]
      for i in range(n):
          for j in range(n):
              result[j][n - 1 - i] = matrix[i][j]
      return result
random:
  call: rotate_matrix
  gen: |
    def gen(rng, size):
        n = rng.randint(1, 8)
        return ([[rng.randint(-1000, 1000) for _ in range(n)] for _ in range(n)],)
wrong:
  - |
    def rotate_matrix(matrix):
        return [list(row) for row in zip(*matrix)][::-1]
  - |
    def rotate_matrix(matrix):
        n = len(matrix)
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        return matrix
  - |
    def rotate_matrix(matrix):
        return [row[::-1] for row in matrix]
equivalent:
  - "for j in range(i + 0, n):"  # why: j starts at i, so the swap is with itself and changes nothing
---
::
