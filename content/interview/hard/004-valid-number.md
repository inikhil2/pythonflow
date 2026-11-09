---
title: Valid Number
tier: hard
order: 4
leetcode: 65
url: https://leetcode.com/problems/valid-number/
companies: [Meta, Google, Amazon]
topic: String
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string of 1 to 20 characters, and you decide whether it spells a decimal number in the form used by a calculator. The string may start with a plus or minus sign. After the sign comes the main part: digits, with at most one decimal point. The main part must contain at least one digit, so a lone point is not a number, but a point with digits on either side or on one side only is fine. After the main part, the string may have one exponent, which is the letter e or E, then an optional sign, then one or more digits. Nothing else is allowed: no spaces, no other letters, and no second sign or point in the wrong place.

Return True when the whole string is a valid number, and False otherwise.

::exercise
---
id: iv-hard-004
prompt: Write a function is_number(s) that returns True if the whole string is a valid decimal number with an optional exponent, and False otherwise.
starter: |
  # write your code below
  def is_number(s):
      pass
hints:
  - Walk through the string one character at a time, moving from the sign to the digits, then the point, then the exponent.
  - Count the digits in the main part and in the exponent separately. Each one must be at least one.
tests:
  - check: assert is_number("2") == True
  - check: assert is_number("0089") == True
  - check: assert is_number("-0.1") == True
  - check: assert is_number("+3.14") == True
  - check: assert is_number("4.") == True
  - check: assert is_number("-.9") == True
  - check: assert is_number("2e10") == True
  - check: assert is_number("-90E3") == True
  - check: assert is_number("abc") == False
  - check: assert is_number("1a") == False
  - check: assert is_number(".") == False
  - check: assert is_number("e3") == False
  - check: assert is_number("99e2.5") == False
  - check: assert is_number("--6") == False
  - check: assert is_number("1e") == False
  - check: assert is_number("-+3") == False
  - check: assert is_number("1e+5") == True
  - check: assert is_number("1e-5") == True
  - check: assert is_number("5e+") == False
solution: |
  def is_number(s):
      digits = "0123456789"
      i = 0
      n = len(s)
      if i < n and s[i] in "+-":
          i += 1
      count = 0
      while i < n and s[i] in digits:
          i += 1
          count += 1
      if i < n and s[i] == ".":
          i += 1
          while i < n and s[i] in digits:
              i += 1
              count += 1
      if count == 0:
          return False
      if i < n and s[i] in "eE":
          i += 1
          if i < n and s[i] in "+-":
              i += 1
          exp_digits = 0
          while i < n and s[i] in digits:
              i += 1
              exp_digits += 1
          if exp_digits == 0:
              return False
      return i == n
brute: |
  import re

  def is_number(s):
      return re.fullmatch(r"[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?", s) is not None
random:
  call: is_number
  gen: |
    def gen(rng, size):
        chars = "0123456789.+-eEa "
        return ("".join(rng.choice(chars) for _ in range(rng.randint(1, size + 4))),)
no_slow: "the string is capped at 20 characters, so every correct method finishes in a few hundred steps and no input can make it too slow"
equivalent:
  - 5: "if i <= n and s[i] in '+-':"  # why: the first sign check runs at i = 0, and the string has at least one character, so i <= n and i < n agree there
  - 10: "count += 2"  # why: count is only compared with 0, so any positive step gives the same answer
  - 15: "count += 2"  # why: same, on the fractional digit loop
  - 25: "exp_digits += 2"  # why: exp_digits is only compared with 0, and any positive step is nonzero exactly when a digit was read
  - 25: "exp_digits -= 1"  # why: exp_digits only matters when it is 0, and subtracting 1 per digit is nonzero exactly when at least one digit was read
wrong:
  - |
    def is_number(s):
        digits = "0123456789"
        i = 0
        n = len(s)
        if i < n and s[i] in "+-":
            i += 1
        count = 0
        while i < n and s[i] in digits:
            i += 1
            count += 1
        if i < n and s[i] == ".":
            i += 1
            while i < n and s[i] in digits:
                i += 1
                count += 1
        if count == 0:
            return False
        if i < n and s[i] in "eE":
            i += 1
            while i < n and s[i] in digits:
                i += 1
        return i == n
  - |
    def is_number(s):
        digits = "0123456789"
        i = 0
        n = len(s)
        if i < n and s[i] in "+-":
            i += 1
        count = 0
        while i < n and s[i] in digits:
            i += 1
            count += 1
        if i < n and s[i] == ".":
            i += 1
            while i < n and s[i] in digits:
                i += 1
                count += 1
        if i < n and s[i] in "eE":
            i += 1
            if i < n and s[i] in "+-":
                i += 1
            exp_digits = 0
            while i < n and s[i] in digits:
                i += 1
                exp_digits += 1
            if exp_digits == 0:
                return False
        return i == n
  - |
    def is_number(s):
        digits = "0123456789"
        i = 0
        n = len(s)
        if i < n and s[i] in "+-":
            i += 1
        count = 0
        while i < n and s[i] in digits:
            i += 1
            count += 1
        if i < n and s[i] == ".":
            i += 1
            while i < n and s[i] in digits:
                i += 1
                count += 1
        if i < n and s[i] in "eE":
            i += 1
            if i < n and s[i] in "+-":
                i += 1
            exp_digits = 0
            while i < n and s[i] in digits:
                i += 1
                exp_digits += 1
            if exp_digits == 0:
                return False
        return count > 0 and i == n or s == "."
---
::
