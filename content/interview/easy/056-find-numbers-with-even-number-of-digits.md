---
title: Find Numbers with Even Number of Digits
tier: easy
order: 56
leetcode: 1295
url: https://leetcode.com/problems/find-numbers-with-even-number-of-digits/
companies: [Google, Meta, Amazon]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/06-numbers]
---

You get a list nums of 1 to 500 whole numbers, each from 1 to 100000. Count how many of them have an even number of digits. Return that count.

::exercise
---
id: iv-easy-056
prompt: Write a function find_numbers(nums) that returns how many numbers in nums have an even number of digits.
starter: |
  # write your code below
  def find_numbers(nums):
      pass
hints:
  - Turn each number into text, then take the length of that text.
  - A length with remainder 0 when divided by 2 is even.
tests:
  - check: assert find_numbers([12, 345, 2, 6, 7896]) == 2
  - check: assert find_numbers([555, 901, 482, 1771]) == 1
  - check: assert find_numbers([1]) == 0
  - check: assert find_numbers([10]) == 1
  - check: assert find_numbers([100000]) == 1
  - check: assert find_numbers([99999]) == 0
  - check: assert find_numbers([7, 77, 777, 7777]) == 2
solution: |
  def find_numbers(nums):
      return sum(1 for x in nums if len(str(x)) % 2 == 0)
brute: |
  def find_numbers(nums):
      count = 0
      for x in nums:
          digits = 0
          while x > 0:
              x //= 10
              digits += 1
          if digits % 2 == 0:
              count += 1
      return count
random:
  call: find_numbers
  gen: |
    def gen(rng, size):
        return ([rng.randint(1, 100000) for _ in range(rng.randint(1, size + 4))],)
wrong:
  - |
    def find_numbers(nums):
        return sum(1 for x in nums if len(str(x)) % 2 == 1)
  - |
    def find_numbers(nums):
        return sum(1 for x in nums if len(str(x)) == 2)
---
::
