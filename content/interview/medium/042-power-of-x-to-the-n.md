---
title: Power of X to the N
tier: medium
order: 42
leetcode: 50
url: https://leetcode.com/problems/powx-n/
companies: [Amazon, Microsoft, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week0-functions/06-numbers, /learn/week2-loops/02-for-and-range]
---

You get a number `x` from -10 to 10, which may have decimals, and a whole number `n` from -2147483648 to 2147483647. Return x raised to the power n. When `n` is negative, return 1 divided by x raised to the power of -n. `x` is never 0 when `n` is negative, so you never divide by zero. Zero to the power 0 is 1.

The true answer is never larger than 10^9 in size, but it may be very small, even 0 once the float runs out of room.

For example, power(2, 10) gives 1024, power(2, -2) gives 0.25 and power(-2, 3) gives -8.

::exercise
---
id: iv-medium-042
prompt: Write a function power(x, n) that returns x raised to the power n.
starter: |
  # write your code below
  def power(x, n):
      pass
hints:
  - Handle a negative n first: replace x with 1 / x and n with -n. Then the power is always a non-negative count of multiplications.
  - Repeated squaring needs far fewer steps than multiplying one at a time. Each step halves n and squares x; odd steps also multiply the result by x. The point is to do the multiplying yourself, so avoid ** and pow.
tests:
  - check: 'assert power(0, 0) == 1'
  - check: 'assert power(2, 10) == 1024'
  - check: 'assert power(2, -2) == 0.25'
  - check: 'assert power(2, 0) == 1'
  - check: 'assert power(-2, 3) == -8'
  - check: 'assert power(-3, 2) == 9'
  - check: 'assert power(5, 1) == 5'
  - check: 'assert power(1, -8) == 1'
  - check: 'assert power(0, 4) == 0'
  - check: 'assert power(10, 8) == 100000000'
  - check: 'assert power(-1, -3) == -1'
  - check: 'assert power(1.5, 2) == 2.25'
  - check: 'assert power(0.5, -3) == 8'
big: 'assert abs(power(1 + 2.0 ** -31, 2 ** 31 - 1) / 2.7182818265600877 - 1) < 1e-5 and power(2.0, -2147483648) == 0 and abs(power(1 - 2.0 ** -31, -(2 ** 31)) / 2.7182818265600877 - 1) < 1e-5'
solution: |
  def power(x, n):
      if n < 0:
          x = 1 / x
          n = -n
      result = 1.0
      while n > 0:
          if n % 2 == 1:
              result *= x
          x *= x
          n //= 2
      return result
brute: |
  def power(x, n):
      result = 1.0
      for _ in range(abs(n)):
          result *= x
      return result if n >= 0 else 1 / result
random:
  call: power
  gen: |
    def gen(rng, size):
        x = rng.choice([rng.randint(-10, 10), round(rng.uniform(-10, 10), 2)])
        big = max(abs(x), 1 / abs(x)) if x else 1
        cap = 60 if big == 1 else min(60, int(9 / __import__("math").log10(big)))
        n = rng.randint(-cap, cap)
        if x == 0 and n < 0:
            n = -n
        return (x, n)
  same: |
    def same(args, got, want):
        return abs(got - want) <= 1e-9 * max(1.0, abs(want))
slow:
  - |
    def power(x, n):
        if n < 0:
            x = 1 / x
            n = -n
        result = 1.0
        for _ in range(n):
            result *= x
        return result
wrong:
  - |
    def power(x, n):
        n = abs(n)
        result = 1.0
        while n > 0:
            if n % 2 == 1:
                result *= x
            x *= x
            n //= 2
        return result
  - |
    def power(x, n):
        if n < 0:
            x = 1 / x
            n = -n
        result = 1.0
        while n > 1:
            if n % 2 == 1:
                result *= x
            x *= x
            n //= 2
        return result
  - |
    def power(x, n):
        if n < 0:
            x = 1 / x
        result = 1.0
        while n > 0:
            if n % 2 == 1:
                result *= x
            x *= x
            n //= 2
        return result
---
::
