---
title: Longest Consecutive Sequence
tier: medium
order: 72
leetcode: 128
url: https://leetcode.com/problems/longest-consecutive-sequence/
companies: [Google, Amazon, Microsoft]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week8-objects/01-classes, /learn/week10-algorithms/09-graphs]
---

You get a list of whole numbers, with between 0 and 20000 values, each from -1000000000 to 1000000000. The values may come in any order and may repeat. Find the length of the longest run of numbers that go up by one, such as 4, 5, 6, 7, where every number in the run appears in the list. Repeated values count once. An empty list gives 0.

Put every value in a set so each lookup takes one step. A run can only start at a value whose number one less is missing from the set. From each start, count upward while the next number is present. Starting only at run beginnings keeps the total work close to the length of the list.

::exercise
---
id: iv-medium-072
prompt: Write a function longest_consecutive(nums) that returns the length of the longest run of consecutive whole numbers that all appear in the list.
starter: |
  # write your code below
  def longest_consecutive(nums):
      pass
hints:
  - Put the values in a set so you can check whether a number is present in one step.
  - Only start counting at a value whose number minus one is not in the set.
tests:
  - check: assert longest_consecutive([100, 4, 200, 1, 3, 2]) == 4
  - check: assert longest_consecutive([]) == 0
  - check: assert longest_consecutive([0]) == 1
  - check: assert longest_consecutive([1, 2, 0, 1]) == 3
  - check: assert longest_consecutive([9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]) == 7
  - check: assert longest_consecutive([5, 5, 5]) == 1
  - check: assert longest_consecutive([-3, -2, -1, 5, 6]) == 3
  - check: assert longest_consecutive([10, 20, 30]) == 1
big: assert longest_consecutive(list(range(20000))) == 20000
solution: |
  def longest_consecutive(nums):
      values = set(nums)
      best = 0
      for x in values:
          if x - 1 not in values:
              length = 1
              while x + length in values:
                  length += 1
              best = max(best, length)
      return best
brute: |
  def longest_consecutive(nums):
      ordered = sorted(set(nums))
      best = 0
      run = 0
      previous = None
      for v in ordered:
          run = run + 1 if previous is not None and v == previous + 1 else 1
          best = max(best, run)
          previous = v
      return best
random:
  call: longest_consecutive
  gen: |
    def gen(rng, size):
        return ([rng.randint(-6, 6) for _ in range(size)],)
slow:
  - |
    def longest_consecutive(nums):
        best = 0
        for x in nums:
            length = 1
            while x + length in nums:
                length += 1
            best = max(best, length)
        return best if nums else 0
wrong:
  - |
    def longest_consecutive(nums):
        return len(set(nums))
  - |
    def longest_consecutive(nums):
        best = 0
        run = 0
        previous = None
        for v in nums:
            run = run + 1 if previous is not None and v == previous + 1 else 1
            best = max(best, run)
            previous = v
        return best
  - |
    def longest_consecutive(nums):
        values = set(nums)
        best = 0
        for x in values:
            if x - 1 not in values and x > 0:
                length = 1
                while x + length in values:
                    length += 1
                best = max(best, length)
        return best
equivalent:
  - "length = 0"   # why: x always comes from the set, so the first check x + 0 in values is true and length becomes 1 before the loop runs, the same as starting at 1
---
::
