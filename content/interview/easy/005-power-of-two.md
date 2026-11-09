---
title: Power of Two
tier: easy
order: 5
leetcode: 231
url: https://leetcode.com/problems/power-of-two/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get a whole number n, which may be zero or negative. Return True if n is a power of two (1, 2, 4, 8 and so on), and False otherwise.

::exercise
---
id: iv-easy-005
prompt: Write a function is_power_of_two(n) that returns True when n is a power of two, and False otherwise.
starter: |
  # write your code below
  def is_power_of_two(n):
      pass
hints:
  - Zero and negative numbers are never powers of two.
  - Keep dividing by 2 while n is even. A power of two ends at 1.
tests:
  - check: assert is_power_of_two(1) == True
  - check: assert is_power_of_two(16) == True
  - check: assert is_power_of_two(3) == False
  - check: assert is_power_of_two(0) == False
  - check: assert is_power_of_two(-8) == False
  - check: assert is_power_of_two(6) == False
  - check: assert is_power_of_two(2 ** 40) == True
solution: |
  def is_power_of_two(n):
      if n < 1:
          return False
      while n % 2 == 0:
          n = n // 2
      return n == 1
brute: |
  def is_power_of_two(n):
      p = 1
      while p < n:
          p *= 2
      return p == n
random:
  call: is_power_of_two
  gen: |
    def gen(rng, size):
        if rng.random() < 0.5:
            n = 2 ** rng.randint(0, 3 * size + 2)
            n = n + rng.choice([0, 0, -1, 1])
        else:
            n = rng.randint(-10, 2 ** (size + 3))
        return (n,)
wrong:
  - |
    def is_power_of_two(n):
        return n % 2 == 0
  - |
    def is_power_of_two(n):
        if n < 1:
            return False
        return n % 2 == 0 or n == 1
  - |
    def is_power_of_two(n):
        if n < 1:
            return False
        while n % 2 == 0:
            n = n // 2
        return True
---
::
