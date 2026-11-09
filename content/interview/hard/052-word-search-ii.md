---
title: Word Search II
tier: hard
order: 52
leetcode: 212
url: https://leetcode.com/problems/word-search-ii/
companies: [Amazon, Google, Meta]
topic: Backtracking
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week10-algorithms/02-stacks-and-queues]
---

You are given a board of lowercase letters, from 1 to 12 rows and 1 to 12 columns, and a list of up to 200 distinct words, each from 1 to 10 lowercase letters. A word is found when its letters can be traced along neighbouring cells, moving up, down, left or right, without reusing a cell within that word.

Return every word from the list that can be found on the board, sorted alphabetically. Searching each word separately from every starting cell is correct but slow, because the same starting prefixes get re-explored for every word. Storing all the words in one prefix tree lets a single walk over the board check every word at once.

::exercise
---
id: iv-hard-052
prompt: Write a function find_words(board, words) that returns the sorted list of words from words that can be traced on board by moving between neighbouring cells without reusing a cell within the same word.
starter: |
  # write your code below
  def find_words(board, words):
      pass
hints:
  - Store the words in a prefix tree made of nested dictionaries. A walk on the board only continues while the next letter is a child of the current node.
  - When you reach a node that ends a word, record the word and remove the end marker so it is not recorded twice. Mark a cell as used while you explore below it, and restore it when you return.
tests:
  - check: assert find_words([["a"]], ["a"]) == ["a"]
  - check: assert find_words([["a"]], ["b"]) == []
  - check: assert find_words([["a", "b"], ["c", "d"]], ["ab", "ac", "abd", "acdb", "ba", "cd"]) == ["ab", "abd", "ac", "acdb", "ba", "cd"]
  - check: assert find_words([["a", "a"]], ["aa", "aaa"]) == ["aa"]
  - check: assert find_words([["a", "b"]], ["ab", "ab"]) == ["ab"]
  - check: assert find_words([["a", "b"]], ["aba"]) == []
  - check: assert find_words([["a", "b", "c"]], ["cba", "abc", "ac"]) == ["abc", "cba"]
  - check: assert find_words([["c", "a", "t"], ["x", "t", "a"], ["d", "o", "g"]], ["cat", "dog", "dot", "tax", "cata"]) == ["cat", "cata", "dog", "dot"]
  - check: assert find_words([["a", "b"], ["c", "d"]], []) == []
  - check: assert find_words([["x", "y"], ["z", "w"]], ["xyzw", "xw", "wz", "yxzw"]) == ["wz", "yxzw"]
solution: |
  def find_words(board, words):
      trie = {}
      for w in words:
          node = trie
          for ch in w:
              node = node.setdefault(ch, {})
          node["$"] = w
      rows, cols = len(board), len(board[0])
      found = []

      def dfs(r, c, node):
          ch = board[r][c]
          nxt = node.get(ch)
          if nxt is None:
              return
          if "$" in nxt:
              found.append(nxt.pop("$"))
          board[r][c] = "#"
          for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
              nr, nc = r + dr, c + dc
              if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != "#":
                  dfs(nr, nc, nxt)
          board[r][c] = ch

      for r in range(rows):
          for c in range(cols):
              dfs(r, c, trie)
      return sorted(found)
equivalent:
  - 8: "rows, cols = (len(board), len(board[-1]))"   # why: every row of a rectangular board has the same length, so board[-1] gives the same column count
  - 20: "nr, nc = (r - dr, c + dc)"   # why: the direction list is closed under sign flips, so this still visits the same four neighbours in some order
  - 20: "nr, nc = (r + dr, c - dc)"   # why: same as above, the four neighbours are unchanged as a set
slow:
  - |
    def find_words(board, words):
        rows, cols = len(board), len(board[0])

        def search(word, r, c, k, used):
            if board[r][c] != word[k]:
                return False
            if k == len(word) - 1:
                return True
            used.add((r, c))
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in used and search(word, nr, nc, k + 1, used):
                    used.discard((r, c))
                    return True
            used.discard((r, c))
            return False

        return [w for w in sorted(set(words)) if any(search(w, r, c, 0, set()) for r in range(rows) for c in range(cols))]
brute: |
  def find_words(board, words):
      rows, cols = len(board), len(board[0])

      def search(word, r, c, k, used):
          if board[r][c] != word[k]:
              return False
          if k == len(word) - 1:
              return True
          used.add((r, c))
          for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
              nr, nc = r + dr, c + dc
              if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in used and search(word, nr, nc, k + 1, used):
                  used.discard((r, c))
                  return True
          used.discard((r, c))
          return False

      return [w for w in sorted(set(words)) if any(search(w, r, c, 0, set()) for r in range(rows) for c in range(cols))]
big: 'assert len(find_words([["a"] * 4 for _ in range(4)], ["a" * k for k in range(1, 11)] + ["a" * 7 + x + y + z for x in "bcde" for y in "abcdefgh" for z in "abc"])) == 10'
random:
  call: find_words
  gen: |
    def gen(rng, size):
        rows = rng.randint(1, 3)
        cols = rng.randint(1, 3)
        board = [[rng.choice("abc") for _ in range(cols)] for _ in range(rows)]
        words = list({"".join(rng.choice("abc") for _ in range(rng.randint(1, 4))) for _ in range(rng.randint(1, 5))})
        return (board, words)
wrong:
  - |
    def find_words(board, words):
        trie = {}
        for w in words:
            node = trie
            for ch in w:
                node = node.setdefault(ch, {})
            node["$"] = w
        rows, cols = len(board), len(board[0])
        found = []

        def dfs(r, c, node):
            nxt = node.get(board[r][c])
            if nxt is None:
                return
            if "$" in nxt:
                found.append(nxt.pop("$"))
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    dfs(nr, nc, nxt)

        for r in range(rows):
            for c in range(cols):
                dfs(r, c, trie)
        return sorted(found)
  - |
    def find_words(board, words):
        trie = {}
        for w in words:
            node = trie
            for ch in w:
                node = node.setdefault(ch, {})
            node["$"] = w
        rows, cols = len(board), len(board[0])
        found = []

        def dfs(r, c, node):
            ch = board[r][c]
            nxt = node.get(ch)
            if nxt is None:
                return
            if "$" in nxt:
                found.append(nxt["$"])
            board[r][c] = "#"
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != "#":
                    dfs(nr, nc, nxt)
            board[r][c] = ch

        for r in range(rows):
            for c in range(cols):
                dfs(r, c, trie)
        return sorted(found)
  - |
    def find_words(board, words):
        trie = {}
        for w in words:
            node = trie
            for ch in w:
                node = node.setdefault(ch, {})
            node["$"] = w
        rows, cols = len(board), len(board[0])
        found = []

        def dfs(r, c, node):
            ch = board[r][c]
            nxt = node.get(ch)
            if nxt is None:
                return
            if "$" in nxt:
                found.append(nxt.pop("$"))
            board[r][c] = "#"
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != "#":
                    dfs(nr, nc, nxt)

        for r in range(rows):
            for c in range(cols):
                dfs(r, c, trie)
        return sorted(found)
---
::
