---
title: Longest Happy Prefix
tier: hard
order: 9
leetcode: 1392
url: https://leetcode.com/problems/longest-happy-prefix/
companies: [Google, Amazon, Apple]
topic: Rolling hash
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string s of 1 to 60000 lowercase letters. A prefix is a piece taken from the start of s, and a suffix is a piece taken from the end. Return the longest prefix of s that is also a suffix, not counting s itself. If there is no such piece, return an empty string. The two pieces may overlap in s: for "aaaa" the answer is "aaa".

::exercise
---
id: iv-hard-009
prompt: Write a function longest_happy_prefix(s) that returns the longest proper prefix of s that is also a suffix, or an empty string if none exists.
starter: |
  # write your code below
  def longest_happy_prefix(s):
      pass
hints:
  - Check each length from longest to shortest. A piece of length k is a prefix and a suffix when s[:k] equals the last k characters of s.
  - A failure table over s, built the same way as for string matching, gives the longest border in one pass. The border is the last value of that table.
tests:
  - check: assert longest_happy_prefix("level") == "l"
  - check: assert longest_happy_prefix("ababab") == "abab"
  - check: assert longest_happy_prefix("leetcode") == ""
  - check: assert longest_happy_prefix("aaaa") == "aaa"
  - check: assert longest_happy_prefix("a") == ""
  - check: assert longest_happy_prefix("ab") == ""
  - check: assert longest_happy_prefix("abcab") == "ab"
  - check: assert longest_happy_prefix("abba") == "a"
  - check: assert longest_happy_prefix("aabaa") == "aa"
solution: |
  def longest_happy_prefix(s):
      fail = [0] * len(s)
      k = 0
      for i in range(1, len(s)):
          while k and s[i] != s[k]:
              k = fail[k - 1]
          if s[i] == s[k]:
              k += 1
          fail[i] = k
      return s[:fail[-1]]
brute: |
  def longest_happy_prefix(s):
      for k in range(len(s) - 1, 0, -1):
          if s[:k] == s[len(s) - k:]:
              return s[:k]
      return ""
random:
  call: longest_happy_prefix
  gen: |
    def gen(rng, size):
        return ("".join(rng.choice("ab") for _ in range(rng.randint(1, size + 4))),)
big: assert longest_happy_prefix((rng := __import__("random").Random(9)) and (AB := bytes(97 + (i & 1) for i in range(256))) and (P := rng.randbytes(20000).translate(AB).decode()) and (P + (Q := rng.randbytes(20000).translate(AB).decode()) + P)) == P and longest_happy_prefix((P2 := __import__("random").Random(9).randbytes(14999).translate(bytes(97 + (i & 1) for i in range(256))).decode()) and ((P2 + "b") * 3 + P2)) == (P2 + "b") * 2 + P2
# why: the natural slicing version (s[:k] == s[-k:]) finishes in about 0.1 s on this input, because each comparison fails within a few characters. The checker cannot catch that at this size, so the list-based version is the slow.
slow:
  - |
    def longest_happy_prefix(s):
        for k in range(len(s) - 1, 0, -1):
            if list(s[:k]) == list(s[-k:]):
                return s[:k]
        return ""
wrong:
  - |
    def longest_happy_prefix(s):
        if len(s) > 1 and s[:-1] == s[1:]:
            return s[:-1]
        return ""
  - |
    def longest_happy_prefix(s):
        fail = [0] * len(s)
        k = 0
        for i in range(1, len(s)):
            while k and s[i] != s[k]:
                k = fail[k - 1]
            if s[i] == s[k]:
                k += 1
            fail[i] = k
        return s[:fail[-1] - 1]
  - |
    def longest_happy_prefix(s):
        for k in range(len(s) - 1, 0, -1):
            if s[:k] == s[len(s) - k:][::-1]:
                return s[:k]
        return ""
---
::
