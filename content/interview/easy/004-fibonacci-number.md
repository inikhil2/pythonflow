---
title: Fibonacci Number
tier: easy
order: 4
leetcode: 509
url: https://leetcode.com/problems/fibonacci-number/
companies: [Google, Apple, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

The Fibonacci numbers start 0, 1, and each next number is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8 and so on. You get n from 0 to 100. Return the Fibonacci number at position n, counting from 0.

::exercise
---
id: iv-easy-004
prompt: Write a function fib(n) that returns the Fibonacci number at position n, where fib(0) is 0 and fib(1) is 1.
starter: |
  # write your code below
  def fib(n):
      pass
hints:
  - Keep the last two numbers in two variables and move them forward n times.
  - Update both at once with a, b = b, a + b, so the old a is still there when you add.
tests:
  - check: assert fib(0) == 0
  - check: assert fib(1) == 1
  - check: assert fib(2) == 1
  - check: assert fib(3) == 2
  - check: assert fib(10) == 55
  - check: assert fib(30) == 832040
  - check: assert fib(100) == 354224848179261915075
  - check: assert fib(4) == 3
solution: |
  def fib(n):
      a, b = 0, 1
      for _ in range(n):
          a, b = b, a + b
      return a
brute: |
  def fib(n):
      seq = [0, 1]
      while len(seq) <= n:
          seq.append(seq[-1] + seq[-2])
      return seq[n]
random:
  call: fib
  gen: |
    def gen(rng, size):
        return (rng.randint(0, 8 * size + 4),)
wrong:
  - |
    def fib(n):
        a, b = 0, 1
        for _ in range(n - 1):
            a, b = b, a + b
        return b
  - |
    def fib(n):
        a, b = 1, 1
        for _ in range(n):
            a, b = b, a + b
        return a
  - |
    def fib(n):
        a, b = 0, 1
        for _ in range(n):
            a = b
            b = a + b
        return a
---
::
