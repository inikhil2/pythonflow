---
title: Regular Expression Matching
tier: hard
order: 71
leetcode: 10
url: https://leetcode.com/problems/regular-expression-matching/
companies: [Amazon, Google, Apple]
topic: Dynamic programming
needs: [/learn/week0-functions/08-return-values, /learn/week0-functions/04-strings, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/10-dynamic-programming]
---

You get a text s and a pattern p. The text has between 1 and 20 lowercase letters. The pattern has between 1 and 20 characters, each a lowercase letter, a dot or a star. In the pattern, a dot matches any one letter, and a letter or dot followed by a star matches zero or more copies of it. Each star comes right after a letter or a dot, and never at the start of the pattern.

Return True if the pattern matches the whole text, and False otherwise. The match must cover every letter of the text; a match of only part of it does not count. A table with one row for each prefix of the text and one column for each prefix of the pattern answers every question once, so each cell is filled in a single step from cells already known.

::exercise
---
id: iv-hard-071
prompt: Write a function is_match(s, p) that returns True if the pattern p matches the whole text s, and False otherwise. A dot matches one letter, and a letter or dot followed by a star matches zero or more copies of it.
starter: |
  # write your code below
  def is_match(s, p):
      pass
hints:
  - Decide the last cell first, then fill each cell from the cells after it, one step at a time.
  - If the pattern character after the current one is a star, the star can match zero copies, or match one copy and stay in place.
tests:
  - check: assert is_match("aa", "a") == False
  - check: assert is_match("aa", "a*") == True
  - check: assert is_match("ab", ".*") == True
  - check: assert is_match("aab", "c*a*b") == True
  - check: assert is_match("mississippi", "mis*is*p*.") == False
  - check: assert is_match("ab", ".*c") == False
  - check: assert is_match("a", "ab*") == True
  - check: assert is_match("aaa", "a*a") == True
  - check: assert is_match("aab", "a*ab") == True
  - check: assert is_match("ab", "a*b") == True
  - check: assert is_match("a", "a") == True
  - check: assert is_match("abc", "a.c") == True
big: assert is_match("a" * 19, "a*" * 9 + "a") == True and is_match("a" * 20, "a*" * 9 + "b") == False
solution: |
  def is_match(s, p):
      m, n = len(s), len(p)
      dp = [[False] * (n + 1) for _ in range(m + 1)]
      dp[m][n] = True
      for i in range(m, -1, -1):
          for j in range(n - 1, -1, -1):
              first = i < m and p[j] in (s[i], ".")
              if j + 1 < n and p[j + 1] == "*":
                  dp[i][j] = dp[i][j + 2] or (first and dp[i + 1][j])
              else:
                  dp[i][j] = first and dp[i + 1][j + 1]
      return dp[0][0]
brute: |
  def is_match(s, p):
      if not p:
          return not s
      first = bool(s) and p[0] in (s[0], ".")
      if len(p) >= 2 and p[1] == "*":
          return is_match(s, p[2:]) or (first and is_match(s[1:], p))
      return first and is_match(s[1:], p[1:])
random:
  call: is_match
  gen: |
    def gen(rng, size):
        s = "".join(rng.choice("ab") for _ in range(rng.randint(1, min(max(size, 1), 20))))
        p = ""
        while len(p) < rng.randint(1, 8):
            p += rng.choice("ab.")
            if rng.random() < 0.4:
                p += "*"
        return (s, p)
slow:
  - |
    def is_match(s, p):
        if not p:
            return not s
        first = bool(s) and p[0] in (s[0], ".")
        if len(p) >= 2 and p[1] == "*":
            return is_match(s, p[2:]) or (first and is_match(s[1:], p))
        return first and is_match(s[1:], p[1:])
wrong:
  - |
    def is_match(s, p):
        return s == p
  - |
    def is_match(s, p):
        if not p:
            return not s
        first = bool(s) and p[0] in (s[0], ".")
        if len(p) >= 2 and p[1] == "*":
            return first and is_match(s[1:], p)
        return first and is_match(s[1:], p[1:])
  - |
    def is_match(s, p):
        i = j = 0
        while j < len(p):
            if j + 1 < len(p) and p[j + 1] == "*":
                while i < len(s) and p[j] in (s[i], "."):
                    i += 1
                j += 2
            elif i < len(s) and p[j] in (s[i], "."):
                i += 1
                j += 1
            else:
                return False
        return i == len(s)
equivalent:
  - "3: dp = [[False] * (n + 2) for _ in range(m + 1)]"   # why: column n + 1 is never read, since j + 2 is at most n
  - "3: dp = [[False] * (n + 1) for _ in range(m + 2)]"   # why: row m + 1 is never read, since the loop reads row i + 1 only when i < m
  - "5: for i in range(m, -2, -1):"   # why: the pass at i = -1 writes row m, which is read only before this pass; dp[0][0] is already final
---
::
