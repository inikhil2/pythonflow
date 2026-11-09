---
title: Find Winner on a Tic Tac Toe Game
tier: easy
order: 69
leetcode: 1275
url: https://leetcode.com/problems/find-winner-on-a-tic-tac-toe-game/
companies: [Meta, Amazon, Apple]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list `moves` of between 1 and 9 moves on a 3 by 3 board. Each move is a pair `[row, col]`, with both numbers from 0 to 2, and no cell is used twice. Player A moves first, and the players then take turns. Player A places "A" marks and player B places "B" marks.

A player wins by filling a whole row, a whole column or one of the two diagonals with their own mark. The game stops as soon as someone wins, so no move follows a win. Return:

- `"A"` if player A has won,
- `"B"` if player B has won,
- `"Draw"` if all nine cells are filled and nobody has won,
- `"Pending"` if nobody has won yet and some cells are still empty.

::exercise
---
id: iv-easy-069
prompt: Write a function tic_tac_winner(moves) that returns "A", "B", "Draw" or "Pending" for the game the moves describe.
starter: |
  # write your code below
  def tic_tac_winner(moves):
      pass
hints:
  - Player A makes every move with an even index in the list, and player B makes the rest.
  - After each move, check the row, column and diagonals through that cell for three of the same mark.
tests:
  - check: assert tic_tac_winner([[0, 0], [2, 0], [1, 1], [2, 1], [2, 2]]) == "A"
  - check: assert tic_tac_winner([[0, 0], [1, 1], [0, 1], [0, 2], [1, 0], [2, 0]]) == "B"
  - check: assert tic_tac_winner([[0, 0], [1, 1], [2, 0], [1, 0], [1, 2], [2, 1], [0, 1], [0, 2], [2, 2]]) == "Draw"
  - check: assert tic_tac_winner([[0, 0], [1, 1]]) == "Pending"
  - check: assert tic_tac_winner([[0, 0]]) == "Pending"
  - check: assert tic_tac_winner([[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]]) == "A"
  - check: assert tic_tac_winner([[0, 0], [0, 1], [1, 1], [0, 2], [2, 2]]) == "A"
  - check: assert tic_tac_winner([[2, 0], [1, 0], [2, 1], [1, 1], [2, 2]]) == "A"
solution: |
  def tic_tac_winner(moves):
      board = [["", "", ""], ["", "", ""], ["", "", ""]]
      for step in range(len(moves)):
          r, c = moves[step]
          mark = "A" if step % 2 == 0 else "B"
          board[r][c] = mark
          lines = [
              board[0], board[1], board[2],
              [board[0][0], board[1][0], board[2][0]],
              [board[0][1], board[1][1], board[2][1]],
              [board[0][2], board[1][2], board[2][2]],
              [board[0][0], board[1][1], board[2][2]],
              [board[0][2], board[1][1], board[2][0]],
          ]
          for line in lines:
              if line[0] == line[1] == line[2] == mark:
                  return mark
      if len(moves) == 9:
          return "Draw"
      return "Pending"
brute: |
  def tic_tac_winner(moves):
      triples = [
          [(0, 0), (0, 1), (0, 2)], [(1, 0), (1, 1), (1, 2)], [(2, 0), (2, 1), (2, 2)],
          [(0, 0), (1, 0), (2, 0)], [(0, 1), (1, 1), (2, 1)], [(0, 2), (1, 2), (2, 2)],
          [(0, 0), (1, 1), (2, 2)], [(0, 2), (1, 1), (2, 0)],
      ]
      owner = {}
      for step, (r, c) in enumerate(moves):
          owner[(r, c)] = "A" if step % 2 == 0 else "B"
          for triple in triples:
              marks = [owner.get(cell) for cell in triple]
              if marks[0] is not None and marks[0] == marks[1] == marks[2]:
                  return marks[0]
      if len(moves) == 9:
          return "Draw"
      return "Pending"
random:
  call: tic_tac_winner
  gen: |
    def gen(rng, size):
        triples = [
            [(0, 0), (0, 1), (0, 2)], [(1, 0), (1, 1), (1, 2)], [(2, 0), (2, 1), (2, 2)],
            [(0, 0), (1, 0), (2, 0)], [(0, 1), (1, 1), (2, 1)], [(0, 2), (1, 2), (2, 2)],
            [(0, 0), (1, 1), (2, 2)], [(0, 2), (1, 1), (2, 0)],
        ]
        cells = [[r, c] for r in range(3) for c in range(3)]
        rng.shuffle(cells)
        moves = []
        owner = {}
        for step, cell in enumerate(cells[:rng.randint(1, min(9, size + 1))]):
            moves.append(cell)
            owner[(cell[0], cell[1])] = step % 2
            won = False
            for triple in triples:
                marks = [owner.get(p) for p in triple]
                if marks[0] is not None and marks[0] == marks[1] == marks[2]:
                    won = True
            if won:
                break
        return (moves,)
wrong:
  - |
    def tic_tac_winner(moves):
        board = [["", "", ""], ["", "", ""], ["", "", ""]]
        for step in range(len(moves)):
            r, c = moves[step]
            mark = "A" if step % 2 == 0 else "B"
            board[r][c] = mark
            for line in [board[0], board[1], board[2]]:
                if line[0] == line[1] == line[2] == mark:
                    return mark
            for col in range(3):
                if board[0][col] == board[1][col] == board[2][col] == mark:
                    return mark
        if len(moves) == 9:
            return "Draw"
        return "Pending"
  - |
    def tic_tac_winner(moves):
        board = [["", "", ""], ["", "", ""], ["", "", ""]]
        for step in range(len(moves)):
            r, c = moves[step]
            mark = "A" if step % 2 == 0 else "B"
            board[r][c] = mark
            lines = [
                board[0], board[1], board[2],
                [board[0][0], board[1][0], board[2][0]],
                [board[0][1], board[1][1], board[2][1]],
                [board[0][2], board[1][2], board[2][2]],
                [board[0][0], board[1][1], board[2][2]],
                [board[0][2], board[1][1], board[2][0]],
            ]
            for line in lines:
                if line[0] == line[1] == line[2] == mark and mark == "A":
                    return mark
        if len(moves) == 9:
            return "Draw"
        return "Pending"
  - |
    def tic_tac_winner(moves):
        board = [["", "", ""], ["", "", ""], ["", "", ""]]
        for step in range(len(moves)):
            r, c = moves[step]
            mark = "B" if step % 2 == 0 else "A"
            board[r][c] = mark
            lines = [
                board[0], board[1], board[2],
                [board[0][0], board[1][0], board[2][0]],
                [board[0][1], board[1][1], board[2][1]],
                [board[0][2], board[1][2], board[2][2]],
                [board[0][0], board[1][1], board[2][2]],
                [board[0][2], board[1][1], board[2][0]],
            ]
            for line in lines:
                if line[0] == line[1] == line[2] == mark:
                    return mark
        if len(moves) == 9:
            return "Draw"
        return "Pending"
---
::
