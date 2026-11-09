---
title: Sliding Window Median
tier: hard
order: 35
leetcode: 480
url: https://leetcode.com/problems/sliding-window-median/
companies: [Meta, Amazon, Google]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week10-algorithms/04-sorting-and-heaps]
---

You get a list of whole numbers nums and a window size k. A window of size k starts at the left end of nums and moves one place to the right each time, until it reaches the right end. For every position of the window, find the median of the k numbers inside it: the middle number when they are sorted if k is odd, and the average of the two middle numbers if k is even.

Return the list of medians, one per window position, in order. Each median may be a whole number or have .5; the answers are checked to within 0.00001.

There are between 1 and 40000 numbers, each between -100000 and 100000, and k is between 1 and the length of nums. Sorting every window from scratch is too slow for the largest inputs.

::exercise
---
id: iv-hard-035
prompt: Write a function median_sliding_window(nums, k) that returns the list of medians of every window of k numbers.
starter: |
  # write your code below
  def median_sliding_window(nums, k):
      pass
hints:
  - Split the window into a lower half and an upper half, each in a heap, so the median sits at the top of one or both. Python's heapq only has a min-heap, so store negatives for the lower half.
  - A heap cannot remove a number from the middle. Count the numbers that have left the window and drop them only when they reach the top of their heap, and keep your own count of how many live numbers each half holds.
tests:
  - check: assert median_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3) == [1, -1, -1, 3, 5, 6]
  - check: assert median_sliding_window([1, 2, 3, 4, 2, 3, 1, 4, 2], 3) == [2, 3, 3, 3, 2, 3, 2]
  - check: assert median_sliding_window([1, 4, 2, 3], 4) == [2.5]
  - check: assert median_sliding_window([5], 1) == [5]
  - check: assert median_sliding_window([1, 2], 1) == [1, 2]
  - check: assert median_sliding_window([1, 2], 2) == [1.5]
  - check: assert median_sliding_window([100000, 100000], 2) == [100000]
  - check: assert median_sliding_window([-1, -2, -3, -4], 2) == [-1.5, -2.5, -3.5]
  - check: assert median_sliding_window([7, 7, 7, 7], 3) == [7, 7]
  - check: assert median_sliding_window([10, -10, 10, -10, 10], 2) == [0, 0, 0, 0]
  - check: assert median_sliding_window([9, 1, 8, 2, 7], 5) == [7]
  - check: assert median_sliding_window([1, 2, 3, 4, 5, 6], 4) == [2.5, 3.5, 4.5]
solution: |
  import heapq


  def median_sliding_window(nums, k):
      small = []
      large = []
      late = {}
      sizes = [0, 0]

      def prune(heap, sign):
          while heap and late.get(sign * heap[0], 0):
              late[sign * heap[0]] -= 1
              heapq.heappop(heap)

      def balance():
          if sizes[0] > sizes[1] + 1:
              heapq.heappush(large, -heapq.heappop(small))
              sizes[0] -= 1
              sizes[1] += 1
              prune(small, -1)
          elif sizes[0] < sizes[1]:
              heapq.heappush(small, -heapq.heappop(large))
              sizes[0] += 1
              sizes[1] -= 1
              prune(large, 1)

      def add(v):
          if not small or v <= -small[0]:
              heapq.heappush(small, -v)
              sizes[0] += 1
          else:
              heapq.heappush(large, v)
              sizes[1] += 1
          balance()

      def remove(v):
          late[v] = late.get(v, 0) + 1
          if v <= -small[0]:
              sizes[0] -= 1
              prune(small, -1)
          else:
              sizes[1] -= 1
              prune(large, 1)
          balance()

      out = []
      for i, v in enumerate(nums):
          add(v)
          if i >= k:
              remove(nums[i - k])
          if i >= k - 1:
              if k % 2:
                  out.append(-small[0])
              else:
                  out.append((-small[0] + large[0]) / 2)
      return out
