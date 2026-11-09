---
title: Maximum Points You Can Obtain from Cards
tier: medium
order: 23
leetcode: 1423
url: https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/
companies: [Google, Amazon, Meta]
topic: Sliding window
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/01-two-pointers]
---

You get a list `points` of n card values, where 1 <= n <= 100000 and each value is a whole number from 1 to 10000, and a whole number `k`, where 1 <= k <= n. You may take exactly k cards, and each card you take must come from the left end or the right end of the row. Each time you take one, the next card from that end is the one that is now at the end. Return the largest total you can collect.

For example, with points [1, 2, 3, 4, 5, 6, 1] and k = 3, taking the three cards at the right end gives 1 + 6 + 5 = 12, which is the best.

Think about what is left behind. The cards you do not take form one block in the middle of the row, and the cards you take are the two ends. So the best choice leaves behind the block of n - k cards in a row with the smallest total.

::exercise
---
id: iv-medium-023
prompt: Write a function max_points(points, k) that returns the largest total of k cards taken from the two ends of points.
starter: |
  # write your code below
  def max_points(points, k):
      pass
hints:
  - Find the smallest sum of a block of n - k cards in a row. Subtract it from the total.
  - Slide the block one step at a time, adding the card that enters and removing the card that leaves.
tests:
  - check: assert max_points([1, 2, 3, 4, 5, 6, 1], 3) == 12
  - check: assert max_points([2, 2, 2], 2) == 4
  - check: assert max_points([9, 7, 7, 9, 7, 7, 9], 7) == 55
  - check: assert max_points([1, 1000, 1], 1) == 1
  - check: assert max_points([1, 79, 80, 1, 1, 1, 200, 1], 3) == 202
  - check: assert max_points([5], 1) == 5
  - check: assert max_points([3, 1, 2], 3) == 6
  - check: assert max_points([1, 2, 3, 4], 1) == 4
big: 'assert (lambda r: max_points([r.randint(1, 10000) for _ in range(100000)], 50000))(__import__("random").Random(23)) == 249511022'
solution: |
  def max_points(points, k):
      n = len(points)
      window = n - k
      cur = sum(points[:window])
      best = cur
      for i in range(window, n):
          cur += points[i] - points[i - window]
          best = min(best, cur)
      return sum(points) - best
brute: |
  def max_points(points, k):
      n = len(points)
      best = 0
      for left in range(k + 1):
          right = k - left
          total = sum(points[:left])
          if right:
              total += sum(points[n - right:])
          best = max(best, total)
      return best
random:
  call: max_points
  gen: |
    def gen(rng, size):
        points = [rng.randint(1, 20) for _ in range(rng.randint(1, 8))]
        return (points, rng.randint(1, len(points)))
wrong:
  - |
    def max_points(points, k):
        return sum(points[:k])
  - |
    def max_points(points, k):
        l, r = 0, len(points) - 1
        total = 0
        for _ in range(k):
            if points[l] >= points[r]:
                total += points[l]
                l += 1
            else:
                total += points[r]
                r -= 1
        return total
  - |
    def max_points(points, k):
        n = len(points)
        window = n - k + 1
        cur = sum(points[:window])
        best = cur
        for i in range(window, n):
            cur += points[i] - points[i - window]
            best = min(best, cur)
        return sum(points) - best
slow:
  - |
    def max_points(points, k):
        n = len(points)
        best = 0
        for left in range(k + 1):
            right = k - left
            total = 0
            for x in points[:left]:
                total += x
            for x in points[n - right:]:
                total += x
            best = max(best, total)
        return best
---
::
