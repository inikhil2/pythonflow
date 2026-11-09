---
title: Koko Eating Bananas
tier: medium
order: 58
leetcode: 875
url: https://leetcode.com/problems/koko-eating-bananas/
companies: [Amazon, Google, Meta]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

A person has several piles of bananas, given as the list piles, and h hours to eat them all. Each pile has between 1 and 1000000000 bananas, and the list has between 1 and 20000 piles. h is a whole number at least as big as the number of piles and at most 1000000000. In each hour the person picks one pile and eats up to k bananas from it, where k is a whole number speed. If a pile has fewer than k bananas, the person finishes it and does nothing more with it that hour. A pile that needs more than one hour takes that many hours, so a pile of 7 bananas at speed 3 takes 3 hours. Return the smallest speed k that lets the person finish every pile within h hours.

The more bananas per hour, the fewer hours are needed, so the answer is the smallest speed that works. Try speeds with a binary search instead of testing every speed.

::exercise
---
id: iv-medium-058
prompt: Write a function min_eating_speed(piles, h) that returns the smallest whole-number speed that finishes all the piles within h hours.
starter: |
  # write your code below
  def min_eating_speed(piles, h):
      pass
hints:
  - A pile of p bananas at speed k takes ceil(p / k) hours, which is (p + k - 1) // k in whole numbers.
  - The answer lies between 1 and the largest pile. Halve that range until the lowest working speed is left.
tests:
  - check: assert min_eating_speed([3, 6, 7, 11], 8) == 4
  - check: assert min_eating_speed([30, 11, 23, 4, 20], 5) == 30
  - check: assert min_eating_speed([30, 11, 23, 4, 20], 6) == 23
  - check: assert min_eating_speed([5], 5) == 1
  - check: assert min_eating_speed([8], 2) == 4
  - check: assert min_eating_speed([2, 2], 2) == 2
  - check: assert min_eating_speed([1], 1) == 1
  - check: assert min_eating_speed([312884470], 312884469) == 2
big: assert min_eating_speed([(i * 7919) % 1000003 + 1 for i in range(20000)], 3000000) == 3340
solution: |
  def min_eating_speed(piles, h):
      lo, hi = 1, max(piles)
      while lo < hi:
          mid = (lo + hi) // 2
          hours = 0
          for pile in piles:
              hours += (pile + mid - 1) // mid
          if hours <= h:
              hi = mid
          else:
              lo = mid + 1
      return lo
brute: |
  def min_eating_speed(piles, h):
      speed = 1
      while True:
          hours = sum((pile + speed - 1) // speed for pile in piles)
          if hours <= h:
              return speed
          speed += 1
random:
  call: min_eating_speed
  gen: |
    def gen(rng, size):
        piles = [rng.randint(1, 12) for _ in range(max(size, 1))]
        return (piles, rng.randint(len(piles), len(piles) * 4))
slow:
  - |
    def min_eating_speed(piles, h):
        speed = 1
        while True:
            hours = 0
            for pile in piles:
                hours += (pile + speed - 1) // speed
            if hours <= h:
                return speed
            speed += 1
wrong:
  - |
    def min_eating_speed(piles, h):
        return max(1, -(-sum(piles) // h))
  - |
    def min_eating_speed(piles, h):
        lo, hi = 1, max(piles)
        while lo < hi:
            mid = (lo + hi) // 2
            hours = 0
            for pile in piles:
                hours += pile // mid
            if hours <= h:
                hi = mid
            else:
                lo = mid + 1
        return lo
  - |
    def min_eating_speed(piles, h):
        lo, hi = 1, max(piles) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            hours = 0
            for pile in piles:
                hours += (pile + mid - 1) // mid
            if hours <= h:
                hi = mid
            else:
                lo = mid + 1
        return lo
---
::
