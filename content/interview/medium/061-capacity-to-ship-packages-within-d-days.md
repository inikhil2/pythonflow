---
title: Capacity To Ship Packages Within D Days
tier: medium
order: 61
leetcode: 1011
url: https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/
companies: [Amazon, Google, Apple]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

A shipping company has a list of packages, each with a weight given as a whole number. The list has between 1 and 20000 packages, and each weight is from 1 to 500. Packages must leave in the order they appear in the list, and each day a ship carries the next packages in order until adding one more would go over the ship's capacity. The ship's capacity is the most weight it can carry in one day. You are given days, the number of days available, and it is at least 1 and at most the number of packages. Return the smallest capacity that lets every package ship within that many days.

A capacity that works for some number of days also works for every larger number of days. That means the smallest working capacity can be found by searching between the heaviest package and the total weight.

::exercise
---
id: iv-medium-061
prompt: Write a function ship_within(weights, days) that returns the smallest ship capacity that can carry all the packages, in order, within days days.
starter: |
  # write your code below
  def ship_within(weights, days):
      pass
hints:
  - The capacity can never be smaller than the heaviest package, and never larger than the total weight.
  - For a candidate capacity, count the days by loading packages in order and starting a new day when the next one would not fit.
tests:
  - check: assert ship_within([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5) == 15
  - check: assert ship_within([3, 2, 2, 4, 1, 4], 3) == 6
  - check: assert ship_within([1, 2, 3, 1, 1], 4) == 3
  - check: assert ship_within([5], 1) == 5
  - check: assert ship_within([1, 2, 3], 3) == 3
  - check: assert ship_within([1, 2, 3], 1) == 6
  - check: assert ship_within([10, 50, 10], 2) == 60
  - check: assert ship_within([2, 2, 2, 2], 2) == 4
big: assert ship_within([(i * 7919) % 500 + 1 for i in range(20000)], 1000) == 5190
solution: |
  def ship_within(weights, days):
      lo, hi = max(weights), sum(weights)
      while lo < hi:
          mid = (lo + hi) // 2
          needed = 1
          load = 0
          for w in weights:
              if load + w > mid:
                  needed += 1
                  load = 0
              load += w
          if needed <= days:
              hi = mid
          else:
              lo = mid + 1
      return lo
brute: |
  def ship_within(weights, days):
      cap = max(weights)
      while True:
          needed = 1
          load = 0
          for w in weights:
              if load + w > cap:
                  needed += 1
                  load = 0
              load += w
          if needed <= days:
              return cap
          cap += 1
random:
  call: ship_within
  gen: |
    def gen(rng, size):
        weights = [rng.randint(1, 500) for _ in range(max(size, 1))]
        return (weights, rng.randint(1, len(weights)))
slow:
  - |
    def ship_within(weights, days):
        cap = max(weights)
        while True:
            needed = 1
            load = 0
            for w in weights:
                if load + w > cap:
                    needed += 1
                    load = 0
                load += w
            if needed <= days:
                return cap
            cap += 1
wrong:
  - |
    def ship_within(weights, days):
        return max(weights)
  - |
    def ship_within(weights, days):
        return -(-sum(weights) // days)
  - |
    def ship_within(weights, days):
        lo, hi = max(weights), sum(weights)
        while lo < hi:
            mid = (lo + hi) // 2
            needed = 1
            load = 0
            for w in weights:
                if load + w > mid:
                    needed += 1
                    load = 0
                load += w
            if needed < days:
                hi = mid
            else:
                lo = mid + 1
        return lo
---
::
