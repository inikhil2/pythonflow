---
title: Count of Smaller Numbers After Self
tier: hard
order: 46
leetcode: 315
url: https://leetcode.com/problems/count-of-smaller-numbers-after-self/
companies: [Amazon, Meta, Google]
topic: Binary Search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

You are given a list of whole numbers. For each position, count how many numbers to its right are strictly smaller than the number at that position. The list has between 1 and 10000 numbers, each from -10000 to 10000.

Return the counts as a list of the same length. Equal numbers do not count as smaller. For example, in `[5, 2, 6, 2]` the answer is `[2, 0, 1, 0]`: the 5 has two smaller numbers after it, and the second 2 has none.

::exercise
---
id: iv-hard-046
prompt: Write a function count_smaller(nums) that returns a list where entry i is the number of values after position i that are strictly less than nums[i].
starter: |
  # write your code below
  def count_smaller(nums):
      pass
hints:
  - Walk the list from right to left and count how many already-seen values are smaller than the current one. Values can be large, so first replace each one with its rank among the sorted distinct values.
  - A Fenwick tree (binary indexed tree) over those ranks counts the seen values below a rank in logarithmic time. A sorted list kept with insort and counted with bisect_left also gives the right answer, since bisect_left does not count equal values.
tests:
  - check: assert count_smaller([5, 2, 6, 2]) == [2, 0, 1, 0]
  - check: assert count_smaller([7]) == [0]
  - check: assert count_smaller([1, 2, 3]) == [0, 0, 0]
  - check: assert count_smaller([3, 2, 1]) == [2, 1, 0]
  - check: assert count_smaller([4, 4, 4]) == [0, 0, 0]
  - check: assert count_smaller([-1, -2, 0, -1]) == [1, 0, 1, 0]
  - check: assert count_smaller([0, -10000, 10000, -10000]) == [2, 0, 1, 0]
  - check: assert count_smaller([2, 0, 1]) == [2, 0, 0]
  - check: assert count_smaller([1, 1, 0, 1]) == [1, 1, 0, 0]
  - check: assert count_smaller([9, 8, 7, 6, 5, 4]) == [5, 4, 3, 2, 1, 0]
solution: |
  def count_smaller(nums):
      ranks = {v: i + 1 for i, v in enumerate(sorted(set(nums)))}
      size = len(ranks)
      tree = [0] * (size + 1)
      counts = []
      for x in reversed(nums):
          r = ranks[x]
          total = 0
          i = r - 1
          while i > 0:
              total += tree[i]
              i -= i & -i
          counts.append(total)
          i = r
          while i <= size:
              tree[i] += 1
              i += i & -i
      return counts[::-1]
# why: this pairwise count does about 50 million comparisons on big, so it runs out of steps; the Fenwick reference and the bisect plus insort method from the hints are both accepted as correct and fast.
slow:
  - |
    def count_smaller(nums):
        n = len(nums)
        return [sum(1 for j in range(i + 1, n) if nums[j] < nums[i]) for i in range(n)]
brute: |
  def count_smaller(nums):
      n = len(nums)
      return [sum(1 for j in range(i + 1, n) if nums[j] < nums[i]) for i in range(n)]
big: 'assert sum((i + 1) * c for i, c in enumerate(count_smaller([(i * 7919) % 20001 - 10000 for i in range(10000)]))) == 83378064663'
random:
  call: count_smaller
  gen: |
    def gen(rng, size):
        n = rng.randint(1, min(size + 3, 8))
        return ([rng.randint(-3, 3) for _ in range(n)],)
wrong:
  - |
    from bisect import bisect_right, insort

    def count_smaller(nums):
        seen = []
        counts = []
        for x in reversed(nums):
            counts.append(bisect_right(seen, x))
            insort(seen, x)
        return counts[::-1]
  - |
    def count_smaller(nums):
        counts = []
        for i in range(len(nums)):
            if i + 1 < len(nums) and nums[i + 1] < nums[i]:
                counts.append(1)
            else:
                counts.append(0)
        return counts
  - |
    def count_smaller(nums):
        return [sum(1 for y in nums if y < x) for x in nums]
equivalent:
  - 2: "ranks = {v: i + 2 for i, v in enumerate(sorted(set(nums)))}"  # why: every stored rank moves up by one, and the query for x stops at its own rank minus one, so it counts exactly the values with a smaller rank; the largest rank is then skipped by the update loop, which no tree node up to size covers, so no query changes
  - 4: "tree = [0] * (size + 2)"  # why: the extra slot at the top is never read, since every loop stops at size
  - 15: "while i < size:"  # why: the update skips only index size, the largest rank, and no tree node below size covers index size, so no prefix query that reads indices up to size - 1 changes
---
::
