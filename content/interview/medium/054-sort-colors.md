---
title: Sort Colors
tier: medium
order: 54
leetcode: 75
url: https://leetcode.com/problems/sort-colors/
companies: [Amazon, Google, Microsoft]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/01-two-pointers]
---

You get a list of values, and every value is 0, 1 or 2. The list has between 1 and 20000 values. Sort the list so that all the 0s come first, then all the 1s, then all the 2s. Sort it in place, so the list you were given ends up sorted, and return it.

Keep three markers: everything before the first marker is a 0, everything after the last marker is a 2, and the value under the middle marker is looked at next. One pass over the list is enough.

::exercise
---
id: iv-medium-054
prompt: Write a function sort_colors(nums) that sorts a list containing only 0, 1 and 2 in place, and returns that same list.
starter: |
  # write your code below
  def sort_colors(nums):
      pass
hints:
  - Keep one marker for the next 0 slot at the front and one for the next 2 slot at the back, and return the very same list rather than a copy.
  - After you swap a 2 to the back, do not move the middle marker, because the value you swapped in still needs checking.
tests:
  - check: assert sort_colors([2, 0, 2, 1, 1, 0]) == [0, 0, 1, 1, 2, 2]
  - check: assert sort_colors([2, 0, 1]) == [0, 1, 2]
  - check: assert sort_colors([0]) == [0]
  - check: assert sort_colors([1]) == [1]
  - check: assert sort_colors([2, 2, 1, 1]) == [1, 1, 2, 2]
  - check: assert sort_colors([0, 1, 2, 0, 1, 2]) == [0, 0, 1, 1, 2, 2]
  - check: assert sort_colors([1, 0]) == [0, 1]
  - check: assert sort_colors([2, 1, 0, 0, 0]) == [0, 0, 0, 1, 2]
  - check: nums = [2, 0, 1]; sort_colors(nums); assert nums == [0, 1, 2]
big: assert sort_colors([2, 0, 1] * 6666 + [2, 0]) == [0] * 6667 + [1] * 6666 + [2] * 6667
solution: |
  def sort_colors(nums):
      low, mid, high = 0, 0, len(nums) - 1
      while mid <= high:
          if nums[mid] == 0:
              nums[low], nums[mid] = nums[mid], nums[low]
              low += 1
              mid += 1
          elif nums[mid] == 1:
              mid += 1
          else:
              nums[mid], nums[high] = nums[high], nums[mid]
              high -= 1
      return nums
brute: |
  def sort_colors(nums):
      counts = [nums.count(0), nums.count(1), nums.count(2)]
      nums[:] = [0] * counts[0] + [1] * counts[1] + [2] * counts[2]
      return nums
random:
  call: sort_colors
  gen: |
    def gen(rng, size):
        return ([rng.randint(0, 2) for _ in range(max(size, 1))],)
slow:
  - |
    def sort_colors(nums):
        for end in range(len(nums) - 1, 0, -1):
            for i in range(end):
                if nums[i] > nums[i + 1]:
                    nums[i], nums[i + 1] = nums[i + 1], nums[i]
        return nums
wrong:
  - |
    def sort_colors(nums):
        low, mid, high = 0, 0, len(nums) - 1
        while mid <= high:
            if nums[mid] == 0:
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:
                nums[mid], nums[high] = nums[high], nums[mid]
                mid += 1
                high -= 1
        return nums
  - |
    def sort_colors(nums):
        nums.sort()
  - |
    def sort_colors(nums):
        for i in range(len(nums) - 1):
            if nums[i] > nums[i + 1]:
                nums[i], nums[i + 1] = nums[i + 1], nums[i]
        return nums
---
::
