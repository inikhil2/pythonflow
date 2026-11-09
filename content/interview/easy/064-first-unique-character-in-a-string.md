---
title: First Unique Character in a String
tier: easy
order: 64
leetcode: 387
url: https://leetcode.com/problems/first-unique-character-in-a-string/
companies: [Amazon, Apple, Google]
topic: Hash table
needs: [/learn/week0-functions/04-strings, /learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a string `s` of between 1 and 200000 lowercase letters. Find the first character that appears exactly once in the whole string. Return its position, counting from 0 at the left. If every character repeats, return -1.

"First" means the smallest position. A character that repeats somewhere else in the string is not unique, even if it appears only once before the position you are looking at.

::exercise
---
id: iv-easy-064
prompt: Write a function first_unique_char(s) that returns the index of the first character that appears only once in s, or -1 if there is none.
starter: |
  # write your code below
  def first_unique_char(s):
      pass
hints:
  - Count how many times each character appears, then look for the first position whose count is 1.
  - A dictionary of counts is quicker than checking the whole string for each position.
tests:
  - check: assert first_unique_char("leetcode") == 0
  - check: assert first_unique_char("loveleetcode") == 2
  - check: assert first_unique_char("aabb") == -1
  - check: assert first_unique_char("z") == 0
  - check: assert first_unique_char("aab") == 2
  - check: assert first_unique_char("abab") == -1
  - check: assert first_unique_char("cc") == -1
solution: |
  def first_unique_char(s):
      counts = {}
      for ch in s:
          counts[ch] = counts.get(ch, 0) + 1
      for i in range(len(s)):
          if counts[s[i]] == 1:
              return i
      return -1
brute: |
  def first_unique_char(s):
      for i, ch in enumerate(s):
          if s.count(ch) == 1:
              return i
      return -1
random:
  call: first_unique_char
  gen: |
    def gen(rng, size):
        return ("".join(rng.choice("abcde") for _ in range(max(size, 1))),)
big: assert first_unique_char("".join("y" if i == 199990 else "z" if i == 199999 else chr(97 + (i * 7) % 24) for i in range(200000))) == 199990
slow:
  - |
    def first_unique_char(s):
        for i, ch in enumerate(s):
            if s.count(ch) == 1:
                return i
        return -1
  - |
    def first_unique_char(s):
        for i in range(len(s)):
            count = 0
            for other in s:
                if other == s[i]:
                    count += 1
            if count == 1:
                return i
        return -1
wrong:
  - |
    def first_unique_char(s):
        for i, ch in enumerate(s):
            if ch not in s[i + 1:]:
                return i
        return -1
  - |
    def first_unique_char(s):
        for i in range(len(s) - 1, -1, -1):
            if s.count(s[i]) == 1:
                return i
        return -1
  - |
    def first_unique_char(s):
        for i, ch in enumerate(s):
            if ch not in s[:i]:
                return i
        return -1
---
::
