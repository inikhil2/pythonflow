---
title: Isomorphic Strings
tier: easy
order: 67
leetcode: 205
url: https://leetcode.com/problems/isomorphic-strings/
companies: [Amazon, Google, Meta]
topic: Hash table
needs: [/learn/week0-functions/04-strings, /learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get two strings `s` and `t` of the same length, between 1 and 10000 lowercase letters each. The strings are isomorphic when every letter in `s` can be replaced by one letter of `t` so that the same letter in `s` always becomes the same letter in `t`, and two different letters in `s` never become the same letter in `t`. A letter may become itself.

Return `True` if the two strings are isomorphic and `False` if they are not.

::exercise
---
id: iv-easy-067
prompt: Write a function is_isomorphic(s, t) that returns True if the two strings are isomorphic and False otherwise.
starter: |
  # write your code below
  def is_isomorphic(s, t):
      pass
hints:
  - Keep two dictionaries, one from letters of s to letters of t and one the other way round.
  - Check both dictionaries at each position, because a clash can happen in either direction.
tests:
  - check: assert is_isomorphic("egg", "add") == True
  - check: assert is_isomorphic("foo", "bar") == False
  - check: assert is_isomorphic("paper", "title") == True
  - check: assert is_isomorphic("badc", "baba") == False
  - check: assert is_isomorphic("a", "a") == True
  - check: assert is_isomorphic("ab", "aa") == False
  - check: assert is_isomorphic("ab", "ba") == True
  - check: assert is_isomorphic("aba", "cdd") == False
solution: |
  def is_isomorphic(s, t):
      forward = {}
      backward = {}
      for i in range(len(s)):
          a = s[i]
          b = t[i]
          if a in forward and forward[a] != b:
              return False
          if b in backward and backward[b] != a:
              return False
          forward[a] = b
          backward[b] = a
      return True
brute: |
  def is_isomorphic(s, t):
      for i in range(len(s)):
          for j in range(len(s)):
              if (s[i] == s[j]) != (t[i] == t[j]):
                  return False
      return True
random:
  call: is_isomorphic
  gen: |
    def gen(rng, size):
        n = max(size, 1)
        s = "".join(rng.choice("abcd") for _ in range(n))
        if rng.random() < 0.5:
            letters = rng.sample("wxyz", 4)
            t = "".join(letters["abcd".index(c)] for c in s)
        else:
            t = "".join(rng.choice("wxyz") for _ in range(n))
        return (s, t)
big: assert is_isomorphic(s := "".join("bcd"[(i * i) % 3] for i in range(9000)) + "".join("abcd"[(i * 7) % 4] for i in range(998)) + "e", "".join("wxyz"["abcd".index(c)] for c in s[:-1]) + "w") == False
slow:
  - |
    def is_isomorphic(s, t):
        for i in range(len(s)):
            for j in range(len(s)):
                if (s[i] == s[j]) != (t[i] == t[j]):
                    return False
        return True
wrong:
  - |
    def is_isomorphic(s, t):
        mapping = {}
        for i in range(len(s)):
            if s[i] in mapping and mapping[s[i]] != t[i]:
                return False
            mapping[s[i]] = t[i]
        return True
  - |
    def is_isomorphic(s, t):
        return len(set(s)) == len(set(t))
  - |
    def is_isomorphic(s, t):
        forward = {}
        backward = {}
        for i in range(len(s) - 1):
            a = s[i]
            b = t[i]
            if a in forward and forward[a] != b:
                return False
            if b in backward and backward[b] != a:
                return False
            forward[a] = b
            backward[b] = a
        return True
---
::
