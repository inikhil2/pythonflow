---
title: Valid Perfect Square
tier: easy
order: 9
leetcode: 367
url: https://leetcode.com/problems/valid-perfect-square/
companies: [Google, Meta, Amazon]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get a whole number num ≥ 1. Return True if num is a perfect square, meaning some whole number times itself equals num, and False otherwise. You may not use **, pow or math.

::exercise
---
id: iv-easy-009
prompt: Write a function is_perfect_square(num) that returns True when num is a whole number times itself, and False otherwise.
starter: |
  # write your code below
  def is_perfect_square(num):
      pass
hints:
  - Count i up from 1 while i * i is still smaller than num.
  - When the loop stops, num is a perfect square only if i * i equals it. Binary search is faster for huge numbers.
tests:
  - check: assert is_perfect_square(16) == True
  - check: assert is_perfect_square(14) == False
  - check: assert is_perfect_square(1) == True
  - check: assert is_perfect_square(2) == False
  - check: assert is_perfect_square(808201) == True
  - check: assert is_perfect_square(2147395600) == True
  - check: assert is_perfect_square(2147483647) == False
solution: |
  def is_perfect_square(num):
      i = 1
      while i * i < num:
          i += 1
      return i * i == num
brute: |
  def is_perfect_square(num):
      total, odd = 0, 1
      while total < num:
          total += odd
          odd += 2
      return total == num
random:
  call: is_perfect_square
  gen: |
    def gen(rng, size):
        if rng.random() < 0.5:
            i = rng.randint(1, 10 ** (size // 4 + 1))
            num = i * i + rng.choice([0, 0, -1, 1])
        else:
            num = rng.randint(1, 10 ** (size // 2 + 1))
        return (max(num, 1),)
wrong:
  - |
    def is_perfect_square(num):
        i = 1
        while i * i <= num:
            i += 1
        return i * i == num
  - |
    def is_perfect_square(num):
        i = 1
        while i * i < num:
            i += 2
        return i * i == num
  - |
    def is_perfect_square(num):
        for i in range(1, num // 2):
            if i * i == num:
                return True
        return False
equivalent:
  - i = 0  # why: 0 * 0 is below every num, so the loop steps i to 1 and goes on as before
  - i -= 1  # why: i walks down through the negatives, and (-k) * (-k) == k * k, so the loop stops at the same square
---
::
