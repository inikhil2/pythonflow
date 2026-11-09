---
title: Minimum Initial Energy to Finish Tasks
tier: hard
order: 38
leetcode: 1665
url: https://leetcode.com/problems/minimum-initial-energy-to-finish-tasks/
companies: [Amazon, Google, Microsoft]
topic: Greedy
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/04-sorting-and-heaps]
---

You have a list of tasks, and each task is written as [actual, minimum]. To start a task you must have at least minimum energy left. Doing the task then uses up actual energy (actual is never more than minimum). For example, with the task [3, 5] you need 5 or more energy to start, and you are left with 3 less afterwards.

You may do the tasks in any order, but you must do all of them. Return the smallest starting energy that is enough to finish all the tasks.

There are between 1 and 100000 tasks, and 1 <= actual <= minimum <= 10000 for each. Trying every order is far too slow for more than a handful of tasks.

::exercise
---
id: iv-hard-038
prompt: Write a function minimum_effort(tasks) that returns the smallest starting energy that lets you finish every task in some order.
starter: |
  # write your code below
  def minimum_effort(tasks):
      pass
hints:
  - Look at minimum - actual: it is the energy that is left over as a safety margin after a task. Tasks with a bigger margin should go earlier.
  - Sort by that margin, then work out the answer from the last task backwards: need = max(need + actual, minimum) at each step.
tests:
  - check: assert minimum_effort([[1, 2], [2, 4], [4, 8]]) == 8
  - check: assert minimum_effort([[1, 3], [2, 4], [10, 11], [10, 12], [8, 9]]) == 32
  - check: assert minimum_effort([[1, 7], [2, 8], [3, 9], [4, 10], [5, 11], [6, 12]]) == 27
  - check: assert minimum_effort([[5, 5]]) == 5
  - check: assert minimum_effort([[1, 1], [1, 1], [1, 1]]) == 3
  - check: assert minimum_effort([[3, 10], [2, 2]]) == 10
  - check: assert minimum_effort([[1, 10], [9, 10]]) == 11
  - check: assert minimum_effort([[4, 9], [6, 7], [1, 8]]) == 12
  - check: assert minimum_effort([[2, 3], [2, 4], [2, 5], [2, 6]]) == 9
  - check: assert minimum_effort([[10000, 10000], [1, 10000]]) == 10001
  - check: assert minimum_effort([[3, 6], [3, 6], [3, 6], [3, 6]]) == 15
  - check: assert minimum_effort([[1, 9], [8, 9], [4, 6], [2, 3], [5, 8]]) == 21
solution: |
  def minimum_effort(tasks):
      need = 0
      for actual, minimum in sorted(tasks, key=lambda t: t[1] - t[0]):
          need = max(need + actual, minimum)
      return need
brute: |
  from itertools import permutations

  def minimum_effort(tasks):
      best = None
      for order in permutations(tasks):
          spent = 0
          need = 0
          for actual, minimum in order:
              need = max(need, spent + minimum)
              spent += actual
          if best is None or need < best:
              best = need
      return best
valid: |
  def valid(tasks):
      return 1 <= len(tasks) <= 100000 and all(1 <= a <= m <= 10000 for a, m in tasks)
random:
  call: minimum_effort
  gen: |
    def gen(rng, size):
        out = []
        for _ in range(rng.randint(1, min(size + 1, 7))):
            a = rng.randint(1, 6)
            out.append([a, rng.randint(a, 9)])
        return (out,)
big: 'assert minimum_effort([[1 + i * 37 % 50, 1 + i * 37 % 50 + 5000 + i * 7919 % 4900] if i < 98000 else [1, 1] for i in range(100000)]) == 2504000'
slow:
  - |
    def minimum_effort(tasks):
        left = list(tasks)
        order = []
        while left:
            pick = 0
            for i in range(1, len(left)):
                if left[i][1] - left[i][0] < left[pick][1] - left[pick][0]:
                    pick = i
            order.append(left.pop(pick))
        need = 0
        for actual, minimum in order:
            need = max(need + actual, minimum)
        return need
equivalent:
  - "need = -1"  # why: the first task gives max(need + actual, minimum), and minimum is never below actual, so a start of -1 gives the same value as 0
wrong:
  - |
    def minimum_effort(tasks):
        need = 0
        for actual, minimum in sorted(tasks, key=lambda t: t[1]):
            need = max(need + actual, minimum)
        return need
  - |
    def minimum_effort(tasks):
        need = 0
        for actual, minimum in sorted(tasks, key=lambda t: t[1] - t[0], reverse=True):
            need = max(need + actual, minimum)
        return need
  - |
    def minimum_effort(tasks):
        need = 0
        for actual, minimum in sorted(tasks, key=lambda t: t[1] - t[0]):
            need = max(need, minimum) + actual
        return need
  - |
    def minimum_effort(tasks):
        return max(sum(t[0] for t in tasks), max(t[1] for t in tasks))
---
::
