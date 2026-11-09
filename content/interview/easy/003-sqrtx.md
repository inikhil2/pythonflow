---
title: Sqrt(x)
tier: easy
order: 3
leetcode: 69
url: https://leetcode.com/problems/sqrtx/
companies: [Google, Amazon, Microsoft]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get a whole number x ≥ 0. Return the square root rounded down to an int. You may not use **, pow or math. Binary search is the fast way.

::exercise
---
id: iv-easy-003
prompt: Write a function my_sqrt(x) that returns the square root of x rounded down to an int.
starter: |
  # write your code below
  def my_sqrt(x):
      pass
hints:
  - Use binary search on lo and hi.
  - Return the largest i where i * i ≤ x.
tests:
  - check: assert my_sqrt(0) == 0
  - check: assert my_sqrt(1) == 1
  - check: assert my_sqrt(4) == 2
  - check: assert my_sqrt(8) == 2
  - check: assert my_sqrt(2147395600) == 46340
  - check: assert my_sqrt(2147395599) == 46339
solution: |
  def my_sqrt(x):
      lo = 0
      hi = x
      while lo < hi:
          mid = (lo + hi + 1) // 2
          if mid * mid > x:
              hi = mid - 1
          else:
              lo = mid
      return lo
brute: |
  def my_sqrt(x):
      i = 0
      while (i + 1) * (i + 1) <= x:
          i += 1
      return i
random:
  call: my_sqrt
  gen: |
    def gen(rng, size):
        if rng.random() < 0.5:
            i = rng.randint(0, 10**(size // 2 + 1))
            offset = rng.randint(-1, 1)
            x = i * i + offset
            if x < 0:
                x = 0
            return (x,)
        else:
            return (rng.randint(0, 10**(size // 2 + 1)),)
wrong:
  - |
    def my_sqrt(x):
        return round(x ** 0.5)
  - |
    def my_sqrt(x):
        if x == 0:
            return 0
        i = 1
        while i * i < x:
            i += 1
        return i
  - |
    def my_sqrt(x):
        if x == 0:
            return 0
        lo, hi = 1, x
        while lo < hi:
            mid = (lo + hi) // 2
            if mid * mid <= x:
                lo = mid + 1
                ans = mid
            else:
                hi = mid - 1
        return ans
equivalent:
  - lo = -1  # why: mid never drops below 0, so starting one lower ends on the same answer
  - mid = (lo + hi + 2) // 2  # why: mid stays above lo and at most hi, so the search still ends on the same answer
---
::
