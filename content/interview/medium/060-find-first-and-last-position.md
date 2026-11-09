---
title: Find First and Last Position of Element in Sorted Array
tier: medium
order: 60
leetcode: 34
url: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
companies: [Amazon, Meta, Google]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

You get a list of whole numbers sorted from smallest to largest. Values can repeat. The list has between 0 and 100000 values, and each value is between -1000000000 and 1000000000. You also get a list of targets, with between 1 and 8000 targets, each from -1000000000 to 1000000000. For each target, in order, return a pair [first, last] with the first and last positions where that target appears. If the target does not appear, its pair is [-1, -1]. Return all the pairs in one list.

Many targets are searched against the same list, so a method that scans the whole list for each target does far too much work. Each target needs two searches: one finds the first position where the value is at least the target, and the other finds the first position where the value is greater than the target. The gap between those two positions holds all copies of the target.

::exercise
---
id: iv-medium-060
prompt: Write a function search_range(nums, targets) that returns a list with one [first, last] pair per target, in order, using [-1, -1] for a target that is not in the sorted list.
starter: |
  # write your code below
  def search_range(nums, targets):
      pass
hints:
  - Write one helper that returns the first index where the value is at least a bound, and use it twice with different bounds.
  - Check whether the first index actually holds the target before reporting the pair.
tests:
  - check: assert search_range([5, 7, 7, 8, 8, 10], [8]) == [[3, 4]]
  - check: assert search_range([5, 7, 7, 8, 8, 10], [6]) == [[-1, -1]]
  - check: assert search_range([], [0]) == [[-1, -1]]
  - check: assert search_range([1], [1]) == [[0, 0]]
  - check: assert search_range([2, 2, 2, 2], [2]) == [[0, 3]]
  - check: assert search_range([1, 2, 3], [3, 0, 1, 4]) == [[2, 2], [-1, -1], [0, 0], [-1, -1]]
  - check: assert search_range([1, 1, 2, 2, 2, 3, 3], [2, 3, 5]) == [[2, 4], [5, 6], [-1, -1]]
  - check: assert search_range([-5, -5, 0, 7], [-5, 7, -6]) == [[0, 1], [3, 3], [-1, -1]]
big: assert sum(a + b for a, b in search_range(sorted([((i * 7919) % 50021) * 20000 - 500000000 for i in range(66667)] + [0] * 33333), [0 if i % 3 == 0 else ((i * 131) % 50021) * 20000 - 500000000 + (i % 2) * 10000 for i in range(8000)])) == 532446572
slow:
  - |
    def search_range(nums, targets):
        pairs = []
        for t in targets:
            lo, hi = 0, len(nums)
            while lo < hi:
                mid = (lo + hi) // 2
                if nums[mid] < t:
                    lo = mid + 1
                else:
                    hi = mid
            if lo < len(nums) and nums[lo] == t:
                end = lo
                while end + 1 < len(nums) and nums[end + 1] == t:
                    end += 1
                pairs.append([lo, end])
            else:
                pairs.append([-1, -1])
        return pairs
  - |
    def search_range(nums, targets):
        pairs = []
        for t in targets:
            c = nums.count(t)
            if c:
                first = nums.index(t)
                pairs.append([first, first + c - 1])
            else:
                pairs.append([-1, -1])
        return pairs
solution: |
  def search_range(nums, targets):
      def first_at_least(bound, strict):
          lo, hi = 0, len(nums)
          while lo < hi:
              mid = (lo + hi) // 2
              if nums[mid] < bound or (strict and nums[mid] == bound):
                  lo = mid + 1
              else:
                  hi = mid
          return lo
      pairs = []
      for target in targets:
          first = first_at_least(target, False)
          last = first_at_least(target, True) - 1
          if first <= last:
              pairs.append([first, last])
          else:
              pairs.append([-1, -1])
      return pairs
brute: |
  def search_range(nums, targets):
      pairs = []
      for target in targets:
          hits = [i for i, value in enumerate(nums) if value == target]
          if hits:
              pairs.append([hits[0], hits[-1]])
          else:
              pairs.append([-1, -1])
      return pairs
random:
  call: search_range
  gen: |
    def gen(rng, size):
        nums = sorted(rng.randint(0, 6) for _ in range(size))
        targets = [rng.randint(-1, 7) for _ in range(max(size, 1))]
        return (nums, targets)
wrong:
  - |
    def search_range(nums, targets):
        pairs = []
        for target in targets:
            lo, hi = 0, len(nums)
            while lo < hi:
                mid = (lo + hi) // 2
                if nums[mid] < target:
                    lo = mid + 1
                else:
                    hi = mid
            if lo < len(nums) and nums[lo] == target:
                pairs.append([lo, lo])
            else:
                pairs.append([-1, -1])
        return pairs
  - |
    def search_range(nums, targets):
        def first_at_least(bound, strict):
            lo, hi = 0, len(nums)
            while lo < hi:
                mid = (lo + hi) // 2
                if nums[mid] < bound or (strict and nums[mid] == bound):
                    lo = mid + 1
                else:
                    hi = mid
            return lo
        pairs = []
        for target in targets:
            first = first_at_least(target, False)
            last = first_at_least(target, True)
            if first < last:
                pairs.append([first, last])
            else:
                pairs.append([-1, -1])
        return pairs
  - |
    def search_range(nums, targets):
        pairs = []
        for target in targets:
            lo, hi = 0, len(nums)
            while lo < hi:
                mid = (lo + hi) // 2
                if nums[mid] < target:
                    lo = mid + 1
                else:
                    hi = mid
            pairs.append([lo, lo + nums.count(target) - 1])
        return pairs
equivalent: []
---
::
