---
title: Add Strings
tier: easy
order: 30
leetcode: 415
url: https://leetcode.com/problems/add-strings/
companies: [Amazon, Meta, Google]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week0-functions/06-numbers]
---

You get two strings, num1 and num2. Each one is a whole number written in decimal, using only the digits 0 to 9. Each has at least one digit and at most 10000 digits. Neither has leading zeros, except the single digit 0 itself. Return the sum as a string.

::exercise
---
id: iv-easy-030
prompt: Write a function add_strings(num1, num2) that returns the sum of two non-negative whole numbers given as strings.
starter: |
  # write your code below
  def add_strings(num1, num2):
      pass
hints:
  - Add the two strings from their last digits toward their first, the way you add columns on paper.
  - Keep a carry for the next column, and do not forget a carry left over at the end.
  - Turn one character at a time into a number, so each digit is handled on its own.
tests:
  - check: assert add_strings("11", "123") == "134"
  - check: assert add_strings("456", "77") == "533"
  - check: assert add_strings("0", "0") == "0"
  - check: assert add_strings("9", "1") == "10"
  - check: assert add_strings("999", "1") == "1000"
  - check: assert add_strings("1", "0") == "1"
  - check: assert add_strings("9" * 30, "9" * 30) == "1" + "9" * 29 + "8"
solution: |
  def add_strings(num1, num2):
      i, j = len(num1) - 1, len(num2) - 1
      carry = 0
      digits = []
      while i >= 0 or j >= 0 or carry:
          total = carry
          if i >= 0:
              total += int(num1[i])
              i -= 1
          if j >= 0:
              total += int(num2[j])
              j -= 1
          digits.append(str(total % 10))
          carry = total // 10
      return "".join(reversed(digits))
brute: |
  def add_strings(num1, num2):
      return str(int(num1) + int(num2))
random:
  call: add_strings
  gen: |
    def gen(rng, size):
        return (str(rng.randint(0, 10 ** (size + 2))), str(rng.randint(0, 10 ** (size + 2))))
wrong:
  - |
    def add_strings(num1, num2):
        i, j = len(num1) - 1, len(num2) - 1
        digits = []
        while i >= 0 or j >= 0:
            total = 0
            if i >= 0:
                total += int(num1[i])
                i -= 1
            if j >= 0:
                total += int(num2[j])
                j -= 1
            digits.append(str(total % 10))
        return "".join(reversed(digits))
  - |
    def add_strings(num1, num2):
        digits = []
        carry = 0
        for a, b in zip(reversed(num1), reversed(num2)):
            total = int(a) + int(b) + carry
            digits.append(str(total % 10))
            carry = total // 10
        if carry:
            digits.append("1")
        return "".join(reversed(digits))
---
::
