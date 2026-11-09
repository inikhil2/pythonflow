---
title: Largest Rectangle in Histogram
tier: hard
order: 1
leetcode: 84
url: https://leetcode.com/problems/largest-rectangle-in-histogram/
companies: [Google, Amazon, Microsoft]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/02-stacks-and-queues]
---

You get a list of bar heights. Every bar is one unit wide, and the bars stand side by side in list order. Find the largest rectangle that fits inside the bars, where the rectangle is made of consecutive bars and its height is the shortest of those bars. Return its area as a whole number.

Each height is a whole number from 0 to 10000, and the list has between 1 and 20000 bars. A bar of height 0 adds no area. Checking every run of consecutive bars works, but it is too slow at the largest size. A stack that remembers bars still waiting for their right edge gets the same answer in one pass.

::exercise
---
id: iv-hard-001
prompt: Write a function largest_rectangle_area(heights) that returns the area of the largest rectangle made of consecutive bars.
starter: |
  # write your code below
  def largest_rectangle_area(heights):
      pass
hints:
  - For each bar, find how far left and right it can stretch while staying at least as tall as itself.
  - A stack of bars still waiting for their right edge lets you finish a bar the moment a shorter bar arrives.
tests:
  - check: assert largest_rectangle_area([2, 1, 5, 6, 2, 3]) == 10
  - check: assert largest_rectangle_area([2, 4]) == 4
  - check: assert largest_rectangle_area([5]) == 5
  - check: assert largest_rectangle_area([0]) == 0
  - check: assert largest_rectangle_area([0, 0, 0]) == 0
  - check: assert largest_rectangle_area([1, 2, 3]) == 4
  - check: assert largest_rectangle_area([5, 4, 3, 2, 1]) == 9
  - check: assert largest_rectangle_area([2, 1, 2]) == 3
  - check: assert largest_rectangle_area([4, 4, 4, 4]) == 16
solution: |
  def largest_rectangle_area(heights):
      stack = []
      best = 0
      for i, h in enumerate(heights + [0]):
          start = i
          while stack and stack[-1][1] >= h:
              idx, top = stack.pop()
              best = max(best, top * (i - idx))
              start = idx
          stack.append((start, h))
      return best
brute: |
  def largest_rectangle_area(heights):
      best = 0
      n = len(heights)
      for i in range(n):
          for j in range(i, n):
              low = min(heights[i:j + 1])
              best = max(best, low * (j - i + 1))
      return best
random:
  call: largest_rectangle_area
  gen: |
    def gen(rng, size):
        n = rng.randint(1, size + 1)
        return ([rng.randint(0, 6) for _ in range(n)],)
# why: the seeded random heights catch wrong answers; the sorted ramp only exists to make the O(n²) slow expand far enough to fail
big: assert largest_rectangle_area((rng := __import__("random").Random(1)) and [rng.randint(0, 10000) for _ in range(19000)] + [rng.randint(9000, 10000) for _ in range(1000)]) == 9000000 and largest_rectangle_area([10000 - i // 2 for i in range(20000)]) == 50010000
slow:
  - |
    def largest_rectangle_area(heights):
        best = 0
        n = len(heights)
        for i in range(n):
            left = i
            while left > 0 and heights[left - 1] >= heights[i]:
                left -= 1
            right = i
            while right < n - 1 and heights[right + 1] >= heights[i]:
                right += 1
            best = max(best, heights[i] * (right - left + 1))
        return best
equivalent:
  - "while stack and stack[-1][1] > h:"  # why: with a strict test, bars of equal height stay on the stack and are popped together later; each one still gets a valid rectangle, and the largest is still found
  - "best = -1"  # why: the sentinel 0 at the end of heights always pops at least one bar, and each pop sets best to a value of 0 or more, so the starting value never matters
  - "for i, h in enumerate(heights + [1]):"  # why: the sentinel only has to pop every bar taller than 0; a sentinel of 1 does that, and bars of height 0 add 0 area either way
  - "for i, h in enumerate(heights + [-1]):"  # why: a sentinel of -1 pops every bar, and a bar of height 0 adds 0 area, so the answer is the same as with 0
wrong:
  - |
    def largest_rectangle_area(heights):
        stack = []
        best = 0
        for i, h in enumerate(heights + [0]):
            while stack and stack[-1][1] >= h:
                idx, top = stack.pop()
                best = max(best, top * (i - idx))
            stack.append((i, h))
        return best
  - |
    def largest_rectangle_area(heights):
        best = 0
        for i in range(len(heights)):
            width = 0
            for j in range(i, len(heights)):
                if heights[j] < heights[i]:
                    break
                width += 1
            best = max(best, heights[i] * width)
        return best
  - |
    def largest_rectangle_area(heights):
        stack = []
        best = 0
        for i, h in enumerate(heights):
            start = i
            while stack and stack[-1][1] >= h:
                idx, top = stack.pop()
                best = max(best, top * (i - idx))
                start = idx
            stack.append((start, h))
        return best
---
::
