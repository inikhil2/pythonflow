---
title: Plus One
tier: easy
order: 24
leetcode: 66
url: https://leetcode.com/problems/plus-one/
companies: [Google, Meta, Amazon]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/06-numbers]
---

You get a list of digits that spells a whole number, with the most significant digit first. The list has at least one digit, and it has no leading zeros, except for the number 0 itself. Add one to that number and return the new digits as a list. The list you were given must stay the same.

::exercise
---
id: iv-easy-024
prompt: Write a function plus_one(digits) that returns a new list of digits for the number spelled by digits, plus one.
starter: |
  # write your code below
  def plus_one(digits):
      pass
hints:
  - Start at the last digit and add one there. If that digit was 9, it becomes 0 and the carry moves one place left.
  - If every digit was 9, the answer needs one more digit at the front, so add a 1 there.
tests:
  - check: assert plus_one([1]) == [2]
  - check: assert plus_one([0]) == [1]
  - check: assert plus_one([9]) == [1, 0]
  - check: assert plus_one([1, 2, 3]) == [1, 2, 4]
  - check: assert plus_one([1, 2, 9]) == [1, 3, 0]
  - check: assert plus_one([9, 9]) == [1, 0, 0]
  - check: assert plus_one([4, 3, 2, 1]) == [4, 3, 2, 2]
  - check: assert plus_one([9] * 1000) == [1] + [0] * 1000
solution: |
  def plus_one(digits):
      result = list(digits)
      i = len(result) - 1
      while i >= 0:
          if result[i] < 9:
              result[i] += 1
              return result
          result[i] = 0
          i -= 1
      return [1] + result
brute: |
  def plus_one(digits):
      number = int("".join(str(d) for d in digits))
      return [int(c) for c in str(number + 1)]
random:
  call: plus_one
  gen: |
    def gen(rng, size):
        digits = [rng.choice([9, 9, 8, 0, 3]) for _ in range(rng.randint(1, size + 3))]
        digits[0] = rng.randint(1, 9)
        return (digits,)
wrong:
  - |
    def plus_one(digits):
        result = list(digits)
        result[-1] += 1
        return result
  - |
    def plus_one(digits):
        result = list(digits)
        for i in range(len(result) - 1, -1, -1):
            if result[i] < 9:
                result[i] += 1
                return result
            result[i] = 0
        return result
---
::
