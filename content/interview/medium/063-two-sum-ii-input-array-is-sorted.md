---
title: Two Sum II - Input Array Is Sorted
tier: medium
order: 63
leetcode: 167
url: https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
companies: [Amazon, Google, Meta]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/01-two-pointers, /learn/week10-algorithms/05-binary-search]
---

You get a list of whole numbers sorted from smallest to largest. Values may repeat. The list has between 2 and 100000 values, each from -1000000000 to 1000000000. You also get a target number. Find two different positions whose values add up to the target. Return their positions as a list of two whole numbers, counted from 1, with the smaller position first. There is always at least one answer. If several pairs work, any one of them is accepted. You may not use the same position twice.

Put one pointer at the start and one at the end. If their sum is too small, move the start pointer forward. If it is too big, move the end pointer back. Sorting lets each move throw away the values that cannot work.

::exercise
---
id: iv-medium-063
prompt: Write a function two_sum_sorted(numbers, target) that returns the 1-based positions [i, j], with i < j, of the two values that add up to target in the sorted list.
starter: |
  # write your code below
  def two_sum_sorted(numbers, target):
      pass
hints:
  - Start with one pointer at each end of the list.
  - When the sum is too small, which pointer should move, and why does moving the other one lose nothing?
tests:
  - check: assert two_sum_sorted([2, 7, 11, 15], 9) == [1, 2]
  - check: assert two_sum_sorted([2, 3, 4], 6) == [1, 3]
  - check: assert two_sum_sorted([-1, 0], -1) == [1, 2]
  - check: assert two_sum_sorted([0, 0, 3, 4], 0) == [1, 2]
  - check: assert two_sum_sorted([1, 2, 3, 4, 4, 9, 56, 90], 8) == [4, 5]
  - check: assert two_sum_sorted([-10, -3, 1, 5, 8], 6) == [3, 4]
  - check: assert two_sum_sorted([1, 3], 4) == [1, 2]
  - check: assert two_sum_sorted([-5, 1, 2, 9, 12], 21) == [4, 5]
big: 'assert (lambda N, r: 1 <= r[0] < r[1] <= len(N) and N[r[0] - 1] + N[r[1] - 1] == 989995)(sorted({(i * 7919) % 1000003 - 500000 for i in range(100000)}), two_sum_sorted(sorted({(i * 7919) % 1000003 - 500000 for i in range(100000)}), 989995))'
solution: |
  def two_sum_sorted(numbers, target):
      lo, hi = 0, len(numbers) - 1
      while lo < hi:
          total = numbers[lo] + numbers[hi]
          if total == target:
              return [lo + 1, hi + 1]
          if total < target:
              lo += 1
          else:
              hi -= 1
brute: |
  def two_sum_sorted(numbers, target):
      for i in range(len(numbers)):
          for j in range(i + 1, len(numbers)):
              if numbers[i] + numbers[j] == target:
                  return [i + 1, j + 1]
random:
  call: two_sum_sorted
  gen: |
    def gen(rng, size):
        numbers = sorted(rng.sample(range(-10, 11), max(size, 2)))
        i, j = sorted(rng.sample(range(len(numbers)), 2))
        return (numbers, numbers[i] + numbers[j])
  same: |
    def same(args, got, want):
        numbers, target = args
        return (
            isinstance(got, list) and len(got) == 2 and 1 <= got[0] < got[1] <= len(numbers)
            and numbers[got[0] - 1] + numbers[got[1] - 1] == target
        )
slow:
  - |
    def two_sum_sorted(numbers, target):
        for i in range(len(numbers)):
            for j in range(i + 1, len(numbers)):
                if numbers[i] + numbers[j] == target:
                    return [i + 1, j + 1]
  - |
    def two_sum_sorted(numbers, target):
        for i, x in enumerate(numbers):
            if target - x in numbers[i + 1:]:
                return [i + 1, numbers.index(target - x, i + 1) + 1]
wrong:
  - |
    def two_sum_sorted(numbers, target):
        lo, hi = 0, len(numbers) - 1
        while lo < hi:
            total = numbers[lo] + numbers[hi]
            if total == target:
                return [lo, hi]
            if total < target:
                lo += 1
            else:
                hi -= 1
  - |
    def two_sum_sorted(numbers, target):
        lo, hi = 0, len(numbers) - 1
        while lo < hi:
            total = numbers[lo] + numbers[hi]
            if total == target:
                return [lo + 1, hi + 1]
            if total > target:
                lo += 1
            else:
                hi -= 1
  - |
    def two_sum_sorted(numbers, target):
        lo, hi = 0, len(numbers) - 1
        while lo < hi:
            total = numbers[lo] + numbers[hi]
            if total == target:
                return [lo + 1, hi + 1]
            if total < target:
                hi -= 1
            else:
                lo += 1
equivalent:
  - "while lo <= hi:"   # why: the problem guarantees a pair with two different positions, so the search returns before lo and hi can meet on one position
  - "if total <= target:"   # why: the equal case already returned on the line above, so < and <= never differ here
---
::
