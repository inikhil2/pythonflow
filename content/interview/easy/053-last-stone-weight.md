---
title: Last Stone Weight
tier: easy
order: 53
leetcode: 1046
url: https://leetcode.com/problems/last-stone-weight/
companies: [Amazon, Google, Apple]
topic: Heap
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list stones of 1 to 30 weights, each a whole number from 1 to 1000. While two or more stones are left, take the two heaviest. If they weigh the same, remove both. If not, remove the lighter one and replace the heavier one with a stone whose weight is their difference. Return the weight of the last stone, or 0 if no stone is left.

::exercise
---
id: iv-easy-053
prompt: Write a function last_stone_weight(stones) that returns the weight of the final stone after smashing the heaviest pairs, or 0 if none is left.
starter: |
  # write your code below
  def last_stone_weight(stones):
      pass
hints:
  - A heap gives the heaviest stone quickly, so each step stays fast.
  - Python heapq only gives the smallest item, so store the weights as negative numbers.
tests:
  - check: assert last_stone_weight([2, 7, 4, 1, 8, 1]) == 1
  - check: assert last_stone_weight([1]) == 1
  - check: assert last_stone_weight([2, 2]) == 0
  - check: assert last_stone_weight([3, 2]) == 1
  - check: assert last_stone_weight([5, 5, 5]) == 5
  - check: assert last_stone_weight([10, 4, 2, 10]) == 2
  - check: assert last_stone_weight([9, 3, 2, 1]) == 3
solution: |
  def last_stone_weight(stones):
      import heapq
      heap = [-x for x in stones]
      heapq.heapify(heap)
      while len(heap) > 1:
          a = -heapq.heappop(heap)
          b = -heapq.heappop(heap)
          if a != b:
              heapq.heappush(heap, -(a - b))
      return -heapq.heappop(heap) if heap else 0
brute: |
  def last_stone_weight(stones):
      stones = list(stones)
      while len(stones) > 1:
          stones.sort()
          a = stones.pop()
          b = stones.pop()
          if a != b:
              stones.append(a - b)
      return stones[0] if stones else 0
random:
  call: last_stone_weight
  gen: |
    def gen(rng, size):
        return ([rng.randint(1, 20) for _ in range(rng.randint(1, size + 4))],)
wrong:
  - |
    def last_stone_weight(stones):
        return max(stones)
  - |
    def last_stone_weight(stones):
        stones = sorted(stones)
        while len(stones) > 1:
            a = stones.pop(0)
            b = stones.pop(0)
            if a != b:
                stones.append(a - b)
                stones.sort()
        return stones[0] if stones else 0
---
::
