---
title: Happy Number
tier: easy
order: 65
leetcode: 202
url: https://leetcode.com/problems/happy-number/
companies: [Google, Amazon, Apple]
topic: Hash table
needs: [/learn/week0-functions/06-numbers, /learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a whole number `n` from 1 to 2147483647. Repeat this step: replace the number with the sum of the squares of its digits. For example, 19 becomes 1 + 81 = 82, then 68, then 100, then 1. If the steps reach 1, the number is happy. If they never reach 1, it is not happy.

Return `True` for a happy number and `False` for a number that is not happy.

::exercise
---
id: iv-easy-065
prompt: Write a function is_happy(n) that returns True if n is a happy number and False if it is not.
starter: |
  # write your code below
  def is_happy(n):
      pass
hints:
  - Write the digit-square step as its own loop, and keep going until the value is 1.
  - If the same value appears twice, the steps will repeat forever, so the number is not happy.
tests:
  - check: assert is_happy(1) == True
  - check: assert is_happy(19) == True
  - check: assert is_happy(2) == False
  - check: assert is_happy(7) == True
  - check: assert is_happy(4) == False
  - check: assert is_happy(10) == True
  - check: assert is_happy(20) == False
  - check: assert is_happy(2147483647) == False
solution: |
  def is_happy(n):
      seen = {}
      while n != 1:
          if seen.get(n):
              return False
          seen[n] = True
          total = 0
          for digit in str(n):
              total += int(digit) ** 2
          n = total
      return True
brute: |
  def is_happy(n):
      for _ in range(1000):
          if n == 1:
              return True
          total = 0
          for digit in str(n):
              total += int(digit) ** 2
          n = total
      return False
random:
  call: is_happy
  gen: |
    def gen(rng, size):
        return (rng.randint(1, min(2147483647, 10 ** max(size, 1))),)
wrong:
  - |
    def is_happy(n):
        total = 0
        for digit in str(n):
            total += int(digit) ** 2
        return total == 1
  - |
    def is_happy(n):
        while n >= 10:
            total = 0
            for digit in str(n):
                total += int(digit) ** 2
            n = total
        return n == 1
---
::
