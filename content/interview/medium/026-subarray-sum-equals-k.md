---
title: Subarray Sum Equals K
tier: medium
order: 26
leetcode: 560
url: https://leetcode.com/problems/subarray-sum-equals-k/
companies: [Amazon, Google, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list `nums` of 1 to 20000 whole numbers, each from -1000 to 1000, and a whole number `k` from -10000000 to 10000000. A subarray is a run of one or more numbers that stand next to each other in `nums`. Count how many subarrays have a sum equal to `k`. Two subarrays count as different when they start or end at different positions, even if they hold the same numbers.

For example, with nums = [1, 1, 1] and k = 2, there are two subarrays with sum 2: the first two numbers and the last two numbers.

Numbers can be negative, so a longer subarray is not always bigger. Think about the running total so far: a subarray sums to `k` exactly when the running total now is `k` more than some earlier running total.

::exercise
---
id: iv-medium-026
prompt: Write a function subarray_sum(nums, k) that returns how many subarrays of nums add up to k.
starter: |
  # write your code below
  def subarray_sum(nums, k):
      pass
hints:
  - Keep a count of how many times each running total has appeared, starting with the empty total 0 once.
  - At each number, add the count of earlier running totals equal to the current total minus k.
tests:
  - check: assert subarray_sum([1, 1, 1], 2) == 2
  - check: assert subarray_sum([1, 2, 3], 3) == 2
  - check: assert subarray_sum([1], 0) == 0
  - check: assert subarray_sum([0, 0, 0], 0) == 6
  - check: assert subarray_sum([1, -1, 0], 0) == 3
  - check: assert subarray_sum([-1, -1, 1], 0) == 1
  - check: assert subarray_sum([3, 4, 7, 2, -3, 1, 4, 2], 7) == 4
  - check: assert subarray_sum([5], 5) == 1
big: assert subarray_sum([(i * 7919) % 2001 - 1000 for i in range(20000)], 1234) == 18940
solution: |
  def subarray_sum(nums, k):
      seen = {0: 1}
      total = 0
      count = 0
      for x in nums:
          total += x
          count += seen.get(total - k, 0)
          seen[total] = seen.get(total, 0) + 1
      return count
brute: |
  def subarray_sum(nums, k):
      count = 0
      for i in range(len(nums)):
          for j in range(i, len(nums)):
              if sum(nums[i:j + 1]) == k:
                  count += 1
      return count
random:
  call: subarray_sum
  gen: |
    def gen(rng, size):
        nums = [rng.randint(-3, 3) for _ in range(rng.randint(1, size + 4))]
        return (nums, rng.randint(-3, 3))
wrong:
  - |
    def subarray_sum(nums, k):
        seen = {}
        total = 0
        count = 0
        for x in nums:
            total += x
            count += seen.get(total - k, 0)
            seen[total] = seen.get(total, 0) + 1
        return count
  - |
    def subarray_sum(nums, k):
        seen = {0: 1}
        total = 0
        count = 0
        for x in nums:
            total += x
            count += seen.get(total - k, 0)
            seen[total] = 1
        return count
  - |
    def subarray_sum(nums, k):
        count = 0
        left = 0
        total = 0
        for right in range(len(nums)):
            total += nums[right]
            while total > k and left <= right:
                total -= nums[left]
                left += 1
            if total == k:
                count += 1
        return count
slow:
  - |
    def subarray_sum(nums, k):
        count = 0
        for i in range(len(nums)):
            for j in range(i, len(nums)):
                if sum(nums[i:j + 1]) == k:
                    count += 1
        return count
---
::