brute: |
  def median_sliding_window(nums, k):
      out = []
      for i in range(len(nums) - k + 1):
          s = sorted(nums[i:i + k])
          if k % 2:
              out.append(s[k // 2])
          else:
              out.append((s[k // 2 - 1] + s[k // 2]) / 2)
      return out
valid: |
  def valid(nums, k):
      return 1 <= len(nums) <= 40000 and 1 <= k <= len(nums) and all(-100000 <= v <= 100000 for v in nums)
random:
  call: median_sliding_window
  same: |
    def same(args, got, want):
        return len(got) == len(want) and all(abs(a - b) < 1e-6 for a, b in zip(got, want))
  gen: |
    def gen(rng, size):
        n = rng.randint(1, size + 3)
        return ([rng.randint(-8, 8) for _ in range(n)], rng.randint(1, n))
big: assert (r := median_sliding_window([(i * 7919 + (i * i) % 1013 + 1000 * (i // 6000)) % 200001 - 100000 for i in range(40000)], 20000)) and len(r) == 20001 and sum(r) == 1831085.0 and r[0] == 18.0 and r[1000] == 35.5 and r[10000] == 55.5 and r[-1] == 184.5
# why: a sorted list with bisect and insort is O(n*k) memmove, which is fast enough at these sizes, so it is accepted and is not listed as a slow solution
slow:
  - |
    def median_sliding_window(nums, k):
        out = []
        for i in range(len(nums) - k + 1):
            s = sorted(nums[i:i + k])
            if k % 2:
                out.append(s[k // 2])
            else:
                out.append((s[k // 2 - 1] + s[k // 2]) / 2)
        return out
  - |
    def median_sliding_window(nums, k):
        window = []
        out = []
        for i, v in enumerate(nums):
            j = 0
            while j < len(window) and window[j] < v:
                j += 1
            window.insert(j, v)
            if i >= k:
                j = 0
                while window[j] != nums[i - k]:
                    j += 1
                del window[j]
            if i >= k - 1:
                if k % 2:
                    out.append(window[k // 2])
                else:
                    out.append((window[k // 2 - 1] + window[k // 2]) / 2)
        return out
equivalent:
  - "if not small or v < -small[0]:"  # why: a number equal to the top of the lower half can sit in either heap, since both copies are equal, and balance() fixes the sizes; the medians come out the same
  - "for i in range(k, len(nums) + 2):"  # why: the loop breaks at i == len(nums), so the extra last value of i is never reached
wrong:
  - |
    from bisect import bisect_left, insort

    def median_sliding_window(nums, k):
        window = sorted(nums[:k])
        out = []
        for i in range(k, len(nums) + 1):
            if k % 2:
                out.append(window[k // 2])
            else:
                out.append(window[k // 2])
            if i == len(nums):
                break
            del window[bisect_left(window, nums[i - k])]
            insort(window, nums[i])
        return out
  - |
    from bisect import bisect_left, insort

    def median_sliding_window(nums, k):
        window = sorted(nums[:k])
        out = []
        for i in range(k, len(nums) + 1):
            if k % 2:
                out.append(window[k // 2])
            else:
                out.append((window[k // 2 - 1] + window[k // 2]) // 2)
            if i == len(nums):
                break
            del window[bisect_left(window, nums[i - k])]
            insort(window, nums[i])
        return out
  - |
    from bisect import bisect_left, insort

    def median_sliding_window(nums, k):
        window = sorted(nums[:k])
        out = []
        for i in range(k, len(nums) + 1):
            if k % 2:
                out.append(window[k // 2])
            else:
                out.append((window[k // 2 - 1] + window[k // 2]) / 2)
            if i == len(nums):
                break
            del window[bisect_left(window, nums[i])]
            insort(window, nums[i])
        return out
  - |
    from bisect import bisect_left, insort

    def median_sliding_window(nums, k):
        window = sorted(nums[:k])
        out = []
        for i in range(k, len(nums)):
            if k % 2:
                out.append(window[k // 2])
            else:
                out.append((window[k // 2 - 1] + window[k // 2]) / 2)
            del window[bisect_left(window, nums[i - k])]
            insort(window, nums[i])
        return out
---
::
