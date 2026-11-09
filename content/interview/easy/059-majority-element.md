---
title: Majority Element
tier: easy
order: 59
leetcode: 169
url: https://leetcode.com/problems/majority-element/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list nums of 1 to 70000 whole numbers, each between -1000000000 and 1000000000. One value appears more than half the time: it appears more than the length of nums divided by 2. Return that value.

::exercise
---
id: iv-easy-059
prompt: Write a function majority_element(nums) that returns the value that appears more than half the time in nums.
starter: |
  # write your code below
  def majority_element(nums):
      pass
hints:
  - Keep one candidate and a count. A value equal to the candidate adds one to the count, and any other value takes one away.
  - When the count drops to zero, the next value becomes the new candidate.
tests:
  - check: assert majority_element([3, 2, 3]) == 3
  - check: assert majority_element([2, 2, 1, 1, 1, 2, 2]) == 2
  - check: assert majority_element([1]) == 1
  - check: assert majority_element([6, 5, 5]) == 5
  - check: assert majority_element([-1, -1, -2]) == -1
  - check: assert majority_element([4, 4, 4, 4, 1, 2]) == 4
big: assert majority_element([(i * 7919) % 10007 + 2 for i in range(34999)] + [1] * 35001) == 1
solution: |
  def majority_element(nums):
      candidate = None
      count = 0
      for x in nums:
          if count == 0:
              candidate = x
          count += 1 if x == candidate else -1
      return candidate
brute: |
  def majority_element(nums):
      return sorted(nums)[len(nums) // 2]
random:
  call: majority_element
  gen: |
    def gen(rng, size):
        n = rng.randint(1, size + 4)
        v = rng.randint(-3, 3)
        nums = [v] * (n // 2 + 1) + [rng.randint(-3, 3) for _ in range(n - (n // 2 + 1))]
        rng.shuffle(nums)
        return (nums,)
slow:
  - |
    def majority_element(nums):
        best, best_count = None, 0
        for x in nums:
            count = 0
            for y in nums:
                if y == x:
                    count += 1
            if count > best_count:
                best, best_count = x, count
        return best
  - |
    def majority_element(nums):
        for x in nums:
            if nums.count(x) > len(nums) // 2:
                return x
wrong:
  - |
    def majority_element(nums):
        return nums[0]
  - |
    def majority_element(nums):
        return sorted(nums)[0]
equivalent:
  - "count -= 1 if x == candidate else -1"  # why: same as the line below, the counter is only compared with 0 and this just flips its sign, so the candidate changes at the same points
  - "count += 1 if x != candidate else -1"  # why: the counter is only compared with 0, and flipping its sign on every step keeps zero in the same places, so the candidate changes at the same points and the answer is identical
---
::
