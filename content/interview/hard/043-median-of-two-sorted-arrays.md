---
title: Median of Two Sorted Arrays
tier: hard
order: 43
leetcode: 4
url: https://leetcode.com/problems/median-of-two-sorted-arrays/
companies: [Google, Amazon, Microsoft]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

You are given two sorted lists, `nums1` and `nums2`, with at least one number between them in total. Merged and sorted together, they form one long sorted list. A query asks for the value at a position `k`, counted from 1 at the smallest number. The median is the query at the middle position. Each list has up to 10000 numbers, each from -10^6 to 10^6, and there are up to 20000 queries, each with `k` from 1 to the total count.

Many queries arrive at once, and each one must be answered quickly. Asking each query separately by merging both lists is too slow when the lists are long. Instead, binary search for how many numbers to take from `nums1` among the first `k`. That count is the only thing you need to find, and it can be found in about log of the list length steps.

::exercise
---
id: iv-hard-043
prompt: Write a function median_queries(nums1, nums2, ks) that returns a list with the value at each position in ks, where position 1 is the smallest number of the merged sorted list.
starter: |
  # write your code below
  def median_queries(nums1, nums2, ks):
      pass
hints:
  - For a position k, try taking i numbers from nums1 and k - i from nums2, and search for the i where the two sides line up.
  - The answer for position k is the larger of the last number taken from each side.
tests:
  - check: assert median_queries([1, 3], [2], [1, 2, 3]) == [1, 2, 3]
  - check: assert median_queries([], [5, 6], [1, 2]) == [5, 6]
  - check: assert median_queries([1, 2], [], [2]) == [2]
  - check: assert median_queries([1, 2, 3], [4, 5, 6], [3, 4]) == [3, 4]
  - check: assert median_queries([1, 1, 1], [1, 1], [1, 5]) == [1, 1]
  - check: assert median_queries([-5, 0], [-3, 10], [2, 3]) == [-3, 0]
  - check: assert median_queries([10, 20, 30], [1, 2, 3, 4, 5], [1, 4, 8]) == [1, 4, 30]
  - check: assert median_queries([7], [], [1]) == [7]
  - check: assert median_queries([0, 2, 4, 6], [1, 3, 5], [4, 5, 7]) == [3, 4, 6]
solution: |
  def median_queries(nums1, nums2, ks):
      def kth(a, b, k):
          lo = max(0, k - len(b))
          hi = min(k, len(a))
          while lo < hi:
              i = (lo + hi) // 2
              if a[i] < b[k - i - 1]:
                  lo = i + 1
              else:
                  hi = i
          i = lo
          j = k - i
          left = [a[i - 1]] if i > 0 else []
          if j > 0:
              left.append(b[j - 1])
          return max(left)

      return [kth(nums1, nums2, k) for k in ks]
slow:
  - |
    def median_queries(nums1, nums2, ks):
        out = []
        for k in ks:
            i = j = 0
            last = None
            for _ in range(k):
                if j >= len(nums2) or (i < len(nums1) and nums1[i] <= nums2[j]):
                    last = nums1[i]
                    i += 1
                else:
                    last = nums2[j]
                    j += 1
            out.append(last)
        return out
brute: |
  def median_queries(nums1, nums2, ks):
      merged = sorted(nums1 + nums2)
      return [merged[k - 1] for k in ks]
big: 'assert sum(median_queries(sorted((i * 7919) % 100003 for i in range(10000)), sorted((i * 104729) % 100003 for i in range(10000)), [(i * 7919) % 20000 + 1 for i in range(20000)])) == 999739957'
random:
  call: median_queries
  gen: |
    def gen(rng, size):
        m = rng.randint(0, min(size + 2, 5))
        n = rng.randint(0, min(size + 2, 5))
        if m + n == 0:
            n = 1
        a = sorted(rng.randint(0, 6) for _ in range(m))
        b = sorted(rng.randint(0, 6) for _ in range(n))
        ks = [rng.randint(1, m + n) for _ in range(rng.randint(1, 3))]
        return (a, b, ks)
wrong:
  - |
    def median_queries(nums1, nums2, ks):
        both = nums1 + nums2
        return [both[k - 1] for k in ks]
  - |
    def median_queries(nums1, nums2, ks):
        merged = sorted(nums1 + nums2)
        return [merged[k] for k in ks]
  - |
    def median_queries(nums1, nums2, ks):
        def kth(a, b, k):
            lo = 0
            hi = min(k, len(a))
            while lo < hi:
                i = (lo + hi) // 2
                if a[i] < b[k - i - 1]:
                    lo = i + 1
                else:
                    hi = i
            return max(a[lo - 1] if lo > 0 else b[k - 1], b[k - lo - 1] if k - lo > 0 else a[lo - 1])
        return [kth(nums1, nums2, k) for k in ks]
equivalent:
  - 8: "if a[i] <= b[k - i - 1]:"   # why: when a[i] equals b[k-i-1] the k-th smallest is that same value whichever side the split falls on, so the returned value does not change
---
::
