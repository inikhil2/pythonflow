---
title: Making A Large Island
tier: hard
order: 55
leetcode: 827
url: https://leetcode.com/problems/making-a-large-island/
companies: [Google, Amazon, Meta]
topic: Depth-First Search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/02-stacks-and-queues]
---

You are given an n by n grid of 0s and 1s, where n is from 1 to 50. A 1 is land and a 0 is water. An island is a group of land cells joined up, down, left or right. You may change at most one water cell to land.

Return the size of the largest island you can have after that change. If the grid already has no water, the answer is the total number of cells, and if the grid has no land at all, changing one cell gives an island of size 1. The fast way is to label each existing island once, store its size, and for each water cell add up the sizes of the distinct islands it touches. Trying each change and recounting the whole grid is correct but far too slow at the largest size.

::exercise
---
id: iv-hard-055
prompt: Write a function largest_island(grid) that returns the largest possible island size after changing at most one 0 to 1 in the square grid, where islands are connected by up, down, left or right moves.
starter: |
  # write your code below
  def largest_island(grid):
      pass
hints:
  - Label every island with a number in one pass, remembering its size. Then each water cell can be scored from the labels of the land cells around it.
  - When you score a water cell, count each neighbouring island only once even if two of its sides touch that cell. Add one for the water cell itself.
tests:
  - check: assert largest_island([[1, 0], [0, 1]]) == 3
  - check: assert largest_island([[1, 1], [1, 1]]) == 4
  - check: assert largest_island([[0]]) == 1
  - check: assert largest_island([[1]]) == 1
  - check: assert largest_island([[0, 0], [0, 0]]) == 1
  - check: assert largest_island([[1, 0], [1, 1]]) == 4
  - check: assert largest_island([[1, 0, 1], [0, 0, 0], [1, 0, 1]]) == 3
  - check: assert largest_island([[1, 1, 0], [0, 0, 0], [1, 0, 0]]) == 4
  - check: assert largest_island([[0, 1, 0], [1, 0, 1], [0, 1, 0]]) == 5
  - check: assert largest_island([[1, 0, 1], [1, 1, 1], [0, 0, 0]]) == 6
  - check: assert largest_island([[1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 1, 1], [0, 0, 0, 0]]) == 9
  - check: assert largest_island([[0, 0, 0, 0], [0, 0, 0, 1], [1, 0, 1, 0], [1, 1, 1, 0]]) == 7
solution: |
  def largest_island(grid):
      n = len(grid)
      label = [[-1] * n for _ in range(n)]
      sizes = []
      for r in range(n):
          for c in range(n):
              if grid[r][c] == 1 and label[r][c] == -1:
                  k = len(sizes)
                  label[r][c] = k
                  stack = [(r, c)]
                  size = 0
                  while stack:
                      y, x = stack.pop()
                      size += 1
                      for y2, x2 in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                          if 0 <= y2 < n and 0 <= x2 < n and grid[y2][x2] == 1 and label[y2][x2] == -1:
                              label[y2][x2] = k
                              stack.append((y2, x2))
                  sizes.append(size)
      best = max(sizes, default=0)
      for r in range(n):
          for c in range(n):
              if grid[r][c] == 0:
                  seen = set()
                  for y, x in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                      if 0 <= y < n and 0 <= x < n and label[y][x] != -1:
                          seen.add(label[y][x])
                  best = max(best, 1 + sum(sizes[k] for k in seen))
      return best
equivalent:
  - 20: "best = max(sizes, default=1)"   # why: sizes is empty only when there is no land, and then every water cell scores 1, so the loop's result is 1 either way
  - 20: "best = max(sizes, default=-1)"   # why: with no land the initial -1 is replaced by 1 from the water-cell loop, which always runs since n >= 1
  - 20: "best = min(sizes, default=0)"   # why: with two or more islands the largest one borders some water, so the water-cell loop reaches it and the final max is unchanged; with one island min equals max
