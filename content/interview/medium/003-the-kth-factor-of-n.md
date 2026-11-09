---
title: The kth Factor of n
tier: medium
order: 3
leetcode: 1492
url: https://leetcode.com/problems/the-kth-factor-of-n/
companies: [Amazon, Google, Microsoft]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get two whole numbers, `n` and `k`, where 1 <= k <= n <= 10**7. A factor of `n` is a positive whole number that divides `n` with no remainder. List all the factors of `n` from smallest to largest, and return the factor at position `k`, counting from 1. If `n` has fewer than `k` factors, return -1.

A factor pair such as 3 and 4 for 12 both belong in the list, and `n` itself is a factor, so 12 is the last factor of 12.

::exercise
---
id: iv-medium-003
prompt: Write a function kth_factor(n, k) that returns the k-th smallest positive factor of n, or -1 if n has fewer than k factors.
starter: |
  # write your code below
  def kth_factor(n, k):
      pass
hints:
  - A factor d below the square root of n always comes with a partner n // d, which is at least as big.
  - Collect the small factors in increasing order and the partners in reverse, and the two lists join into one sorted list.
tests:
  - check: assert kth_factor(12, 3) == 3
  - check: assert kth_factor(7, 2) == 7
  - check: assert kth_factor(4, 4) == -1
  - check: assert kth_factor(1, 1) == 1
  - check: assert kth_factor(1, 2) == -1
  - check: assert kth_factor(36, 9) == 36
  - check: assert kth_factor(36, 4) == 4
  - check: assert kth_factor(1000, 16) == 1000
  - check: assert kth_factor(1000, 1) == 1
big: assert kth_factor(9696996, 24) == 4671
solution: |
  def kth_factor(n, k):
      small, large = [], []
      i = 1
      while i * i <= n:
          if n % i == 0:
              small.append(i)
              if i != n // i:
                  large.append(n // i)
          i += 1
      factors = small + large[::-1]
      return factors[k - 1] if k <= len(factors) else -1
slow:
  - |
    def kth_factor(n, k):
        factors = []
        for d in range(1, n + 1):
            if n % d == 0:
                factors.append(d)
        return factors[k - 1] if k <= len(factors) else -1
  - |
    def kth_factor(n, k):
        factors = [d for d in range(1, n + 1) if n % d == 0]
        return factors[k - 1] if k <= len(factors) else -1
brute: |
  def kth_factor(n, k):
      factors = [d for d in range(1, n + 1) if n % d == 0]
      return factors[k - 1] if k <= len(factors) else -1
random:
  call: kth_factor
  gen: |
    def gen(rng, size):
        n = rng.randint(1, 1000)
        return (n, rng.randint(1, min(n, 12)))
wrong:
  - |
    def kth_factor(n, k):
        factors = [d for d in range(1, n + 1) if n % d == 0]
        return factors[k] if k < len(factors) else -1
  - |
    def kth_factor(n, k):
        factors = [d for d in range(1, n // 2 + 1) if n % d == 0]
        return factors[k - 1] if k <= len(factors) else -1
  - |
    def kth_factor(n, k):
        small, large = [], []
        i = 1
        while i * i <= n:
            if n % i == 0:
                small.append(i)
                large.append(n // i)
            i += 1
        factors = small + large[::-1]
        return factors[k - 1] if k <= len(factors) else -1
---
::
