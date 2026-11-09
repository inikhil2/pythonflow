---
title: Palindrome Pairs
tier: hard
order: 66
leetcode: 336
url: https://leetcode.com/problems/palindrome-pairs/
companies: [Amazon, Google, Microsoft]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week2-loops/04-dictionaries]
---

You get a list of different words, each made of lowercase letters (a word can also be the empty text ""). Find every pair of positions [i, j] with i != j such that the word at i followed directly by the word at j reads the same forwards and backwards.

Return the pairs as a list of [i, j] lists, in any order. The order of i and j matters, so [0, 1] and [1, 0] are two different pairs when both work, and no pair appears twice. There are between 1 and 5000 words, each at most 20 letters long, and checking every pair of words one by one is too slow for the largest lists.

::exercise
---
id: iv-hard-066
prompt: Write a function palindrome_pairs(words) that returns every [i, j], i != j, where words[i] + words[j] is a palindrome.
starter: |
  # write your code below
  def palindrome_pairs(words):
      pass
hints:
  - Put every word in a dict from word to position. For a word, try every split into a left part and a right part.
  - If the left part is a palindrome, the word whose text is the right part reversed can go in front; if the right part is a palindrome, the word that is the left part reversed can go behind.
tests:
  - check: assert sorted(palindrome_pairs(['abcd', 'dcba', 'lls', 's', 'sssll'])) == [[0, 1], [1, 0], [2, 4], [3, 2]]
  - check: assert sorted(palindrome_pairs(['bat', 'tab', 'cat'])) == [[0, 1], [1, 0]]
  - check: assert sorted(palindrome_pairs(['a', ''])) == [[0, 1], [1, 0]]
  - check: assert sorted(palindrome_pairs(['a', 'b', 'c', ''])) == [[0, 3], [1, 3], [2, 3], [3, 0], [3, 1], [3, 2]]
  - check: assert sorted(palindrome_pairs(['abc', 'cba'])) == [[0, 1], [1, 0]]
  - check: assert sorted(palindrome_pairs(['ab', 'ba', 'abc', 'cba', 'aa'])) == [[0, 1], [0, 3], [1, 0], [2, 1], [2, 3], [3, 2]]
  - check: assert sorted(palindrome_pairs(['aa', 'a'])) == [[0, 1], [1, 0]]
  - check: assert sorted(palindrome_pairs(['race', 'car'])) == [[0, 1]]
  - check: assert sorted(palindrome_pairs(['xyz'])) == []
  - check: assert sorted(palindrome_pairs([''])) == []
  - check: assert sorted(palindrome_pairs(['abcd', 'cba', 'dcb'])) == [[0, 1], [2, 0]]
  - check: assert sorted(palindrome_pairs(['ab', 'a'])) == [[0, 1]]
  - check: assert sorted(palindrome_pairs(['ba', 'a'])) == [[1, 0]]
  - check: assert sorted(palindrome_pairs(['lls', 'sssll', 's', 'll'])) == [[0, 1], [0, 3], [2, 0], [3, 1]]
  - check: assert sorted(palindrome_pairs(['a', 'aa', 'aaa'])) == [[0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1]]
  - check: assert sorted(palindrome_pairs(['aba', '', 'b'])) == [[0, 1], [1, 0], [1, 2], [2, 1]]
solution: |
  def palindrome_pairs(words):
      index = {w: i for i, w in enumerate(words)}
      out = []
      for i, w in enumerate(words):
          for cut in range(len(w) + 1):
              left, right = w[:cut], w[cut:]
              if left == left[::-1]:
                  j = index.get(right[::-1])
                  if j is not None and j != i:
                      out.append([j, i])
              if right and right == right[::-1]:
                  j = index.get(left[::-1])
                  if j is not None and j != i:
                      out.append([i, j])
      return out
brute: |
  def palindrome_pairs(words):
      out = []
      for i in range(len(words)):
          for j in range(len(words)):
              if i != j:
                  s = words[i] + words[j]
                  if s == s[::-1]:
                      out.append([i, j])
      return out
valid: |
  def valid(words):
      return 1 <= len(words) <= 5000 and len(set(words)) == len(words) and all(len(w) <= 20 and all("a" <= c <= "z" for c in w) for w in words)
random:
  call: palindrome_pairs
  same: |
    def same(args, got, want):
        return sorted(map(list, got)) == sorted(map(list, want))
  gen: |
    def gen(rng, size):
        n = rng.randint(1, size + 3)
        words = set()
        for _ in range(n):
            words.add("".join(rng.choice("ab") for _ in range(rng.randint(0, 4))))
        words = sorted(words)
        rng.shuffle(words)
        return (words,)
big: 'assert (r := palindrome_pairs([("" if v == 0 else bin(v)[2:].replace("0", "a").replace("1", "b")) for v in [i * 1237 % 5003 for i in range(5000)]])) and len(r) == 16510 and sum(i * 7919 + j for i, j in r) == 331283507863 and len(set(map(tuple, r))) == len(r)'
slow:
  - |
    def palindrome_pairs(words):
        out = []
        for i in range(len(words)):
            for j in range(len(words)):
                if i != j:
                    s = words[i] + words[j]
                    if s == s[::-1]:
                        out.append([i, j])
        return out
wrong:
  - |
    def palindrome_pairs(words):
        index = {w: i for i, w in enumerate(words)}
        out = []
        for i, w in enumerate(words):
            for cut in range(len(w) + 1):
                left, right = w[:cut], w[cut:]
                if left == left[::-1]:
                    j = index.get(right[::-1])
                    if j is not None:
                        out.append([j, i])
                if right and right == right[::-1]:
                    j = index.get(left[::-1])
                    if j is not None:
                        out.append([i, j])
        return out
  - |
    def palindrome_pairs(words):
        index = {w: i for i, w in enumerate(words)}
        out = []
        for i, w in enumerate(words):
            for cut in range(len(w) + 1):
                left, right = w[:cut], w[cut:]
                if left == left[::-1]:
                    j = index.get(right[::-1])
                    if j is not None and j != i:
                        out.append([j, i])
        return out
  - |
    def palindrome_pairs(words):
        index = {w: i for i, w in enumerate(words)}
        out = []
        for i, w in enumerate(words):
            for cut in range(len(w) + 1):
                left, right = w[:cut], w[cut:]
                if left == left[::-1]:
                    j = index.get(right[::-1])
                    if j is not None and j != i:
                        out.append([j, i])
                if right == right[::-1]:
                    j = index.get(left[::-1])
                    if j is not None and j != i:
                        out.append([i, j])
        return out
  - |
    def palindrome_pairs(words):
        index = {w: i for i, w in enumerate(words)}
        out = []
        for i, w in enumerate(words):
            j = index.get(w[::-1])
            if j is not None and j != i:
                out.append([i, j])
        return out
  - |
    def palindrome_pairs(words):
        index = {w: i for i, w in enumerate(words)}
        out = []
        for i, w in enumerate(words):
            for cut in range(len(w) + 1):
                left, right = w[:cut], w[cut:]
                if left == left[::-1]:
                    j = index.get(right[::-1])
                    if j is not None and j != i:
                        out.append([i, j])
                if right and right == right[::-1]:
                    j = index.get(left[::-1])
                    if j is not None and j != i:
                        out.append([j, i])
        return out
---
::
