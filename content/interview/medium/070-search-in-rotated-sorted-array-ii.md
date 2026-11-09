---
title: Search in Rotated Sorted Array II
tier: medium
order: 70
leetcode: 81
url: https://leetcode.com/problems/search-in-rotated-sorted-array-ii/
companies: [Meta, Google, Amazon]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

Start with a list of whole numbers that was sorted from smallest to largest, then cut it at some point and move the front piece to the back. Values may repeat, so 2, 2, 2, 0, 2 is a valid rotated list. The list has between 1 and 5000 values, and each value is from -10000 to 10000. You also get a list of between 1 and 2000 targets, each from -10000 to 10000. For each target, in order, return True if that target is in the list, and False otherwise. Return all the answers in one list.

Each target is searched on its own, using the same idea as a binary search on a rotated list. Look at the middle value: if it is the target, you are done. If the left end equals the middle value, the left end is not the target, so move the left end in by one and keep going; this is the case where repeated values hide which half is sorted. Otherwise one half is in sorted order, so check whether the target lies in that sorted half and keep that side or the other.

::exercise
---
id: iv-medium-070
prompt: Write a function search_rotated(nums, targets) that returns a list with True or False for each target, in order, saying whether that target is in the rotated sorted list, which may contain repeated values.
starter: |
  # write your code below
  def search_rotated(nums, targets):
      pass
hints:
  - Compare the middle value with the left end to find which half is sorted, as in the version without repeats.
  - If the left end equals the middle value, the left end cannot be the target, so move the left end one step in.
  - Python's `in` operator checks a whole list in one step, but a loop written out by hand over every value for every target is too slow at this size.
tests:
  - check: assert search_rotated([2, 5, 6, 0, 0, 1, 2], [0]) == [True]
  - check: assert search_rotated([2, 5, 6, 0, 0, 1, 2], [3]) == [False]
  - check: assert search_rotated([2, 5, 6, 0, 0, 1, 2], [1, 2, 9]) == [True, True, False]
  - check: assert search_rotated([1, 0, 1, 1, 1], [0]) == [True]
  - check: assert search_rotated([1], [1, 0]) == [True, False]
  - check: assert search_rotated([1, 1, 1, 0, 1, 1, 1, 1], [0]) == [True]
  - check: assert search_rotated([3, 1, 1], [3]) == [True]
  - check: assert search_rotated([1, 1, 1], [2]) == [False]
  - check: assert search_rotated([1, 3, 1, 1, 1], [3]) == [True]
  - check: assert search_rotated([4, 5, 6, 7, 0, 1, 2], [2, 4, 8]) == [True, True, False]
  - check: assert search_rotated([1, 1, 1, 0, 1], [0, 5]) == [True, False]
  - check: assert search_rotated([0, 1], [-1]) == [False]
# why: 1000000 is the sum of (i + 1) over the even indices 0..1998, which is what the membership test gives because even-index targets are in the list and odd-index targets are not; it is set-based, so it does not come from the solution
big: "assert (lambda b: sum((i + 1) * found for i, found in enumerate(search_rotated((lambda s: s[1234:] + s[:1234])(sorted(b[:4900] + b[:4900:49])), [b[(i * 37) % 4900] if i % 2 == 0 else b[4900 + i % 100] for i in range(2000)])))) (sorted({(i * 7919) % 20001 - 10000 for i in range(5000)})) == 1000000 and search_rotated([1] * 2500 + [2] + [1] * 2499, [2, 3]) == [True, False]"
# why: the explicit loop over all 5000 values for each of 2000 targets is about 10 million steps, so it runs out of steps on big; it is correct, so it is not a wrong answer
slow:
  - |
    def search_rotated(nums, targets):
        answers = []
        for target in targets:
            found = False
            for x in nums:
                if x == target:
                    found = True
            answers.append(found)
        return answers
solution: |
  def search_rotated(nums, targets):
      def find(target):
          lo, hi = 0, len(nums) - 1
          while lo <= hi:
              mid = (lo + hi) // 2
              if nums[mid] == target:
                  return True
              if nums[lo] == nums[mid]:
                  lo += 1
                  continue
              if nums[lo] < nums[mid]:
                  if nums[lo] <= target < nums[mid]:
                      hi = mid - 1
                  else:
                      lo = mid + 1
              else:
                  if nums[mid] < target <= nums[hi]:
                      lo = mid + 1
                  else:
                      hi = mid - 1
          return False
      return [find(target) for target in targets]
brute: |
  def search_rotated(nums, targets):
      return [target in nums for target in targets]
random:
  call: search_rotated
  gen: |
    def gen(rng, size):
        k = max(size, 1)
        values = sorted(rng.randint(0, 4) for _ in range(k))
        shift = rng.randint(0, k - 1)
        nums = values[shift:] + values[:shift]
        targets = [rng.randint(-1, 5) for _ in range(k)]
        return (nums, targets)
wrong:
  - |
    def search_rotated(nums, targets):
        def find(target):
            lo, hi = 0, len(nums) - 1
            while lo <= hi:
                mid = (lo + hi) // 2
                if nums[mid] == target:
                    return True
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
            return False
        return [find(target) for target in targets]
  - |
    def search_rotated(nums, targets):
        def find(target):
            lo, hi = 0, len(nums) - 1
            while lo <= hi:
                mid = (lo + hi) // 2
                if nums[mid] == target:
                    return True
                if nums[lo] == nums[mid]:
                    return False
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
            return False
        return [find(target) for target in targets]
  - |
    def search_rotated(nums, targets):
        return [target in nums[:len(nums) // 2] for target in targets]
# standard lo <= hi form; see the reasons below
equivalent:
  - "4: lo, hi = (-1, len(nums) - 1)"   # why: nums[-1] is the last value, so the search runs on [last] + nums, which is still a rotated sorted list with duplicates, and the algorithm handles that
  - "12: if nums[lo] <= nums[mid]:"   # why: equal values at lo and mid are handled by the branch above
  - "13: if nums[lo] <= target <= nums[mid]:"   # why: target == nums[mid] has already returned True
  - "14: hi = mid - 0"   # why: when the range has one or two cells, mid == lo, so nums[lo] == nums[mid] sends it to the drop-lo branch; otherwise lo < mid < hi, so moving to mid still shrinks the range, and nums[mid] is already known not to be the target
  - "16: lo = mid + 0"   # why: when the range has one or two cells, mid == lo, so nums[lo] == nums[mid] sends it to the drop-lo branch; otherwise lo < mid < hi, so moving to mid still shrinks the range, and nums[mid] is already known not to be the target
  - "17: elif nums[mid] <= target <= nums[hi]:"   # why: target == nums[mid] has already returned True
  - "18: lo = mid + 0"   # why: when the range has one or two cells, mid == lo, so nums[lo] == nums[mid] sends it to the drop-lo branch; otherwise lo < mid < hi, so moving to mid still shrinks the range, and nums[mid] is already known not to be the target
  - "20: hi = mid - 0"   # why: when the range has one or two cells, mid == lo, so nums[lo] == nums[mid] sends it to the drop-lo branch; otherwise lo < mid < hi, so moving to mid still shrinks the range, and nums[mid] is already known not to be the target
---
::
