---
title: Minimum Cost to Hire K Workers
tier: hard
order: 33
leetcode: 857
url: https://leetcode.com/problems/minimum-cost-to-hire-k-workers/
companies: [Apple, Amazon, Google]
topic: Greedy
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/04-sorting-and-heaps]
---

There are n workers. Worker i has a quality quality[i] and asks for at least wage[i] in pay. You must hire exactly k of them and pay all of them by two rules. First, every hired worker is paid in proportion to quality: if one hired worker gets pay p for quality q, every other hired worker with quality q2 gets p * q2 / q. Second, nobody is paid less than the wage they ask for. Pay does not have to be a whole number.

Return the smallest total pay for any group of k workers. The answer is checked to within 0.00001.

There are between 1 and 20000 workers, k is between 1 and n, and every quality and wage is a whole number from 1 to 10000. Trying every group of k workers is far too slow for the largest inputs.

::exercise
---
id: iv-hard-033
prompt: Write a function min_cost_to_hire(quality, wage, k) that returns the smallest total pay for hiring exactly k workers under the two pay rules.
starter: |
  # write your code below
  def min_cost_to_hire(quality, wage, k):
      pass
hints:
  - In a chosen group, the worker with the highest wage-to-quality ratio sets the pay rate for everyone. Try each worker as that one, in order of ratio.
  - Once the rate is fixed, the total is rate times the sum of the qualities, so keep the k smallest qualities seen so far in a heap.
tests:
  - check: assert abs(min_cost_to_hire([10, 20, 5], [70, 50, 30], 2) - 105) < 1e-5
  - check: assert abs(min_cost_to_hire([3, 1, 10, 10, 1], [4, 8, 2, 2, 7], 3) - 30.66667) < 1e-5
  - check: assert abs(min_cost_to_hire([1, 2, 3], [5, 4, 9], 1) - 4) < 1e-5
  - check: assert abs(min_cost_to_hire([2, 4], [10, 10], 2) - 30) < 1e-5
  - check: assert abs(min_cost_to_hire([1, 2], [2, 4], 2) - 6) < 1e-5
  - check: assert abs(min_cost_to_hire([5], [7], 1) - 7) < 1e-5
  - check: assert abs(min_cost_to_hire([4, 4, 4, 4], [8, 9, 10, 11], 2) - 18) < 1e-5
  - check: assert abs(min_cost_to_hire([1, 1, 1], [1, 1, 1], 3) - 3) < 1e-5
  - check: assert abs(min_cost_to_hire([100, 1], [100, 10000], 1) - 100) < 1e-5
  - check: assert abs(min_cost_to_hire([5, 1, 4, 1], [10, 5, 20, 3], 2) - 10) < 1e-5
  - check: assert abs(min_cost_to_hire([1, 2, 3, 4], [10, 10, 10, 10], 2) - 23.33333) < 1e-5
  - check: assert abs(min_cost_to_hire([8, 1, 1], [8, 10, 10], 2) - 20) < 1e-5
solution: |
  import heapq

  def min_cost_to_hire(quality, wage, k):
      workers = sorted(zip(quality, wage), key=lambda w: w[1] / w[0])
      heap = []
      total = 0
      best = float("inf")
      for q, w in workers:
          heapq.heappush(heap, -q)
          total += q
          if len(heap) > k:
              total += heapq.heappop(heap)
          if len(heap) == k:
              best = min(best, total * w / q)
      return best
brute: |
  def min_cost_to_hire(quality, wage, k):
      from itertools import combinations
      from fractions import Fraction
      best = None
      for group in combinations(range(len(quality)), k):
          rate = max(Fraction(wage[i], quality[i]) for i in group)
          cost = rate * sum(quality[i] for i in group)
          if best is None or cost < best:
              best = cost
      return float(best)
valid: |
  def valid(quality, wage, k):
      n = len(quality)
      return 1 <= n <= 20000 and len(wage) == n and 1 <= k <= n and all(1 <= v <= 10000 for v in quality) and all(1 <= v <= 10000 for v in wage)
random:
  call: min_cost_to_hire
  same: |
    def same(args, got, want):
        return abs(got - want) < 1e-6 * max(1, abs(want))
  gen: |
    def gen(rng, size):
        n = rng.randint(1, min(size + 2, 8))
        quality = [rng.randint(1, 6) for _ in range(n)]
        wage = [rng.randint(1, 30) for _ in range(n)]
        return (quality, wage, rng.randint(1, n))
big: assert abs(min_cost_to_hire([(i * 37) % 100 + 1 for i in range(20000)], [((i * 37) % 100 + 1) * (3 + (i * 131) % 17) + (i * 7) % 5 for i in range(20000)], 5000) - 1279981) < 1e-3
slow:
  - |
    def min_cost_to_hire(quality, wage, k):
        best = float("inf")
        n = len(quality)
        for i in range(n):
            rate = wage[i] / quality[i]
            qs = sorted(quality[j] for j in range(n) if wage[j] <= rate * quality[j] + 1e-12)
            if len(qs) >= k:
                best = min(best, rate * sum(qs[:k]))
        return best
  - |
    def min_cost_to_hire(quality, wage, k):
        best = float("inf")
        n = len(quality)
        for i in range(n):
            rate = wage[i] / quality[i]
            qs = []
            for j in range(n):
                if wage[j] <= rate * quality[j] + 1e-12:
                    qs.append(quality[j])
            qs.sort()
            if len(qs) >= k:
                best = min(best, rate * sum(qs[:k]))
        return best
  - |
    def min_cost_to_hire(quality, wage, k):
        workers = sorted(zip(quality, wage), key=lambda w: w[1] / w[0])
        seen = []
        best = float("inf")
        for q, w in workers:
            seen.append(q)
            if len(seen) >= k:
                best = min(best, sum(sorted(seen)[:k]) * w / q)
        return best
wrong:
  - |
    def min_cost_to_hire(quality, wage, k):
        workers = sorted(zip(wage, quality))[:k]
        rate = max(w / q for w, q in workers)
        return rate * sum(q for w, q in workers)
  - |
    import heapq

    def min_cost_to_hire(quality, wage, k):
        workers = sorted(zip(quality, wage), key=lambda w: w[1] / w[0])
        heap = []
        total = 0
        best = float("inf")
        for q, w in workers:
            heapq.heappush(heap, q)
            total += q
            if len(heap) > k:
                total -= heapq.heappop(heap)
            if len(heap) == k:
                best = min(best, total * w / q)
        return best
  - |
    def min_cost_to_hire(quality, wage, k):
        return sum(sorted(wage)[:k])
  - |
    import heapq

    def min_cost_to_hire(quality, wage, k):
        workers = sorted(zip(quality, wage), key=lambda w: w[1] / w[0])
        heap = []
        total = 0
        best = float("inf")
        for q, w in workers:
            heapq.heappush(heap, -q)
            total += q
            if len(heap) > k:
                heapq.heappop(heap)
            if len(heap) == k:
                best = min(best, total * w / q)
        return best
---
::
