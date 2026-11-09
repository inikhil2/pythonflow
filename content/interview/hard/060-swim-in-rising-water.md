---
title: Swim in Rising Water
tier: hard
order: 60
leetcode: 778
url: https://leetcode.com/problems/swim-in-rising-water/
companies: [Google, Amazon, Meta]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search, /learn/week10-algorithms/09-graphs]
---

You get a square grid of whole numbers, n rows by n columns, where 1 is at most n and n is at most 20. The numbers are a permutation of 0 up to n times n minus 1, so each value appears once. You also get a list of starting cells, with between 1 and 30 of them. Each starting cell is a pair [row, column] counted from 0.

Think of the grid as a flooded field. At time t, a cell is under water when its value is at most t. A swimmer can step up, down, left or right from one cell to the next, but only into cells under water at that time. The swimmer may stand on a cell at any time once it is under water, and the swimmer does not have to move.

For each starting cell, in order, return the smallest time t at which the swimmer can get from that starting cell to the bottom-right corner, moving only through cells under water at time t. If the starting cell is the bottom-right corner, the answer is that cell's value. Return all the answers in one list.

The answer for one start is the smallest time that makes a path possible, and a path is possible at every time after that. So each start can use a binary search over the times, testing whether a path exists at a given time with a search of the grid.

::exercise
---
id: iv-hard-060
prompt: Write a function swim_times(grid, starts) that returns a list with, for each starting cell [row, column] in order, the smallest time at which the bottom-right corner can be reached from that cell.
starter: |
  # write your code below
  def swim_times(grid, starts):
      pass
hints:
  - For one start, the answer lies between that start's own value and the largest value in the grid, so binary search that range.
  - To test a time, search from the start through cells whose value is at most that time, and report whether the corner is found.
tests:
  - check: assert swim_times([[0, 2], [1, 3]], [[0, 0]]) == [3]
  - check: assert swim_times([[0]], [[0, 0]]) == [0]
  - check: assert swim_times([[0, 2, 1], [3, 4, 5], [6, 7, 8]], [[0, 0], [1, 0]]) == [8, 8]
  - check: assert swim_times([[0, 1, 2], [7, 6, 3], [8, 5, 4]], [[0, 0], [2, 1], [1, 0]]) == [4, 5, 7]
  - check: assert swim_times([[3, 1], [0, 2]], [[1, 0], [0, 0]]) == [2, 3]
  - check: assert swim_times([[0, 1], [2, 3]], [[1, 1], [0, 0]]) == [3, 3]
  - check: assert swim_times([[0, 4, 3], [1, 5, 2], [8, 6, 7]], [[0, 0], [2, 0], [2, 2]]) == [7, 8, 7]
  - check: assert swim_times([[0, 9, 8, 7], [1, 10, 11, 6], [2, 15, 12, 5], [3, 4, 13, 14]], [[0, 0], [3, 0]]) == [14, 14]
  - check: assert swim_times([[0, 1, 2], [7, 6, 3], [8, 5, 4]], [[1, 1]]) == [6]
  - check: assert swim_times([[1, 5, 6], [0, 8, 4], [7, 2, 3]], [[1, 0]]) == [6]
big: "assert (lambda perm: sum(swim_times([[perm[r * 20 + c] for c in range(20)] for r in range(20)], [[(i * 17) % 20, (i * 29) % 20] for i in range(30)])))(sorted(range(400), key=lambda x: (x * 1103515245 + 12345) % 2147483648)) == 7930"
solution: |
  def swim_times(grid, starts):
      n = len(grid)
      def reachable(r0, c0, limit):
          if grid[r0][c0] > limit:
              return False
          seen = {(r0, c0)}
          stack = [(r0, c0)]
          while stack:
              r, c = stack.pop()
              if (r, c) == (n - 1, n - 1):
                  return True
              for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                  if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in seen and grid[nr][nc] <= limit:
                      seen.add((nr, nc))
                      stack.append((nr, nc))
          return False
      answers = []
      for r0, c0 in starts:
          lo, hi = grid[r0][c0], n * n - 1
          while lo < hi:
              mid = (lo + hi) // 2
              if reachable(r0, c0, mid):
                  hi = mid
              else:
                  lo = mid + 1
          answers.append(lo)
      return answers
