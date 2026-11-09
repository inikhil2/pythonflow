---
title: Word Break II
tier: hard
order: 72
leetcode: 140
url: https://leetcode.com/problems/word-break-ii/
companies: [Meta, Amazon, Google]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week0-functions/04-strings, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/10-dynamic-programming]
---

You get a text s and a list of words. The text has between 1 and 20 lowercase letters. The list has between 1 and 1000 distinct words, and each word has between 1 and 10 lowercase letters. A word can be used any number of times.

Cut the text into pieces so that every piece is a word from the list. Each way of cutting gives one sentence: its pieces joined with single spaces. Return every sentence, in any order. If the text cannot be cut at all, return an empty list. A search that tries every cut from the start repeats the same questions many times, so remember the answer for each starting point the first time you compute it.

::exercise
---
id: iv-hard-072
prompt: Write a function word_break(s, words) that returns every sentence made by splitting s into words from the list, with the words joined by single spaces. Return the sentences in any order, or an empty list if there are none.
starter: |
  # write your code below
  def word_break(s, words):
      pass
hints:
  - Try each word that starts at the current position; for each one that fits, solve the rest of the text.
  - Keep the answers for each starting position in a dictionary, so the same rest of the text is never solved twice.
tests:
  - check: assert sorted(word_break("catsanddog", ["cat", "cats", "and", "sand", "dog"])) == ["cat sand dog", "cats and dog"]
  - check: assert sorted(word_break("pineapplepenapple", ["apple", "pen", "applepen", "pine", "pineapple"])) == ["pine apple pen apple", "pine applepen apple", "pineapple pen apple"]
  - check: assert word_break("catsandog", ["cats", "dog", "sand", "and", "cat"]) == []
  - check: assert word_break("a", ["a"]) == ["a"]
  - check: assert sorted(word_break("aaa", ["a", "aa"])) == ["a a a", "a aa", "aa a"]
  - check: assert word_break("ab", ["a", "b"]) == ["a b"]
  - check: assert word_break("abc", ["ab", "c"]) == ["ab c"]
  - check: assert sorted(word_break("ab", ["a", "ab", "b"])) == ["a b", "ab"]
  - check: assert word_break("bb", ["b"]) == ["b b"]
  - check: assert word_break("abab", ["ab", "aba"]) == ["ab ab"]
big: 'assert (lambda s, words: (lambda r: len(r) == 256 and len(set(r)) == 256 and all(all(w in words for w in x.split(" ")) and x.replace(" ", "") == s for x in r))(word_break(s, words)))("a" * 18 + "b", ["a" * k for k in range(1, 10)] + ["a" * 9 + "b"])'
solution: |
  def word_break(s, words):
      known = set(words)
      memo = {}
      def go(i):
          if i == len(s):
              return [[]]
          if i in memo:
              return memo[i]
          out = []
          for j in range(i + 1, len(s) + 1):
              if s[i:j] in known:
                  for rest in go(j):
                      out.append([s[i:j]] + rest)
          memo[i] = out
          return out
      return [" ".join(x) for x in go(0)]
brute: |
  def word_break(s, words):
      out = []
      n = len(s)
      for mask in range(1 << (n - 1)):
          cuts = [i + 1 for i in range(n - 1) if mask >> i & 1] + [n]
          pieces = []
          start = 0
          for c in cuts:
              pieces.append(s[start:c])
              start = c
          if all(p in words for p in pieces):
              out.append(" ".join(pieces))
      return out
random:
  call: word_break
  gen: |
    def gen(rng, size):
        s = "".join(rng.choice("ab") for _ in range(rng.randint(1, min(max(size, 1), 12))))
        words = list({"".join(rng.choice("ab") for _ in range(rng.randint(1, 3))) for _ in range(rng.randint(1, 5))})
        return (s, words)
  same: |
    def same(args, got, want):
        return sorted(got) == sorted(want)
slow:
  - |
    def word_break(s, words):
        def go(i):
            if i == len(s):
                return [[]]
            out = []
            for w in words:
                if s.startswith(w, i):
                    for rest in go(i + len(w)):
                        out.append([w] + rest)
            return out
        return [" ".join(x) for x in go(0)]
wrong:
  - |
    def word_break(s, words):
        def go(i):
            if i == len(s):
                return []
            for w in words:
                if s.startswith(w, i):
                    rest = go(i + len(w))
                    if rest is not None:
                        return [w] + rest
            return None
        found = go(0)
        return [] if found is None else [" ".join(found)]
  - |
    def word_break(s, words):
        known = set(w for w in words if len(w) < 10)
        memo = {}
        def go(i):
            if i == len(s):
                return [[]]
            if i in memo:
                return memo[i]
            out = []
            for j in range(i + 1, len(s) + 1):
                if s[i:j] in known:
                    for rest in go(j):
                        out.append([s[i:j]] + rest)
            memo[i] = out
            return out
        return [" ".join(x) for x in go(0)]
  - |
    def word_break(s, words):
        known = set(words)
        memo = {}
        def go(i):
            if i == len(s):
                return [[]]
            if i in memo:
                return memo[i]
            out = []
            for j in range(i + 1, len(s) + 1):
                if s[i:j] in known:
                    for rest in go(j):
                        out.append([s[i:j]] + rest)
            memo[i] = out
            return out
        return ["".join(x) for x in go(0)]
equivalent: []
---
::
