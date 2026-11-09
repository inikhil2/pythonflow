---
title: Shortest Path in a Grid with Obstacles Elimination
tier: hard
order: 54
leetcode: 1293
url: https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/
companies: [Google, Amazon, Meta]
topic: Breadth-First Search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/02-stacks-and-queues]
---

You are given a grid of 0s and 1s, from 1 to 40 rows and 1 to 40 columns. A 0 is an open cell and a 1 is an obstacle. The top-left and bottom-right cells are open. You start at the top-left and want to reach the bottom-right, moving one cell at a time up, down, left or right. You may remove up to `k` obstacles along the way, where `k` is from 0 to 40.

Return the fewest moves needed, or -1 if the bottom-right cell cannot be reached. If the grid is a single cell, the answer is 0. Because a path can cross the same cell more than once with different numbers of removed obstacles, keep the number of obstacles removed as part of what you remember about a position.

::exercise
---
id: iv-hard-054
prompt: Write a function shortest_path(grid, k) that returns the fewest moves from the top-left to the bottom-right of grid, moving up, down, left or right, when up to k obstacles (1s) may be removed, or -1 if it is impossible.
starter: |
  # write your code below
  def shortest_path(grid, k):
      pass
hints:
  - Search over states (row, column, obstacles removed so far). Moving onto a 1 adds one to the count, and a move is allowed only while the count stays at most k.
  - Search level by level with a queue, and record each state the first time you reach it, so the first time you pop the bottom-right cell gives the fewest moves.
tests:
  - check: assert shortest_path([[0]], 0) == 0
  - check: assert shortest_path([[0, 0], [0, 0]], 0) == 2
  - check: assert shortest_path([[0, 1], [1, 0]], 0) == -1
  - check: assert shortest_path([[0, 1], [1, 0]], 1) == 2
  - check: assert shortest_path([[0, 1], [0, 0]], 0) == 2
  - check: assert shortest_path([[0, 1, 0], [0, 1, 0], [0, 0, 0]], 0) == 4
  - check: assert shortest_path([[0, 0, 0], [1, 1, 0], [0, 0, 0]], 0) == 4
  - check: assert shortest_path([[0, 1, 1], [1, 1, 1], [1, 1, 0]], 2) == -1
  - check: assert shortest_path([[0, 1, 1], [1, 1, 1], [1, 1, 0]], 3) == 4
  - check: assert shortest_path([[0, 1, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0]], 1) == 5
  - check: assert shortest_path([[0, 0, 1], [1, 0, 1]], 1) == 3
  - check: assert shortest_path([[0, 1, 0, 0], [0, 0, 1, 0]], 0) == -1
  - check: assert shortest_path([[0], [0], [0]], 0) == 2
  - check: assert shortest_path([[0, 1, 0], [1, 1, 0], [0, 0, 0]], 0) == -1
  - check: assert shortest_path([[0, 1, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 1, 1, 0], [1, 0, 1, 0, 1], [0, 0, 1, 1, 0]], 1) == 11
solution: |
  from collections import deque

  def shortest_path(grid, k):
      rows, cols = len(grid), len(grid[0])
      goal = (rows - 1, cols - 1)
      seen = {(0, 0, 0)}
      queue = deque([(0, 0, 0, 0)])
      while queue:
          r, c, used, steps = queue.popleft()
          if (r, c) == goal:
              return steps
          for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
              nr, nc = r + dr, c + dc
              if 0 <= nr < rows and 0 <= nc < cols:
                  nused = used + grid[nr][nc]
                  if nused <= k and (nr, nc, nused) not in seen:
                      seen.add((nr, nc, nused))
                      queue.append((nr, nc, nused, steps + 1))
      return -1
