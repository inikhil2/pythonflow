---
title: Next Permutation
tier: medium
order: 8
leetcode: 31
url: https://leetcode.com/problems/next-permutation/
companies: [Amazon, Google, Meta]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/01-two-pointers]
---

You get a list `nums` of n whole numbers, where 1 <= n <= 100 and each value is from 0 to 100. Every rearrangement of the values is a candidate. Order the candidates the way a dictionary orders words, comparing the first value, then the second, and so on. Return the candidate that comes right after `nums` in that order, as a list. If `nums` is already last, which is the arrangement sorted from largest to smallest, return the first one instead, which is sorted from smallest to largest. Equal values count as the same value, so [1, 1, 5] is followed by [1, 5, 1].

Work from the right. Find the last place where a value is smaller than the value after it. The value at that place has to change, so swap it with the smallest larger value to its right. Then the part after that place is in the wrong order, and sorting it gives the smallest arrangement from there.

::exercise
---
id: iv-medium-008
prompt: Write a function next_permutation(nums) that returns the next arrangement of nums in dictionary order, or the smallest arrangement if nums is the last one.
starter: |
  # write your code below
  def next_permutation(nums):
      pass
hints:
  - Scan from the right for the first position whose value is smaller than the value after it.
  - Once you have swapped, the values after that position are in descending order, so reversing them puts them in ascending order.
tests:
  - check: assert next_permutation([1, 2, 3]) == [1, 3, 2]
  - check: assert next_permutation([3, 2, 1]) == [1, 2, 3]
  - check: assert next_permutation([1, 1, 5]) == [1, 5, 1]
  - check: assert next_permutation([1]) == [1]
  - check: assert next_permutation([1, 2, 4, 3]) == [1, 3, 2, 4]
  - check: assert next_permutation([1, 3, 2]) == [2, 1, 3]
  - check: assert next_permutation([2, 2, 0, 4, 3, 1]) == [2, 2, 1, 0, 3, 4]
  - check: assert next_permutation([0, 0, 0]) == [0, 0, 0]
solution: |
  def next_permutation(nums):
      i = len(nums) - 2
      while i >= 0 and nums[i] >= nums[i + 1]:
          i -= 1
      if i >= 0:
          j = len(nums) - 1
          while nums[j] <= nums[i]:
              j -= 1
          nums[i], nums[j] = nums[j], nums[i]
      nums[i + 1:] = reversed(nums[i + 1:])
      return nums
slow:
  - |
    def next_permutation(nums):
        from itertools import permutations
        current = tuple(nums)
        first = None
        found = False
        for p in permutations(sorted(nums)):
            if first is None:
                first = p
            if found and p != current:
                return list(p)
            if p == current:
                found = True
        return list(first)
brute: |
  def next_permutation(nums):
      from itertools import permutations
      arrangements = sorted(set(permutations(nums)))
      index = arrangements.index(tuple(nums))
      return list(arrangements[(index + 1) % len(arrangements)])
# why: the input is 0 to 49 ascending, then 99 down to 50. The pivot is 49 at index 49, and its smallest larger value to the right is 50, which is last. After the swap the suffix is 99 down to 51, then 49, and sorting it gives 49, then 51 to 99, so the expected list is 0 to 48, 50, 49, 51 to 99. This value is worked out by hand, not from brute: brute would need 100! arrangements.
big: 'assert next_permutation(list(range(50)) + list(range(99, 49, -1))) == list(range(49)) + [50, 49] + list(range(51, 100))'
random:
  call: next_permutation
  gen: |
    def gen(rng, size):
        n = rng.randint(1, 6)
        return ([rng.randint(0, 3) for _ in range(n)],)
wrong:
  - |
    def next_permutation(nums):
        i = len(nums) - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
        if i >= 0:
            j = len(nums) - 1
            while nums[j] <= nums[i]:
                j -= 1
            nums[i], nums[j] = nums[j], nums[i]
        return nums
  - |
    def next_permutation(nums):
        i = len(nums) - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
        if i < 0:
            return nums
        j = len(nums) - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
        nums[i + 1:] = reversed(nums[i + 1:])
        return nums
  - |
    def next_permutation(nums):
        i = len(nums) - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
        if i >= 0:
            j = i + 1
            while nums[j] <= nums[i]:
                j += 1
            nums[i], nums[j] = nums[j], nums[i]
        nums[i + 1:] = reversed(nums[i + 1:])
        return nums
equivalent:
  - "while i >= -1 and nums[i] >= nums[i + 1]:"  # why: only differs when all values are equal, and then reversing leaves the list the same
---
::
