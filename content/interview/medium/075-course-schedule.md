---
title: Course Schedule
tier: medium
order: 75
leetcode: 207
url: https://leetcode.com/problems/course-schedule/
companies: [Amazon, Google, Apple]
topic: Depth-first search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/09-graphs]
---

You get a number of courses, labelled from 0 up to one less than that number, and a list of prerequisite pairs. A pair [a, b] means course b must be finished before course a can be taken. There are between 1 and 20000 courses and between 0 and 20000 pairs. If there is no loop, the longest chain of prerequisites is at most 400 courses long. Return True if every course can be taken in some order, and False if the prerequisites form a loop somewhere. A course that is paired with itself is a loop.

Take courses that have no unfinished prerequisites first. Each time you finish one, its dependent courses lose one prerequisite. If you can take every course this way, there is no loop. Otherwise the leftover courses are stuck in a loop.

::exercise
---
id: iv-medium-075
prompt: Write a function can_finish(num_courses, prerequisites) that returns True if all courses can be taken, and False if the prerequisites contain a loop.
starter: |
  # write your code below
  def can_finish(num_courses, prerequisites):
      pass
hints:
  - Count how many unfinished prerequisites each course has. Start with the courses that have none.
  - When you take a course, reduce the count for every course that depends on it. Courses that reach zero are ready.
tests:
  - check: assert can_finish(2, [[1, 0]]) == True
  - check: assert can_finish(2, [[1, 0], [0, 1]]) == False
  - check: assert can_finish(1, []) == True
  - check: assert can_finish(3, [[0, 1], [1, 2], [2, 0]]) == False
  - check: assert can_finish(4, [[1, 0], [2, 1], [3, 2]]) == True
  - check: assert can_finish(3, []) == True
  - check: assert can_finish(2, [[0, 0]]) == False
  - check: assert can_finish(4, [[1, 0], [2, 0], [3, 1], [3, 2]]) == True
  - check: assert can_finish(3, [[0, 1], [1, 0]]) == False
big: assert can_finish(20000, [[i, (i - 1) // 2] for i in range(1, 20000)] + [[19999, 19998]]) == True and can_finish(20000, [[i, (i - 1) // 2] for i in range(1, 19990)] + [[19990, 19991], [19991, 19992], [19992, 19993], [19993, 19990]]) == False
solution: |
  def can_finish(num_courses, prerequisites):
      waiting = [0] * num_courses
      unlocks = [[] for _ in range(num_courses)]
      for a, b in prerequisites:
          waiting[a] += 1
          unlocks[b].append(a)
      ready = [c for c in range(num_courses) if waiting[c] == 0]
      taken = 0
      for c in ready:
          taken += 1
          for nxt in unlocks[c]:
              waiting[nxt] -= 1
              if waiting[nxt] == 0:
                  ready.append(nxt)
      return taken == num_courses
brute: |
  def can_finish(num_courses, prerequisites):
      needs = {c: [] for c in range(num_courses)}
      for a, b in prerequisites:
          needs[a].append(b)
      state = {}
      def visit(c):
          if state.get(c) == 1:
              return False
          if state.get(c) == 2:
              return True
          state[c] = 1
          for b in needs[c]:
              if not visit(b):
                  return False
          state[c] = 2
          return True
      return all(visit(c) for c in range(num_courses))
valid: |
  def valid(num_courses, prerequisites):
      if not 1 <= num_courses <= 20000 or len(prerequisites) > 20000:
          return False
      if any(not (0 <= a < num_courses and 0 <= b < num_courses) for a, b in prerequisites):
          return False
      waiting = [0] * num_courses
      unlocks = [[] for _ in range(num_courses)]
      for a, b in prerequisites:
          waiting[a] += 1
          unlocks[b].append(a)
      depth = [1] * num_courses
      ready = [c for c in range(num_courses) if waiting[c] == 0]
      for c in ready:
          for nxt in unlocks[c]:
              depth[nxt] = max(depth[nxt], depth[c] + 1)
              waiting[nxt] -= 1
              if waiting[nxt] == 0:
                  ready.append(nxt)
      if len(ready) < num_courses:
          return True
      return max(depth) <= 400
random:
  call: can_finish
  gen: |
    def gen(rng, size):
        n = rng.randint(1, 6)
        pairs = [[rng.randrange(n), rng.randrange(n)] for _ in range(rng.randint(0, 6))]
        return (n, pairs)
slow:
  - |
    def can_finish(num_courses, prerequisites):
        done = set()
        progress = True
        while progress and len(done) < num_courses:
            progress = False
            for c in range(num_courses):
                if c not in done and all(b in done for a, b in prerequisites if a == c):
                    done.add(c)
                    progress = True
        return len(done) == num_courses
# why: wrong #1 only looks for 2-cycles, so it returns True on the 3-cycle in fixed test 4 and fails by output, not by timeout
wrong:
  - |
    def can_finish(num_courses, prerequisites):
        return all([b, a] not in prerequisites for a, b in prerequisites)
  - |
    def can_finish(num_courses, prerequisites):
        return len(prerequisites) < num_courses
  - |
    def can_finish(num_courses, prerequisites):
        waiting = [0] * num_courses
        unlocks = [[] for _ in range(num_courses)]
        for a, b in prerequisites:
            waiting[a] += 1
            unlocks[b].append(a)
        ready = [c for c in range(num_courses) if waiting[c] == 0]
        taken = 0
        for c in ready:
            taken += 1
            for nxt in unlocks[c]:
                waiting[nxt] -= 1
                if waiting[nxt] == 0:
                    ready.append(nxt)
        return taken > 0
---
::