equivalent:
  - 4: "rows, cols = (len(grid), len(grid[-1]))"   # why: every row of a rectangular grid has the same length, so grid[-1] gives the same column count
  - 6: "seen = {(0, 0, -1)}"   # why: the start is re-queued only at a higher step count, and its neighbours are already queued at those used counts, so every first arrival is unchanged
  - 6: "seen = {(-1, 0, 0)}"   # why: no real state equals (-1, 0, 0), and the start is still expanded first from the queue, so the same argument as above applies
  - 6: "seen = {(0, -1, 0)}"   # why: same as above, no real state equals (0, -1, 0)
  - 6: "seen = {(0, 0, 1)}"   # why: the start is queued first with used 0 and expanded before any re-queue, so the removal count of its first visit is unchanged
  - 12: "for dr, dc in ((1, 0), (-0, 0), (0, 1), (0, -1)):"   # why: a self-move gives the same cell with the same or more removals and more steps, a state dominated by the current one, so it never shortens a path
  - 13: "nr, nc = (r - dr, c + dc)"   # why: the direction list is closed under sign flips, so the four neighbours are unchanged as a set
  - 13: "nr, nc = (r + dr, c - dc)"   # why: same as above
slow:
  - |
    def shortest_path(grid, k):
        rows, cols = len(grid), len(grid[0])
        dist = {(0, 0, 0): 0}
        changed = True
        while changed:
            changed = False
            for (r, c, used), d in list(dist.items()):
                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols:
                        nused = used + grid[nr][nc]
                        if nused <= k and dist.get((nr, nc, nused), float("inf")) > d + 1:
                            dist[(nr, nc, nused)] = d + 1
                            changed = True
        best = [d for (r, c, used), d in dist.items() if (r, c) == (rows - 1, cols - 1)]
        return min(best) if best else -1
brute: |
  def shortest_path(grid, k):
      rows, cols = len(grid), len(grid[0])
      level = {(0, 0, 0)}
      visited = set(level)
      steps = 0
      while level:
          if any((r, c) == (rows - 1, cols - 1) for r, c, _ in level):
              return steps
          following = set()
          for r, c, used in level:
              for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                  nr, nc = r + dr, c + dc
                  if 0 <= nr < rows and 0 <= nc < cols and used + grid[nr][nc] <= k:
                      following.add((nr, nc, used + grid[nr][nc]))
          following -= visited
          visited |= following
          level = following
          steps += 1
      return -1
big: 'assert shortest_path([[1 if (r % 2 == 1 and c != (39 if (r // 2) % 2 == 0 else 0)) else 0 for c in range(40)] for r in range(40)], 1) == 780'
random:
  call: shortest_path
  gen: |
    def gen(rng, size):
        rows = rng.randint(1, 3)
        cols = rng.randint(1, 3)
        grid = [[rng.randint(0, 1) for _ in range(cols)] for _ in range(rows)]
        grid[0][0] = 0
        grid[-1][-1] = 0
        return (grid, rng.randint(0, 2))
wrong:
  - |
    from collections import deque

    def shortest_path(grid, k):
        rows, cols = len(grid), len(grid[0])
        goal = (rows - 1, cols - 1)
        seen = {(0, 0, 0)}
        queue = deque([(0, 0, 0, 0)])
        while queue:
            r, c, used, steps = queue.popleft()
            if (r, c) == goal:
                return steps
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    nused = used + grid[nr][nc]
                    if nused <= 0 and (nr, nc, nused) not in seen:
                        seen.add((nr, nc, nused))
                        queue.append((nr, nc, nused, steps + 1))
        return -1
  - |
    from collections import deque

    def shortest_path(grid, k):
        rows, cols = len(grid), len(grid[0])
        goal = (rows - 1, cols - 1)
        seen = {(0, 0)}
        queue = deque([(0, 0, 0, 0)])
        while queue:
            r, c, used, steps = queue.popleft()
            if (r, c) == goal:
                return steps
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    nused = used + grid[nr][nc]
                    if nused <= k and (nr, nc) not in seen:
                        seen.add((nr, nc))
                        queue.append((nr, nc, nused, steps + 1))
        return -1
  - |
    from collections import deque

    def shortest_path(grid, k):
        rows, cols = len(grid), len(grid[0])
        goal = (rows - 1, cols - 1)
        seen = {(0, 0, 0)}
        queue = deque([(0, 0, 0, 0)])
        while queue:
            r, c, used, steps = queue.popleft()
            if (r, c) == goal:
                return steps + 1
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    nused = used + grid[nr][nc]
                    if nused <= k and (nr, nc, nused) not in seen:
                        seen.add((nr, nc, nused))
                        queue.append((nr, nc, nused, steps + 1))
        return -1
---
::
