---
title: Split Array Largest Sum
tier: hard
order: 68
leetcode: 410
url: https://leetcode.com/problems/split-array-largest-sum/
companies: [Google, Amazon, Meta]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

You get a list of whole numbers nums that are not negative, and a whole number k. Cut nums into exactly k non-empty pieces of neighbouring numbers, so that every number is in one piece and the pieces keep their order. The sum of a piece is the total of the numbers in it.

Return the smallest value that the largest piece sum can have, over all the ways to cut. There are between 1 and 1000 numbers, each from 0 to 1000000, and k is between 1 and the smaller of the length of nums and 50. Trying every way to cut, or filling a table over every cut position for every piece, is too slow for the largest inputs.

::exercise
---
id: iv-hard-068
prompt: Write a function split_array(nums, k) that returns the smallest possible largest piece sum when nums is cut into exactly k pieces.
starter: |
  # write your code below
  def split_array(nums, k):
      pass
hints:
  - If you are told the largest piece sum may be at most some limit, you can check it by cutting greedily: close a piece only when the next number would break the limit.
  - The answer is between the largest single number and the total, and a bigger limit never makes it harder, so binary search on the limit.
tests:
  - check: assert split_array([7, 2, 5, 10, 8], 2) == 18
  - check: assert split_array([1, 2, 3, 4, 5], 2) == 9
  - check: assert split_array([1, 4, 4], 3) == 4
  - check: assert split_array([5], 1) == 5
  - check: assert split_array([0, 0, 0], 2) == 0
  - check: assert split_array([10, 1], 2) == 10
  - check: assert split_array([1, 1, 1, 1], 4) == 1
  - check: assert split_array([1, 1, 1, 1], 1) == 4
  - check: assert split_array([2, 3, 1, 2, 4, 3], 5) == 4
  - check: assert split_array([1, 2, 3, 4, 5], 3) == 6
  - check: assert split_array([9, 1, 1, 1, 9], 2) == 11
  - check: assert split_array([3, 3, 3, 3], 3) == 6
  - check: assert split_array([100, 1, 1, 1, 1], 2) == 100
  - check: assert split_array([1, 100, 1, 1, 1], 3) == 100
  - check: assert split_array([4, 3, 2, 6, 6, 1], 4) == 7
  - check: assert split_array([0, 10, 0], 2) == 10
  - check: assert split_array([5, 5, 5, 5, 5, 5], 4) == 10
  - check: assert split_array([2, 2, 9, 1, 1], 3) == 9
solution: |
  def split_array(nums, k):
      low, high = max(nums), sum(nums)
      while low < high:
          mid = (low + high) // 2
          parts, current = 1, 0
          for x in nums:
              if current + x > mid:
                  parts += 1
                  current = 0
              current += x
          if parts <= k:
              high = mid
          else:
              low = mid + 1
      return low
brute: |
  def split_array(nums, k):
      n = len(nums)
      prefix = [0]
      for x in nums:
          prefix.append(prefix[-1] + x)
      inf = float("inf")
      best = [[inf] * (n + 1) for _ in range(k + 1)]
      best[0][0] = 0
      for parts in range(1, k + 1):
          for end in range(1, n + 1):
              for cut in range(parts - 1, end):
                  best[parts][end] = min(best[parts][end], max(best[parts - 1][cut], prefix[end] - prefix[cut]))
      return best[k][n]
valid: |
  def valid(nums, k):
      return 1 <= len(nums) <= 1000 and 1 <= k <= min(len(nums), 50) and all(isinstance(x, int) and 0 <= x <= 1000000 for x in nums)
random:
  call: split_array
  gen: |
    def gen(rng, size):
        n = rng.randint(1, size + 3)
        top = rng.choice([3, 9, 30])
        return ([rng.randint(0, top) for _ in range(n)], rng.randint(1, min(n, 50)))
big: 'assert split_array([(i * 7919 + (i * i) % 10007) % 1000001 for i in range(1000)], 37) == 13726725'
slow:
  - |
    def split_array(nums, k):
        n = len(nums)
        prefix = [0]
        for x in nums:
            prefix.append(prefix[-1] + x)
        inf = float("inf")
        best = [[inf] * (n + 1) for _ in range(k + 1)]
        best[0][0] = 0
        for parts in range(1, k + 1):
            for end in range(1, n + 1):
                for cut in range(parts - 1, end):
                    best[parts][end] = min(best[parts][end], max(best[parts - 1][cut], prefix[end] - prefix[cut]))
        return best[k][n]
  - |
    def split_array(nums, k):
        limit = max(nums)
        while True:
            parts, current = 1, 0
            for x in nums:
                if current + x > limit:
                    parts += 1
                    current = 0
                current += x
            if parts <= k:
                return limit
            limit += 1
wrong:
  - |
    def split_array(nums, k):
        low, high = 0, sum(nums)
        while low < high:
            mid = (low + high) // 2
            parts, current = 1, 0
            for x in nums:
                if current + x > mid:
                    parts += 1
                    current = 0
                current += x
            if parts <= k:
                high = mid
            else:
                low = mid + 1
        return low
  - |
    def split_array(nums, k):
        low, high = max(nums), sum(nums)
        while low < high:
            mid = (low + high) // 2
            parts, current = 1, 0
            for x in nums:
                if current + x > mid:
                    parts += 1
                    current = 0
                current += x
            if parts < k:
                high = mid
            else:
                low = mid + 1
        return low
  - |
    def split_array(nums, k):
        size = -(-len(nums) // k)
        return max(sum(nums[i:i + size]) for i in range(0, len(nums), size))
  - |
    def split_array(nums, k):
        low, high = max(nums), sum(nums)
        while low < high:
            mid = (low + high) // 2
            parts, current = 1, 0
            for x in nums:
                if current + x >= mid:
                    parts += 1
                    current = 0
                current += x
            if parts <= k:
                high = mid
            else:
                low = mid + 1
        return low
---
::
