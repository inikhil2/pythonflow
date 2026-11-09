---
title: Sliding Window Maximum
tier: hard
order: 30
leetcode: 239
url: https://leetcode.com/problems/sliding-window-maximum/
companies: [Amazon, Google, Microsoft]
topic: Queue
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/02-stacks-and-queues, /learn/week10-algorithms/04-sorting-and-heaps]
---

You get a list nums of whole numbers and a window size k. A window is k neighbouring values of the list. Start with the window at the left end and slide it one place to the right at a time, until its last value is the last value of the list. Return the largest value inside the window at every position, in order.

The list has between 1 and 60000 values, each between -20000 and 20000, and k is between 1 and the length of the list. That makes len(nums) - k + 1 windows, so the answer has that many values. Looking inside every window from scratch is too slow for the biggest inputs.

::exercise
---
id: iv-hard-030
prompt: Write a function max_sliding_window(nums, k) that returns a list with the largest value of every window of k neighbouring values, from left to right.
starter: |
  # write your code below
  def max_sliding_window(nums, k):
      pass
hints:
  - Keep a double-ended queue of positions whose values are in decreasing order. The front always holds the position of the current maximum.
  - Before adding a new value, drop smaller values from the back, since they can never be a maximum again. Drop the front when it falls out of the window.
tests:
  - check: assert max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3) == [3, 3, 5, 5, 6, 7]
  - check: assert max_sliding_window([1], 1) == [1]
  - check: assert max_sliding_window([1, -1], 1) == [1, -1]
  - check: assert max_sliding_window([9, 11], 2) == [11]
  - check: assert max_sliding_window([4, 3, 2, 1], 2) == [4, 3, 2]
  - check: assert max_sliding_window([2, 2, 1], 2) == [2, 2]
  - check: assert max_sliding_window([9, 8, 7], 2) == [9, 8]
  - check: assert max_sliding_window([5, 5, 5], 3) == [5]
  - check: assert max_sliding_window([1, 3, 1, 2, 0, 5], 3) == [3, 3, 2, 5]
  - check: assert max_sliding_window([-7, -8, 7, 5, 7, 1, 6, 0], 4) == [7, 7, 7, 7, 7]
  - check: assert max_sliding_window([1, 2, 3, 4, 5], 5) == [5]
solution: |
  from collections import deque

  def max_sliding_window(nums, k):
      dq = deque()
      out = []
      for i, x in enumerate(nums):
          while dq and nums[dq[-1]] <= x:
              dq.pop()
          dq.append(i)
          if dq[0] <= i - k:
              dq.popleft()
          if i >= k - 1:
              out.append(nums[dq[0]])
      return out
brute: |
  def max_sliding_window(nums, k):
      return [max(nums[i:i + k]) for i in range(len(nums) - k + 1)]
valid: |
  def valid(nums, k):
      return 1 <= len(nums) <= 60000 and all(-20000 <= v <= 20000 for v in nums) and 1 <= k <= len(nums)
random:
  call: max_sliding_window
  gen: |
    def gen(rng, size):
        n = rng.randint(1, size + 2)
        nums = [rng.randint(-5, 5) for _ in range(n)]
        return (nums, rng.randint(1, n))
big: assert (r := max_sliding_window([9000 - i // 8 + (i * 7919) % 2001 - 1000 + (3000 if i % 15013 == 7 else 0) for i in range(60000)], 30000)) and len(r) == 30001 and sum(r) == 282366639 and r[0] == 12406 and r[-1] == 7717 and r[15000] == 11062
slow:
  - |
    def max_sliding_window(nums, k):
        return [max(nums[i:i + k]) for i in range(len(nums) - k + 1)]
  - |
    def max_sliding_window(nums, k):
        out = []
        for i in range(len(nums) - k + 1):
            best = nums[i]
            for j in range(i + 1, i + k):
                if nums[j] > best:
                    best = nums[j]
            out.append(best)
        return out
equivalent:
  - "while dq and nums[dq[-1]] < x:"  # why: an equal value left in the queue sits earlier and leaves the window first, so the front is still a maximum of the window
wrong:
  - |
    def max_sliding_window(nums, k):
        from collections import deque
        dq = deque()
        out = []
        for i, x in enumerate(nums):
            while dq and nums[dq[-1]] <= x:
                dq.pop()
            dq.append(i)
            if dq[0] <= i - k:
                dq.popleft()
            if i >= k - 1 and i < len(nums) - 1:
                out.append(nums[dq[0]])
        return out
  - |
    def max_sliding_window(nums, k):
        from collections import deque
        dq = deque()
        out = []
        for i, x in enumerate(nums):
            while dq and nums[dq[-1]] <= x:
                dq.pop()
            dq.append(i)
            if i >= k - 1:
                out.append(nums[dq[0]])
        return out
  - |
    def max_sliding_window(nums, k):
        from collections import deque
        dq = deque()
        out = []
        for i, x in enumerate(nums):
            while dq and dq[-1] <= x:
                dq.pop()
            dq.append(x)
            if i >= k and dq[0] == nums[i - k]:
                dq.popleft()
            if i >= k - 1:
                out.append(dq[0])
        return out
  - |
    def max_sliding_window(nums, k):
        out = [max(nums[:k])]
        for i in range(k, len(nums)):
            out.append(max(out[-1], nums[i]))
        return out
---
::
