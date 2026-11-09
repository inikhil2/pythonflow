---
title: String Compression
tier: medium
order: 18
leetcode: 443
url: https://leetcode.com/problems/string-compression/
companies: [Google, Amazon, Apple]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week10-algorithms/01-two-pointers]
---

You get a list `chars` of 1 to 2000 single characters. Compress it by writing each run of equal characters as the character followed by its count, but only when the run is longer than one character. A run of one character is written as just that character. Each digit of a count is its own entry in the list, so a run of 12 equal `a` characters becomes `a`, `1`, `2`.

Return the new list of characters. Characters are never reordered, and the runs are read from left to right. For example, `["a", "a", "b", "b", "c", "c", "c"]` becomes `["a", "2", "b", "2", "c", "3"]`.

::exercise
---
id: iv-medium-018
prompt: Write a function compress(chars) that returns the compressed list of characters as described above.
starter: |
  # write your code below
  def compress(chars):
      pass
hints:
  - Walk through the list with two positions, one at the start of a run and one at the end of it.
  - Use str() on the count, then add each of its characters to the result.
tests:
  - check: assert compress(["a", "a", "b", "b", "c", "c", "c"]) == ["a", "2", "b", "2", "c", "3"]
  - check: assert compress(["a"]) == ["a"]
  - check: assert compress(["a", "b", "b", "b"]) == ["a", "b", "3"]
  - check: assert compress(["a"] * 12) == ["a", "1", "2"]
  - check: assert compress(["a", "b"]) == ["a", "b"]
  - check: assert compress(["%", "%"]) == ["%", "2"]
  - check: assert compress(["x"] * 100) == ["x", "1", "0", "0"]
  - check: assert compress(["a", "a", "b"]) == ["a", "2", "b"]
no_slow: "The list is at most 2000 characters, so every method finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def compress(chars):
      result = []
      i = 0
      n = len(chars)
      while i < n:
          j = i
          while j < n and chars[j] == chars[i]:
              j += 1
          result.append(chars[i])
          if j - i > 1:
              result.extend(str(j - i))
          i = j
      return result
brute: |
  def compress(chars):
      from itertools import groupby
      out = []
      for ch, group in groupby(chars):
          size = len(list(group))
          out.append(ch)
          if size > 1:
              out.extend(list(str(size)))
      return out
random:
  call: compress
  gen: |
    def gen(rng, size):
        return ([rng.choice("aab%") for _ in range(rng.randint(1, 15))],)
wrong:
  - |
    def compress(chars):
        result = []
        i = 0
        n = len(chars)
        while i < n:
            j = i
            while j < n and chars[j] == chars[i]:
                j += 1
            result.append(chars[i])
            i = j
        return result
  - |
    def compress(chars):
        result = []
        i = 0
        n = len(chars)
        while i < n:
            j = i
            while j < n and chars[j] == chars[i]:
                j += 1
            result.append(chars[i])
            if j - i > 1:
                result.append(str(j - i))
            i = j
        return result
  - |
    def compress(chars):
        result = []
        i = 0
        n = len(chars)
        while i < n:
            j = i
            while j < n and chars[j] == chars[i]:
                j += 1
            result.append(chars[i])
            result.extend(str(j - i))
            i = j
        return result
---
::
