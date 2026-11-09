---
title: Find the Index of the First Occurrence in a String
tier: easy
order: 17
leetcode: 28
url: https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/
companies: [Google, Amazon, Meta]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get two strings, haystack and needle. Return the position where needle first appears inside haystack, counting from 0. Return -1 if needle never appears. The needle has at least one character.

::exercise
---
id: iv-easy-017
prompt: Write a function first_occurrence(haystack, needle) that returns the index of the first place needle appears in haystack, or -1 if it does not appear.
starter: |
  # write your code below
  def first_occurrence(haystack, needle):
      pass
hints:
  - Try every start position where the needle could still fit, and compare the slice of that length with the needle.
  - The last possible start is the length of haystack minus the length of needle, so include it in the loop.
tests:
  - check: assert first_occurrence("sadbutsad", "sad") == 0
  - check: assert first_occurrence("leetcode", "leeto") == -1
  - check: assert first_occurrence("hello", "ll") == 2
  - check: assert first_occurrence("aaa", "aaaa") == -1
  - check: assert first_occurrence("abc", "c") == 2
  - check: assert first_occurrence("mississippi", "issip") == 4
  - check: assert first_occurrence("a", "a") == 0
  - check: assert first_occurrence("abab", "ab") == 0
solution: |
  def first_occurrence(haystack, needle):
      for i in range(len(haystack) - len(needle) + 1):
          if haystack[i:i + len(needle)] == needle:
              return i
      return -1
brute: |
  def first_occurrence(haystack, needle):
      for i in range(len(haystack)):
          if haystack.startswith(needle, i):
              return i
      return -1
random:
  call: first_occurrence
  gen: |
    def gen(rng, size):
        haystack = ''.join(rng.choice('ab') for _ in range(rng.randint(0, size + 4)))
        needle = ''.join(rng.choice('ab') for _ in range(rng.randint(1, 3)))
        return (haystack, needle)
equivalent:
  - "for i in range(len(haystack) + len(needle) + 1):"  # why: positions past the last full fit give a slice shorter than needle, so they never match
  - "for i in range(len(haystack) - len(needle) + 2):"  # why: the one extra position gives a slice shorter than needle, so it never matches
wrong:
  - |
    def first_occurrence(haystack, needle):
        for i in range(len(haystack) - len(needle)):
            if haystack[i:i + len(needle)] == needle:
                return i
        return -1
  - |
    def first_occurrence(haystack, needle):
        for i in range(len(haystack)):
            if haystack[i] == needle[0]:
                return i
        return -1
---
::
