---
title: Word Break
tier: medium
order: 96
leetcode: 139
url: https://leetcode.com/problems/word-break/
companies: [Amazon, Google, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week2-loops/04-dictionaries, /learn/week10-algorithms/10-dynamic-programming]
---

You get a string `s` of between 1 and 400 lowercase letters, and `word_dict`, a list of between 1 and 100 words. Each word has between 1 and 100 lowercase letters, and the same word may be listed more than once.

Return `True` if `s` can be split into one or more pieces that each appear in `word_dict`, with the pieces joined back together to make `s`. Words may be reused as many times as needed. Return `False` otherwise.

::exercise
---
id: iv-medium-096
prompt: Write a function word_break(s, word_dict) that returns True if s can be split into pieces that are each in word_dict, and False otherwise.
starter: |
  # write your code below
  def word_break(s, word_dict):
      pass
hints:
  - Put the words in a set first, so checking whether a piece is a word takes one step.
  - Track which prefixes of s can be split properly. A prefix ending at position end can be split if some shorter prefix that can be split is followed by a word that fits the gap.
tests:
  - check: assert word_break("leetcode", ["leet", "code"]) == True
  - check: assert word_break("applepenapple", ["apple", "pen"]) == True
  - check: assert word_break("catsandog", ["cats", "dog", "sand", "and", "cat"]) == False
  - check: assert word_break("a", ["a"]) == True
  - check: assert word_break("a", ["b"]) == False
  - check: assert word_break("aaaaaaa", ["aaaa", "aaa"]) == True
  - check: assert word_break("abc", ["ab", "a", "bc"]) == True
  - check: assert word_break("abcd", ["a", "abc", "b", "cd"]) == True
big: assert word_break("a" * 396, ["a" * 40, "a" * 39]) == True and word_break("a" * 396 + "b", ["a" * k for k in range(38, 44)] + ["bb"]) == False
solution: |
  def word_break(s, word_dict):
      words = set(word_dict)
      longest = max(len(w) for w in word_dict)
      ok = [True] + [False] * len(s)
      for end in range(1, len(s) + 1):
          for start in range(max(0, end - longest), end):
              if ok[start] and s[start:end] in words:
                  ok[end] = True
                  break
      return ok[len(s)]
brute: |
  def word_break(s, word_dict):
      def go(i):
          if i == len(s):
              return True
          return any(s.startswith(w, i) and go(i + len(w)) for w in word_dict)
      return go(0)
slow:
  - |
    def word_break(s, word_dict):
        def split_from(i):
            if i == len(s):
                return True
            for w in word_dict:
                if s[i:i + len(w)] == w and split_from(i + len(w)):
                    return True
            return False
        return split_from(0)
random:
  call: word_break
  gen: |
    def gen(rng, size):
        s = "".join(rng.choice("ab") for _ in range(min(max(size, 1), 8)))
        words = ["".join(rng.choice("ab") for _ in range(rng.randint(1, 3))) for _ in range(rng.randint(1, 4))]
        return (s, words)
wrong:
  - |
    def word_break(s, word_dict):
        return all(any(ch in w for w in word_dict) for ch in s)
  - |
    def word_break(s, word_dict):
        i = 0
        while i < len(s):
            for w in word_dict:
                if s.startswith(w, i):
                    i += len(w)
                    break
            else:
                return False
        return True
  - |
    def word_break(s, word_dict):
        words = set(word_dict)
        longest = max(len(w) for w in word_dict)
        ok = [True] + [False] * len(s)
        for end in range(1, len(s) + 1):
            for start in range(max(0, end - longest), end):
                if ok[start] and s[start:end] in words:
                    ok[end] = True
                    break
        return ok[len(s) - 1]
equivalent:
  - "for end in range(0, len(s) + 1):"  # why: at end = 0 the inner range is empty, so the extra pass does nothing
  - "for start in range(max(-1, end - longest), end):"  # why: ok[-1] is ok[len(s)], which is still False until end reaches len(s), so start = -1 never sets anything
  - "for start in range(min(0, end - longest), end):"  # why: starts further back than the longest word give a piece longer than any word, so they never match and the extra starts change nothing
---
::
