---
title: Task Scheduler
tier: medium
order: 55
leetcode: 621
url: https://leetcode.com/problems/task-scheduler/
companies: [Amazon, Google, Apple]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week10-algorithms/04-sorting-and-heaps]
---

You get a list of tasks, where each task is a single capital letter from A to Z. The list has between 1 and 10000 tasks. Each task takes one time unit. The number n is a whole number from 0 to 100. Exactly n time units must pass between two runs of the same kind of task: if a task runs at time t, its next run can start no earlier than time t + n + 1. Units between runs can be used by other tasks or left idle. Return the fewest time units needed to run every task. If n is 0, the same task may run back to back.

Count how many times each task appears. The task that appears most often sets a minimum: it needs its runs spread out with gaps between them. Other tasks can fill those gaps, so the answer is the larger of the list length and that minimum.

::exercise
---
id: iv-medium-055
prompt: Write a function least_interval(tasks, n) that returns the fewest time units needed to run all the tasks, given that the same task needs n units between runs.
starter: |
  # write your code below
  def least_interval(tasks, n):
      pass
hints:
  - Count how many times each task appears, and find the largest count.
  - The most frequent tasks each need a full block of n + 1 slots, except the last one, and the tasks that tie for the most also share the last block.
tests:
  - check: assert least_interval(["A", "A", "A", "B", "B", "B"], 2) == 8
  - check: assert least_interval(["A", "A", "A", "B", "B", "B"], 0) == 6
  - check: assert least_interval(["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], 2) == 16
  - check: assert least_interval(["A"], 5) == 1
  - check: assert least_interval(["A", "B"], 3) == 2
  - check: assert least_interval(["A", "A"], 2) == 4
  - check: assert least_interval(["A", "A", "B", "B", "C", "C"], 2) == 6
  - check: assert least_interval(["A", "A", "A", "B", "C"], 3) == 9
big: assert least_interval([chr(65 + (i * 7) % 26) for i in range(10000)], 100) == 38800
solution: |
  def least_interval(tasks, n):
      counts = {}
      for t in tasks:
          counts[t] = counts.get(t, 0) + 1
      most = max(counts.values())
      tied = 0
      for c in counts.values():
          if c == most:
              tied += 1
      return max(len(tasks), (most - 1) * (n + 1) + tied)
brute: |
  def least_interval(tasks, n):
      remaining = {}
      for t in tasks:
          remaining[t] = remaining.get(t, 0) + 1
      ready_at = {}
      for t in remaining:
          ready_at[t] = 0
      time = 0
      done = 0
      while done < len(tasks):
          best = None
          for t in sorted(remaining):
              if remaining[t] > 0 and ready_at[t] <= time:
                  if best is None or remaining[t] > remaining[best]:
                      best = t
          if best is not None:
              remaining[best] -= 1
              ready_at[best] = time + n + 1
              done += 1
          time += 1
      return time
random:
  call: least_interval
  gen: |
    def gen(rng, size):
        tasks = [rng.choice("ABCD") for _ in range(max(size, 1))]
        return (tasks, rng.randint(0, 4))
slow:
  - |
    def least_interval(tasks, n):
        remaining = {}
        for t in tasks:
            remaining[t] = remaining.get(t, 0) + 1
        ready_at = {}
        for t in remaining:
            ready_at[t] = 0
        time = 0
        done = 0
        while done < len(tasks):
            best = None
            for t in sorted(remaining):
                if remaining[t] > 0 and ready_at[t] <= time:
                    if best is None or remaining[t] > remaining[best]:
                        best = t
            if best is not None:
                remaining[best] -= 1
                ready_at[best] = time + n + 1
                done += 1
            time += 1
        return time
wrong:
  - |
    def least_interval(tasks, n):
        return len(tasks)
  - |
    def least_interval(tasks, n):
        counts = {}
        for t in tasks:
            counts[t] = counts.get(t, 0) + 1
        most = max(counts.values())
        return max(len(tasks), (most - 1) * (n + 1) + 1)
  - |
    def least_interval(tasks, n):
        counts = {}
        for t in tasks:
            counts[t] = counts.get(t, 0) + 1
        most = max(counts.values())
        return max(len(tasks), most * (n + 1))
---
::
