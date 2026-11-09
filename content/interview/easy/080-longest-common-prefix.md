---
title: Longest Common Prefix
tier: easy
order: 80
leetcode: 14
url: https://leetcode.com/problems/longest-common-prefix/
companies: [Google, Amazon, Meta]
topic: Trie
needs: [/learn/week0-functions/04-strings, /learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes]
---

You get a list `strs` of between 1 and 200 words. Each word has between 0 and 200 lowercase letters. A common prefix is the start that every word shares. For example, "tread" and "trend" share the prefix "tr".

Return the longest common prefix of all the words. If the words share no first letter, or if one of them is empty, return the empty string `""`.

::exercise
---
id: iv-easy-080
prompt: Write a function longest_common_prefix(strs) that returns the longest string that is the start of every word in strs, or an empty string.
starter: |
  # write your code below
  def longest_common_prefix(strs):
      pass
hints:
  - Start with the first word as your guess, then cut it shorter until every other word starts with it.
  - A word that starts with the guess is enough to keep the guess, so you only need to test each word once.
tests:
  - check: assert longest_common_prefix(["tread", "trend", "tray"]) == "tr"
  - check: assert longest_common_prefix(["dog", "racecar", "car"]) == ""
  - check: assert longest_common_prefix(["a"]) == "a"
  - check: assert longest_common_prefix(["", "b"]) == ""
  - check: assert longest_common_prefix(["ab", "abc", "abcd"]) == "ab"
  - check: assert longest_common_prefix(["same", "same"]) == "same"
  - check: assert longest_common_prefix(["abc", "abd"]) == "ab"
  - check: assert longest_common_prefix(["x", "xy", "xyz", "x"]) == "x"
  - check: assert longest_common_prefix(["abc", "abd", "ax"]) == "a"
solution: |
  def longest_common_prefix(strs):
      prefix = strs[0]
      for word in strs[1:]:
          while not word.startswith(prefix):
              prefix = prefix[:-1]
      return prefix
brute: |
  def longest_common_prefix(strs):
      best = ""
      for k in range(len(strs[0]) + 1):
          candidate = strs[0][:k]
          ok = True
          for word in strs:
              if word[:k] != candidate:
                  ok = False
          if ok:
              best = candidate
      return best
random:
  call: longest_common_prefix
  gen: |
    def gen(rng, size):
        base = "".join(rng.choice("ab") for _ in range(rng.randint(0, size + 1)))
        strs = []
        for _ in range(rng.randint(1, 4)):
            extra = "".join(rng.choice("ab") for _ in range(rng.randint(0, 3)))
            strs.append(base + extra)
        return (strs,)
wrong:
  - |
    def longest_common_prefix(strs):
        prefix = strs[0]
        for word in strs[1:2]:
            while not word.startswith(prefix):
                prefix = prefix[:-1]
        return prefix
  - |
    def longest_common_prefix(strs):
        return min(strs, key=len)
  - |
    def longest_common_prefix(strs):
        prefix = strs[0]
        for word in strs[1:]:
            if not word.startswith(prefix):
                prefix = prefix[:-1]
        return prefix
equivalent:
  - "for word in strs[0:]:"  # why: the first word always starts with itself, so rechecking it never shortens the prefix
---
::
