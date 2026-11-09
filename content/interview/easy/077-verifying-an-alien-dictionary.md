---
title: Verifying an Alien Dictionary
tier: easy
order: 77
leetcode: 953
url: https://leetcode.com/problems/verifying-an-alien-dictionary/
companies: [Meta, Google, Amazon]
topic: Hash table
needs: [/learn/week0-functions/04-strings, /learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

A made-up language uses the 26 lowercase letters, but in its own order. You get the letters in that order as one string `order`, which always holds each of the 26 letters exactly once. You also get a list `words` of between 1 and 100 words, each with between 1 and 20 lowercase letters.

Return `True` if the words are in sorted order under this language's letter order, and `False` if not. Compare two words letter by letter from the left, and at the first place they differ, the earlier letter in `order` must come first. If one word is the start of the other, the shorter word comes first.

::exercise
---
id: iv-easy-077
prompt: Write a function is_alien_sorted(words, order) that returns True if words are sorted under the letter order given by order, and False otherwise.
starter: |
  # write your code below
  def is_alien_sorted(words, order):
      pass
hints:
  - Give each letter its position in order, so you can compare two letters by their positions.
  - Only neighbouring words need checking, because sorted order is decided one pair at a time.
tests:
  - check: assert is_alien_sorted(["hello", "leetcode"], "hlabcdefgijkmnopqrstuvwxyz") == True
  - check: assert is_alien_sorted(["word", "world", "row"], "worldabcefghijkmnpqstuvxyz") == False
  - check: assert is_alien_sorted(["apple", "app"], "abcdefghijklmnopqrstuvwxyz") == False
  - check: assert is_alien_sorted(["app", "apple"], "abcdefghijklmnopqrstuvwxyz") == True
  - check: assert is_alien_sorted(["b", "a"], "abcdefghijklmnopqrstuvwxyz") == False
  - check: assert is_alien_sorted(["b", "a"], "zyxwvutsrqponmlkjihgfedcba") == True
  - check: assert is_alien_sorted(["ab", "ab"], "abcdefghijklmnopqrstuvwxyz") == True
  - check: assert is_alien_sorted(["abc", "abd", "abe"], "abcdefghijklmnopqrstuvwxyz") == True
solution: |
  def is_alien_sorted(words, order):
      rank = {}
      for i in range(len(order)):
          rank[order[i]] = i
      for k in range(len(words) - 1):
          a = words[k]
          b = words[k + 1]
          j = 0
          while j < len(a) and j < len(b) and a[j] == b[j]:
              j += 1
          if j == len(b) and j < len(a):
              return False
          if j < len(a) and j < len(b) and rank[a[j]] > rank[b[j]]:
              return False
      return True
brute: |
  def is_alien_sorted(words, order):
      rank = {}
      for i in range(len(order)):
          rank[order[i]] = i
      keys = []
      for w in words:
          key = []
          for ch in w:
              key.append(rank[ch])
          keys.append(key)
      return keys == sorted(keys)
random:
  call: is_alien_sorted
  gen: |
    def gen(rng, size):
        letters = list("abcdefghijklmnopqrstuvwxyz")
        rng.shuffle(letters)
        order = "".join(letters)
        words = ["".join(rng.choice("abcde") for _ in range(rng.randint(1, 3))) for _ in range(max(size, 1))]
        if rng.random() < 0.5:
            rank = {}
            for i in range(len(order)):
                rank[order[i]] = i
            words.sort(key=lambda w: [rank[c] for c in w])
        return (words, order)
wrong:
  - |
    def is_alien_sorted(words, order):
        rank = {}
        for i in range(len(order)):
            rank[order[i]] = i
        for k in range(len(words) - 1):
            if rank[words[k][0]] > rank[words[k + 1][0]]:
                return False
        return True
  - |
    def is_alien_sorted(words, order):
        return words == sorted(words)
  - |
    def is_alien_sorted(words, order):
        rank = {}
        for i in range(len(order)):
            rank[order[i]] = i
        for k in range(len(words) - 1):
            a = words[k]
            b = words[k + 1]
            for j in range(min(len(a), len(b))):
                if a[j] != b[j]:
                    if rank[a[j]] > rank[b[j]]:
                        return False
                    break
        return True
equivalent:
  - "if j < len(a) and j <= len(b) and (rank[a[j]] > rank[b[j]]):"  # why: when j equals len(b) the earlier check has already returned False, so j is always below len(b) here
  - "if j < len(a) and j < len(b) and (rank[a[j]] >= rank[b[j]]):"  # why: the while loop already skipped equal letters, so at this point a[j] and b[j] differ and their ranks can never be equal
---
::
