---
title: Repeated Substring Pattern
tier: easy
order: 49
leetcode: 459
url: https://leetcode.com/problems/repeated-substring-pattern/
companies: [Amazon, Google, Meta]
topic: String matching
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string s of 1 to 10000 lowercase letters. Return True if s is made by repeating some shorter piece two or more times in a row. The piece must be shorter than s. Return False otherwise.

::exercise
---
id: iv-easy-049
prompt: Write a function repeated_substring_pattern(s) that returns True if s is a shorter piece repeated at least twice, and False otherwise.
starter: |
  # write your code below
  def repeated_substring_pattern(s):
      pass
hints:
  - If s appears inside s plus s with the first and last letters cut off, then s is a repeat of a shorter piece.
  - A slower check tries each piece length that divides the length of s, and sees whether repeating that piece gives s.
tests:
  - check: assert repeated_substring_pattern("abab") == True
  - check: assert repeated_substring_pattern("aba") == False
  - check: assert repeated_substring_pattern("a") == False
  - check: assert repeated_substring_pattern("aa") == True
  - check: assert repeated_substring_pattern("abcabcabcabc") == True
  - check: assert repeated_substring_pattern("abcabcabc") == True
  - check: assert repeated_substring_pattern("abcd") == False
  - check: assert repeated_substring_pattern("ababba") == False
  - check: assert repeated_substring_pattern("zzzzzzzz") == True
solution: |
  def repeated_substring_pattern(s):
      return s in (s + s)[1:-1]
brute: |
  def repeated_substring_pattern(s):
      n = len(s)
      for k in range(1, n):
          if n % k == 0 and all(s[i] == s[i - k] for i in range(k, n)):
              return True
      return False
random:
  call: repeated_substring_pattern
  gen: |
    def gen(rng, size):
        unit = "".join(rng.choice("ab") for _ in range(rng.randint(1, 3)))
        if rng.random() < 0.5:
            return (unit * rng.randint(1, 4),)
        return ("".join(rng.choice("ab") for _ in range(rng.randint(1, size + 4))),)
wrong:
  - |
    def repeated_substring_pattern(s):
        return s[0] * len(s) == s
  - |
    def repeated_substring_pattern(s):
        return s[:len(s) // 2] * 2 == s
---
::
