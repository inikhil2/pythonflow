---
title: Smallest Range Covering Elements from K Lists
tier: hard
order: 34
leetcode: 632
url: https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/
companies: [Amazon, Google, Microsoft]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week10-algorithms/04-sorting-and-heaps]
---

You get nums, a list of k lists of whole numbers. Every inner list is sorted from smallest to largest, and no inner list is empty. A range [a, b] covers an inner list if at least one number x in that list has a <= x <= b. Find the range that covers all k lists and has the smallest width b - a. If two ranges have the same width, return the one with the smaller a. Return it as the list [a, b].

There are between 1 and 500 inner lists, together they hold at most 50000 numbers, and every number is between -100000 and 100000. Repeated numbers are allowed, in one list and across lists. Checking every pair of numbers as a range is too slow for the largest inputs.

::exercise
---
id: iv-hard-034
prompt: Write a function smallest_range(nums) that returns [a, b], the narrowest range that has at least one number from every inner list, breaking ties by the smaller a.
starter: |
  # write your code below
  def smallest_range(nums):
      pass
hints:
  - Keep one pointer in every list and look at the current numbers. The range from the smallest to the largest of them covers every list.
  - To get a narrower range the smallest number has to go, so move its pointer forward. A heap holds the smallest, and you track the largest as you push.
tests:
  - check: assert smallest_range([[4, 10, 15, 24, 26], [0, 9, 12, 20], [5, 18, 22, 30]]) == [20, 24]
  - check: assert smallest_range([[1, 2, 3], [1, 2, 3], [1, 2, 3]]) == [1, 1]
  - check: assert smallest_range([[1]]) == [1, 1]
  - check: assert smallest_range([[1], [2], [3]]) == [1, 3]
  - check: assert smallest_range([[-5, -3], [-4]]) == [-5, -4]
  - check: assert smallest_range([[1, 5], [3, 7]]) == [1, 3]
  - check: assert smallest_range([[2, 2, 2], [2]]) == [2, 2]
  - check: assert smallest_range([[10], [1, 9], [5]]) == [5, 10]
  - check: assert smallest_range([[-10, -5], [-6], [-8, -1]]) == [-8, -5]
  - check: assert smallest_range([[1, 100], [50], [2, 99]]) == [1, 50]
  - check: assert smallest_range([[0, 10], [5, 15], [10, 20]]) == [5, 10]
solution: |
  import heapq

  def smallest_range(nums):
      heap = [(row[0], i, 0) for i, row in enumerate(nums)]
      heapq.heapify(heap)
      hi = max(row[0] for row in nums)
      best = [heap[0][0], hi]
      while True:
          lo, i, j = heapq.heappop(heap)
          if hi - lo < best[1] - best[0]:
              best = [lo, hi]
          if j + 1 == len(nums[i]):
              break
          nxt = nums[i][j + 1]
          hi = max(hi, nxt)
          heapq.heappush(heap, (nxt, i, j + 1))
      return best
brute: |
  def smallest_range(nums):
      values = sorted({v for row in nums for v in row})
      best = None
      for a in values:
          for b in values:
              if a <= b and all(any(a <= v <= b for v in row) for row in nums):
                  cost = (b - a, a)
                  if best is None or cost < best:
                      best = cost
      return [best[1], best[1] + best[0]]
valid: |
  def valid(nums):
      if not 1 <= len(nums) <= 500 or sum(len(row) for row in nums) > 50000:
          return False
      return all(row and row == sorted(row) and all(-100000 <= v <= 100000 for v in row) for row in nums)
random:
  call: smallest_range
  gen: |
    def gen(rng, size):
        k = rng.randint(1, min(size // 2 + 2, 5))
        return ([sorted(rng.randint(-6, 6) for _ in range(rng.randint(1, size // 3 + 1))) for _ in range(k)],)
big: assert smallest_range([sorted([(i * 7919 + j * 104729 + (i * j) % 97) % 200001 - 100000 for j in range(98)] + [-99000 + i % 3, 90000 + i % 3]) for i in range(500)]) == [-99000, -98998]
slow:
  - |
    def smallest_range(nums):
        from bisect import bisect_left
        starts = sorted({v for row in nums for v in row})
        best = None
        for a in starts:
            b = a
            for row in nums:
                pos = bisect_left(row, a)
                if pos == len(row):
                    b = None
                    break
                if row[pos] > b:
                    b = row[pos]
            if b is not None and (best is None or (b - a, a) < best):
                best = (b - a, a)
        return [best[1], best[1] + best[0]]
equivalent:
  - "heap = [(row[0], i, -1) for i, row in enumerate(nums)]"  # why: starting one step early only reads the same first number twice, so the range comes out the same
wrong:
  - |
    import heapq

    def smallest_range(nums):
        heap = [(row[0], i, 0) for i, row in enumerate(nums)]
        heapq.heapify(heap)
        hi = max(row[0] for row in nums)
        best = [heap[0][0], hi]
        while True:
            lo, i, j = heapq.heappop(heap)
            if hi - lo < best[1] - best[0]:
                best = [lo, hi]
            if j + 1 == len(nums[i]):
                break
            nxt = nums[i][j + 1]
            heapq.heappush(heap, (nxt, i, j + 1))
        return best
  - |
    import heapq

    def smallest_range(nums):
        heap = [(row[0], i, 0) for i, row in enumerate(nums)]
        heapq.heapify(heap)
        hi = max(row[0] for row in nums)
        best = [heap[0][0], hi]
        while True:
            lo, i, j = heapq.heappop(heap)
            if hi - lo <= best[1] - best[0]:
                best = [lo, hi]
            if j + 1 == len(nums[i]):
                break
            nxt = nums[i][j + 1]
            hi = max(hi, nxt)
            heapq.heappush(heap, (nxt, i, j + 1))
        return best
  - |
    def smallest_range(nums):
        return [min(row[0] for row in nums), max(row[0] for row in nums)]
  - |
    import heapq

    def smallest_range(nums):
        heap = [(row[0], i, 0) for i, row in enumerate(nums)]
        heapq.heapify(heap)
        hi = max(row[0] for row in nums)
        best = [heap[0][0], hi]
        while True:
            lo, i, j = heapq.heappop(heap)
            if j + 1 == len(nums[i]):
                break
            if hi - lo < best[1] - best[0]:
                best = [lo, hi]
            nxt = nums[i][j + 1]
            hi = max(hi, nxt)
            heapq.heappush(heap, (nxt, i, j + 1))
        return best
---
::
