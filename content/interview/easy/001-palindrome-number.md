---
title: Palindrome Number
tier: easy
order: 1
leetcode: 9
url: https://leetcode.com/problems/palindrome-number/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get a whole number and must decide if its digits read the same both ways. Negative numbers are never palindromes.

::exercise
---
id: iv-easy-001
prompt: Write a function is_palindrome(x) that returns True when the digits of x read the same both ways, and False otherwise.
starter: |
  # write your code below
  def is_palindrome(x):
      pass
hints:
  - Reverse the digits with % 10 and // 10 in a loop, then compare.
  - Negative numbers are never palindromes.
tests:
  - check: assert is_palindrome(121) == True
  - check: assert is_palindrome(-121) == False
  - check: assert is_palindrome(10) == False
  - check: assert is_palindrome(0) == True
  - check: assert is_palindrome(1221) == True
  - check: assert is_palindrome(12341) == False
solution: |
  def is_palindrome(x):
      original = x
      reversed_num = 0
      while x > 0:
          reversed_num = reversed_num * 10 + x % 10
          x = x // 10
      return original == reversed_num
brute: |
  def is_palindrome(x):
      return str(x) == str(x)[::-1]
random:
  call: is_palindrome
  gen: |
    def gen(rng, size):
        if rng.random() < 0.5:
            s = "".join(str(rng.randint(0, 9)) for _ in range(size // 2 + 1))
            x = int(s + s[::-1][rng.randint(0, 1):])
        else:
            x = rng.randint(0, 10 ** (size // 2 + 1))
        return (-x if rng.random() < 0.25 else x,)
wrong:
  - |
    def is_palindrome(x):
        x = abs(x)
        original = x
        reversed_num = 0
        while x > 0:
            reversed_num = reversed_num * 10 + x % 10
            x = x // 10
        return original == reversed_num
  - |
    def is_palindrome(x):
        s = str(x)
        return s[0] == s[-1]
  - |
    def is_palindrome(x):
        if x % 10 == 0:
            return False
        original = x
        reversed_num = 0
        while x > 0:
            reversed_num = reversed_num * 10 + x % 10
            x = x // 10
        return original == reversed_num
---
::
