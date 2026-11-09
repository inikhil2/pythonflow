---
title: Length of Last Word
tier: easy
order: 37
leetcode: 58
url: https://leetcode.com/problems/length-of-last-word/
companies: [Google, Amazon, Meta]
topic: String
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string s made of letters and spaces. It has at least one letter, and it may start or end with spaces. A word is a group of letters with no spaces between them. Words may be separated by one or more spaces. Return the number of letters in the last word.

::exercise
---
id: iv-easy-037
prompt: Write a function length_of_last_word(s) that returns the number of letters in the last word of s.
starter: |
  # write your code below
  def length_of_last_word(s):
      pass
hints:
  - Skip the spaces at the end of the string first.
  - Then count letters going backwards until you reach a space or the start of the string.
tests:
  - check: assert length_of_last_word("Hello World") == 5
  - check: assert length_of_last_word("   fly me   to   the moon  ") == 4
  - check: assert length_of_last_word("luffy is still joyboy") == 6
  - check: assert length_of_last_word("a") == 1
  - check: assert length_of_last_word("a ") == 1
  - check: assert length_of_last_word("  ab") == 2
solution: |
  def length_of_last_word(s):
      i = len(s) - 1
      while s[i] == " ":
          i -= 1
      length = 0
      while i >= 0 and s[i] != " ":
          length += 1
          i -= 1
      return length
brute: |
  def length_of_last_word(s):
      return len(s.split()[-1])
random:
  call: length_of_last_word
  gen: |
    def gen(rng, size):
        words = ["".join(rng.choice("abcxyz") for _ in range(rng.randint(1, 4))) for _ in range(rng.randint(1, size // 2 + 2))]
        text = " " * rng.randint(0, 2) + words[0]
        for w in words[1:]:
            text += " " * rng.randint(1, 2) + w
        return (text + " " * rng.randint(0, 2),)
wrong:
  - |
    def length_of_last_word(s):
        return len(s.split()[0])
  - |
    def length_of_last_word(s):
        return len(s.split(" ")[-1])
---
::
