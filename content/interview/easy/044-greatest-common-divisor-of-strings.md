---
title: Greatest Common Divisor of Strings
tier: easy
order: 44
leetcode: 1071
url: https://leetcode.com/problems/greatest-common-divisor-of-strings/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get two strings, str1 and str2, each with 1 to 1000 uppercase letters. A string x divides a string y when y is x repeated one or more times. Return the longest string that divides both str1 and str2. If no string divides both, return an empty string.

::exercise
---
id: iv-easy-044
prompt: Write a function gcd_of_strings(str1, str2) that returns the longest string dividing both str1 and str2, or an empty string if there is none.
starter: |
  # write your code below
  def gcd_of_strings(str1, str2):
      pass
hints:
  - If str1 plus str2 equals str2 plus str1, both strings are built from one shared piece. Otherwise return an empty string.
  - The length of the shared piece divides both lengths, and the largest such length is their greatest common divisor.
tests:
  - check: assert gcd_of_strings("ABCABC", "ABC") == "ABC"
  - check: assert gcd_of_strings("ABABAB", "ABAB") == "AB"
  - check: assert gcd_of_strings("LEET", "CODE") == ""
  - check: assert gcd_of_strings("ABABAB", "AB") == "AB"
  - check: assert gcd_of_strings("AAAA", "AA") == "AA"
  - check: assert gcd_of_strings("A", "AA") == "A"
  - check: assert gcd_of_strings("ABC", "ABCABC") == "ABC"
solution: |
  def gcd_of_strings(str1, str2):
      from math import gcd
      if str1 + str2 != str2 + str1:
          return ""
      return str1[:gcd(len(str1), len(str2))]
brute: |
  def gcd_of_strings(str1, str2):
      for k in range(min(len(str1), len(str2)), 0, -1):
          piece = str1[:k]
          if len(str1) % k == 0 and len(str2) % k == 0 and piece * (len(str1) // k) == str1 and piece * (len(str2) // k) == str2:
              return piece
      return ""
random:
  call: gcd_of_strings
  gen: |
    def gen(rng, size):
        base = "".join(rng.choice("ab") for _ in range(rng.randint(1, 3)))
        str1 = base * rng.randint(1, 3)
        if rng.random() < 0.3:
            str2 = "".join(rng.choice("ab") for _ in range(rng.randint(1, 4)))
        else:
            str2 = base * rng.randint(1, 3)
        return (str1, str2)
wrong:
  - |
    def gcd_of_strings(str1, str2):
        from math import gcd
        return str1[:gcd(len(str1), len(str2))]
  - |
    def gcd_of_strings(str1, str2):
        return str1 if str1 == str2 else ""
---
::
