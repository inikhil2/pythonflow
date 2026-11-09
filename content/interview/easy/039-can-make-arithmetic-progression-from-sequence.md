---
title: Can Make Arithmetic Progression From Sequence
tier: easy
order: 39
leetcode: 1502
url: https://leetcode.com/problems/can-make-arithmetic-progression-from-sequence/
companies: [Google, Amazon, Meta]
topic: Sorting
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list arr of whole numbers, which has at least two numbers, and each number is between -1000000 and 1000000. You may put the numbers in any order. An arithmetic progression is a list where the difference between each pair of neighbours is the same. Return True if some order of the numbers forms an arithmetic progression, and False otherwise.

::exercise
---
id: iv-easy-039
prompt: Write a function can_make_progression(arr) that returns True if arr can be rearranged into an arithmetic progression, and False otherwise.
starter: |
  # write your code below
  def can_make_progression(arr):
      pass
hints:
  - Sorting the numbers puts any progression in order.
  - After sorting, every step between two neighbours must be the same.
tests:
  - check: assert can_make_progression([3, 5, 1]) == True
  - check: assert can_make_progression([1, 2, 4]) == False
  - check: assert can_make_progression([1, 2]) == True
  - check: assert can_make_progression([5, 5, 5]) == True
  - check: assert can_make_progression([1, 1, 2]) == False
  - check: assert can_make_progression([-1, -5, -3]) == True
  - check: assert can_make_progression([1, 3, 5, 7, 2]) == False
solution: |
  def can_make_progression(arr):
      arr = sorted(arr)
      step = arr[1] - arr[0]
      return all(arr[i + 1] - arr[i] == step for i in range(len(arr) - 1))
brute: |
  def can_make_progression(arr):
      n = len(arr)
      for a in arr:
          for b in arr:
              d = b - a
              if sorted(a + i * d for i in range(n)) == sorted(arr):
                  return True
      return False
random:
  call: can_make_progression
  gen: |
    def gen(rng, size):
        n = rng.randint(2, size + 2)
        if rng.random() < 0.5:
            a, d = rng.randint(-5, 5), rng.randint(-3, 3)
            arr = [a + i * d for i in range(n)]
            rng.shuffle(arr)
        else:
            arr = [rng.randint(-5, 5) for _ in range(n)]
        return (arr,)
wrong:
  - |
    def can_make_progression(arr):
        return max(arr) - min(arr) == len(arr) - 1
  - |
    def can_make_progression(arr):
        step = arr[1] - arr[0]
        return all(arr[i + 1] - arr[i] == step for i in range(len(arr) - 1))
---
::
