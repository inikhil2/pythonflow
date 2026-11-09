---
title: Roman to Integer
tier: easy
order: 61
leetcode: 13
url: https://leetcode.com/problems/roman-to-integer/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/04-strings, /learn/week0-functions/06-numbers, /learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a string that spells a whole number in Roman numerals. The symbols are I, V, X, L, C, D and M, worth 1, 5, 10, 50, 100, 500 and 1000. Most symbols add to the total, but a smaller symbol written before a larger one is taken away instead, so IV means 4 and IX means 9. Return the number the string stands for.

The string is always a valid Roman numeral for a whole number from 1 to 3999, so you do not need to check it. A string of one symbol returns that symbol's value. Look at each symbol together with the one that follows it.

::exercise
---
id: iv-easy-061
prompt: Write a function roman_to_int(s) that returns the whole number a Roman numeral string stands for.
starter: |
  # write your code below
  def roman_to_int(s):
      pass
hints:
  - Give each symbol its value, then compare each value with the value of the symbol after it.
  - A value that is smaller than the next one is subtracted, and every other value is added.
tests:
  - check: assert roman_to_int("III") == 3
  - check: assert roman_to_int("I") == 1
  - check: assert roman_to_int("IV") == 4
  - check: assert roman_to_int("IX") == 9
  - check: assert roman_to_int("XL") == 40
  - check: assert roman_to_int("LVIII") == 58
  - check: assert roman_to_int("MCMXCIV") == 1994
solution: |
  def roman_to_int(s):
      values = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
      total = 0
      for i in range(len(s)):
          value = values[s[i]]
          if i + 1 < len(s) and value < values[s[i + 1]]:
              total -= value
          else:
              total += value
      return total
brute: |
  def roman_to_int(s):
      pairs = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"), (90, "XC"),
               (50, "L"), (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]
      for n in range(1, 4000):
          letters = ""
          left = n
          for value, symbols in pairs:
              while left >= value:
                  letters += symbols
                  left -= value
          if letters == s:
              return n
random:
  call: roman_to_int
  gen: |
    def gen(rng, size):
        pairs = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"), (90, "XC"),
                 (50, "L"), (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]
        n = rng.randint(1, min(3999, 10 + size * 300))
        out = ""
        for value, symbols in pairs:
            while n >= value:
                out += symbols
                n -= value
        return (out,)
wrong:
  - |
    def roman_to_int(s):
        values = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
        total = 0
        for ch in s:
            total += values[ch]
        return total
  - |
    def roman_to_int(s):
        values = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
        total = 0
        for i in range(len(s) - 1):
            value = values[s[i]]
            if value < values[s[i + 1]]:
                total -= value
            else:
                total += value
        return total
  - |
    def roman_to_int(s):
        values = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
        total = 0
        for i in range(len(s)):
            value = values[s[i]]
            if i + 1 < len(s) and s[i] == "I" and s[i + 1] in "VX":
                total -= value
            else:
                total += value
        return total
---
::
