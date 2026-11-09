---
title: Reverse Integer
tier: medium
order: 1
leetcode: 7
url: https://leetcode.com/problems/reverse-integer/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get a whole number `x`, where -2147483648 <= x <= 2147483647. Reverse its decimal digits and keep its sign, so 120 becomes 21 and -45 becomes -54. Trailing zeros disappear, because they become leading zeros. If the reversed number falls outside the range -2147483648 to 2147483647, return 0 instead. Return a whole number.

Python integers never overflow, so the range check is something you write yourself. Check the result after you reverse it, not the input.

::exercise
---
id: iv-medium-001
prompt: Write a function reverse_int(x) that returns x with its digits reversed and its sign kept, or 0 if the result is outside the signed 32-bit range.
starter: |
  # write your code below
  def reverse_int(x):
      pass
hints:
  - Pull off the last digit with x % 10 and add it to the end of a new number.
  - The reversed value can overflow even when x does not, so test the reversed value against the bounds.
tests:
  - check: assert reverse_int(123) == 321
  - check: assert reverse_int(-123) == -321
  - check: assert reverse_int(120) == 21
  - check: assert reverse_int(0) == 0
  - check: assert reverse_int(7) == 7
  - check: assert reverse_int(-1) == -1
  - check: assert reverse_int(1534236469) == 0
  - check: assert reverse_int(-2147483648) == 0
  - check: assert reverse_int(-2147483412) == -2143847412
  - check: assert reverse_int(1563847412) == 0
no_slow: "reversing digits is O(digits), at most 10"
solution: |
  def reverse_int(x):
      sign = -1 if x < 0 else 1
      x = abs(x)
      result = 0
      while x > 0:
          result = result * 10 + x % 10
          x //= 10
      result *= sign
      if result < -2**31 or result > 2**31 - 1:
          return 0
      return result
brute: |
  def reverse_int(x):
      sign = -1 if x < 0 else 1
      result = sign * int(str(abs(x))[::-1])
      if result < -2**31 or result > 2**31 - 1:
          return 0
      return result
random:
  call: reverse_int
  gen: |
    def gen(rng, size):
        return (rng.choice([rng.randint(-2**31, 2**31 - 1), rng.randint(-20, 20)]),)
wrong:
  - |
    def reverse_int(x):
        sign = -1 if x < 0 else 1
        return sign * int(str(abs(x))[::-1])
  - |
    def reverse_int(x):
        sign = -1 if x < 0 else 1
        x = abs(x)
        result = 0
        while x > 0:
            result = result * 10 + x % 10
            x //= 10
        result *= sign
        if result > 2**31 - 1:
            return 0
        return result
  - |
    def reverse_int(x):
        if x < -2**31 or x > 2**31 - 1:
            return 0
        result = 0
        y = abs(x)
        while y > 0:
            result = result * 10 + y % 10
            y //= 10
        return result if x > 0 else -result
equivalent:
  - sign = -1 if x < 1 else 1  # why: only x = 0 differs, and 0 times either sign is still 0
  - sign = -1 if x <= 0 else 1  # why: only x = 0 differs, and 0 times either sign is still 0
  - "if result <= -2 ** 31 or result > 2 ** 31 - 1:"  # why: no in-range x reverses to exactly -2147483648; that would need x = -8463847412, out of range
  - "if result < -2 ** 31 or result > 2 ** 31 - 2:"  # why: no in-range x reverses to exactly 2147483647 (it would need x = 7463847412), so a bound one lower changes no answer
  - "if result < -2 ** 31 or result > 2 ** 31 - 0:"  # why: the only changed value is 2147483648, which no in-range x reverses to (it would need x = 8463847412)
  - "if result < -2 ** 31 or result > 2 ** 31 + 1:"  # why: the changed values are 2147483648 and 2147483649, which no in-range x reverses to
  - "if result < -2 ** 31 or result >= 2 ** 31 - 1:"  # why: no in-range x reverses to exactly 2147483647; that would need x = 7463847412, out of range
---
::
