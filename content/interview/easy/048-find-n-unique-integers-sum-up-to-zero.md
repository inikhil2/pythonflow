---
title: Find N Unique Integers Sum up to Zero
tier: easy
order: 48
leetcode: 1304
url: https://leetcode.com/problems/find-n-unique-integers-sum-up-to-zero/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/06-numbers]
---

You get a whole number n from 1 to 1000. Return a list of n different whole numbers whose sum is 0. Many lists are correct, so the numbers and their order may differ from other answers. Only the length, the uniqueness and the sum are checked.

::exercise
---
id: iv-easy-048
prompt: Write a function sum_zero(n) that returns n different whole numbers that add up to 0.
starter: |
  # write your code below
  def sum_zero(n):
      pass
hints:
  - Pair up numbers such as 1 and -1, so each pair cancels out.
  - When n is odd, one number is left over, and 0 can fill that place since it adds nothing.
tests:
  - check: assert sorted(sum_zero(1)) == [0]
  - check: assert len(sum_zero(2)) == 2 and len(set(sum_zero(2))) == 2 and sum(sum_zero(2)) == 0
  - check: assert len(sum_zero(3)) == 3 and len(set(sum_zero(3))) == 3 and sum(sum_zero(3)) == 0
  - check: assert len(sum_zero(4)) == 4 and len(set(sum_zero(4))) == 4 and sum(sum_zero(4)) == 0
  - check: assert len(sum_zero(5)) == 5 and len(set(sum_zero(5))) == 5 and sum(sum_zero(5)) == 0
  - check: assert len(sum_zero(7)) == 7 and sum(sum_zero(7)) == 0
  - check: assert sum(sum_zero(1000)) == 0 and len(set(sum_zero(1000))) == 1000
solution: |
  def sum_zero(n):
      result = list(range(1, n // 2 + 1))
      result += [-x for x in result]
      if n % 2:
          result.append(0)
      return result
brute: |
  def sum_zero(n):
      out = []
      v = 1
      while len(out) + 2 <= n:
          out += [v, -v]
          v += 1
      if len(out) < n:
          out.append(0)
      return out
random:
  call: sum_zero
  gen: |
    def gen(rng, size):
        return (rng.randint(1, 1000),)
  same: |
    def same(args, got, want):
        n = args[0]
        return len(got) == n and len(set(got)) == n and sum(got) == 0
wrong:
  - |
    def sum_zero(n):
        return list(range(n))
  - |
    def sum_zero(n):
        result = list(range(1, n // 2 + 1))
        result += [-x for x in result]
        return result
---
::
