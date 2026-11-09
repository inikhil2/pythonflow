---
title: Subarray Product Less Than K
tier: medium
order: 67
leetcode: 713
url: https://leetcode.com/problems/subarray-product-less-than-k/
companies: [Google, Apple, Meta]
topic: Sliding window
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search]
---

You get a list of whole numbers from 1 to 1000, with between 1 and 20000 values. You also get a whole number k from 0 to 1000000. A subarray is a run of values that sit next to each other in the list. Count how many subarrays have a product of their values that is strictly less than k. Each subarray counts once for each place it appears, so two runs at different positions count separately.

Keep a window whose product is below k. When adding a value makes the product too big, divide out values from the left until it is below k again. Every subarray that ends at the current position and starts inside the window is valid, so the window length adds to the count.

::exercise
---
id: iv-medium-067
prompt: Write a function count_subarrays_below(nums, k) that returns how many contiguous subarrays have a product strictly less than k.
starter: |
  # write your code below
  def count_subarrays_below(nums, k):
      pass
hints:
  - Keep the running product of the window and divide out values from the left when it reaches k or more.
  - If k is 1 or less, no product can be below k, since every value is at least 1.
tests:
  - check: assert count_subarrays_below([10, 5, 2, 6], 100) == 8
  - check: assert count_subarrays_below([1, 2, 3], 0) == 0
  - check: assert count_subarrays_below([1], 2) == 1
  - check: assert count_subarrays_below([1], 1) == 0
  - check: assert count_subarrays_below([5], 5) == 0
  - check: assert count_subarrays_below([2, 2], 3) == 2
  - check: assert count_subarrays_below([1, 1, 1], 2) == 6
  - check: assert count_subarrays_below([1, 2, 3], 7) == 6
big: assert count_subarrays_below([(i * 7919) % 3 + 1 for i in range(20000)], 746496) == 439768
solution: |
  def count_subarrays_below(nums, k):
      if k <= 1:
          return 0
      count = 0
      product = 1
      left = 0
      for right, value in enumerate(nums):
          product *= value
          while product >= k:
              product //= nums[left]
              left += 1
          count += right - left + 1
      return count
brute: |
  def count_subarrays_below(nums, k):
      count = 0
      for start in range(len(nums)):
          product = 1
          for end in range(start, len(nums)):
              product *= nums[end]
              if product < k:
                  count += 1
      return count
random:
  call: count_subarrays_below
  gen: |
    def gen(rng, size):
        nums = [rng.randint(1, 4) for _ in range(max(size, 1))]
        return (nums, rng.randint(0, 20))
slow:
  - |
    def count_subarrays_below(nums, k):
        count = 0
        for start in range(len(nums)):
            product = 1
            for end in range(start, len(nums)):
                product *= nums[end]
                if product < k:
                    count += 1
        return count
wrong:
  - |
    def count_subarrays_below(nums, k):
        count = 0
        product = 1
        left = 0
        for right, value in enumerate(nums):
            product *= value
            while product > k:
                product //= nums[left]
                left += 1
            count += right - left + 1
        return count
  - |
    def count_subarrays_below(nums, k):
        count = 0
        for value in nums:
            if value < k:
                count += 1
        return count
  - |
    def count_subarrays_below(nums, k):
        if k <= 1:
            return 0
        count = 0
        product = 1
        left = 0
        for right, value in enumerate(nums):
            product *= value
            while product >= k:
                product //= nums[left]
                left += 1
            count += right - left
        return count
---
::