brute: |
  def swim_times(grid, starts):
      n = len(grid)
      out = []
      for r0, c0 in starts:
          INF = 10 ** 9
          best = [[INF] * n for _ in range(n)]
          best[n - 1][n - 1] = grid[n - 1][n - 1]
          changed = True
          while changed:
              changed = False
              for r in range(n):
                  for c in range(n):
                      for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                          if 0 <= nr < n and 0 <= nc < n and best[nr][nc] < INF:
                              cand = max(grid[r][c], best[nr][nc])
                              if cand < best[r][c]:
                                  best[r][c] = cand
                                  changed = True
          out.append(best[r0][c0])
      return out
random:
  call: swim_times
  gen: |
    def gen(rng, size):
        n = min(max(size, 1), 5)
        values = list(range(n * n))
        rng.shuffle(values)
        grid = [values[r * n:(r + 1) * n] for r in range(n)]
        starts = [[rng.randrange(n), rng.randrange(n)] for _ in range(rng.randint(1, 4))]
        return (grid, starts)
slow:
  - |
    def swim_times(grid, starts):
        n = len(grid)
        def reachable(r0, c0, limit):
            if grid[r0][c0] > limit:
                return False
            seen = {(r0, c0)}
            stack = [(r0, c0)]
            while stack:
                r, c = stack.pop()
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in seen and grid[nr][nc] <= limit:
                        seen.add((nr, nc))
                        stack.append((nr, nc))
            return (n - 1, n - 1) in seen
        answers = []
        for r0, c0 in starts:
            best = None
            for t in range(n * n):
                ok = reachable(r0, c0, t)
                if ok and best is None:
                    best = t
            answers.append(best)
        return answers
wrong:
  - |
    def swim_times(grid, starts):
        n = len(grid)
        def reachable(r0, c0, limit):
            if grid[r0][c0] > limit:
                return False
            seen = {(r0, c0)}
            stack = [(r0, c0)]
            while stack:
                r, c = stack.pop()
                if (r, c) == (n - 1, n - 1):
                    return True
                for nr, nc in ((r + 1, c), (r, c + 1)):
                    if nr < n and nc < n and (nr, nc) not in seen and grid[nr][nc] <= limit:
                        seen.add((nr, nc))
                        stack.append((nr, nc))
            return False
        answers = []
        for r0, c0 in starts:
            lo, hi = grid[r0][c0], n * n - 1
            while lo < hi:
                mid = (lo + hi) // 2
                if reachable(r0, c0, mid):
                    hi = mid
                else:
                    lo = mid + 1
            answers.append(lo)
        return answers
  - |
    def swim_times(grid, starts):
        n = len(grid)
        def reachable(r0, c0, limit):
            if grid[r0][c0] > limit:
                return False
            seen = {(r0, c0)}
            stack = [(r0, c0)]
            while stack:
                r, c = stack.pop()
                if (r, c) == (n - 1, n - 1):
                    return True
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in seen and grid[nr][nc] <= limit:
                        seen.add((nr, nc))
                        stack.append((nr, nc))
            return False
        answers = []
        for r0, c0 in starts:
            lo, hi = grid[r0][c0], n * n - 2
            while lo < hi:
                mid = (lo + hi) // 2
                if reachable(r0, c0, mid):
                    hi = mid
                else:
                    lo = mid + 1
            answers.append(lo)
        return answers
  - |
    def swim_times(grid, starts):
        n = len(grid)
        def reachable(r0, c0, limit):
            if grid[r0][c0] > limit:
                return False
            seen = {(r0, c0)}
            stack = [(r0, c0)]
            while stack:
                r, c = stack.pop()
                if (r, c) == (n - 1, n - 1):
                    return True
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in seen and grid[nr][nc] < limit:
                        seen.add((nr, nc))
                        stack.append((nr, nc))
            return False
        answers = []
        for r0, c0 in starts:
            lo, hi = grid[r0][c0], n * n - 1
            while lo < hi:
                mid = (lo + hi) // 2
                if reachable(r0, c0, mid):
                    hi = mid
                else:
                    lo = mid + 1
            answers.append(lo)
        return answers
equivalent:
  - "6: return True"   # why: the search starts at the start cell's own value, so mid is never below it and this early exit never runs
  - "20: lo, hi = (grid[r0][c0], n * n - 0)"   # why: values are a permutation of 0 to n*n-1, so the answer is always below n*n and a higher ceiling still returns the same minimum
  - "20: lo, hi = (grid[r0][c0], n * n + 1)"   # why: same as the line above, with a larger ceiling the search still settles on the smallest reachable time
---
::
