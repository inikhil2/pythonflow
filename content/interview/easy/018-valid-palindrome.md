---
title: Valid Palindrome
tier: easy
order: 18
leetcode: 125
url: https://leetcode.com/problems/valid-palindrome/
companies: [Amazon, Google, Meta]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string s. Ignore every character that is not a letter or a digit, and ignore capital letters. Return True if what is left reads the same forwards and backwards, and False otherwise. The string may be empty.

::exercise
---
id: iv-easy-018
prompt: Write a function is_palindrome(s) that returns True if s is a palindrome after you drop non-alphanumeric characters and ignore case, and False otherwise.
starter: |
  # write your code below
  def is_palindrome(s):
      pass
hints:
  - Build a list of only the letters and digits, in lowercase, as you walk through s.
  - Then the text is a palindrome when that list equals its own reverse.
tests:
  - check: assert is_palindrome("A man, a plan, a canal Panama") == True
  - check: assert is_palindrome("race a car") == False
  - check: assert is_palindrome("") == True
  - check: assert is_palindrome(" ") == True
  - check: assert is_palindrome("a") == True
  - check: assert is_palindrome("ab") == False
  - check: assert is_palindrome("0P") == False
  - check: assert is_palindrome("Ab,a") == True
  - check: 'assert is_palindrome("A man, a plan, a canal: Panama") == True'
solution: |
  def is_palindrome(s):
      chars = []
      for c in s:
          if c.isalnum():
              chars.append(c.lower())
      return chars == chars[::-1]
brute: |
  def is_palindrome(s):
      t = "".join(c for c in s if c.isalnum()).lower()
      return all(t[i] == t[-1 - i] for i in range(len(t)))
random:
  call: is_palindrome
  gen: |
    def gen(rng, size):
        half = ''.join(rng.choice('aAb,. ') for _ in range(rng.randint(0, size + 2)))
        s = half + rng.choice(['', ',', 'x']) + half[::-1]
        if rng.random() < 0.3:
            s = s + rng.choice('ab')
        return (s,)
wrong:
  - |
    def is_palindrome(s):
        s = s.lower()
        return s == s[::-1]
  - |
    def is_palindrome(s):
        chars = [c.lower() for c in s if c.isalnum()]
        return chars[0] == chars[-1]
---
::
