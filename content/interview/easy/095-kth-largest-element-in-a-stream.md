---
title: Kth Largest Element in a Stream
tier: easy
order: 95
leetcode: 703
url: https://leetcode.com/problems/kth-largest-element-in-a-stream/
companies: [Meta, Google, Amazon]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/04-dictionaries, /learn/week8-objects/01-classes, /learn/week10-algorithms/04-sorting-and-heaps]
---

You get three things: a whole number `k`, a list `nums` that holds the numbers seen so far, and a list `adds` of new numbers that arrive one at a time. Here `1 <= k <= len(nums)`, `len(nums)` is at most 10000, `adds` has at most 10000 values, and every value is a whole number from -10000 to 10000.

The k-th largest is the value that would sit at position `k` if all the numbers were sorted from largest to smallest. Repeated values count each time they appear. For example, in `[7, 7, 3]` the 2nd largest is `7`.

Return a list with one answer for the starting `nums`, followed by one answer after each value in `adds` is added, in order. The answer list therefore has `len(adds) + 1` entries.

::exercise
---
id: iv-easy-095
prompt: Write a function kth_largest_after(k, nums, adds) that returns the k-th largest value after nums, then the k-th largest after each value in adds is added in turn.
starter: |
  # write your code below
  def kth_largest_after(k, nums, adds):
      pass
hints:
  - Keep a small heap that holds only the k largest values seen so far. Its smallest item is the answer.
  - Push each new value, then drop the smallest item if the heap grew past k.
tests:
  - check: assert kth_largest_after(2, [4, 5, 8], [3, 9]) == [5, 5, 8]
  - check: assert kth_largest_after(1, [0], [1, 2, 3]) == [0, 1, 2, 3]
  - check: assert kth_largest_after(3, [4, 5, 8, 2], [3, 5, 10]) == [4, 4, 5, 5]
  - check: assert kth_largest_after(2, [7, 7], []) == [7]
  - check: assert kth_largest_after(1, [-3], [-5, -1]) == [-3, -3, -1]
  - check: assert kth_largest_after(2, [1, 2, 3], [0, 0, 9]) == [2, 2, 2, 3]
  - check: assert kth_largest_after(1, [5, 5], [5]) == [5, 5]
big: assert kth_largest_after(5000, [(i * 7919) % 10000 for i in range(10000)], [-((j * 7919) % 10000) - 1 for j in range(10000)]) == [5000] * 10001 and kth_largest_after(1, [(i * 7919) % 10000 for i in range(10000)], [-((j * 7919) % 10000) - 1 for j in range(10000)]) == [9999] * 10001
solution: |
  import heapq
  def kth_largest_after(k, nums, adds):
      heap = []
      for x in nums:
          heapq.heappush(heap, x)
          if len(heap) > k:
              heapq.heappop(heap)
      answer = [heap[0]]
      for x in adds:
          heapq.heappush(heap, x)
          if len(heap) > k:
              heapq.heappop(heap)
          answer.append(heap[0])
      return answer
brute: |
  def kth_largest_after(k, nums, adds):
      seen = list(nums)
      answer = [sorted(seen, reverse=True)[k - 1]]
      for x in adds:
          seen.append(x)
          answer.append(sorted(seen, reverse=True)[k - 1])
      return answer
random:
  call: kth_largest_after
  gen: |
    def gen(rng, size):
        n = max(size, 1)
        nums = [rng.randint(-20, 20) for _ in range(n)]
        adds = [rng.randint(-20, 20) for _ in range(size)]
        return (rng.randint(1, n), nums, adds)
slow:
  - |
    def kth_largest_after(k, nums, adds):
        seen = list(nums)
        result = [sorted(seen)[-k]]
        for value in adds:
            seen.append(value)
            result.append(sorted(seen)[-k])
        return result
  - |
    def kth_largest_after(k, nums, adds):
        def kth(values):
            best = None
            for v in values:
                at_least = 0
                for x in values:
                    if x >= v:
                        at_least += 1
                if at_least >= k and (best is None or v > best):
                    best = v
            return best
        seen = list(nums)
        answer = [kth(seen)]
        for x in adds:
            seen.append(x)
            answer.append(kth(seen))
        return answer
wrong:
  - |
    def kth_largest_after(k, nums, adds):
        return [sorted(nums, reverse=True)[k - 1]]
  - |
    import heapq
    def kth_largest_after(k, nums, adds):
        heap = []
        for x in nums:
            heapq.heappush(heap, x)
            if len(heap) > k + 1:
                heapq.heappop(heap)
        answer = [heap[0]]
        for x in adds:
            heapq.heappush(heap, x)
            if len(heap) > k + 1:
                heapq.heappop(heap)
            answer.append(heap[0])
        return answer
  - |
    import heapq
    def kth_largest_after(k, nums, adds):
        heap = []
        for x in nums:
            heapq.heappush(heap, x)
            if len(heap) > k:
                heapq.heappop(heap)
        answer = [heap[-1]]
        for x in adds:
            heapq.heappush(heap, x)
            if len(heap) > k:
                heapq.heappop(heap)
            answer.append(heap[-1])
        return answer
equivalent:
  - "if len(heap) >= k:"  # why: in the adds loop only, the heap holds exactly k items before each push, so after the push it holds k + 1 and both comparisons pop once
---
::
