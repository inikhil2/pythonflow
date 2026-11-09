---
title: Reverse String
tier: easy
order: 20
leetcode: 344
url: https://leetcode.com/problems/reverse-string/
companies: [Google, Amazon, Apple]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a list of single characters. Return a new list that holds the same characters in reverse order. The list you were given must stay the same, and the list may be empty.

::exercise
---
id: iv-easy-020
prompt: Write a function reverse_string(chars) that returns a new list with the characters of chars in reverse order.
starter: |
  # write your code below
  def reverse_string(chars):
      pass
hints:
  - Walk the list from its last position down to its first, and add each character to a new list.
  - An empty list has no last position, so the loop must simply run zero times for it.
tests:
  - check: assert reverse_string([]) == []
  - check: assert reverse_string(["a"]) == ["a"]
  - check: assert reverse_string(["a", "b"]) == ["b", "a"]
  - check: assert reverse_string(["h", "e", "l", "l", "o"]) == ["o", "l", "l", "e", "h"]
  - check: assert reverse_string(["A", "b", "A"]) == ["A", "b", "A"]
  - check: assert reverse_string(["1", "2", "3", "4"]) == ["4", "3", "2", "1"]
  - check: assert reverse_string(["x", "x"]) == ["x", "x"]
  - check: assert reverse_string(["a"] * 20 + ["b"]) == ["b"] + ["a"] * 20
  - check: assert reverse_string(["H", "a", "n", "n", "a", "h"]) == ["h", "a", "n", "n", "a", "H"]
solution: |
  def reverse_string(chars):
      result = []
      for i in range(len(chars) - 1, -1, -1):
          result.append(chars[i])
      return result
brute: |
  def reverse_string(chars):
      return list(reversed(chars))
random:
  call: reverse_string
  gen: |
    def gen(rng, size):
        return ([rng.choice('abc') for _ in range(rng.randint(0, size + 3))],)
wrong:
  - |
    def reverse_string(chars):
        result = []
        for i in range(len(chars) - 1, 0, -1):
            result.append(chars[i])
        return result
  - |
    def reverse_string(chars):
        result = list(chars)
        for i in range(0, len(result) - 1, 2):
            result[i], result[i + 1] = result[i + 1], result[i]
        return result
---
::
