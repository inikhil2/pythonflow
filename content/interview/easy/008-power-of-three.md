---
title: Power of Three
tier: easy
order: 8
leetcode: 326
url: https://leetcode.com/problems/power-of-three/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get a whole number n, which may be zero or negative. Return True if n is a power of three (1, 3, 9, 27 and so on), and False otherwise.

::exercise
---
id: iv-easy-008
prompt: Write a function is_power_of_three(n) that returns True when n is a power of three, and False otherwise.
starter: |
  # write your code below
  def is_power_of_three(n):
      pass
hints:
  - Zero and negative numbers are never powers of three.
  - Keep dividing by 3 while n divides evenly. A power of three ends at 1.
tests:
  - check: assert is_power_of_three(1) == True
  - check: assert is_power_of_three(27) == True
  - check: assert is_power_of_three(9) == True
  - check: assert is_power_of_three(0) == False
  - check: assert is_power_of_three(-27) == False
  - check: assert is_power_of_three(45) == False
  - check: assert is_power_of_three(2) == False
  - check: assert is_power_of_three(3 ** 30) == True
solution: |
  def is_power_of_three(n):
      if n < 1:
          return False
      while n % 3 == 0:
          n = n // 3
      return n == 1
brute: |
  def is_power_of_three(n):
      p = 1
      while p < n:
          p *= 3
      return p == n
random:
  call: is_power_of_three
  gen: |
    def gen(rng, size):
        if rng.random() < 0.5:
            n = 3 ** rng.randint(0, 2 * size + 2)
            n = n + rng.choice([0, 0, -1, 1, 3])
        else:
            n = rng.randint(-10, 3 ** (size // 2 + 3))
        return (n,)
wrong:
  - |
    def is_power_of_three(n):
        return n % 3 == 0
  - |
    def is_power_of_three(n):
        if n < 1:
            return False
        return n % 3 == 0 or n == 1
  - |
    def is_power_of_three(n):
        return n > 0 and 3 ** 20 % n == 0
---
::
