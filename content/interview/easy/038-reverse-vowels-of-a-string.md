---
title: Reverse Vowels of a String
tier: easy
order: 38
leetcode: 345
url: https://leetcode.com/problems/reverse-vowels-of-a-string/
companies: [Google, Amazon, Meta]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string s made only of English letters, which has at least one letter. The vowels are a, e, i, o and u, in either capital or small form. Reverse the order of the vowels in s, and keep every other letter in its own place. Return the new string. The string you were given must stay the same.

::exercise
---
id: iv-easy-038
prompt: Write a function reverse_vowels(s) that returns s with only its vowels put in reverse order.
starter: |
  # write your code below
  def reverse_vowels(s):
      pass
hints:
  - Move one pointer in from the left and one in from the right, and swap the two vowels they find.
  - When a pointer lands on a consonant, move it one step and keep looking.
tests:
  - check: assert reverse_vowels("hello") == "holle"
  - check: assert reverse_vowels("leetcode") == "leotcede"
  - check: assert reverse_vowels("aA") == "Aa"
  - check: assert reverse_vowels("b") == "b"
  - check: assert reverse_vowels("bcd") == "bcd"
  - check: assert reverse_vowels("AEIOU") == "UOIEA"
  - check: assert reverse_vowels("xyz") == "xyz"
solution: |
  def reverse_vowels(s):
      vowels = "aeiouAEIOU"
      chars = list(s)
      i, j = 0, len(chars) - 1
      while i < j:
          if chars[i] not in vowels:
              i += 1
          elif chars[j] not in vowels:
              j -= 1
          else:
              chars[i], chars[j] = chars[j], chars[i]
              i += 1
              j -= 1
      return "".join(chars)
brute: |
  def reverse_vowels(s):
      vowels = [c for c in s if c in "aeiouAEIOU"]
      result = []
      for c in s:
          if c in "aeiouAEIOU":
              result.append(vowels.pop())
          else:
              result.append(c)
      return "".join(result)
random:
  call: reverse_vowels
  gen: |
    def gen(rng, size):
        return ("".join(rng.choice("aeiouAEIOUbcxy") for _ in range(rng.randint(1, size + 3))),)
wrong:
  - |
    def reverse_vowels(s):
        return s[::-1]
  - |
    def reverse_vowels(s):
        chars = list(s)
        i, j = 0, len(chars) - 1
        while i < j:
            if chars[i] not in "aeiou":
                i += 1
            elif chars[j] not in "aeiou":
                j -= 1
            else:
                chars[i], chars[j] = chars[j], chars[i]
                i += 1
                j -= 1
        return "".join(chars)
equivalent:
  - "while i <= j:"  # why: when the pointers meet they sit on the same letter, and swapping a letter with itself changes nothing
---
::
