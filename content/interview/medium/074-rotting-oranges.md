---
title: Rotting Oranges
tier: medium
order: 74
leetcode: 994
url: https://leetcode.com/problems/rotting-oranges/
companies: [Amazon, Google, Meta]
topic: Breadth-first search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/09-graphs]
---

You get a grid of whole numbers with between 1 and 100 rows and between 1 and 100 columns. A 0 is an empty cell, a 1 is a fresh orange and a 2 is a rotten orange. Every minute, each fresh orange that touches a rotten orange side by side, up, down, left or right, becomes rotten. Return how many minutes pass until no fresh orange is left. If some fresh orange never becomes rotten, return -1. If there is no fresh orange at the start, return 0.

Let all rotten oranges spread at the same time, one ring of neighbours per minute. Each ring is the set of fresh oranges that were reached in the same minute. The number of rings you pass through is the answer, and any fresh orange still left at the end means -1.

::exercise
---
id: iv-medium-074
prompt: Write a function rotting_time(grid) that returns the minutes until every fresh orange is rotten, 0 if there are none to start, or -1 if some never rot.
starter: |
  # write your code below
  def rotting_time(grid):
      pass
hints:
  - Start with all rotten oranges in the first ring, then spread one ring at a time.
  - Count the rings you pass through. Stop when a ring is empty or when no fresh oranges are left.
tests:
  - check: assert rotting_time([[2, 1, 1], [1, 1, 0], [0, 1, 1]]) == 4
  - check: assert rotting_time([[2, 1, 1], [0, 1, 1], [1, 0, 1]]) == -1
  - check: assert rotting_time([[0, 2]]) == 0
  - check: assert rotting_time([[0]]) == 0
  - check: assert rotting_time([[1]]) == -1
  - check: assert rotting_time([[2]]) == 0
  - check: assert rotting_time([[1, 2]]) == 1
  - check: assert rotting_time([[2, 1, 0, 1]]) == -1
  - check: assert rotting_time([[1, 1], [1, 2]]) == 2
  - check: assert rotting_time([[2, 0, 1], [0, 0, 0]]) == -1
big: assert rotting_time([[2 if (r, c) in ((0, 0), (50, 50)) else (1 if r % 2 == 0 or c == (99 if (r // 2) % 2 == 0 else 0) else 0) for c in range(100)] for r in range(100)]) == 2475
solution: |
  def rotting_time(grid):
      fresh = set()
      frontier = []
      for r, row in enumerate(grid):
          for c, cell in enumerate(row):
              if cell == 1:
                  fresh.add((r, c))
              elif cell == 2:
                  frontier.append((r, c))
      minutes = 0
      while frontier and fresh:
          minutes += 1
          ring = []
          for y, x in frontier:
              for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                  if (ny, nx) in fresh:
                      fresh.discard((ny, nx))
                      ring.append((ny, nx))
          frontier = ring
      return -1 if fresh else minutes
brute: |
  def rotting_time(grid):
      INF = float("inf")
      dist = {}
      for r, row in enumerate(grid):
          for c, cell in enumerate(row):
              if cell == 2:
                  dist[(r, c)] = 0
              elif cell == 1:
                  dist[(r, c)] = INF
      changed = True
      while changed:
          changed = False
          for (r, c) in list(dist):
              for nb in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                  if nb in dist and dist[nb] + 1 < dist[(r, c)]:
                      dist[(r, c)] = dist[nb] + 1
                      changed = True
      times = [d for d in dist.values() if d != 0]
      if INF in times:
          return -1
      return max(times, default=0)
random:
  call: rotting_time
  gen: |
    def gen(rng, size):
        rows = rng.randint(1, 4)
        cols = rng.randint(1, 4)
        return ([[rng.choice([0, 1, 1, 2]) for _ in range(cols)] for _ in range(rows)],)
slow:
  - |
    def rotting_time(grid):
        grid = [row[:] for row in grid]
        minutes = 0
        while True:
            changed = []
            for r in range(len(grid)):
                for c in range(len(grid[r])):
                    if grid[r][c] == 1 and any(
                        0 <= r + dr < len(grid) and 0 <= c + dc < len(grid[r]) and grid[r + dr][c + dc] == 2
                        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1))
                    ):
                        changed.append((r, c))
            if not changed:
                break
            for r, c in changed:
                grid[r][c] = 2
            minutes += 1
        return -1 if any(1 in row for row in grid) else minutes
wrong:
  - |
    def rotting_time(grid):
        fresh = set()
        frontier = []
        for r, row in enumerate(grid):
            for c, cell in enumerate(row):
                if cell == 1:
                    fresh.add((r, c))
                elif cell == 2:
                    frontier.append((r, c))
        minutes = 0
        while frontier and fresh:
            minutes += 1
            ring = []
            for y, x in frontier:
                for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                    if (ny, nx) in fresh:
                        fresh.discard((ny, nx))
                        ring.append((ny, nx))
            frontier = ring
        return minutes
  - |
    def rotting_time(grid):
        fresh = set()
        frontier = []
        for r, row in enumerate(grid):
            for c, cell in enumerate(row):
                if cell == 1:
                    fresh.add((r, c))
                elif cell == 2:
                    frontier.append((r, c))
        minutes = 0
        while frontier and fresh:
            minutes += 1
            ring = []
            for y, x in frontier:
                for ny, nx in ((y + 1, x), (y, x + 1)):
                    if (ny, nx) in fresh:
                        fresh.discard((ny, nx))
                        ring.append((ny, nx))
            frontier = ring
        return -1 if fresh else minutes
  - |
    def rotting_time(grid):
        fresh = set()
        frontier = []
        for r, row in enumerate(grid):
            for c, cell in enumerate(row):
                if cell == 1:
                    fresh.add((r, c))
                elif cell == 2:
                    frontier.append((r, c))
        minutes = 0
        while frontier and fresh:
            minutes += 1
            ring = []
            for y, x in frontier:
                for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                    if (ny, nx) in fresh:
                        fresh.discard((ny, nx))
                        ring.append((ny, nx))
            frontier = ring
        return max(minutes - 1, 0) if not fresh else -1
---
::