slow:
  - |
    def largest_island(grid):
        n = len(grid)

        def area(g):
            seen = [[False] * n for _ in range(n)]
            best = 0
            for r in range(n):
                for c in range(n):
                    if g[r][c] == 1 and not seen[r][c]:
                        stack = [(r, c)]
                        seen[r][c] = True
                        size = 0
                        while stack:
                            y, x = stack.pop()
                            size += 1
                            for y2, x2 in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                                if 0 <= y2 < n and 0 <= x2 < n and g[y2][x2] == 1 and not seen[y2][x2]:
                                    seen[y2][x2] = True
                                    stack.append((y2, x2))
                        best = max(best, size)
            return best

        best = area(grid)
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 0:
                    grid[r][c] = 1
                    best = max(best, area(grid))
                    grid[r][c] = 0
        return best
brute: |
  def largest_island(grid):
      n = len(grid)

      def area(g):
          seen = [[False] * n for _ in range(n)]
          best = 0
          for r in range(n):
              for c in range(n):
                  if g[r][c] == 1 and not seen[r][c]:
                      stack = [(r, c)]
                      seen[r][c] = True
                      size = 0
                      while stack:
                          y, x = stack.pop()
                          size += 1
                          for y2, x2 in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                              if 0 <= y2 < n and 0 <= x2 < n and g[y2][x2] == 1 and not seen[y2][x2]:
                                  seen[y2][x2] = True
                                  stack.append((y2, x2))
                      best = max(best, size)
          return best

      best = area(grid)
      for r in range(n):
          for c in range(n):
              if grid[r][c] == 0:
                  grid[r][c] = 1
                  best = max(best, area(grid))
                  grid[r][c] = 0
      return best
big: 'assert largest_island([[1 if (r * 7 + c * 3) % 5 else 0 for c in range(50)] for r in range(50)]) == 381'
random:
  call: largest_island
  gen: |
    def gen(rng, size):
        n = rng.randint(1, 3)
        return ([[rng.randint(0, 1) for _ in range(n)] for _ in range(n)],)
wrong:
  - |
    def largest_island(grid):
        n = len(grid)
        label = [[-1] * n for _ in range(n)]
        sizes = []
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 1 and label[r][c] == -1:
                    k = len(sizes)
                    label[r][c] = k
                    stack = [(r, c)]
                    size = 0
                    while stack:
                        y, x = stack.pop()
                        size += 1
                        for y2, x2 in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                            if 0 <= y2 < n and 0 <= x2 < n and grid[y2][x2] == 1 and label[y2][x2] == -1:
                                label[y2][x2] = k
                                stack.append((y2, x2))
                    sizes.append(size)
        best = max(sizes, default=0)
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 0:
                    seen = set()
                    for y, x in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                        if 0 <= y < n and 0 <= x < n and label[y][x] != -1:
                            seen.add(label[y][x])
                    best = max(best, sum(sizes[k] for k in seen))
        return best
  - |
    def largest_island(grid):
        n = len(grid)
        label = [[-1] * n for _ in range(n)]
        sizes = []
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 1 and label[r][c] == -1:
                    k = len(sizes)
                    label[r][c] = k
                    stack = [(r, c)]
                    size = 0
                    while stack:
                        y, x = stack.pop()
                        size += 1
                        for y2, x2 in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                            if 0 <= y2 < n and 0 <= x2 < n and grid[y2][x2] == 1 and label[y2][x2] == -1:
                                label[y2][x2] = k
                                stack.append((y2, x2))
                    sizes.append(size)
        best = max(sizes, default=0)
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 0:
                    total = 1
                    for y, x in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                        if 0 <= y < n and 0 <= x < n and label[y][x] != -1:
                            total += sizes[label[y][x]]
                    best = max(best, total)
        return best
  - |
    def largest_island(grid):
        n = len(grid)
        best = 0
        stack = [(r, c) for r in range(n) for c in range(n) if grid[r][c] == 1]
        seen = set(stack)
        while stack:
            y, x = stack.pop()
            best += 1
            for y2, x2 in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= y2 < n and 0 <= x2 < n and grid[y2][x2] == 1 and (y2, x2) not in seen:
                    seen.add((y2, x2))
                    stack.append((y2, x2))
        return best
---
::
