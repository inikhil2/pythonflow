---
title: Max Chunks To Make Sorted
tier: medium
order: 57
leetcode: 769
url: https://leetcode.com/problems/max-chunks-to-make-sorted/
companies: [Amazon, Google, Meta]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/02-stacks-and-queues]
---

You get a list arr that holds every whole number from 0 to n - 1 exactly once, in some order, where n is from 1 to 40000. Cut the list into one or more pieces that are next to each other, with no piece reordered in the list. Sort each piece on its own and put the pieces back in order. You want the final list to be sorted from smallest to largest. Return the largest number of pieces you can cut the list into so that this still works.

A cut after position i is allowed exactly when the values before it are the numbers 0 up to i, with nothing larger. That is the same as saying the largest value seen so far equals the current position.

::exercise
---
id: iv-medium-057
prompt: Write a function max_chunks(arr) that returns the most pieces the list can be cut into, so that sorting each piece and joining them gives a sorted list.
starter: |
  # write your code below
  def max_chunks(arr):
      pass
hints:
  - Walk the list and keep the largest value seen so far.
  - Each time that largest value equals the position you are on, you may cut there.
tests:
  - check: assert max_chunks([4, 3, 2, 1, 0]) == 1
  - check: assert max_chunks([1, 0, 2, 3, 4]) == 4
  - check: assert max_chunks([0]) == 1
  - check: assert max_chunks([2, 0, 1]) == 1
  - check: assert max_chunks([1, 2, 0, 3]) == 2
  - check: assert max_chunks([0, 2, 1, 3]) == 3
  - check: assert max_chunks([1, 0]) == 1
  - check: assert max_chunks([0, 1, 2, 3, 4, 5]) == 6
  - check: assert max_chunks([3, 2, 1, 0, 4]) == 2
big: assert max_chunks([v for r in range(203) for k, (off, ln) in enumerate([(0, 3), (3, 17), (20, 1), (21, 50), (71, 8), (79, 26), (105, 2), (107, 44), (151, 11), (162, 35)]) for v in (range(r * 197 + off + ln - 1, r * 197 + off - 1, -1) if k % 2 == 0 else [r * 197 + off + j for j in range(1, ln)] + [r * 197 + off])]) == 2030
solution: |
  def max_chunks(arr):
      chunks = 0
      top = -1
      for i, value in enumerate(arr):
          top = max(top, value)
          if top == i:
              chunks += 1
      return chunks
brute: |
  def max_chunks(arr):
      count = 0
      start = 0
      for end in range(len(arr)):
          piece = arr[start:end + 1]
          if sorted(piece) == list(range(start, end + 1)):
              count += 1
              start = end + 1
      return count
random:
  call: max_chunks
  gen: |
    def gen(rng, size):
        n = max(size, 1)
        arr = []
        start = 0
        while start < n:
            length = rng.randint(1, n - start)
            block = list(range(start, start + length))
            rng.shuffle(block)
            arr += block
            start += length
        return (arr,)
slow:
  - |
    def max_chunks(arr):
        count = 0
        for i in range(len(arr)):
            ok = True
            for k in range(i + 1):
                if arr[k] > i:
                    ok = False
            if ok:
                count += 1
        return count
  - |
    def max_chunks(arr):
        return sum(1 for i in range(len(arr)) if max(arr[:i + 1]) == i)
wrong:
  - |
    def max_chunks(arr):
        chunks = 0
        for i, value in enumerate(arr):
            if value == i:
                chunks += 1
        return chunks
  - |
    def max_chunks(arr):
        chunks = 0
        top = 0
        for value in arr:
            if value > top:
                top = value
                chunks += 1
        return chunks
  - |
    def max_chunks(arr):
        chunks = 0
        top = -1
        for i, value in enumerate(arr):
            top = max(top, value)
            if top == i + 1:
                chunks += 1
        return chunks
equivalent:
  - "top = -2"   # why: every value is at least 0, so the first max() call replaces the starting value either way
  - "top = -0"   # why: -0 is the same integer as 0, and every value is at least 0, so max() returns the same top
---
::
