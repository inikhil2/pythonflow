---
title: Longest Palindromic Substring
tier: medium
order: 87
leetcode: 5
url: https://leetcode.com/problems/longest-palindromic-substring/
companies: [Amazon, Google, Meta]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week10-algorithms/01-two-pointers, /learn/week10-algorithms/10-dynamic-programming]
---

You get a string `s` of between 1 and 5000 lowercase letters. A palindrome reads the same forwards and backwards, and a single letter counts as a palindrome.

Return the longest substring of `s` that is a palindrome. A substring is a run of letters that stays together in the original string. If several palindromes share the longest length, return the one that starts earliest in `s`.

::exercise
---
id: iv-medium-087
prompt: Write a function longest_palindrome(s) that returns the longest palindromic substring of s, choosing the earliest one when two tie.
starter: |
  # write your code below
  def longest_palindrome(s):
      pass
hints:
  - A palindrome grows outward from its middle. Try every middle position, and both a single letter and a pair of equal letters as the middle.
  - From each middle, move the two ends outward while the letters match, and keep the longest run you find. Only replace the answer when a run is strictly longer, so the earliest one wins ties.
tests:
  - check: assert longest_palindrome("babad") == "bab"
  - check: assert longest_palindrome("cbbd") == "bb"
  - check: assert longest_palindrome("a") == "a"
  - check: assert longest_palindrome("ac") == "a"
  - check: assert longest_palindrome("forgeeksskeegfor") == "geeksskeeg"
  - check: assert longest_palindrome("abacdfgdcaba") == "aba"
  - check: assert longest_palindrome("aaaa") == "aaaa"
big: assert (s := "".join("c" if i == 99 else "a" if i == 250 else "c" if i == 599 else "a" if i == 750 else "ab"[min(i - 100, 249 - i) % 2] if 100 <= i < 250 else "ab"[min(i - 600, 749 - i) % 2] if 600 <= i < 750 else "abc"[((i * 2654435761) % 4294967296 >> 13) % 3] for i in range(5000))) and longest_palindrome(s) == s[100:250]
solution: |
  def longest_palindrome(s):
      best_start, best_len = 0, 1
      for center in range(len(s)):
          for lo, hi in ((center, center), (center, center + 1)):
              while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
                  lo -= 1
                  hi += 1
              length = hi - lo - 1
              start = lo + 1
              if length > best_len or (length == best_len and start < best_start):
                  best_start, best_len = start, length
      return s[best_start:best_start + best_len]
brute: |
  def longest_palindrome(s):
      n = len(s)
      for length in range(n, 0, -1):
          for start in range(n - length + 1):
              piece = s[start:start + length]
              if piece == piece[::-1]:
                  return piece
slow:
  - |
    def longest_palindrome(s):
        n = len(s)
        best = s[0]
        for i in range(n):
            for j in range(i + 1, n + 1):
                ok = True
                a, b = i, j - 1
                while a < b:
                    if s[a] != s[b]:
                        ok = False
                        break
                    a += 1
                    b -= 1
                if ok and j - i > len(best):
                    best = s[i:j]
        return best
  - |
    def longest_palindrome(s):
        n = len(s)
        for length in range(n, 0, -1):
            for start in range(n - length + 1):
                piece = s[start:start + length]
                if piece == piece[::-1]:
                    return piece
random:
  call: longest_palindrome
  gen: |
    def gen(rng, size):
        return ("".join(rng.choice("abc") for _ in range(max(size, 1))),)
wrong:
  - |
    def longest_palindrome(s):
        best_start, best_len = 0, 1
        for center in range(len(s)):
            lo, hi = center, center
            while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
                lo -= 1
                hi += 1
            length = hi - lo - 1
            if length > best_len:
                best_start, best_len = lo + 1, length
        return s[best_start:best_start + best_len]
  - |
    def longest_palindrome(s):
        best_start, best_len = 0, 1
        for center in range(len(s)):
            for lo, hi in ((center, center), (center, center + 1)):
                while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
                    lo -= 1
                    hi += 1
                length = hi - lo - 1
                if length >= best_len:
                    best_start, best_len = lo + 1, length
        return s[best_start:best_start + best_len]
  - |
    def longest_palindrome(s):
        best = s[0]
        for i in range(len(s)):
            for j in range(i + 1, len(s) + 1):
                if s[i] == s[j - 1] and j - i > len(best):
                    best = s[i:j]
        return best
equivalent:
  - "best_start, best_len = (0, 0)"  # why: the first centre always gives a palindrome of length 1 or more, which replaces the starting values
  - "best_start, best_len = (1, 1)"  # why: the first centre gives start 0 with length 1, and start 0 is earlier than 1, so the first centre always replaces the starting values
  - "for lo, hi in ((center, center), (center, center - 1)):"  # why: the pair (center, center - 1) is the pair the previous centre already checked as (center - 1, center), so it only repeats a palindrome already seen
  - "if length > best_len or (length != best_len and start < best_start):"  # why: centres are visited in order, so a palindrome that starts earlier and is shorter cannot come later
  - "if length > best_len or (length == best_len and start <= best_start):"  # why: equal start and equal length mean the same substring, so replacing it changes nothing
---
::
