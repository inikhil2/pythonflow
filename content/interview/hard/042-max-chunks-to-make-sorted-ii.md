---
title: Max Chunks to Make Sorted II
tier: hard
order: 42
leetcode: 768
url: https://leetcode.com/problems/max-chunks-to-make-sorted-ii/
companies: [Google, Amazon, Microsoft]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/02-stacks-and-queues]
---

You are given a list of whole numbers. You cut it into pieces, sort each piece on its own, and put the pieces back in order. The result must be fully sorted. The list has between 1 and 2000 numbers, each from 0 to 10^8. Each cut must leave pieces that fit together: everything in an earlier piece must be no bigger than everything in a later piece.

Return the largest number of pieces you can make. A cut is allowed after position `i` exactly when every number before it is no bigger than every number after it. Counting those allowed cut points, the answer is one more than their number.

::exercise
---
id: iv-hard-042
prompt: Write a function max_chunks(arr) that returns the largest number of pieces the list can be cut into so that sorting each piece and joining them gives a sorted list.
starter: |
  # write your code below
  def max_chunks(arr):
      pass
hints:
  - A cut after position i is valid when the largest value on the left is no bigger than the smallest value on the right.
  - Keep the running maximum from the left and the running minimum from the right, or keep a stack of piece maxima as you go.
tests:
  - check: assert max_chunks([5, 4, 3, 2, 1]) == 1
  - check: assert max_chunks([1, 2, 3, 4, 5]) == 5
  - check: assert max_chunks([2, 1, 3, 4, 4]) == 4
  - check: assert max_chunks([1, 0, 2, 3, 4]) == 4
  - check: assert max_chunks([0]) == 1
  - check: assert max_chunks([1, 0]) == 1
  - check: assert max_chunks([0, 2, 1]) == 2
  - check: assert max_chunks([2, 0, 1]) == 1
  - check: assert max_chunks([3, 1, 2, 0]) == 1
  - check: assert max_chunks([1, 1, 1, 0, 2, 2]) == 3
  - check: assert max_chunks([7, 7, 7]) == 3
  - check: assert max_chunks([2, 3, 1, 4]) == 2
solution: |
  def max_chunks(arr):
      stack = []
      for x in arr:
          top = x
          while stack and stack[-1] > x:
              top = max(top, stack.pop())
          stack.append(top)
      return len(stack)
slow:
  - |
    def max_chunks(arr):
        n = len(arr)
        count = 0
        for i in range(n):
            left = arr[0]
            for j in range(1, i + 1):
                if arr[j] > left:
                    left = arr[j]
            ok = True
            for j in range(i + 1, n):
                if arr[j] < left:
                    ok = False
                    break
            if ok:
                count += 1
        return count
brute: |
  def max_chunks(arr):
      n = len(arr)
      best = 1
      for mask in range(1 << (n - 1)):
          cuts = [i + 1 for i in range(n - 1) if mask >> i & 1]
          bounds = [0] + cuts + [n]
          pieces = [sorted(arr[bounds[k]:bounds[k + 1]]) for k in range(len(bounds) - 1)]
          joined = [x for piece in pieces for x in piece]
          if joined == sorted(arr):
              best = max(best, len(pieces))
      return best
big: 'assert max_chunks([(i // 3) * 3 + (2 - i % 3) for i in range(2000)]) == 667'
random:
  call: max_chunks
  gen: |
    def gen(rng, size):
        n = rng.randint(1, min(size + 3, 7))
        return ([rng.randint(0, 5) for _ in range(n)],)
wrong:
  - |
    def max_chunks(arr):
        count = 0
        for i in range(len(arr)):
            if max(arr[:i + 1]) == i:
                count += 1
        return count
  - |
    def max_chunks(arr):
        target = sorted(arr)
        count = 0
        for i in range(len(arr)):
            if arr[i] == target[i]:
                count += 1
        return count
  - |
    def max_chunks(arr):
        count = 1
        for i in range(len(arr) - 1):
            if max(arr[:i + 1]) <= arr[i + 1]:
                count += 1
        return count
---
::
