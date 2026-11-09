---
title: Shortest Subarray with Sum at Least K
tier: hard
order: 47
leetcode: 862
url: https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/
companies: [Amazon, Google, Meta]
topic: Monotonic Queue
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/02-stacks-and-queues]
---

You are given a list of whole numbers, which may be negative, and a target number `k`. A subarray is a run of neighbouring entries. Find the length of the shortest non-empty subarray whose sum is at least `k`. The list has between 1 and 10000 numbers, each from -1000 to 1000, and `k` is from 1 to 10^6.

If no subarray reaches `k`, the answer is `-1`. Because the numbers can be negative, you cannot just grow and shrink a window: a longer run can have a smaller sum than a shorter one.

::exercise
---
id: iv-hard-047
prompt: Write a function shortest_subarray(nums, k) that returns the length of the shortest non-empty contiguous subarray of nums with sum at least k, or -1 if there is none.
starter: |
  # write your code below
  def shortest_subarray(nums, k):
      pass
hints:
  - Work with prefix sums. A subarray from index i to j has sum prefix[j] - prefix[i], so you need the latest earlier prefix index i with prefix[i] <= prefix[j] - k.
  - Keep a deque of prefix indices whose prefix values increase. Pop from the front while the current prefix is at least k above the front, and pop from the back while the back prefix is no smaller than the current one.
tests:
  - check: assert shortest_subarray([1], 1) == 1
  - check: assert shortest_subarray([1], 2) == -1
  - check: assert shortest_subarray([1, 2], 4) == -1
  - check: assert shortest_subarray([1, 2, 3, 4], 6) == 2
  - check: assert shortest_subarray([5, -2, 4, -1, 3], 7) == 3
  - check: assert shortest_subarray([2, 3, -1, 4], 6) == 3
  - check: assert shortest_subarray([-3, -1, 6], 5) == 1
  - check: assert shortest_subarray([-5, -2, -1], 1) == -1
  - check: assert shortest_subarray([0, 0, 5], 5) == 1
  - check: assert shortest_subarray([1, 1, 1, 1], 4) == 4
  - check: assert shortest_subarray([2, -1, 2], 3) == 3
  - check: assert shortest_subarray([5, 1, 1, 1, 1, 1, 1, 1, 1], 5) == 1
  - check: assert shortest_subarray([2, -1, 0, 3], 3) == 1
solution: |
  from collections import deque

  def shortest_subarray(nums, k):
      prefix = [0]
      for x in nums:
          prefix.append(prefix[-1] + x)
      best = len(nums) + 1
      queue = deque()
      for i, p in enumerate(prefix):
          while queue and p - prefix[queue[0]] >= k:
              best = min(best, i - queue.popleft())
          while queue and prefix[queue[-1]] >= p:
              queue.pop()
          queue.append(i)
      return best if best <= len(nums) else -1
slow:
  - |
    def shortest_subarray(nums, k):
        n = len(nums)
        best = n + 1
        for i in range(n):
            total = 0
            for j in range(i, n):
                total += nums[j]
                if total >= k and j - i + 1 < best:
                    best = j - i + 1
        return best if best <= n else -1
brute: |
  def shortest_subarray(nums, k):
      n = len(nums)
      best = None
      for i in range(n):
          for j in range(i + 1, n + 1):
              if sum(nums[i:j]) >= k and (best is None or j - i < best):
                  best = j - i
      return -1 if best is None else best
big: 'assert shortest_subarray([(i * 7919) % 2001 - 1000 for i in range(10000)], 2500) == 3'
random:
  call: shortest_subarray
  gen: |
    def gen(rng, size):
        n = rng.randint(1, min(size + 3, 8))
        return ([rng.randint(-3, 3) for _ in range(n)], rng.randint(1, 6))
wrong:
  - |
    def shortest_subarray(nums, k):
        best = None
        left = 0
        total = 0
        for right, x in enumerate(nums):
            total += x
            while left <= right and total >= k:
                if best is None or right - left + 1 < best:
                    best = right - left + 1
                total -= nums[left]
                left += 1
        return -1 if best is None else best
  - |
    from collections import deque

    def shortest_subarray(nums, k):
        prefix = [0]
        for x in nums:
            prefix.append(prefix[-1] + x)
        best = len(nums) + 1
        queue = deque()
        for i, p in enumerate(prefix):
            while queue and p - prefix[queue[0]] >= k:
                best = min(best, i - queue.popleft() - 1)
            while queue and prefix[queue[-1]] >= p:
                queue.pop()
            queue.append(i)
        return best if best <= len(nums) else -1
  - |
    def shortest_subarray(nums, k):
        best = None
        for i in range(len(nums)):
            total = 0
            for j in range(i, len(nums)):
                total += nums[j]
                if total >= k:
                    best = j - i + 1
                    break
        return -1 if best is None else best
equivalent:
  - 4: "prefix = [1]"   # why: every prefix shifts by the same constant, so every difference prefix[j] - prefix[i] is unchanged
  - 4: "prefix = [-1]"   # why: same as above; a constant shift leaves all differences unchanged
  - 7: "best = len(nums) + 2"   # why: the initial value only matters when no subarray qualifies, and any value above len(nums) gives -1
  - 12: "while queue and prefix[queue[-1]] > p:"   # why: with an equal prefix, the later index is the better candidate; keeping both is still correct because min() takes the shorter one
---
::
