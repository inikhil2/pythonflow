---
title: Palindromic Substrings
tier: medium
order: 95
leetcode: 647
url: https://leetcode.com/problems/palindromic-substrings/
companies: [Meta, Amazon, Google]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/04-strings, /learn/week10-algorithms/01-two-pointers]
---

You get a string `s` of between 1 and 5000 lowercase letters. A palindrome reads the same forwards and backwards, and a single letter counts as a palindrome.

Return how many substrings of `s` are palindromes. Two substrings count as different when they start or end at different positions, even if their letters match. So `"aaa"` has 6 palindromic substrings: three single letters, two of length 2, and one of length 3.

::exercise
---
id: iv-medium-095
prompt: Write a function count_palindromic_substrings(s) that returns how many substrings of s are palindromes, counting each position range separately.
starter: |
  # write your code below
  def count_palindromic_substrings(s):
      pass
hints:
  - Every palindrome has a centre, either a single letter or the gap between two equal letters. Try each centre.
  - From each centre, move two pointers outward while the letters they point to match. Each step that still matches is one more palindrome.
tests:
  - check: assert count_palindromic_substrings("abc") == 3
  - check: assert count_palindromic_substrings("aaa") == 6
  - check: assert count_palindromic_substrings("a") == 1
  - check: assert count_palindromic_substrings("aba") == 4
  - check: assert count_palindromic_substrings("abba") == 6
  - check: assert count_palindromic_substrings("racecar") == 10
  - check: assert count_palindromic_substrings("ab") == 2
big: assert (s := "".join("ab"[min(i - 2000, 2999 - i) % 2] if 2000 <= i < 3000 else "ab"[((i * 7919) >> 5) % 2] for i in range(5000))) and count_palindromic_substrings(s) == 204273 and count_palindromic_substrings("a" * 300) == 45150
solution: |
  def count_palindromic_substrings(s):
      count = 0
      for center in range(2 * len(s) - 1):
          lo = center // 2
          hi = lo + center % 2
          while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
              count += 1
              lo -= 1
              hi += 1
      return count
brute: |
  def count_palindromic_substrings(s):
      count = 0
      for i in range(len(s)):
          for j in range(i + 1, len(s) + 1):
              piece = s[i:j]
              if piece == piece[::-1]:
                  count += 1
      return count
slow:
  - |
    def count_palindromic_substrings(s):
        return sum(1 for i in range(len(s)) for j in range(i + 1, len(s) + 1) if s[i:j] == s[i:j][::-1])
random:
  call: count_palindromic_substrings
  gen: |
    def gen(rng, size):
        return ("".join(rng.choice("ab") for _ in range(min(max(size, 1), 12))),)
wrong:
  - |
    def count_palindromic_substrings(s):
        count = 0
        for center in range(len(s)):
            lo, hi = center, center
            while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
                count += 1
                lo -= 1
                hi += 1
        return count
  - |
    def count_palindromic_substrings(s):
        found = set()
        for i in range(len(s)):
            for j in range(i + 1, len(s) + 1):
                if s[i:j] == s[i:j][::-1]:
                    found.add(s[i:j])
        return len(found)
  - |
    def count_palindromic_substrings(s):
        count = 0
        for center in range(2 * len(s) - 1):
            lo = center // 2
            hi = lo + center % 2
            while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
                count += 1
                lo -= 1
                hi += 1
            if center % 2 == 0:
                count -= 1
        return count
equivalent:
  - "for center in range(3 * len(s) - 1):"  # why: centres past 2n - 2 have lo at least n or hi at least n, so the while loop never runs
  - "for center in range(2 * len(s) - 0):"  # why: the extra centre 2n - 1 has hi = n, which fails hi < len(s), so the loop never runs
  - "for center in range(2 * len(s) + 1):"  # why: centres past 2n - 2 have lo at least n or hi at least n, so the while loop never runs
---
::
