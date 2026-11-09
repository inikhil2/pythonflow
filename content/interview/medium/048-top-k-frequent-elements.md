---
title: Top K Frequent Elements
tier: medium
order: 48
leetcode: 347
url: https://leetcode.com/problems/top-k-frequent-elements/
companies: [Amazon, Meta, Google]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list `nums` of 1 to 100000 whole numbers, each from -10000 to 10000, and a whole number `k` from 1 to the number of different values in `nums`. Return a list of the `k` values that appear most often in `nums`. Each value is returned once.

If two values appear the same number of times, you may choose either one when they both fall at the edge of the top `k`. The answer can list its values in any order.

For example, [1, 1, 1, 2, 2, 3] with k = 2 gives [1, 2], because 1 appears 3 times and 2 appears 2 times.

::exercise
---
id: iv-medium-048
prompt: Write a function top_k_frequent(nums, k) that returns the k values that appear most often in nums.
starter: |
  # write your code below
  def top_k_frequent(nums, k):
      pass
hints:
  - Count how many times each value appears. A dictionary or the Counter class from collections does this in one pass.
  - Sort the values by their counts, largest first, and keep the first k.
tests:
  - check: 'assert sorted(top_k_frequent([1, 1, 1, 2, 2, 3], 2)) == [1, 2]'
  - check: 'assert top_k_frequent([1], 1) == [1]'
  - check: 'assert sorted(top_k_frequent([4, 4, 4, 5, 5, 6, 6, 6, 6, 7], 2)) == [4, 6]'
  - check: 'assert top_k_frequent([-1, -1, 0, 0, 0, 3], 1) == [0]'
  - check: 'assert top_k_frequent([7, 8, 9, 9, 9, 8, 7, 7, 7], 1) == [7]'
  - check: 'assert sorted(top_k_frequent([3, 3, 2, 2, 2, 1, 1, 1, 1], 2)) == [1, 2]'
  - check: 'assert sorted(top_k_frequent([10, 20, 30, 40, 40, 40, 50, 50], 2)) == [40, 50]'
  - check: 'assert sorted(top_k_frequent([1, 2, 3, 4, 5], 5)) == [1, 2, 3, 4, 5]'
big: 'assert sorted(top_k_frequent([(i * 7919) % 20001 - 10000 for i in range(99000)] + [3] * 400 + [-8] * 300 + [11] * 200 + [-2] * 100, 4)) == [-8, -2, 3, 11]'
solution: |
  def top_k_frequent(nums, k):
      from collections import Counter
      counts = Counter(nums)
      ranked = sorted(counts, key=lambda x: counts[x], reverse=True)
      return ranked[:k]
brute: |
  def top_k_frequent(nums, k):
      ranked = sorted(set(nums), key=lambda x: -nums.count(x))
      return ranked[:k]
random:
  call: top_k_frequent
  gen: |
    def gen(rng, size):
        nums = [rng.randint(-5, 5) for _ in range(rng.randint(1, 3 + size))]
        return (nums, rng.randint(1, len(set(nums))))
  same: |
    def same(args, got, want):
        from collections import Counter
        nums, k = args
        counts = Counter(nums)
        if len(got) != k or len(set(got)) != k:
            return False
        if any(x not in counts for x in got):
            return False
        worst = min(counts[x] for x in got)
        return all(counts[x] <= worst for x in counts if x not in got)
slow:
  - |
    def top_k_frequent(nums, k):
        ranked = sorted(set(nums), key=lambda x: -nums.count(x))
        return ranked[:k]
  - |
    def top_k_frequent(nums, k):
        counts = {}
        for x in nums:
            counts[x] = 0
            for y in nums:
                if y == x:
                    counts[x] += 1
        return sorted(counts, key=lambda x: -counts[x])[:k]
wrong:
  - |
    def top_k_frequent(nums, k):
        from collections import Counter
        counts = Counter(nums)
        ranked = sorted(counts, key=lambda x: counts[x])
        return ranked[:k]
  - |
    def top_k_frequent(nums, k):
        return list(dict.fromkeys(nums))[:k]
  - |
    def top_k_frequent(nums, k):
        return sorted(set(nums), reverse=True)[:k]
---
::
