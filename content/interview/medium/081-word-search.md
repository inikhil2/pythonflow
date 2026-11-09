---
title: Word Search
tier: medium
order: 81
leetcode: 79
url: https://leetcode.com/problems/word-search/
companies: [Amazon, Netflix, Google]
topic: Backtracking
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/09-graphs]
---

You get a board, which is a list of rows, and each cell holds one uppercase letter. The board is between 1 and 6 rows high and between 1 and 6 columns wide. You also get a word between 1 and 15 letters long.

Return `True` if the word can be spelled by a path through neighbouring cells, moving up, down, left or right. Each cell may be used at most once in a single path. Return `False` otherwise.

::exercise
---
id: iv-medium-081
prompt: Write a function exist(board, word) that returns True if the word can be traced through neighbouring cells of the board without reusing a cell, and False otherwise.
starter: |
  # write your code below
  def exist(board, word):
      pass
hints:
  - Try each cell as a starting point, then extend the path one neighbour at a time.
  - Keep a set of the cells on the current path, and remove a cell again when its branch fails.
tests:
  - check: assert exist([["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED") == True
  - check: assert exist([["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "SEE") == True
  - check: assert exist([["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB") == False
  - check: assert exist([["A"]], "A") == True
  - check: assert exist([["A"]], "B") == False
  - check: assert exist([["A", "B"]], "ABA") == False
  - check: assert exist([["A", "B"]], "BA") == True
  - check: assert exist([["A", "A"], ["A", "A"]], "AAAA") == True
  - check: assert exist([["A", "B"], ["C", "D"]], "ACDB") == True
  - check: assert exist([["A", "B"], ["C", "D"]], "ABDC") == True
  - check: assert exist([["A", "B"], ["C", "D"]], "ADB") == False
  - check: assert exist([["A", "B", "C"], ["B", "C", "A"]], "ABCB") == True
  - check: assert exist([["A", "A"], ["A", "B"]], "AAA") == True
big: assert exist([["B" if (y, x) == (0, 0) else "C" if (y, x) == (5, 5) else "A" for x in range(6)] for y in range(6)], "B" + "A" * 9 + "C") == True and exist([["B" if (y, x) == (0, 0) else "C" if (y, x) == (5, 5) else "A" for x in range(6)] for y in range(6)], "B" + "A" * 3 + "B") == False
solution: |
  def exist(board, word):
      rows, cols = len(board), len(board[0])
      seen = set()
      def dfs(y, x, i):
          if i == len(word) - 1:
              return True
          seen.add((y, x))
          for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
              if 0 <= ny < rows and 0 <= nx < cols and (ny, nx) not in seen and board[ny][nx] == word[i + 1]:
                  if dfs(ny, nx, i + 1):
                      return True
          seen.discard((y, x))
          return False
      return any(board[y][x] == word[0] and dfs(y, x, 0) for y in range(rows) for x in range(cols))
brute: |
  def exist(board, word):
      rows, cols = len(board), len(board[0])
      def extend(path):
          if len(path) == len(word):
              return True
          y, x = path[-1]
          for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
              if 0 <= ny < rows and 0 <= nx < cols and (ny, nx) not in path and board[ny][nx] == word[len(path)]:
                  if extend(path + [(ny, nx)]):
                      return True
          return False
      return any(board[y][x] == word[0] and extend([(y, x)]) for y in range(rows) for x in range(cols))
slow:
  - |
    def exist(board, word):
        rows, cols = len(board), len(board[0])
        spelled = set()
        def walk(y, x, text, visited):
            if len(text) == len(word):
                spelled.add(text)
                return
            for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= ny < rows and 0 <= nx < cols and (ny, nx) not in visited:
                    walk(ny, nx, text + board[ny][nx], visited | {(ny, nx)})
        for y in range(rows):
            for x in range(cols):
                walk(y, x, board[y][x], {(y, x)})
        return word in spelled
random:
  call: exist
  gen: |
    def gen(rng, size):
        rows = rng.randint(1, 4)
        cols = rng.randint(1, 4)
        board = [[rng.choice("ABC") for _ in range(cols)] for _ in range(rows)]
        if rng.random() < 0.5:
            word = "".join(rng.choice("ABC") for _ in range(rng.randint(1, 6)))
        else:
            y, x = rng.randrange(rows), rng.randrange(cols)
            word, seen = board[y][x], {(y, x)}
            for _ in range(rng.randint(0, 5)):
                options = [(ny, nx) for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1))
                           if 0 <= ny < rows and 0 <= nx < cols and (ny, nx) not in seen]
                if not options:
                    break
                y, x = rng.choice(options)
                seen.add((y, x))
                word += board[y][x]
        return (board, word)
wrong:
  - |
    def exist(board, word):
        rows, cols = len(board), len(board[0])
        seen = set()
        def dfs(y, x, i):
            if i == len(word) - 1:
                return True
            seen.add((y, x))
            for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= ny < rows and 0 <= nx < cols and (ny, nx) not in seen and board[ny][nx] == word[i + 1]:
                    if dfs(ny, nx, i + 1):
                        return True
            return False
        return any(board[y][x] == word[0] and dfs(y, x, 0) for y in range(rows) for x in range(cols))
  - |
    def exist(board, word):
        rows, cols = len(board), len(board[0])
        seen = set()
        def dfs(y, x, i):
            if i == len(word) - 1:
                return True
            for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= ny < rows and 0 <= nx < cols and (ny, nx) not in seen and board[ny][nx] == word[i + 1]:
                    seen.add((ny, nx))
                    if dfs(ny, nx, i + 1):
                        return True
                    seen.discard((ny, nx))
            return False
        return any(board[y][x] == word[0] and dfs(y, x, 0) for y in range(rows) for x in range(cols))
  - |
    def exist(board, word):
        return all(any(ch in row for row in board) for ch in word)
equivalent:
  - "rows, cols = (len(board), len(board[-1]))"  # why: every row of a board has the same length, so the last row gives the same column count
---
::
