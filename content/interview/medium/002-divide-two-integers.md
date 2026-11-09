---
title: Divide Two Integers
tier: medium
order: 2
leetcode: 29
url: https://leetcode.com/problems/divide-two-integers/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get two whole numbers, `dividend` and `divisor`, where -2147483648 <= dividend <= 2147483647, -2147483648 <= divisor <= 2147483647, and divisor is not 0. Return the quotient of dividend divided by divisor, with the fraction thrown away, so the result is rounded toward zero: 7 divided by -3 gives -2.

The only result that can leave the signed 32-bit range is -2147483648 divided by -1, which would be 2147483648. Return 2147483647 for that case.

::exercise
---
id: iv-medium-002
prompt: Write a function divide(dividend, divisor) that returns the quotient rounded toward zero, without using the *, /, // or % operators, and capped at 2147483647.
starter: |
  # write your code below
  def divide(dividend, divisor):
      pass
hints:
  - Keep the signs aside and work with absolute values, then put the sign back at the end.
  - Do not use *, /, // or % at all: double with addition (t + t) instead of multiplying.
  - Subtracting the divisor again and again is correct but slow. Subtracting it doubled (divisor, twice divisor, four times divisor, and so on) takes far fewer steps.
tests:
  - check: assert divide(10, 3) == 3
  - check: assert divide(7, -3) == -2
  - check: assert divide(-7, 2) == -3
  - check: assert divide(-7, -2) == 3
  - check: assert divide(0, 5) == 0
  - check: assert divide(1, 1) == 1
  - check: assert divide(4, 2) == 2
  - check: assert divide(3, 7) == 0
  - check: assert divide(-2147483648, -1) == 2147483647
  - check: assert divide(-1, 1) == -1
  - check: assert divide(-2147483648, 1) == -2147483648
big: assert divide(2147483647, -7) == -306783378
solution: |
  def divide(dividend, divisor):
      if dividend == -2**31 and divisor == -1:
          return 2**31 - 1
      negative = (dividend < 0) != (divisor < 0)
      left, right = abs(dividend), abs(divisor)
      quotient = 0
      for shift in range(31, -1, -1):
          if right << shift <= left:
              left -= right << shift
              quotient += 1 << shift
      return -quotient if negative else quotient
brute: |
  def divide(dividend, divisor):
      negative = (dividend < 0) != (divisor < 0)
      count = abs(dividend) // abs(divisor)
      if negative:
          count = -count
      return max(-2**31, min(2**31 - 1, count))
random:
  call: divide
  gen: |
    def gen(rng, size):
        divisor = rng.choice([d for d in range(-50, 51) if d != 0])
        q = rng.randint(-40, 40)
        r = rng.randint(-(abs(divisor) - 1), abs(divisor) - 1)
        return (q * divisor + r, divisor)
no_slow: "Repeated subtraction needs up to 2^31 steps for dividend -2147483648 and divisor 1, so it runs out of steps on fixed test 11 itself and the fixed tests catch it. The faster methods are all doubling methods such as the shift loop."
wrong:
  - |
    def divide(dividend, divisor):
        negative = (dividend < 0) != (divisor < 0)
        left, right = abs(dividend), abs(divisor)
        quotient = 0
        for shift in range(31, -1, -1):
            if right << shift <= left:
                left -= right << shift
                quotient += 1 << shift
        return -quotient if negative else quotient
  - |
    def divide(dividend, divisor):
        if dividend == -2**31 and divisor == -1:
            return 2**31 - 1
        return dividend // divisor
  - |
    def divide(dividend, divisor):
        if dividend == -2**31 and divisor == -1:
            return 2**31 - 1
        negative = dividend < 0 and divisor < 0
        left, right = abs(dividend), abs(divisor)
        quotient = 0
        while left >= right:
            left -= right
            quotient += 1
        return -quotient if negative else quotient
  - |
    def divide(dividend, divisor):
        if dividend == -2**31 and divisor == -1:
            return 2**31 - 1
        negative = (dividend < 0) != (divisor < 0)
        left, right = abs(dividend), abs(divisor)
        quotient = 0
        while left > right:
            left -= right
            quotient += 1
        return -quotient if negative else quotient
equivalent:
  - "negative = (dividend <= 0) != (divisor < 0)"  # why: when the dividend is 0 the quotient is 0, so its sign does not matter
  - "negative = (dividend < 1) != (divisor < 0)"  # why: when dividend is 0 the quotient is 0 and its sign does not matter
  - "negative = (dividend < 0) != (divisor < 1)"  # why: divisor is never 0, so divisor < 1 and divisor < 0 agree on every value
  - "negative = (dividend < 0) != (divisor <= 0)"  # why: divisor is never 0, so divisor <= 0 and divisor < 0 agree on every value
  - 7: "for shift in range(32, -1, -1):"  # why: the largest absolute dividend is 2**31, so a shift of 32 makes right << 32 at least 2**32, which is never <= left; the first useful shift is 31
---
::
