---
title: Pascal's Triangle
tier: easy
order: 27
leetcode: 118
url: https://leetcode.com/problems/pascals-triangle/
companies: [Amazon, Google, Meta]
topic: Dynamic programming
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a whole number num_rows from 1 to 30. Return the first num_rows rows of Pascal's triangle as a list of lists. Each row starts and ends with 1, and every other entry equals the total of the two entries in the row above that touch it diagonally, one to its upper-left and one to its upper-right.

::exercise
---
id: iv-easy-027
prompt: Write a function generate(num_rows) that returns the first num_rows rows of Pascal's triangle as a list of lists.
starter: |
  # write your code below
  def generate(num_rows):
      pass
hints:
  - Build each row from the row above it, adding each pair of neighbours.
  - The first and last number of every row is 1.
tests:
  - check: assert generate(1) == [[1]]
  - check: assert generate(2) == [[1], [1, 1]]
  - check: assert generate(3) == [[1], [1, 1], [1, 2, 1]]
  - check: assert generate(5) == [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]
  - check: assert generate(6)[5] == [1, 5, 10, 10, 5, 1]
  - check: assert generate(30)[29][14] == 77558760
solution: |
  def generate(num_rows):
      rows = []
      for r in range(num_rows):
          row = [1] * (r + 1)
          for c in range(1, r):
              row[c] = rows[r - 1][c - 1] + rows[r - 1][c]
          rows.append(row)
      return rows
brute: |
  def generate(num_rows):
      from math import comb
      return [[comb(r, c) for c in range(r + 1)] for r in range(num_rows)]
random:
  call: generate
  min_distinct: 20   # why: num_rows is 1 to 30, so there are only 30 distinct inputs and 200 random draws can miss a few of them
  gen: |
    def gen(rng, size):
        return (rng.randint(1, 30),)
wrong:
  - |
    def generate(num_rows):
        return [[1] * (r + 1) for r in range(num_rows)]
  - |
    def generate(num_rows):
        rows = []
        row = [1]
        for _ in range(num_rows - 1):
            row = [1] + [row[i] + row[i + 1] for i in range(len(row) - 1)] + [1]
            rows.append(row)
        return rows
---
::
