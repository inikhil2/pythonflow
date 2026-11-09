---
title: Reverse Bits
tier: easy
order: 6
leetcode: 190
url: https://leetcode.com/problems/reverse-bits/
companies: [Meta, Apple, Google]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get a whole number n from 0 to 2 ** 32 - 1. Write it as exactly 32 bits, with zeros in front where needed. Return the number those 32 bits make when read in reverse order.

::exercise
---
id: iv-easy-006
prompt: Write a function reverse_bits(n) that returns n with its 32 bits in reverse order.
starter: |
  # write your code below
  def reverse_bits(n):
      pass
hints:
  - n % 2 is the last bit of n, and n // 2 drops that bit.
  - Build the answer with result * 2 + bit, exactly 32 times, so leading zeros count too.
tests:
  - check: assert reverse_bits(0) == 0
  - check: assert reverse_bits(1) == 2147483648
  - check: assert reverse_bits(2) == 1073741824
  - check: assert reverse_bits(43261596) == 964176192
  - check: assert reverse_bits(4294967293) == 3221225471
  - check: assert reverse_bits(4294967295) == 4294967295
solution: |
  def reverse_bits(n):
      result = 0
      for _ in range(32):
          result = result * 2 + n % 2
          n = n // 2
      return result
brute: |
  def reverse_bits(n):
      return int(format(n, "032b")[::-1], 2)
random:
  call: reverse_bits
  gen: |
    def gen(rng, size):
        return (rng.randint(0, 2 ** min(32, 3 * size + 2) - 1),)
wrong:
  - |
    def reverse_bits(n):
        result = 0
        while n > 0:
            result = result * 2 + n % 2
            n = n // 2
        return result
  - |
    def reverse_bits(n):
        result = 0
        for _ in range(31):
            result = result * 2 + n % 2
            n = n // 2
        return result
  - |
    def reverse_bits(n):
        return int(bin(n)[2:][::-1], 2)
---
::
