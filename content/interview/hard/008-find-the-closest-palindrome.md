---
title: Find the Closest Palindrome
tier: hard
order: 8
leetcode: 564
url: https://leetcode.com/problems/find-the-closest-palindrome/
companies: [Meta, Amazon, Uber]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week0-functions/06-numbers]
---

You get a string n of digits with no leading zero. It has between 1 and 18 digits, and its value is at least 1. Return the palindrome closest in value to n, as a string, that is not n itself. A palindrome reads the same forwards and backwards. Zero counts as a palindrome. If two palindromes are the same distance from n, return the smaller one.

Checking every number outward from n works for small inputs, but it is too slow at the largest size. The palindrome closest to n is always built from the first half of its digits, changed by one, plus a few special numbers at the edges of the digit count.

::exercise
---
id: iv-hard-008
prompt: Write a function closest_palindrome(n) that takes a digit string n and returns the closest palindrome to it, as a string, that is not n itself. Ties go to the smaller value.
starter: |
  # write your code below
  def closest_palindrome(n):
      pass
hints:
  - Mirror the first half of the digits to make a palindrome. Also try that first half with one added and one taken away.
  - Some answers have one digit more or one digit less than n, such as 99 becoming 101 or 1000 becoming 999. Add those as candidates too.
tests:
  - check: assert closest_palindrome("123") == "121"
  - check: assert closest_palindrome("1") == "0"
  - check: assert closest_palindrome("10") == "9"
  - check: assert closest_palindrome("99") == "101"
  - check: assert closest_palindrome("808") == "818"
  - check: assert closest_palindrome("2") == "1"
  - check: assert closest_palindrome("1000") == "999"
  - check: assert closest_palindrome("11") == "9"
  - check: assert closest_palindrome("100") == "99"
  - check: assert closest_palindrome("1213") == "1221"
  - check: assert closest_palindrome("999") == "1001"
  - check: assert closest_palindrome("999999999999999999") == "1000000000000000001"
  - check: assert closest_palindrome("100000000000000000") == "99999999999999999"
solution: |
  def closest_palindrome(n):
      L = len(n)
      x = int(n)
      out = {10 ** (L - 1) - 1, 10 ** L + 1}
      h = int(n[: (L + 1) // 2])
      for d in (-1, 0, 1):
          p = str(h + d)
          mirror = p + (p[:-1] if L % 2 else p)[::-1]
          out.add(int(mirror))
      out.discard(x)
      out = [c for c in out if c >= 0]
      return str(min(out, key=lambda c: (abs(c - x), c)))
brute: |
  def closest_palindrome(n):
      x = int(n)
      d = 1
      while True:
          for c in (x - d, x + d):
              if c >= 0 and str(c) == str(c)[::-1]:
                  return str(c)
          d += 1
random:
  call: closest_palindrome
  gen: |
    def gen(rng, size):
        return (str(rng.randint(1, 10 ** rng.randint(1, max(1, min(size, 6))))),)
big: assert closest_palindrome(str((rng := __import__("random").Random(9)).randint(10 ** 17, 10 ** 18 - 1))) == "806989027720989608"
slow:
  - |
    def closest_palindrome(n):
        x = int(n)
        d = 1
        while True:
            for c in (x - d, x + d):
                if c >= 0 and str(c) == str(c)[::-1]:
                    return str(c)
            d += 1
wrong:
  - |
    def closest_palindrome(n):
        L = len(n)
        half = n[: (L + 1) // 2]
        mirror = half + (half[:-1] if L % 2 else half)[::-1]
        if mirror != n:
            return mirror
        return str(int(n) - 1)
  - |
    def closest_palindrome(n):
        L = len(n)
        x = int(n)
        out = []
        h = int(n[: (L + 1) // 2])
        for d in (-1, 0, 1):
            p = str(h + d)
            mirror = p + (p[:-1] if L % 2 else p)[::-1]
            out.append(int(mirror))
        out = [c for c in out if c != x and c >= 0]
        return str(min(out, key=lambda c: (abs(c - x), c)))
  - |
    def closest_palindrome(n):
        L = len(n)
        x = int(n)
        out = {10 ** (L - 1) - 1, 10 ** L + 1}
        h = int(n[: (L + 1) // 2])
        for d in (-1, 0, 1):
            p = str(h + d)
            mirror = p + (p[:-1] if L % 2 else p)[::-1]
            out.add(int(mirror))
        out.discard(x)
        out = [c for c in out if c >= 0]
        return str(min(out, key=lambda c: (abs(c - x), -c)))
equivalent:
  - "7: p = str(h - d)"  # why: the loop runs over (-1, 0, 1), which is symmetric, so h - d gives the same three candidates in another order
  - "11: out = [c for c in out if c >= -1]"  # why: every candidate is already at least 0, because the first digit is at least 1 and h - 1 is at least 0
---
::
