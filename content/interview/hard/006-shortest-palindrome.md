---
title: Shortest Palindrome
tier: hard
order: 6
leetcode: 214
url: https://leetcode.com/problems/shortest-palindrome/
companies: [Google, Amazon, Microsoft]
topic: Rolling hash
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string s of 0 to 110000 lowercase letters. You may add letters only to the front of s. Return the shortest palindrome that you can make this way. If s is already a palindrome, return s unchanged. If s is empty, return an empty string.

Some letters at the start of s may already form a palindrome. Only the letters after that part need to be copied, reversed, and placed in front.

::exercise
---
id: iv-hard-006
prompt: Write a function shortest_palindrome(s) that returns the shortest palindrome made by adding letters to the front of s.
starter: |
  # write your code below
  def shortest_palindrome(s):
      pass
hints:
  - Find the longest prefix of s that is a palindrome. The part of s after it, reversed, goes in front.
  - Checking each prefix from longest to shortest is correct but slow: each check copies and compares a prefix, so the total is O(n²) and too slow in an interview. A prefix-function table over s joined to its reverse finds the longest palindromic prefix in one pass.
tests:
  - check: assert shortest_palindrome("aacecaaa") == "aaacecaaa"
  - check: assert shortest_palindrome("abcd") == "dcbabcd"
  - check: assert shortest_palindrome("") == ""
  - check: assert shortest_palindrome("a") == "a"
  - check: assert shortest_palindrome("ab") == "bab"
  - check: assert shortest_palindrome("racecar") == "racecar"
  - check: assert shortest_palindrome("abacd") == "dcabacd"
  - check: assert shortest_palindrome("aabba") == "abbaabba"
  - check: assert shortest_palindrome("aaaa") == "aaaa"
solution: |
  def shortest_palindrome(s):
      t = s + "#" + s[::-1]
      fail = [0] * len(t)
      for i in range(1, len(t)):
          k = fail[i - 1]
          while k and t[i] != t[k]:
              k = fail[k - 1]
          if t[i] == t[k]:
              k += 1
          fail[i] = k
      return s[fail[-1]:][::-1] + s
brute: |
  def shortest_palindrome(s):
      for k in range(len(s), -1, -1):
          if s[:k] == s[:k][::-1]:
              return s[k:][::-1] + s
random:
  call: shortest_palindrome
  gen: |
    def gen(rng, size):
        return ("".join(rng.choice("ab") for _ in range(rng.randint(0, size + 4))),)
big: assert shortest_palindrome((rng := __import__("random").Random(6)) and (S := rng.randbytes(110000).translate(bytes(97 + (i & 1) for i in range(256))).decode())) == S[5:][::-1] + S
# why: the slicing version (for each length k from longest, compare s[:k] with its reverse) is removed as a slow: it runs at C speed, and at the stated maximum it finishes in about 3.8 s, so it cannot be separated from a correct solution within the time limit
slow:
  - |
    def shortest_palindrome(s):
        n = len(s)
        for k in range(n, -1, -1):
            ok = True
            for i in range(k // 2):
                if s[i] != s[k - 1 - i]:
                    ok = False
            if ok:
                return s[k:][::-1] + s
        return s
wrong:
  - |
    def shortest_palindrome(s):
        n = len(s)
        for k in (n, n - 1):
            if k >= 0 and s[:k] == s[:k][::-1]:
                return s[k:][::-1] + s
        return s[::-1] + s
  - |
    def shortest_palindrome(s):
        t = s + "#" + s[::-1]
        fail = [0] * len(t)
        for i in range(1, len(t)):
            k = fail[i - 1]
            while k and t[i] != t[k]:
                k = fail[k - 1]
            if t[i] == t[k]:
                k += 1
            fail[i] = k
        return s[fail[-1] - 1:][::-1] + s
  - |
    def shortest_palindrome(s):
        if s == s[::-1]:
            return s
        return s[::-1] + s
---
::
