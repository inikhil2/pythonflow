---
title: Trapping Rain Water
tier: hard
order: 67
leetcode: 42
url: https://leetcode.com/problems/trapping-rain-water/
companies: [Amazon, Google, Meta]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/01-two-pointers]
---

You get a list of whole numbers that are the heights of walls standing side by side, each one unit wide. After it rains, water collects in the gaps between walls: above a wall, the water level is as high as the lower of the tallest wall to its left and the tallest wall to its right (counting the wall itself on both sides), and the water above that wall is that level minus the wall's height.

Return the total amount of water, counted in square units, that is held above all the walls together. There are between 1 and 20000 heights, each from 0 to 100000, and adding up the best left and best right height again for every wall is too slow for the largest lists.

::exercise
---
id: iv-hard-067
prompt: Write a function trap(height) that returns how many square units of water the walls hold.
starter: |
  # write your code below
  def trap(height):
      pass
hints:
  - The water above one wall depends only on the tallest wall to its left and the tallest to its right, so try walking in from both ends.
  - Keep a left and a right position, and the best height seen from each side. Move the side whose current wall is shorter, since that side's best height is the limit there.
tests:
  - check: assert trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) == 6
  - check: assert trap([4, 2, 0, 3, 2, 5]) == 9
  - check: assert trap([1]) == 0
  - check: assert trap([0]) == 0
  - check: assert trap([3, 3, 3]) == 0
  - check: assert trap([2, 0, 2]) == 2
  - check: assert trap([1, 2, 3, 4]) == 0
  - check: assert trap([4, 3, 2, 1]) == 0
  - check: assert trap([5, 4, 1, 2]) == 1
  - check: assert trap([1, 2, 1]) == 0
  - check: assert trap([0, 5, 0]) == 0
  - check: assert trap([3, 0, 0, 2, 0, 4]) == 10
  - check: assert trap([2, 1, 2, 1, 2]) == 2
  - check: assert trap([0, 0, 0]) == 0
  - check: assert trap([5, 2, 3, 2, 5]) == 8
  - check: assert trap([1, 0, 0, 0, 1]) == 3
  - check: assert trap([4, 1, 1, 0, 2, 3]) == 8
  - check: assert trap([3, 1, 2, 5, 2, 4]) == 5
  - check: assert trap([2, 6, 3, 3, 1, 4, 1, 2]) == 6
  - check: assert trap([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 19
solution: |
  def trap(height):
      left, right = 0, len(height) - 1
      left_max = right_max = 0
      total = 0
      while left < right:
          if height[left] < height[right]:
              left_max = max(left_max, height[left])
              total += left_max - height[left]
              left += 1
          else:
              right_max = max(right_max, height[right])
              total += right_max - height[right]
              right -= 1
      return total
brute: |
  def trap(height):
      total = 0
      for i in range(len(height)):
          total += min(max(height[:i + 1]), max(height[i:])) - height[i]
      return total
valid: |
  def valid(height):
      return 1 <= len(height) <= 20000 and all(isinstance(h, int) and 0 <= h <= 100000 for h in height)
random:
  call: trap
  gen: |
    def gen(rng, size):
        top = rng.choice([2, 4, 7])
        return ([rng.randint(0, top) for _ in range(rng.randint(1, size + 4))],)
big: 'assert trap([(i * 7919 % 1000) * (1 if (i // 5000) % 2 else 3) % 100001 for i in range(20000)]) == 29922705'
slow:
  - |
    def trap(height):
        total = 0
        for i in range(len(height)):
            left = 0
            for j in range(i + 1):
                left = max(left, height[j])
            right = 0
            for j in range(i, len(height)):
                right = max(right, height[j])
            total += min(left, right) - height[i]
        return total
equivalent:
  - "left_max = right_max = -1"  # why: heights are never below 0, so the first max() with a height gives that height either way, and the first wall adds left_max - height = 0
  - "while left <= right:"  # why: the bar where the two pointers meet is a tallest bar, so its water is 0 and processing it adds nothing
  - "if height[left] <= height[right]:"  # why: when the two heights are equal either side can move first, since both sides are bounded by a bar at least that tall
wrong:
  - |
    def trap(height):
        total = 0
        left_max = 0
        for h in height:
            left_max = max(left_max, h)
            total += left_max - h
        return total
  - |
    def trap(height):
        left, right = 0, len(height) - 1
        left_max = right_max = 0
        total = 0
        while left < right:
            if height[left] > height[right]:
                left_max = max(left_max, height[left])
                total += left_max - height[left]
                left += 1
            else:
                right_max = max(right_max, height[right])
                total += right_max - height[right]
                right -= 1
        return total
  - |
    def trap(height):
        stack = []
        total = 0
        for i, h in enumerate(height):
            if stack and h > height[stack[-1]]:
                bottom = stack.pop()
                if stack:
                    total += (min(h, height[stack[-1]]) - height[bottom]) * (i - stack[-1] - 1)
            stack.append(i)
        return total
  - |
    def trap(height):
        total = 0
        for i in range(1, len(height)):
            if height[i] > height[i - 1]:
                total += height[i] - height[i - 1]
        return total
---
::
