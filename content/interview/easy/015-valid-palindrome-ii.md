---
title: Valid Palindrome II
tier: easy
order: 15
leetcode: 680
url: https://leetcode.com/problems/valid-palindrome-ii/
companies: [Meta, Amazon, Google]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string s of lowercase letters. Return True if s reads the same forwards and backwards once you delete at most one character, and False otherwise. The string may be empty.

::exercise
---
id: iv-easy-015
prompt: Write a function valid_palindrome(s) that returns True if s is a palindrome or becomes one after removing a single character, and False otherwise.
starter: |
  # write your code below
  def valid_palindrome(s):
      pass
hints:
  - Compare the two ends and move inward while they match.
  - At the first mismatch, try skipping the left character or skipping the right character, and check each rest.
tests:
  - check: assert valid_palindrome("") == True
  - check: assert valid_palindrome("a") == True
  - check: assert valid_palindrome("ab") == True
  - check: assert valid_palindrome("aba") == True
  - check: assert valid_palindrome("abc") == False
  - check: assert valid_palindrome("abca") == True
  - check: assert valid_palindrome("abbaa") == True
  - check: assert valid_palindrome("abcdba") == True
  - check: assert valid_palindrome("abcdef") == False
  - check: assert valid_palindrome("deeee") == True
  - check: assert valid_palindrome("bdeeeeb") == True
solution: |
  def valid_palindrome(s):
      i, j = 0, len(s) - 1
      while i < j:
          if s[i] != s[j]:
              left = s[i + 1:j + 1]
              right = s[i:j]
              return left == left[::-1] or right == right[::-1]
          i += 1
          j -= 1
      return True
brute: |
  def valid_palindrome(s):
      if s == s[::-1]:
          return True
      return any(t == t[::-1] for t in (s[:i] + s[i + 1:] for i in range(len(s))))
random:
  call: valid_palindrome
  gen: |
    def gen(rng, size):
        half = ''.join(rng.choice('ab') for _ in range(rng.randint(0, size + 2)))
        s = half + rng.choice(['', 'c']) + half[::-1]
        if rng.random() < 0.5 and s:
            k = rng.randrange(len(s))
            s = s[:k] + rng.choice('abc') + s[k + 1:]
        return (s,)
equivalent:
  - "while i <= j:"  # why: when i equals j the two letters match, so the loop only moves past the middle, and the result is True either way
wrong:
  - |
    def valid_palindrome(s):
        i, j = 0, len(s) - 1
        while i < j:
            if s[i] != s[j]:
                left = s[i + 1:j + 1]
                return left == left[::-1]
            i += 1
            j -= 1
        return True
  - |
    def valid_palindrome(s):
        mismatches = 0
        for i in range(len(s) // 2):
            if s[i] != s[len(s) - 1 - i]:
                mismatches += 1
        return mismatches <= 1
---
::
