---
title: Jump Game
tier: medium
order: 91
leetcode: 55
url: https://leetcode.com/problems/jump-game/
companies: [Amazon, Google, Microsoft]
topic: Dynamic programming
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/10-dynamic-programming]
---

You stand on the first index of a list `nums` of between 1 and 100000 whole numbers, each from 0 to 100000. `nums[i]` is the furthest you may jump forward from index `i`. A jump of 0 means you cannot move from that index.

Return `True` if you can reach the last index, and `False` otherwise. Jumps may be shorter than the maximum, so from index `i` you may land on any index from `i + 1` up to `i + nums[i]`.

::exercise
---
id: iv-medium-091
prompt: Write a function can_jump(nums) that returns True if starting at index 0 you can reach the last index, where nums[i] is the furthest you can jump forward from index i.
starter: |
  # write your code below
  def can_jump(nums):
      pass
hints:
  - Keep track of the furthest index you can reach so far. Walk forward while the current index is within that reach.
  - If the current index is ever beyond the furthest reach, you are stuck, so return False. Once the furthest reach passes the last index, return True.
tests:
  - check: assert can_jump([2, 3, 1, 1, 4]) == True
  - check: assert can_jump([3, 2, 1, 0, 4]) == False
  - check: assert can_jump([0]) == True
  - check: assert can_jump([0, 1]) == False
  - check: assert can_jump([1, 0]) == True
  - check: assert can_jump([2, 0, 0]) == True
  - check: assert can_jump([1, 0, 1, 0]) == False
  - check: assert can_jump([5, 0, 0, 0, 0, 0]) == True
big: assert can_jump([0 if i % 10 == 5 else 50000 + (i * 7919) % 50000 for i in range(100000)]) == True and can_jump([min(50000 + (i * 7919) % 50000, 99998 - i) for i in range(99998)] + [0, 5]) == False and can_jump([min(50000 + (i * 7919) % 50000, 50000 - i) for i in range(50000)] + [0] * 50000) == False and can_jump([1] * 100000) == True
solution: |
  def can_jump(nums):
      reach = 0
      for i, jump in enumerate(nums):
          if i > reach:
              return False
          reach = max(reach, i + jump)
      return True
brute: |
  def can_jump(nums):
      last = len(nums) - 1
      reachable = {0}
      frontier = [0]
      while frontier:
          i = frontier.pop()
          for j in range(i + 1, min(last, i + nums[i]) + 1):
              if j not in reachable:
                  reachable.add(j)
                  frontier.append(j)
      return last in reachable
slow:
  - |
    def can_jump(nums):
        good = [False] * len(nums)
        good[0] = True
        for i in range(len(nums)):
            if good[i]:
                for j in range(i + 1, min(len(nums), i + nums[i] + 1)):
                    good[j] = True
        return good[-1]
  - |
    def can_jump(nums):
        reach = [False] * len(nums)
        reach[0] = True
        for i in range(1, len(nums)):
            reach[i] = any(reach[j] and j + nums[j] >= i for j in range(i))
        return reach[-1]
  - |
    def can_jump(nums):
        good = [False] * len(nums)
        good[0] = True
        for i in range(len(nums)):
            if good[i]:
                end = min(len(nums), i + nums[i] + 1)
                good[i + 1:end] = [True] * (end - i - 1)
        return good[-1]
random:
  call: can_jump
  gen: |
    def gen(rng, size):
        return ([rng.randint(0, 3) for _ in range(max(size, 1))],)
wrong:
  - |
    def can_jump(nums):
        return nums[0] > 0 or len(nums) == 1
  - |
    def can_jump(nums):
        reach = 0
        for i, jump in enumerate(nums[:-1]):
            if i > reach:
                return False
            reach = max(reach, i + jump)
        return True
  - |
    def can_jump(nums):
        reach = 0
        for i, jump in enumerate(nums):
            if i > reach:
                return False
            reach = max(reach, jump)
        return True
---
::
