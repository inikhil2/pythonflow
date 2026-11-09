---
title: Ransom Note
tier: easy
order: 70
leetcode: 383
url: https://leetcode.com/problems/ransom-note/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/04-strings, /learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get two strings of lowercase letters: `ransom_note` and `magazine`. Each string has between 1 and 100000 letters. You want to write the ransom note by cutting out letters from the magazine. Each letter in the magazine can be used at most once, and you can use only the letters you have.

Return `True` if the note can be written from the magazine, and `False` if it cannot. The order of the letters does not matter, only how many of each letter there are.

::exercise
---
id: iv-easy-070
prompt: Write a function can_construct(ransom_note, magazine) that returns True if every letter the note needs is available in the magazine, using each magazine letter at most once.
starter: |
  # write your code below
  def can_construct(ransom_note, magazine):
      pass
hints:
  - Count how many times each letter appears in the magazine.
  - Walk the note, and use up one count for each letter; if a count is already 0, the note cannot be written.
tests:
  - check: assert can_construct("a", "b") == False
  - check: assert can_construct("aa", "ab") == False
  - check: assert can_construct("aa", "aab") == True
  - check: assert can_construct("b", "a") == False
  - check: assert can_construct("z", "zz") == True
  - check: assert can_construct("ab", "aab") == True
  - check: assert can_construct("abc", "cba") == True
  - check: assert can_construct("aaa", "aa") == False
  - check: assert can_construct("abc", "abcd") == True
solution: |
  def can_construct(ransom_note, magazine):
      counts = {}
      for ch in magazine:
          counts[ch] = counts.get(ch, 0) + 1
      for ch in ransom_note:
          if counts.get(ch, 0) == 0:
              return False
          counts[ch] -= 1
      return True
brute: |
  def can_construct(ransom_note, magazine):
      left = magazine
      for ch in ransom_note:
          if ch not in left:
              return False
          left = left.replace(ch, "", 1)
      return True
random:
  call: can_construct
  gen: |
    def gen(rng, size):
        n = max(size, 1)
        note = "".join(rng.choice("abc") for _ in range(n))
        magazine = "".join(rng.choice("abc") for _ in range(rng.randint(1, n + 3)))
        return (note, magazine)
big: assert (s := "".join(chr(97 + (i * 7) % 26) for i in range(100000))) and can_construct(s[::-1], s) and not can_construct(s[::-1], s[::-1][:-1] + "z")
# why: a builtin replace-and-search loop takes about 0.3 s at 100000 letters and 1.8 s at 300000, so it is not a real trap here; the Python loop below is.
slow:
  - |
    def can_construct(ransom_note, magazine):
        pool = list(magazine)
        for ch in ransom_note:
            found = -1
            for i in range(len(pool)):
                if pool[i] == ch:
                    found = i
                    break
            if found == -1:
                return False
            del pool[found]
        return True
wrong:
  - |
    def can_construct(ransom_note, magazine):
        return all(ch in magazine for ch in ransom_note)
  - |
    def can_construct(ransom_note, magazine):
        return len(ransom_note) <= len(magazine)
  - |
    def can_construct(ransom_note, magazine):
        counts = {}
        for ch in magazine:
            counts[ch] = counts.get(ch, 0) + 1
        for ch in ransom_note[:-1]:
            if counts.get(ch, 0) == 0:
                return False
            counts[ch] -= 1
        return True
---
::
