---
title: Is Subsequence
tier: easy
order: 52
leetcode: 392
url: https://leetcode.com/problems/is-subsequence/
companies: [Meta, Google, Amazon]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get two strings, s and t, of lowercase letters. s has 0 to 100 letters and t has 0 to 10000 letters. Return True if s can be made by deleting some letters from t without changing the order of the rest. Return False otherwise. An empty s is always a subsequence.

::exercise
---
id: iv-easy-052
prompt: Write a function is_subsequence(s, t) that returns True if s can be formed from t by deleting some letters, and False otherwise.
starter: |
  # write your code below
  def is_subsequence(s, t):
      pass
hints:
  - Walk through t once, and move on to the next letter of s each time you find it.
  - When s has no letters left to find, every letter of s was found in order.
tests:
  - check: assert is_subsequence("abc", "ahbgdc") == True
  - check: assert is_subsequence("axc", "ahbgdc") == False
  - check: assert is_subsequence("", "ahbgdc") == True
  - check: assert is_subsequence("abc", "") == False
  - check: assert is_subsequence("", "") == True
  - check: assert is_subsequence("ab", "baa") == False
  - check: assert is_subsequence("aa", "aba") == True
solution: |
  def is_subsequence(s, t):
      i = 0
      for ch in t:
          if i < len(s) and s[i] == ch:
              i += 1
      return i == len(s)
brute: |
  def is_subsequence(s, t):
      it = iter(t)
      return all(ch in it for ch in s)
random:
  call: is_subsequence
  gen: |
    def gen(rng, size):
        s = "".join(rng.choice("abc") for _ in range(rng.randint(0, size + 3)))
        t = "".join(rng.choice("abc") for _ in range(rng.randint(0, size + 6)))
        return (s, t)
wrong:
  - |
    def is_subsequence(s, t):
        return s in t
  - |
    def is_subsequence(s, t):
        return set(s) <= set(t)
---
::
