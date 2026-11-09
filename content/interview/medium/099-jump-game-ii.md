---
title: Jump Game II
tier: medium
order: 99
leetcode: 45
url: https://leetcode.com/problems/jump-game-ii/
companies: [Amazon, Google, Meta]
topic: Dynamic programming
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/10-dynamic-programming]
---

You get a list `nums` of between 1 and 10000 whole numbers, each from 0 to 1000. `nums[i]` is the furthest you may jump forward from index `i`. From index `i` you may land on any index from `i + 1` up to `i + nums[i]`.

You start at index 0. You can always reach the last index, so an answer always exists.

Return the fewest jumps needed to reach the last index.

::exercise
---
id: iv-medium-099
prompt: Write a function jump(nums) that returns the fewest jumps needed to reach the last index from index 0. You can always reach the last index.
starter: |
  # write your code below
  def jump(nums):
      pass
hints:
  - Think of the jumps as layers. Layer one is every index you can reach in one jump, layer two is every index reachable from layer one, and so on.
  - Track the furthest index you can reach so far. When you reach the end of the current layer, count one more jump and start the next layer from that furthest point.
tests:
  - check: assert jump([2, 3, 1, 1, 4]) == 2
  - check: assert jump([2, 3, 0, 1, 4]) == 2
  - check: assert jump([0]) == 0
  - check: assert jump([1]) == 0
  - check: assert jump([1, 2]) == 1
  - check: assert jump([1, 2, 3]) == 2
  - check: assert jump([1, 1, 1, 1]) == 3
  - check: assert jump([5, 1, 1, 1, 1, 1]) == 1
big: assert jump([2 + (i * 7919) % 39 if i % 97 != 50 else 0 for i in range(9999)] + [0]) == 262 and jump([1] * 9999) == 9998
solution: |
  def jump(nums):
      jumps = 0
      reach = 0
      far = 0
      for i in range(len(nums) - 1):
          far = max(far, i + nums[i])
          if i == reach:
              jumps += 1
              reach = far
      return jumps
brute: |
  def jump(nums):
      n = len(nums)
      def go(i):
          if i == n - 1:
              return 0
          return min([go(j) + 1 for j in range(i + 1, min(n - 1, i + nums[i]) + 1)] + [10 ** 9])
      return go(0)
slow:
  - |
    def jump(nums):
        n = len(nums)
        best = [0] * n
        for t in range(1, n):
            options = [best[i] + 1 for i in range(t) if i + nums[i] >= t]
            best[t] = min(options)
        return best[n - 1]
random:
  call: jump
  gen: |
    def gen(rng, size):
        n = min(max(size, 1), 8)
        while True:
            nums = [rng.randint(0, 3) for _ in range(n)]
            far = 0
            for i in range(n):
                if i > far:
                    break
                far = max(far, i + nums[i])
            if far >= n - 1:
                return (nums,)
wrong:
  - |
    def jump(nums):
        return sum(1 for x in nums[:-1] if x > 0)
  - |
    def jump(nums):
        jumps = 0
        reach = 0
        far = 0
        for i in range(len(nums)):
            far = max(far, i + nums[i])
            if i == reach:
                jumps += 1
                reach = far
        return jumps
  - |
    def jump(nums):
        jumps = 0
        reach = 0
        far = 0
        for i in range(len(nums) - 1):
            far = max(far, i + nums[i])
            if i > reach:
                jumps += 1
                reach = far
        return jumps
equivalent:
  - "far = 1"  # why: with more than one index the last index is reachable, so nums[0] is at least 1 and the first step sets far to nums[0] whatever the starting value
  - "far = -1"  # why: same as far = 1, the first step's max(far, nums[0]) is nums[0] for any valid input
---
::
