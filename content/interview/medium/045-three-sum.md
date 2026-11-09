---
title: Three Sum
tier: medium
order: 45
leetcode: 15
url: https://leetcode.com/problems/3sum/
companies: [Meta, Amazon, Microsoft]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/01-two-pointers]
---

You get a list `nums` of 3 to 500 whole numbers, each from -100000 to 100000. Return every group of three different positions whose numbers add up to 0. Each group is a list of its three numbers sorted from smallest to largest.

The same group of numbers must not appear twice, even if it comes from different positions. For example, [-1, -1, 2] appears once in the answer even though `nums` has two -1s. The groups can come back in any order. If no group works, return an empty list.

For example, [-1, 0, 1, 2, -1, -4] gives [-1, -1, 2] and [-1, 0, 1].

::exercise
---
id: iv-medium-045
prompt: Write a function three_sum(nums) that returns every unique group of three numbers from nums that add up to 0, each group sorted from smallest to largest.
starter: |
  # write your code below
  def three_sum(nums):
      pass
hints:
  - Sort the list first. Fix one number, then use two pointers, one at each end of the numbers after it, to find a pair that makes the total zero.
  - After you find a group, skip over any repeated numbers so the same group is not added again.
tests:
  - check: 'assert sorted(sorted(t) for t in three_sum([-1, 0, 1, 2, -1, -4])) == [[-1, -1, 2], [-1, 0, 1]]'
  - check: 'assert three_sum([0, 1, 1]) == []'
  - check: 'assert sorted(sorted(t) for t in three_sum([0, 0, 0, 0])) == [[0, 0, 0]]'
  - check: 'assert three_sum([-2, 0, 4]) == []'
  - check: 'assert sorted(sorted(t) for t in three_sum([-2, 0, 1, 1, 2])) == [[-2, 0, 2], [-2, 1, 1]]'
  - check: 'assert sorted(sorted(t) for t in three_sum([3, -1, 2, -2, 0])) == [[-2, -1, 3], [-2, 0, 2]]'
  - check: 'assert sorted(sorted(t) for t in three_sum([-3, 1, 1, 2, 2])) == [[-3, 1, 2]]'
  - check: 'assert sorted(sorted(t) for t in three_sum([-4, -4, -4, 4, 4, 4, 0])) == [[-4, 0, 4]]'
  - check: 'assert sorted(sorted(t) for t in three_sum([1, -1, 0, -1, 1, 0])) == [[-1, 0, 1]]'
  - check: 'assert sorted(sorted(t) for t in three_sum([-3, 0, -3, 3, 3])) == [[-3, 0, 3]]'
  - check: 'assert three_sum([0, 0, 0, 0, 0]) == [[0, 0, 0]]'
big: 'assert (lambda r: len(r) == 20050 and r[0] == [-200, 0, 200] and sum(t[0] for t in r) == -2347425)(sorted(sorted(t) for t in three_sum([(i * 7919) % 401 - 200 for i in range(500)])))'
solution: |
  def three_sum(nums):
      nums = sorted(nums)
      result = []
      n = len(nums)
      for i in range(n - 2):
          if i > 0 and nums[i] == nums[i - 1]:
              continue
          lo, hi = i + 1, n - 1
          while lo < hi:
              total = nums[i] + nums[lo] + nums[hi]
              if total < 0:
                  lo += 1
              elif total > 0:
                  hi -= 1
              else:
                  result.append([nums[i], nums[lo], nums[hi]])
                  lo += 1
                  hi -= 1
                  while lo < hi and nums[lo] == nums[lo - 1]:
                      lo += 1
                  while lo < hi and nums[hi] == nums[hi + 1]:
                      hi -= 1
      return result
brute: |
  def three_sum(nums):
      from itertools import combinations
      found = set()
      for a, b, c in combinations(nums, 3):
          if a + b + c == 0:
              found.add(tuple(sorted((a, b, c))))
      return [list(t) for t in found]
random:
  call: three_sum
  gen: |
    def gen(rng, size):
        return ([rng.randint(-4, 4) for _ in range(rng.randint(3, 3 + size))],)
  same: |
    def same(args, got, want):
        return sorted(sorted(t) for t in got) == sorted(sorted(t) for t in want)
slow:
  - |
    def three_sum(nums):
        found = set()
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                for k in range(j + 1, len(nums)):
                    if nums[i] + nums[j] + nums[k] == 0:
                        found.add(tuple(sorted((nums[i], nums[j], nums[k]))))
        return [list(t) for t in found]
  - |
    def three_sum(nums):
        from itertools import combinations
        found = set()
        for a, b, c in combinations(nums, 3):
            if a + b + c == 0:
                found.add(tuple(sorted((a, b, c))))
        return [list(t) for t in found]
wrong:
  - |
    def three_sum(nums):
        nums = sorted(nums)
        result = []
        n = len(nums)
        for i in range(n - 2):
            lo, hi = i + 1, n - 1
            while lo < hi:
                total = nums[i] + nums[lo] + nums[hi]
                if total < 0:
                    lo += 1
                elif total > 0:
                    hi -= 1
                else:
                    result.append([nums[i], nums[lo], nums[hi]])
                    lo += 1
                    hi -= 1
                    while lo < hi and nums[lo] == nums[lo - 1]:
                        lo += 1
                    while lo < hi and nums[hi] == nums[hi + 1]:
                        hi -= 1
        return result
  - |
    def three_sum(nums):
        result = []
        n = len(nums)
        for i in range(n - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            lo, hi = i + 1, n - 1
            while lo < hi:
                total = nums[i] + nums[lo] + nums[hi]
                if total < 0:
                    lo += 1
                elif total > 0:
                    hi -= 1
                else:
                    result.append([nums[i], nums[lo], nums[hi]])
                    lo += 1
                    hi -= 1
        return result
  - |
    def three_sum(nums):
        nums = sorted(nums)
        result = []
        n = len(nums)
        for i in range(n - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            lo, hi = i, n - 1
            while lo < hi:
                total = nums[i] + nums[lo] + nums[hi]
                if total < 0:
                    lo += 1
                elif total > 0:
                    hi -= 1
                else:
                    result.append([nums[i], nums[lo], nums[hi]])
                    lo += 1
                    hi -= 1
                    while lo < hi and nums[lo] == nums[lo - 1]:
                        lo += 1
                    while lo < hi and nums[hi] == nums[hi + 1]:
                        hi -= 1
        return result
equivalent:
  - "for i in range(n - 1):"  # why: when i is n - 2, lo starts at n - 1, which equals hi, so the inner loop never runs and adds nothing
  - "17: lo += 0"  # why: after a match, the next total with the same lo is smaller, so the loop moves lo forward on its own (lo-dedupe skips equal values, and the next total is negative)
  - "while lo <= hi and nums[lo] == nums[lo - 1]:"  # why: when lo equals hi, the outer loop ends after this step anyway, and the hi-dedupe after it is guarded by lo < hi, so the extra step changes no output
  - "19: while lo < hi and nums[lo] == nums[lo - 2]:"  # why: sorted, so this holds only for three equal values and stops one duplicate early; that left-over duplicate pairs with a hi already moved below the old hi value, so its total is negative and lo steps on to where the original lands
  - "21: while lo <= hi and nums[hi] == nums[hi + 1]:"  # why: same as the lo version: when lo equals hi, the next check of the outer loop ends it, so one extra step down changes no output
  - "17: lo -= 1"  # why: after a match, hi moves strictly down past equal values, so pairs (lo-1, hi') and (lo, hi') both sum below the target; lo then steps forward to where the original lands, and no extra triple can appear
---
::
