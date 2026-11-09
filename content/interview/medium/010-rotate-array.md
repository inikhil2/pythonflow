---
title: Rotate Array
tier: medium
order: 10
leetcode: 189
url: https://leetcode.com/problems/rotate-array/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/06-numbers]
---

You get a list `nums` of n whole numbers, where 1 <= n <= 200000 and each value is from -2147483648 to 2147483647, and a whole number `k`, where 0 <= k <= 200000. Rotate the list to the right by k places: each value moves k positions toward the end, and the values that run off the end come back in at the front. For example, rotating [1, 2, 3, 4] by 1 gives [4, 1, 2, 3]. If k is larger than n, the rotation repeats, so a k that is a multiple of n leaves the list unchanged. Return the rotated list.

Moving one place at a time works, but on a long list with a large k it does far too much work. Think about where each value ends up instead.

::exercise
---
id: iv-medium-010
prompt: Write a function rotate_array(nums, k) that returns nums rotated to the right by k places.
starter: |
  # write your code below
  def rotate_array(nums, k):
      pass
hints:
  - Only k modulo the length matters, so start by reducing k that way.
  - Reverse the whole list, then reverse the first k values and the rest separately. Slicing gives the same result but copies the list, so swap pairs inside the list instead.
tests:
  - check: assert rotate_array([1, 2, 3, 4, 5, 6, 7], 3) == [5, 6, 7, 1, 2, 3, 4]
  - check: assert rotate_array([-1, -100, 3, 99], 2) == [3, 99, -1, -100]
  - check: assert rotate_array([1], 5) == [1]
  - check: assert rotate_array([1, 2], 0) == [1, 2]
  - check: assert rotate_array([1, 2, 3], 3) == [1, 2, 3]
  - check: assert rotate_array([1, 2, 3], 4) == [3, 1, 2]
  - check: assert rotate_array([1, 2, 3, 4], 1) == [4, 1, 2, 3]
  - check: assert rotate_array([7, 7, 8], 2) == [7, 8, 7]
big: 'assert (lambda v: rotate_array(list(v), 200000) == [v[(i - 200000) % 199991] for i in range(199991)])([(i * 7919) % 100003 for i in range(199991)])'
solution: |
  def rotate_array(nums, k):
      n = len(nums)
      k %= n

      def reverse(lo, hi):
          while lo < hi:
              nums[lo], nums[hi] = nums[hi], nums[lo]
              lo += 1
              hi -= 1

      reverse(0, n - 1)
      reverse(0, k - 1)
      reverse(k, n - 1)
      return nums
slow:
  - |
    def rotate_array(nums, k):
        n = len(nums)
        for _ in range(k % n):
            last = nums[-1]
            for i in range(n - 1, 0, -1):
                nums[i] = nums[i - 1]
            nums[0] = last
        return nums
  - |
    def rotate_array(nums, k):
        for _ in range(k):
            nums.insert(0, nums.pop())
        return nums
brute: |
  def rotate_array(nums, k):
      nums = list(nums)
      for _ in range(k):
          nums = [nums[-1]] + nums[:-1]
      return nums
random:
  call: rotate_array
  gen: |
    def gen(rng, size):
        n = rng.randint(1, 8)
        return ([rng.randint(-20, 20) for _ in range(n)], rng.randint(0, 12))
wrong:
  - |
    def rotate_array(nums, k):
        k %= len(nums)
        return nums[k:] + nums[:k]
  - |
    def rotate_array(nums, k):
        if k == 0:
            return nums
        return nums[-k:] + nums[:-k]
  - |
    def rotate_array(nums, k):
        k %= len(nums)
        nums.reverse()
        nums[:k] = reversed(nums[:k])
        return nums
equivalent:
  - 6: "while lo <= hi:"   # why: when lo equals hi the swap writes that value onto itself, so the extra pass changes nothing
---
::
