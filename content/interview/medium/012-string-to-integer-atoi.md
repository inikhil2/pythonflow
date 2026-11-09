---
title: String to Integer (atoi)
tier: medium
order: 12
leetcode: 8
url: https://leetcode.com/problems/string-to-integer-atoi/
companies: [Google, Amazon, Netflix]
topic: String
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string `s` of 0 to 200 characters. Each character is a letter, a digit, a space, a plus sign, a minus sign or a full stop. Read a whole number from the start of the string with these rules:

1. Skip any spaces at the start. Stop skipping at the first character that is not a space.
2. If the next character is a plus or minus sign, remember it. Only one sign counts.
3. Read digits one by one until the first character that is not a digit, or the end of the string. Leading zeros are digits too.
4. If no digits were read, the answer is 0.
5. If the number is below -2147483648, return -2147483648. If it is above 2147483647, return 2147483647.

Anything after the digits is ignored. So "4193 with words" gives 4193, and "words and 987" gives 0, because the first real character is not a digit.

::exercise
---
id: iv-medium-012
prompt: Write a function string_to_int(s) that reads a whole number from the start of s using the rules above, and clamps it to the signed 32-bit range.
starter: |
  # write your code below
  def string_to_int(s):
      pass
hints:
  - Walk the string with one position number, moving past spaces first, then the sign, then the digits.
  - Build the number as you read each digit, and clamp the final value to the range only once at the end.
tests:
  - check: assert string_to_int("42") == 42
  - check: assert string_to_int("   -42") == -42
  - check: assert string_to_int("4193 with words") == 4193
  - check: assert string_to_int("words and 987") == 0
  - check: assert string_to_int("-91283472332") == -2147483648
  - check: assert string_to_int("2147483648") == 2147483647
  - check: assert string_to_int("") == 0
  - check: assert string_to_int("+1") == 1
  - check: assert string_to_int("+-12") == 0
  - check: assert string_to_int("  +0 123") == 0
  - check: assert string_to_int("-") == 0
  - check: assert string_to_int("3.14") == 3
  - check: assert string_to_int("00000-42a1234") == 0
no_slow: "The string is at most 200 characters, so every method finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def string_to_int(s):
      i, n = 0, len(s)
      while i < n and s[i] == " ":
          i += 1
      sign = 1
      if i < n and s[i] in "+-":
          if s[i] == "-":
              sign = -1
          i += 1
      value = 0
      while i < n and "0" <= s[i] <= "9":
          value = value * 10 + (ord(s[i]) - ord("0"))
          i += 1
      value *= sign
      return max(-2**31, min(value, 2**31 - 1))
brute: |
  def string_to_int(s):
      import re
      match = re.match(r" *([+-]?)(\d+)", s)
      if match is None:
          return 0
      value = int(match.group(1) + match.group(2))
      return max(-2**31, min(value, 2**31 - 1))
random:
  call: string_to_int
  gen: |
    def gen(rng, size):
        alphabet = "0123456789 +-a."
        return ("".join(rng.choice(alphabet) for _ in range(rng.randint(0, 12))),)
wrong:
  - |
    def string_to_int(s):
        i, n = 0, len(s)
        while i < n and s[i] == " ":
            i += 1
        sign = 1
        if i < n and s[i] in "+-":
            if s[i] == "-":
                sign = -1
            i += 1
        value = 0
        while i < n and "0" <= s[i] <= "9":
            value = value * 10 + (ord(s[i]) - ord("0"))
            i += 1
        return value * sign
  - |
    def string_to_int(s):
        i, n = 0, len(s)
        while i < n and s[i] == " ":
            i += 1
        value = 0
        while i < n and "0" <= s[i] <= "9":
            value = value * 10 + (ord(s[i]) - ord("0"))
            i += 1
        return max(-2**31, min(value, 2**31 - 1))
  - |
    def string_to_int(s):
        try:
            value = int(s.strip())
        except ValueError:
            return 0
        return max(-2**31, min(value, 2**31 - 1))
---
::
