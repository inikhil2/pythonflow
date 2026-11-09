---
title: Flood Fill
tier: easy
order: 34
leetcode: 733
url: https://leetcode.com/problems/flood-fill/
companies: [Amazon, Google, Apple]
topic: Depth-first search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a grid, which is a list of rows, and each cell holds a whole number from 0 to 2. The grid has between 1 and 50 rows and between 1 and 50 columns, and every row has the same length. You also get a starting row sr and a starting column sc, which are valid positions in the grid, and a new color, which is a whole number from 0 to 3. Start at cell (sr, sc). Change its value to the new color, and also change every cell you can reach from it by moving up, down, left or right through cells with the same starting value. Return a new grid with those changes.

::exercise
---
id: iv-easy-034
prompt: Write a function flood_fill(image, sr, sc, color) that returns a new grid with the connected region from the start cell recoloured.
starter: |
  # write your code below
  def flood_fill(image, sr, sc, color):
      pass
hints:
  - Start from the chosen cell and visit each neighbour that shares its starting value.
  - Keep a list of cells still to visit, and recolour each cell as you add it, so you never visit one twice.
tests:
  - check: assert flood_fill([[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2) == [[2, 2, 2], [2, 2, 0], [2, 0, 1]]
  - check: assert flood_fill([[0, 0, 0], [0, 0, 0]], 0, 0, 0) == [[0, 0, 0], [0, 0, 0]]
  - check: assert flood_fill([[0, 0, 0], [0, 1, 1]], 1, 1, 1) == [[0, 0, 0], [0, 1, 1]]
  - check: assert flood_fill([[1]], 0, 0, 3) == [[3]]
  - check: assert flood_fill([[0, 1], [1, 0]], 0, 0, 2) == [[2, 1], [1, 0]]
  - check: assert flood_fill([[1, 0, 1]], 0, 0, 2) == [[2, 0, 1]]
  - check: assert flood_fill([[1, 1], [1, 0]], 0, 0, 3) == [[3, 3], [3, 0]]
solution: |
  def flood_fill(image, sr, sc, color):
      start = image[sr][sc]
      result = [row[:] for row in image]
      if start == color:
          return result
      result[sr][sc] = color
      stack = [(sr, sc)]
      while stack:
          r, c = stack.pop()
          for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
              nr, nc = r + dr, c + dc
              if 0 <= nr < len(result) and 0 <= nc < len(result[0]) and result[nr][nc] == start:
                  result[nr][nc] = color
                  stack.append((nr, nc))
      return result
brute: |
  def flood_fill(image, sr, sc, color):
      start = image[sr][sc]
      reached = {(sr, sc)}
      grow = True
      while grow:
          grow = False
          for r in range(len(image)):
              for c in range(len(image[0])):
                  if (r, c) not in reached and image[r][c] == start:
                      if any((r + dr, c + dc) in reached for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                          reached.add((r, c))
                          grow = True
      result = [row[:] for row in image]
      for r, c in reached:
          result[r][c] = color
      return result
random:
  call: flood_fill
  gen: |
    def gen(rng, size):
        rows = rng.randint(1, 4)
        cols = rng.randint(1, 4)
        grid = [[rng.randint(0, 2) for _ in range(cols)] for _ in range(rows)]
        return (grid, rng.randrange(rows), rng.randrange(cols), rng.randint(0, 3))
wrong:
  - |
    def flood_fill(image, sr, sc, color):
        result = [row[:] for row in image]
        result[sr][sc] = color
        return result
  - |
    def flood_fill(image, sr, sc, color):
        start = image[sr][sc]
        result = [row[:] for row in image]
        if start == color:
            return result
        result[sr][sc] = color
        stack = [(sr, sc)]
        while stack:
            r, c = stack.pop()
            for dr in (-1, 0, 1):
                for dc in (-1, 0, 1):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < len(result) and 0 <= nc < len(result[0]) and result[nr][nc] == start:
                        result[nr][nc] = color
                        stack.append((nr, nc))
        return result
equivalent:
  - "nr, nc = (r - dr, c + dc)"  # why: the four directions are symmetric, so flipping the sign of dr visits the same neighbours
  - "nr, nc = (r + dr, c - dc)"  # why: the four directions are symmetric, so flipping the sign of dc visits the same neighbours
  - "nr, nc = (r - dr, c - dc)"  # why: flipping both signs maps the four directions onto themselves
  - "if 0 <= nr < len(result) and 0 <= nc < len(result[-1]) and (result[nr][nc] == start):"  # why: the grid is rectangular, so the last row is as long as the first
---
::
