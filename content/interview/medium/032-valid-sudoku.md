---
title: Valid Sudoku
tier: medium
order: 32
leetcode: 36
url: https://leetcode.com/problems/valid-sudoku/
companies: [Amazon, Meta, Google]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a 9 by 9 grid `board` of strings. Each cell holds a digit from "1" to "9", or "." for an empty cell. Decide whether the filled cells follow the rules of Sudoku. Each digit may appear at most once in each row, at most once in each column, and at most once in each of the nine 3 by 3 boxes. Empty cells are ignored. You do not have to check whether the board can be finished. Return True if the filled cells follow the rules, and False if any digit repeats in a row, a column or a box.

For example, a board with "8" in its top-left corner and also "8" somewhere else in the same first column is not valid, even if every other rule holds.

::exercise
---
id: iv-medium-032
prompt: Write a function is_valid_sudoku(board) that returns True when the filled cells of the 9 by 9 board follow the Sudoku rules, and False otherwise.
starter: |
  # write your code below
  def is_valid_sudoku(board):
      pass
hints:
  - Check each filled cell against three groups: its row, its column and its box. The box number can come from the row and column divided by 3.
  - Keep a set of the things you have seen, such as a tuple of the group kind, its position and the digit. A repeat means the board is not valid.
tests:
  - check: 'assert is_valid_sudoku([[str((r * 3 + r // 3 + c) % 9 + 1) for c in range(9)] for r in range(9)]) == True'
  - check: 'assert (lambda cells: is_valid_sudoku([[cells.get((r, c), ".") for c in range(9)] for r in range(9)]))({(0, 0): "8", (3, 0): "8"}) == False'
  - check: 'assert is_valid_sudoku([["."] * 9 for _ in range(9)]) == True'
  - check: 'assert (lambda cells: is_valid_sudoku([[cells.get((r, c), ".") for c in range(9)] for r in range(9)]))({(0, 0): "1", (0, 8): "1"}) == False'
  - check: 'assert (lambda cells: is_valid_sudoku([[cells.get((r, c), ".") for c in range(9)] for r in range(9)]))({(0, 0): "1", (8, 0): "1"}) == False'
  - check: 'assert (lambda cells: is_valid_sudoku([[cells.get((r, c), ".") for c in range(9)] for r in range(9)]))({(0, 0): "1", (1, 1): "1"}) == False'
  - check: 'assert (lambda cells: is_valid_sudoku([[cells.get((r, c), ".") for c in range(9)] for r in range(9)]))({(0, 0): "1", (1, 3): "1"}) == True'
  - check: 'assert (lambda cells: is_valid_sudoku([[cells.get((r, c), ".") for c in range(9)] for r in range(9)]))({(8, 8): "9", (7, 6): "9"}) == False'
no_slow: "The board is always 9 by 9, so every method finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def is_valid_sudoku(board):
      seen = set()
      for r in range(9):
          for c in range(9):
              v = board[r][c]
              if v == ".":
                  continue
              box = (r // 3, c // 3)
              for key in (("row", r, v), ("col", c, v), ("box", box, v)):
                  if key in seen:
                      return False
                  seen.add(key)
      return True
brute: |
  def is_valid_sudoku(board):
      groups = []
      for i in range(9):
          groups.append([board[i][j] for j in range(9)])
          groups.append([board[j][i] for j in range(9)])
      for br in range(0, 9, 3):
          for bc in range(0, 9, 3):
              groups.append([board[br + i][bc + j] for i in range(3) for j in range(3)])
      for g in groups:
          digits = [v for v in g if v != "."]
          if any(digits.count(v) > 1 for v in digits):
              return False
      return True
random:
  call: is_valid_sudoku
  gen: |
    def gen(rng, size):
        board = [[str((r * 3 + r // 3 + c) % 9 + 1) for c in range(9)] for r in range(9)]
        for r in range(9):
            for c in range(9):
                if rng.random() < 0.5:
                    board[r][c] = "."
        if rng.random() < 0.5:
            board[rng.randrange(9)][rng.randrange(9)] = str(rng.randint(1, 9))
        return (board,)
wrong:
  - |
    def is_valid_sudoku(board):
        seen = set()
        for r in range(9):
            for c in range(9):
                v = board[r][c]
                if v == ".":
                    continue
                for key in (("row", r, v), ("col", c, v)):
                    if key in seen:
                        return False
                    seen.add(key)
        return True
  - |
    def is_valid_sudoku(board):
        seen = set()
        for r in range(9):
            for c in range(9):
                v = board[r][c]
                if v == ".":
                    continue
                box = (r % 3, c // 3)
                for key in (("row", r, v), ("col", c, v), ("box", box, v)):
                    if key in seen:
                        return False
                    seen.add(key)
        return True
  - |
    def is_valid_sudoku(board):
        seen = set()
        for r in range(9):
            for c in range(9):
                v = board[r][c]
                box = (r // 3, c // 3)
                for key in (("row", r, v), ("col", c, v), ("box", box, v)):
                    if key in seen:
                        return False
                    seen.add(key)
        return True
---
::
