---
title: Integer to Roman
tier: medium
order: 30
leetcode: 12
url: https://leetcode.com/problems/integer-to-roman/
companies: [Amazon, Google, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/04-strings, /learn/week0-functions/06-numbers, /learn/week2-loops/04-dictionaries]
---

Roman numerals use seven letters: I is 1, V is 5, X is 10, L is 50, C is 100, D is 500 and M is 1000. Write a number with these letters from largest to smallest, so VI is 6 and XII is 12. The only exception is a small letter placed before a bigger one to mean subtraction. Use it for exactly these six pairs: IV for 4, IX for 9, XL for 40, XC for 90, CD for 400 and CM for 900. Never repeat V, L or D, and never repeat I, X, C or M more than three times in a row.

You get a whole number `num` from 1 to 3999. Return its Roman numeral as a string, written with the rules above.

For example, 58 is LVIII (50, then 8 written as VIII), and 1994 is MCMXCIV (1000, then 900 as CM, 90 as XC, and 4 as IV).

::exercise
---
id: iv-medium-030
prompt: Write a function int_to_roman(num) that returns the Roman numeral for num, a whole number from 1 to 3999.
starter: |
  # write your code below
  def int_to_roman(num):
      pass
hints:
  - Make a list of the values and their letters from largest to smallest, including the six subtraction pairs such as 900 with CM.
  - Go down the list, and while the number is at least the value, add its letters and subtract the value.
tests:
  - check: assert int_to_roman(3) == "III"
  - check: assert int_to_roman(4) == "IV"
  - check: assert int_to_roman(9) == "IX"
  - check: assert int_to_roman(40) == "XL"
  - check: assert int_to_roman(58) == "LVIII"
  - check: assert int_to_roman(1994) == "MCMXCIV"
  - check: assert int_to_roman(3999) == "MMMCMXCIX"
  - check: assert int_to_roman(900) == "CM"
no_slow: "The input is at most 3999, so every method finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def int_to_roman(num):
      table = [
          (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
          (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
          (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I"),
      ]
      out = []
      for value, letters in table:
          while num >= value:
              out.append(letters)
              num -= value
      return "".join(out)
brute: |
  def int_to_roman(num):
      digits = {
          0: ("", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"),
          1: ("", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"),
          2: ("", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"),
          3: ("", "M", "MM", "MMM"),
      }
      text = str(num).zfill(4)
      out = ""
      for position, ch in enumerate(text):
          out += digits[3 - position][int(ch)]
      return out
random:
  call: int_to_roman
  gen: |
    def gen(rng, size):
        return (rng.randint(1, 3999),)
wrong:
  - |
    def int_to_roman(num):
        table = [
            (1000, "M"), (500, "D"), (100, "C"), (50, "L"),
            (10, "X"), (5, "V"), (1, "I"),
        ]
        out = []
        for value, letters in table:
            while num >= value:
                out.append(letters)
                num -= value
        return "".join(out)
  - |
    def int_to_roman(num):
        table = [
            (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
            (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
            (10, "X"), (9, "IX"), (5, "V"), (1, "I"),
        ]
        out = []
        for value, letters in table:
            while num >= value:
                out.append(letters)
                num -= value
        return "".join(out)
  - |
    def int_to_roman(num):
        table = [
            (1000, "M"), (500, "D"), (100, "C"), (50, "L"),
            (10, "X"), (5, "V"), (4, "IV"), (1, "I"),
        ]
        out = []
        for value, letters in table:
            while num >= value:
                out.append(letters)
                num -= value
        return "".join(out)
---
::
