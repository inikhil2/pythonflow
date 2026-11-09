---
title: Climbing Stairs
tier: easy
order: 2
leetcode: 70
url: https://leetcode.com/problems/climbing-stairs/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get a number of steps n from 1 to 70. You can climb 1 or 2 steps at a time. Return the number of different ways to reach the top.

::exercise
---
id: iv-easy-002
prompt: Write a function climb_stairs(n) that returns the number of ways to climb n steps, taking 1 or 2 steps at a time.
starter: |
  # write your code below
  def climb_stairs(n):
      pass
hints:
  - Keep the last two counts in a loop.
  - climb_stairs(1) = 1, climb_stairs(2) = 2.
tests:
  - check: assert climb_stairs(1) == 1
  - check: assert climb_stairs(2) == 2
  - check: assert climb_stairs(3) == 3
  - check: assert climb_stairs(5) == 8
  - check: assert climb_stairs(10) == 89
  - check: assert climb_stairs(45) == 1836311903
solution: |
  def climb_stairs(n):
      prev2, prev1 = 1, 1
      for _ in range(n - 1):
          prev2, prev1 = prev1, prev1 + prev2
      return prev1
brute: |
  from math import comb
  def climb_stairs(n):
      return sum(comb(n - k, k) for k in range(n // 2 + 1))
random:
  call: climb_stairs
  gen: |
    def gen(rng, size):
        n = rng.randint(1, 5 * size + 10)
        return (n,)
wrong:
  - |
    def climb_stairs(n):
        return n
  - |
    def climb_stairs(n):
        if n == 1:
            return 1
        if n == 2:
            return 2
        prev2 = 1
        prev1 = 2
        for i in range(3, n + 2):
            current = prev1 + prev2
            prev2 = prev1
            prev1 = current
        return prev1
  - |
    def climb_stairs(n):
        if n == 1:
            return 1
        if n == 2:
            return 1
        prev2 = 1
        prev1 = 1
        for i in range(3, n + 1):
            current = prev1 + prev2
            prev2 = prev1
            prev1 = current
        return prev1
---
::
