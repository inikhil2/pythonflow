---
title: N-Queens
tier: hard
order: 19
leetcode: 51
url: https://leetcode.com/problems/n-queens/
companies: [Google, Amazon, Meta]
topic: Backtracking
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week10-algorithms/06-recursion-and-backtracking]
---

You get a whole number `n` from 1 to 9. Place `n` queens on an `n` by `n` chessboard so that no two queens attack each other. A queen attacks every square in its row, its column and both diagonals, so no two queens may share a row, a column or a diagonal.

Return every valid placement. Each placement is a list of `n` strings, one per row from top to bottom, where `"Q"` marks a queen and `"."` marks an empty square. The placements may come back in any order. If no placement exists, return an empty list.

Trying every arrangement of `n` queens and checking each one is far too slow. Place one queen per row instead, and step back when a row has no safe column.

::exercise
---
id: iv-hard-019
prompt: Write a function n_queens(n) that returns every placement of n queens on an n by n board where no two attack each other, as a list of boards. Each board is a list of n strings, with "Q" for a queen and "." for an empty square.
starter: |
  # write your code below
  def n_queens(n):
      pass
hints:
  - Place one queen in each row, left to right, and try every column that no earlier queen attacks.
  - A column is blocked when an earlier queen shares it, or when the column gap between two queens equals their row gap, which puts them on one diagonal.
tests:
  - check: assert n_queens(1) == [["Q"]]
  - check: assert n_queens(2) == []
  - check: assert n_queens(3) == []
  - check: assert sorted(n_queens(4)) == sorted([[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]])
  - check: assert len(n_queens(5)) == 10
  - check: assert ["Q....", "..Q..", "....Q", ".Q...", "...Q."] in n_queens(5)
  - check: assert all(len(b) == 5 and all(len(row) == 5 and row.count("Q") == 1 for row in b) for b in n_queens(5))
  - check: assert all(len(set(row.index("Q") for row in b)) == 5 for b in n_queens(5))
big: assert len(n_queens(9)) == 352 and len({tuple(b) for b in n_queens(9)}) == 352
solution: |
  def n_queens(n):
      boards = []
      cols = []
      def place(row):
          if row == n:
              boards.append(["." * c + "Q" + "." * (n - c - 1) for c in cols])
              return
          for c in range(n):
              if all(c != cc and abs(c - cc) != row - r for r, cc in enumerate(cols)):
                  cols.append(c)
                  place(row + 1)
                  cols.pop()
      place(0)
      return boards
brute: |
  from itertools import permutations
  def n_queens(n):
      found = []
      for cols in permutations(range(n)):
          if all(abs(cols[a] - cols[b]) != b - a for a in range(n) for b in range(a + 1, n)):
              found.append(["." * c + "Q" + "." * (n - c - 1) for c in cols])
      return found
random:
  call: n_queens
  min_distinct: 9   # why: n runs from 1 to 9, so exactly 9 inputs exist
  gen: |
    def gen(rng, size):
        return (rng.randint(1, min(max(size, 1), 9)),)
  same: |
    def same(args, got, want):
        return sorted(got) == sorted(want)
slow:
  - |
    def n_queens(n):
        boards = []
        def fill(row, cols):
            if row == n:
                if all(cols[a] != cols[b] and abs(cols[a] - cols[b]) != b - a for a in range(n) for b in range(a + 1, n)):
                    boards.append(["." * c + "Q" + "." * (n - c - 1) for c in cols])
                return
            for c in range(n):
                fill(row + 1, cols + [c])
        fill(0, [])
        return boards
wrong:
  - |
    def n_queens(n):
        boards = []
        cols = []
        def place(row):
            if row == n:
                boards.append(["." * c + "Q" + "." * (n - c - 1) for c in cols])
                return
            for c in range(n):
                if all(c != cc for cc in cols):
                    cols.append(c)
                    place(row + 1)
                    cols.pop()
        place(0)
        return boards
  - |
    def n_queens(n):
        boards = []
        cols = []
        def place(row):
            if row == n:
                boards.append(["." * c + "Q" + "." * (n - c - 1) for c in cols])
                return
            for c in range(n):
                if all(c != cc and abs(c - cc) != row - r for r, cc in enumerate(cols)):
                    cols.append(c)
                    place(row + 1)
                    cols.pop()
        place(0)
        return boards[:1]
  - |
    def n_queens(n):
        if n == 1:
            return []
        boards = []
        cols = []
        def place(row):
            if row == n:
                boards.append(["." * c + "Q" + "." * (n - c - 1) for c in cols])
                return
            for c in range(n):
                if all(c != cc and abs(c - cc) > row - r for r, cc in enumerate(cols)):
                    cols.append(c)
                    place(row + 1)
                    cols.pop()
        place(0)
        return boards
---
::
