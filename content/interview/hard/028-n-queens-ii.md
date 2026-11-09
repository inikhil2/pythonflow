---
title: N-Queens II
tier: hard
order: 28
leetcode: 52
url: https://leetcode.com/problems/n-queens-ii/
companies: [Google, Amazon, Meta]
topic: Backtracking
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week10-algorithms/06-recursion-and-backtracking]
---

You get a whole number n, the side of a square board with n rows and n columns. Put n queens on the board so that no two of them attack each other. A queen attacks every square in its own row, its own column and along both diagonals, as far as the board goes.

Return how many different ways there are to place the queens. Two placements are different if some square holds a queen in one and not in the other, and a board that is a rotation or a mirror image of another still counts as its own placement. The number n is between 1 and 10, and for some n the answer is 0.

::exercise
---
id: iv-hard-028
prompt: Write a function total_n_queens(n) that returns the number of ways to place n non-attacking queens on an n by n board.
starter: |
  # write your code below
  def total_n_queens(n):
      pass
hints:
  - Each row holds exactly one queen, so place them row by row and only choose a column for each.
  - Squares on the same diagonal share either row - column or row + column. Keep a set for the columns and one for each diagonal direction.
tests:
  - check: assert total_n_queens(1) == 1
  - check: assert total_n_queens(2) == 0
  - check: assert total_n_queens(3) == 0
  - check: assert total_n_queens(4) == 2
  - check: assert total_n_queens(5) == 10
  - check: assert total_n_queens(6) == 4
  - check: assert total_n_queens(7) == 40
  - check: assert total_n_queens(8) == 92
solution: |
  def total_n_queens(n):
      cols = set()
      down = set()
      up = set()

      def place(r):
          if r == n:
              return 1
          total = 0
          for c in range(n):
              if c in cols or r - c in down or r + c in up:
                  continue
              cols.add(c)
              down.add(r - c)
              up.add(r + c)
              total += place(r + 1)
              cols.remove(c)
              down.remove(r - c)
              up.remove(r + c)
          return total

      return place(0)
brute: |
  def total_n_queens(n):
      from itertools import permutations
      count = 0
      for perm in permutations(range(n)):
          if len({perm[i] + i for i in range(n)}) == n and len({perm[i] - i for i in range(n)}) == n:
              count += 1
      return count
valid: |
  def valid(n):
      return isinstance(n, int) and 1 <= n <= 10
random:
  call: total_n_queens
  min_distinct: 10   # why: n is 1 to 10, so there are only 10 inputs
  gen: |
    def gen(rng, size):
        return (rng.randint(1, min(size + 1, 10)),)
big: assert total_n_queens(10) == 724
slow:
  - |
    def total_n_queens(n):
        from itertools import permutations
        count = 0
        for perm in permutations(range(n)):
            if len({perm[i] + i for i in range(n)}) == n and len({perm[i] - i for i in range(n)}) == n:
                count += 1
        return count
wrong:
  - |
    def total_n_queens(n):
        cols = set()
        down = set()

        def place(r):
            if r == n:
                return 1
            total = 0
            for c in range(n):
                if c in cols or r - c in down:
                    continue
                cols.add(c)
                down.add(r - c)
                total += place(r + 1)
                cols.remove(c)
                down.remove(r - c)
            return total

        return place(0)
  - |
    def total_n_queens(n):
        cols = set()
        down = set()
        up = set()

        def place(r):
            if r == n:
                return 1
            total = 0
            for c in range(n if r else (n + 1) // 2):
                if c in cols or r - c in down or r + c in up:
                    continue
                cols.add(c)
                down.add(r - c)
                up.add(r + c)
                total += place(r + 1)
                cols.remove(c)
                down.remove(r - c)
                up.remove(r + c)
            return total

        return place(0) * 2
  - |
    def total_n_queens(n):
        cols = set()
        down = set()
        up = set()

        def place(r):
            if r == n:
                return 1
            total = 0
            for c in range(n):
                if c in cols or r - c in down or r + c in up:
                    continue
                cols.add(c)
                down.add(r - c)
                up.add(r + c)
                total += place(r + 1)
                cols.remove(c)
                down.remove(r - c)
            return total

        return place(0)
  - |
    def total_n_queens(n):
        cols = set()
        down = set()
        up = set()

        def place(r):
            if r == n:
                return True
            for c in range(n):
                if c in cols or r - c in down or r + c in up:
                    continue
                cols.add(c)
                down.add(r - c)
                up.add(r + c)
                if place(r + 1):
                    return True
                cols.remove(c)
                down.remove(r - c)
                up.remove(r + c)
            return False

        return 1 if place(0) else 0
---
::
