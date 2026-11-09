---
title: Valid Anagram
tier: easy
order: 60
leetcode: 242
url: https://leetcode.com/problems/valid-anagram/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week2-loops/04-dictionaries]
---

You get two strings, s and t, each with 1 to 50000 lowercase letters. Return True if t uses exactly the same letters as s, with the same count of each letter, in any order. Return False otherwise.

::exercise
---
id: iv-easy-060
prompt: Write a function is_anagram(s, t) that returns True if t is a rearrangement of the letters in s, and False otherwise.
starter: |
  # write your code below
  def is_anagram(s, t):
      pass
hints:
  - Count how many times each letter appears in s, then take one off for each letter of t.
  - If a letter of t is missing or already used up, the strings are not anagrams.
tests:
  - check: assert is_anagram("anagram", "nagaram") == True
  - check: assert is_anagram("rat", "car") == False
  - check: assert is_anagram("a", "a") == True
  - check: assert is_anagram("a", "b") == False
  - check: assert is_anagram("ab", "a") == False
  - check: assert is_anagram("aab", "abb") == False
  - check: assert is_anagram("listen", "silent") == True
solution: |
  def is_anagram(s, t):
      if len(s) != len(t):
          return False
      counts = {}
      for ch in s:
          counts[ch] = counts.get(ch, 0) + 1
      for ch in t:
          if counts.get(ch, 0) == 0:
              return False
          counts[ch] -= 1
      return True
brute: |
  def is_anagram(s, t):
      return sorted(s) == sorted(t)
random:
  call: is_anagram
  gen: |
    def gen(rng, size):
        s = "".join(rng.choice("ab") for _ in range(rng.randint(1, size + 4)))
        if rng.random() < 0.5:
            t = list(s)
            rng.shuffle(t)
            return (s, "".join(t))
        return (s, "".join(rng.choice("ab") for _ in range(rng.randint(1, size + 4))))
wrong:
  - |
    def is_anagram(s, t):
        return set(s) == set(t)
  - |
    def is_anagram(s, t):
        counts = {}
        for ch in s:
            counts[ch] = counts.get(ch, 0) + 1
        for ch in t:
            if counts.get(ch, 0) == 0:
                return False
            counts[ch] -= 1
        return True
---
::
