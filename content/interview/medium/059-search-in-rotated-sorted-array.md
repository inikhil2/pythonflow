---
title: Search in Rotated Sorted Array
tier: medium
order: 59
leetcode: 33
url: https://leetcode.com/problems/search-in-rotated-sorted-array/
companies: [Amazon, Google, Meta]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

You get a list of distinct whole numbers that was sorted from smallest to largest and then cut at some point, with the front piece moved to the back. For example, the sorted list 0, 1, 2, 4, 5 could become 4, 5, 0, 1, 2. The list has between 1 and 100000 values, and every value is between -1000000 and 1000000. You also get a list of targets, with between 1 and 10000 targets, each from -1000000 to 1000000. For each target, in order, return its index in the list, or -1 if it is not there. Return all the answers in one list.

Many targets are searched against the same list, so a method that looks at every value for each target does far too much work. For each target, look at the middle value. One half of the list is always in sorted order, so you can check whether the target falls inside that sorted half. If it does, keep only that half. If it does not, keep the other half.

::exercise
---
id: iv-medium-059
prompt: Write a function search(nums, targets) that returns a list holding, for each target in order, its index in the rotated sorted list, or -1 if it is missing.
starter: |
  # write your code below
  def search(nums, targets):
      pass
hints:
  - For one target, compare the middle value with the left end to find which half is in sorted order.
  - Check whether the target lies inside that sorted half, using the end values as the boundaries.
tests:
  - check: assert search([4, 5, 6, 7, 0, 1, 2], [0]) == [4]
  - check: assert search([4, 5, 6, 7, 0, 1, 2], [3]) == [-1]
  - check: assert search([4, 5, 6, 7, 0, 1, 2], [4]) == [0]
  - check: assert search([4, 5, 6, 7, 0, 1, 2], [2, 7, 9, 0]) == [6, 3, -1, 4]
  - check: assert search([1], [0]) == [-1]
  - check: assert search([1], [1]) == [0]
  - check: assert search([1, 3], [3]) == [1]
  - check: assert search([3, 1], [1, 3]) == [1, 0]
  - check: assert search([-7, -3, 0, 2, 9], [9]) == [4]
  - check: assert search([6, 7, 8, 1, 2, 3, 4, 5], [8, 5, 6]) == [2, 7, 0]
big: assert sum(search([i * 7 - 350000 for i in range(33333, 100000)] + [i * 7 - 350000 for i in range(33333)], [(i * 7919) % 1000001 - 500000 for i in range(10000)])) == 49856649
solution: |
  def search(nums, targets):
      def find(target):
          lo, hi = 0, len(nums) - 1
          while lo <= hi:
              mid = (lo + hi) // 2
              if nums[mid] == target:
                  return mid
              if nums[lo] <= nums[mid]:
                  if nums[lo] <= target < nums[mid]:
                      hi = mid - 1
                  else:
                      lo = mid + 1
              else:
                  if nums[mid] < target <= nums[hi]:
                      lo = mid + 1
                  else:
                      hi = mid - 1
          return -1
      return [find(target) for target in targets]
brute: |
  def search(nums, targets):
      answers = []
      for target in targets:
          if target in nums:
              answers.append(nums.index(target))
          else:
              answers.append(-1)
      return answers
random:
  call: search
  gen: |
    def gen(rng, size):
        k = min(max(size, 1), 12)
        values = sorted(rng.sample(range(-20, 21), k))
        shift = rng.randint(0, k - 1)
        nums = values[shift:] + values[:shift]
        targets = [rng.randint(-21, 21) for _ in range(max(size, 1))]
        return (nums, targets)
slow:
  - |
    def search(nums, targets):
        return [nums.index(t) if t in nums else -1 for t in targets]
wrong:
  - |
    def search(nums, targets):
        def find(target):
            lo, hi = 0, len(nums) - 1
            while lo <= hi:
                mid = (lo + hi) // 2
                if nums[mid] == target:
                    return mid
                if nums[mid] < target:
                    lo = mid + 1
                else:
                    hi = mid - 1
            return -1
        return [find(target) for target in targets]
  - |
    def search(nums, targets):
        def find(target):
            lo, hi = 0, len(nums) - 1
            while lo <= hi:
                mid = (lo + hi) // 2
                if nums[mid] == target:
                    return mid
                if nums[lo] <= nums[mid]:
                    if nums[lo] < target < nums[mid]:
                        hi = mid - 1
                    else:
                        lo = mid + 1
                else:
                    if nums[mid] < target <= nums[hi]:
                        lo = mid + 1
                    else:
                        hi = mid - 1
            return -1
        return [find(target) for target in targets]
  - |
    def search(nums, targets):
        def find(target):
            lo, hi = 0, len(nums) - 1
            while lo <= hi:
                mid = (lo + hi) // 2
                if nums[mid] == target:
                    return mid
                if nums[lo] <= nums[mid]:
                    if nums[lo] <= target < nums[mid]:
                        hi = mid - 1
                    else:
                        lo = mid + 1
                else:
                    if nums[lo] <= target < nums[mid]:
                        hi = mid - 1
                    else:
                        lo = mid + 1
            return -1
        return [find(target) for target in targets]
equivalent:
  - "if nums[lo] <= target <= nums[mid]:"   # why: target == nums[mid] has already returned above, so the extra equal case never runs
  - "elif nums[mid] <= target <= nums[hi]:"   # why: target == nums[mid] has already returned above, so widening the lower bound to equal never changes a branch
  - "lo = mid + 0"   # why: in the rotated branch mid is strictly above lo, so keeping lo at mid still shrinks the range and the target is never dropped (the same text in the sorted branch loops forever, and that copy is killed by the step limit)
  - "11: hi = mid - 0"   # why: nums[mid] is known not to be the target, so keeping mid in the range never drops the answer, and the loop still ends because the last range is handled by the sorted branch
  - "17: hi = mid - 0"   # why: nums[mid] is known not to be the target, so keeping mid in the range never drops the answer, and the loop still ends because the last range is handled by the sorted branch
---
::
