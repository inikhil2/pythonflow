---
title: Create Maximum Number
tier: hard
order: 7
leetcode: 321
url: https://leetcode.com/problems/create-maximum-number/
companies: [Google, Amazon, Microsoft]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/01-two-pointers]
---

You get two lists nums1 and nums2 of digits from 0 to 9. Each list has between 1 and 500 digits. You also get a whole number k from 1 to 200, and k is never more than the total length of both lists.

Build a list of exactly k digits. Digits taken from nums1 must keep their order within nums1, and digits taken from nums2 must keep their order within nums2. Digits from the two lists may be mixed in any order. Return the largest list you can build, where a list is larger when its first differing digit is larger. Every candidate has length k, so no length comparison is needed.

::exercise
---
id: iv-hard-007
prompt: Write a function create_maximum_number(nums1, nums2, k) that returns the largest list of k digits you can build from nums1 and nums2 as described.
starter: |
  # write your code below
  def create_maximum_number(nums1, nums2, k):
      pass
hints:
  - Try every way to split k into a count taken from nums1 and a count taken from nums2. For each list, the best digits of a fixed count keep their order and can be found with a stack that drops smaller digits when a larger one arrives.
  - Merging two chosen lists by taking the larger first digit is not enough when the first digits tie. Compare the whole remaining parts of both lists.
tests:
  - check: assert create_maximum_number([3, 4, 6, 5], [9, 1, 2, 5, 8, 3], 5) == [9, 8, 6, 5, 3]
  - check: assert create_maximum_number([6, 7], [6, 0, 4], 5) == [6, 7, 6, 0, 4]
  - check: assert create_maximum_number([3, 9], [8, 9], 3) == [9, 8, 9]
  - check: assert create_maximum_number([2, 8], [2, 9], 4) == [2, 9, 2, 8]
  - check: assert create_maximum_number([9, 8, 7], [1, 2], 2) == [9, 8]
  - check: assert create_maximum_number([1], [2], 2) == [2, 1]
  - check: assert create_maximum_number([0, 0], [0], 1) == [0]
  - check: assert create_maximum_number([1, 2, 3], [4, 5, 6], 6) == [4, 5, 6, 1, 2, 3]
  - check: assert create_maximum_number([9, 1, 2], [9, 1, 2], 3) == [9, 9, 2]
  - check: assert create_maximum_number([5, 5, 1], [5, 2], 4) == [5, 5, 5, 2]
solution: |
  def create_maximum_number(nums1, nums2, k):
      def best(seq, t):
          out = []
          drop = len(seq) - t
          for d in seq:
              while out and drop and out[-1] < d:
                  out.pop()
                  drop -= 1
              out.append(d)
          return out[:t]

      def merge(a, b):
          out = []
          x = y = 0
          while x < len(a) or y < len(b):
              if a[x:] > b[y:]:
                  out.append(a[x])
                  x += 1
              else:
                  out.append(b[y])
                  y += 1
          return out

      answer = []
      for i in range(max(0, k - len(nums2)), min(k, len(nums1)) + 1):
          cand = merge(best(nums1, i), best(nums2, k - i))
          if cand > answer:
              answer = cand
      return answer
brute: |
  def create_maximum_number(nums1, nums2, k):
      best = []

      def go(p, q, out):
          nonlocal best
          if len(out) == k:
              if out > best:
                  best = out[:]
              return
          for x in range(p, len(nums1)):
              out.append(nums1[x])
              go(x + 1, q, out)
              out.pop()
          for y in range(q, len(nums2)):
              out.append(nums2[y])
              go(p, y + 1, out)
              out.pop()

      go(0, 0, [])
      return best
random:
  call: create_maximum_number
  gen: |
    def gen(rng, size):
        m = rng.randint(1, min(size + 1, 4))
        n = rng.randint(1, min(size + 1, 4))
        return ([rng.randint(0, 9) for _ in range(m)], [rng.randint(0, 9) for _ in range(n)], rng.randint(1, m + n))
big: assert "".join(map(str, create_maximum_number((rng := __import__("random").Random(8)) and [rng.randint(0, 9) for _ in range(500)], [rng.randint(0, 9) for _ in range(500)], 200))) == "99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999989551517237595565124402715198841920250154540038575782424074947446771775291597579638892280184326431007355000"
equivalent:
  - "17: if a[x:] >= b[y:]:"  # why: when the two remaining tails are equal, both branches take a digit with the same value, and the output is the same
  - "27: if cand >= answer:"  # why: a tie means the two candidate lists are identical, so keeping either one gives the same answer
slow:
  - |
    def create_maximum_number(nums1, nums2, k):
        from itertools import combinations
        best = []
        for i in range(k + 1):
            for a in combinations(nums1, i):
                for b in combinations(nums2, k - i):
                    for pos in combinations(range(k), i):
                        take = set(pos)
                        x = y = 0
                        cand = []
                        for t in range(k):
                            if t in take:
                                cand.append(a[x])
                                x += 1
                            else:
                                cand.append(b[y])
                                y += 1
                        if cand > best:
                            best = cand
        return best
wrong:
  - |
    def create_maximum_number(nums1, nums2, k):
        out = []
        drop = len(nums1 + nums2) - k
        for d in nums1 + nums2:
            while out and drop and out[-1] < d:
                out.pop()
                drop -= 1
            out.append(d)
        return out[:k]
  - |
    def create_maximum_number(nums1, nums2, k):
        def best(seq, t):
            out = []
            drop = len(seq) - t
            for d in seq:
                while out and drop and out[-1] < d:
                    out.pop()
                    drop -= 1
                out.append(d)
            return out[:t]

        def merge(a, b):
            out = []
            x = y = 0
            while x < len(a) or y < len(b):
                if a[x:] > b[y:]:
                    out.append(a[x])
                    x += 1
                else:
                    out.append(b[y])
                    y += 1
            return out

        answer = []
        for i in range(max(1, k - len(nums2)), min(k - 1, len(nums1)) + 1):
            cand = merge(best(nums1, i), best(nums2, k - i))
            if cand > answer:
                answer = cand
        return answer
  - |
    def create_maximum_number(nums1, nums2, k):
        def best(seq, t):
            out = []
            drop = len(seq) - t
            for d in seq:
                while out and drop and out[-1] < d:
                    out.pop()
                    drop -= 1
                out.append(d)
            return out[:t]

        def merge(a, b):
            out = []
            x = y = 0
            while x < len(a) or y < len(b):
                if y == len(b) or (x < len(a) and a[x] >= b[y]):
                    out.append(a[x])
                    x += 1
                else:
                    out.append(b[y])
                    y += 1
            return out

        answer = []
        for i in range(max(0, k - len(nums2)), min(k, len(nums1)) + 1):
            cand = merge(best(nums1, i), best(nums2, k - i))
            if cand > answer:
                answer = cand
        return answer
---
::
