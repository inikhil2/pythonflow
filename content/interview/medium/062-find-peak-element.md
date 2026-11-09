---
title: Find Peak Element
tier: medium
order: 62
leetcode: 162
url: https://leetcode.com/problems/find-peak-element/
companies: [Google, Amazon, Meta]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

You get a list of lists of whole numbers. There are between 1 and 200 lists, and each list has between 1 and 20000 values. In every list, no two neighbors are equal. A peak is a value that is bigger than the value on each side of it. The first value only has a right neighbor, and the last value only has a left neighbor, and a missing neighbor counts as smaller than any value. For each list, in order, return the index of any one peak in that list. A list may have several peaks, so any correct index is accepted. Return all the indexes in one list.

Each list is handled on its own. Look at two neighbors at the middle. If the middle value is smaller than the one to its right, a peak must exist on the right, because the values can only stop rising at a peak or at the end. Otherwise a peak exists on the left, including the middle itself.

::exercise
---
id: iv-medium-062
prompt: Write a function find_peaks(arrays) that takes a list of lists and returns one peak index for each list, in order.
starter: |
  # write your code below
  def find_peaks(arrays):
      pass
hints:
  - Each list is independent, so run the same middle-value check on each one and collect the answers.
  - Keep the half that must contain a peak, and stop when the range is one index wide.
  - A full scan that checks every value also finds a peak, but the point of this problem is the halving search.
tests:
  - check: assert find_peaks([[1]]) == [0]
  - check: assert find_peaks([[1, 2]]) == [1]
  - check: assert find_peaks([[2, 1]]) == [0]
  - check: assert find_peaks([[1, 2, 1]]) == [1]
  - check: assert find_peaks([[1, 2, 3, 1]]) == [2]
  - check: assert find_peaks([[1, 2, 1, 3, 5, 6, 4]])[0] in [1, 5]
  - check: assert find_peaks([[3, 1, 2]])[0] in [0, 2]
  - check: assert find_peaks([[2, 1, 2]])[0] in [0, 2]
  - check: assert find_peaks([[5, 4, 3, 2, 1], [1, 2, 3, 4, 5], [1, 3, 2]]) == [0, 4, 1]
big: 'assert (lambda A: len(find_peaks(A)) == len(A) and all(0 <= p < len(a) and (p == 0 or a[p - 1] < a[p]) and (p == len(a) - 1 or a[p + 1] < a[p]) for a, p in zip(A, find_peaks(A))))([[i if i < (3 * (1 + j * 200)) // 4 else (i % 2) * 1000000 + i % 997 for i in range(1 + j * 200)] for j in range(100)])'
slow:
  - |
    def find_peaks(arrays):
        # why: arr.index(max(arr)) is a builtin that would also be a valid slow, but building the input costs the same O(total) time, so it cannot be timed apart and is not added
        result = []
        for nums in arrays:
            for i in range(len(nums)):
                left_ok = i == 0 or nums[i - 1] < nums[i]
                right_ok = i == len(nums) - 1 or nums[i + 1] < nums[i]
                if left_ok and right_ok:
                    result.append(i)
                    break
        return result
solution: |
  def find_peaks(arrays):
      result = []
      for nums in arrays:
          lo, hi = 0, len(nums) - 1
          while lo < hi:
              mid = (lo + hi) // 2
              if nums[mid] < nums[mid + 1]:
                  lo = mid + 1
              else:
                  hi = mid
          result.append(lo)
      return result
brute: |
  def find_peaks(arrays):
      result = []
      for nums in arrays:
          for i in range(len(nums)):
              left_ok = i == 0 or nums[i - 1] < nums[i]
              right_ok = i == len(nums) - 1 or nums[i + 1] < nums[i]
              if left_ok and right_ok:
                  result.append(i)
                  break
      return result
random:
  call: find_peaks
  gen: |
    def gen(rng, size):
        arrays = []
        for _ in range(rng.randint(1, 3)):
            nums = []
            for _ in range(max(size, 1)):
                value = rng.randint(0, 6)
                while nums and value == nums[-1]:
                    value = rng.randint(0, 6)
                nums.append(value)
            arrays.append(nums)
        return (arrays,)
  same: |
    def same(args, got, want):
        arrays = args[0]
        return (
            isinstance(got, list) and len(got) == len(arrays)
            and all(
                0 <= p < len(a) and (p == 0 or a[p - 1] < a[p]) and (p == len(a) - 1 or a[p + 1] < a[p])
                for a, p in zip(arrays, got)
            )
        )
wrong:
  - |
    def find_peaks(arrays):
        return [0 for nums in arrays]
  - |
    def find_peaks(arrays):
        return [len(nums) - 1 for nums in arrays]
  - |
    def find_peaks(arrays):
        result = []
        for nums in arrays:
            index = 0
            for i in range(1, len(nums)):
                if nums[i] > nums[i - 1]:
                    index = i
                    break
            result.append(index)
        return result
equivalent:
  - "if nums[mid] <= nums[mid + 1]:"   # why: no two neighbors are equal, so the <= and < tests agree at every step
---
::
