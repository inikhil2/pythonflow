---
title: Container With Most Water
tier: medium
order: 4
leetcode: 11
url: https://leetcode.com/problems/container-with-most-water/
companies: [Google, Amazon, Meta]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/01-two-pointers]
---

You get a list `heights` of n vertical bars, where 2 <= n <= 100000 and each height is a whole number from 0 to 10000. Bar i stands at position i. Choose two bars. Together with the ground between them they hold water, and the area they hold is the shorter bar's height times the distance between their positions. Return the largest area you can hold. Two bars can hold no water if one of them has height 0.

Checking every pair works, but it is slow on long lists. Start with the widest pair, at both ends, and move the shorter end inward. The wider pairs you skip can never beat what you already have.

::exercise
---
id: iv-medium-004
prompt: Write a function max_area(heights) that returns the largest area of water two bars can hold, as the shorter height times the distance between the bars.
starter: |
  # write your code below
  def max_area(heights):
      pass
hints:
  - Start with one bar at each end. The area is the smaller height times the distance between the bars.
  - Move the bar that is shorter, because the other bar still might pair with something taller.
tests:
  - check: assert max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 49
  - check: assert max_area([1, 1]) == 1
  - check: assert max_area([4, 3, 2, 1, 4]) == 16
  - check: assert max_area([1, 2, 1]) == 2
  - check: assert max_area([0, 0]) == 0
  - check: assert max_area([5, 0, 0, 5]) == 15
  - check: assert max_area([9, 1, 9]) == 18
big: 'assert max_area([(i * 7919) % 10001 for i in range(100000)]) == 993619842'
solution: |
  def max_area(heights):
      left, right = 0, len(heights) - 1
      best = 0
      while left < right:
          width = right - left
          best = max(best, min(heights[left], heights[right]) * width)
          if heights[left] < heights[right]:
              left += 1
          else:
              right -= 1
      return best
slow:
  - |
    def max_area(heights):
        best = 0
        for i in range(len(heights)):
            for j in range(i + 1, len(heights)):
                best = max(best, min(heights[i], heights[j]) * (j - i))
        return best
brute: |
  def max_area(heights):
      best = 0
      for i in range(len(heights)):
          for j in range(i + 1, len(heights)):
              best = max(best, min(heights[i], heights[j]) * (j - i))
      return best
random:
  call: max_area
  gen: |
    def gen(rng, size):
        return ([rng.randint(0, 12) for _ in range(max(size, 2) + 1)],)
wrong:
  - |
    def max_area(heights):
        return max(min(heights[i], heights[i + 1]) for i in range(len(heights) - 1))
  - |
    def max_area(heights):
        left, right = 0, len(heights) - 1
        best = 0
        while left < right:
            best = max(best, min(heights[left], heights[right]) * (right - left))
            if heights[left] > heights[right]:
                left += 1
            else:
                right -= 1
        return best
  - |
    def max_area(heights):
        left, right = 0, len(heights) - 1
        best = 0
        while left < right:
            best = max(best, min(heights[left], heights[right]) * (right - left + 1))
            if heights[left] < heights[right]:
                left += 1
            else:
                right -= 1
        return best
equivalent:
  - "if heights[left] <= heights[right]:"  # why: when the two bars are equal, moving either end leaves the best area unchanged, since the pairs skipped are no taller than the one already counted
  - "while left <= right:"  # why: when left equals right the width is 0, so the extra step adds a 0 that never beats best
  - "best = -1"  # why: n is at least 2, so the loop always runs and sets best to a value of at least 0 before it is returned
---
::
