---
title: Counting Bits
tier: easy
order: 7
leetcode: 338
url: https://leetcode.com/problems/counting-bits/
companies: [Meta, Amazon, Google]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers, /learn/week2-loops/03-lists]
---

You get a whole number n ≥ 0. Return a list of n + 1 numbers, where the number at position i is how many 1 bits i has when written in binary. For example, 5 is 101 in binary, so it has two 1 bits.

::exercise
---
id: iv-easy-007
prompt: Write a function count_bits(n) that returns a list whose item i is the number of 1 bits in i, for every i from 0 to n.
starter: |
  # write your code below
  def count_bits(n):
      pass
hints:
  - i // 2 is i with its last bit dropped, and i % 2 is that last bit.
  - So the count for i is the count for i // 2, which you already have, plus i % 2.
tests:
  - check: assert count_bits(0) == [0]
  - check: assert count_bits(1) == [0, 1]
  - check: assert count_bits(2) == [0, 1, 1]
  - check: assert count_bits(5) == [0, 1, 1, 2, 1, 2]
  - check: assert count_bits(8) == [0, 1, 1, 2, 1, 2, 2, 3, 1]
  - check: assert count_bits(31)[31] == 5
solution: |
  def count_bits(n):
      ans = [0] * (n + 1)
      for i in range(n + 1):
          ans[i] = ans[i // 2] + i % 2
      return ans
brute: |
  def count_bits(n):
      return [bin(i).count("1") for i in range(n + 1)]
random:
  call: count_bits
  gen: |
    def gen(rng, size):
        return (rng.randint(0, 10 * size + 5),)
wrong:
  - |
    def count_bits(n):
        return [bin(i).count("1") for i in range(n)]
  - |
    def count_bits(n):
        ans = [0] * (n + 1)
        for i in range(1, n + 1):
            ans[i] = ans[i - 1] + 1
        return ans
  - |
    def count_bits(n):
        ans = [0] * (n + 1)
        for i in range(1, n + 1):
            ans[i] = ans[i // 2] + 1
        return ans
---
::
