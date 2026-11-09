---
title: Find the Difference
tier: easy
order: 78
leetcode: 389
url: https://leetcode.com/problems/find-the-difference/
companies: [Google, Meta, Amazon]
topic: Hash table
needs: [/learn/week0-functions/04-strings, /learn/week0-functions/06-numbers, /learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/04-dictionaries]
---

You get two strings of lowercase letters, `s` and `t`. The string `s` has between 0 and 10000 letters. Take every letter of `s`, add one more letter, and mix the whole pile into a new string `t`. That makes `t` exactly one letter longer than `s`.

Return the letter that was added. The added letter may match a letter already in `s`, so do not assume it is new.

::exercise
---
id: iv-easy-078
prompt: Write a function find_the_difference(s, t) that returns the one letter in t that is not paired with a letter in s.
starter: |
  # write your code below
  def find_the_difference(s, t):
      pass
hints:
  - Count the letters of s, then take one count away for each letter of t.
  - The first letter of t that has no count left is the added one.
tests:
  - check: assert find_the_difference("abcd", "abcde") == "e"
  - check: assert find_the_difference("", "y") == "y"
  - check: assert find_the_difference("a", "aa") == "a"
  - check: assert find_the_difference("ae", "aea") == "a"
  - check: assert find_the_difference("xyz", "zyxx") == "x"
  - check: assert find_the_difference("bb", "bbb") == "b"
  - check: assert find_the_difference("ab", "bba") == "b"
solution: |
  def find_the_difference(s, t):
      counts = {}
      for ch in s:
          counts[ch] = counts.get(ch, 0) + 1
      for ch in t:
          if counts.get(ch, 0) == 0:
              return ch
          counts[ch] -= 1
brute: |
  def find_the_difference(s, t):
      for ch in t:
          if t.count(ch) != s.count(ch):
              return ch
random:
  call: find_the_difference
  gen: |
    def gen(rng, size):
        s = [rng.choice("abcd") for _ in range(rng.choice([0, size]))]
        t = s + [rng.choice("abcd")]
        rng.shuffle(t)
        return ("".join(s), "".join(t))
wrong:
  - |
    def find_the_difference(s, t):
        return t[-1]
  - |
    def find_the_difference(s, t):
        for ch in t:
            if ch not in s:
                return ch
  - |
    def find_the_difference(s, t):
        for i in range(len(s)):
            if s[i] != t[i]:
                return t[i]
---
::
