---
title: Course Schedule II
tier: medium
order: 78
leetcode: 210
url: https://leetcode.com/problems/course-schedule-ii/
companies: [Amazon, Google, Netflix]
topic: Depth first search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/09-graphs]
---

You get a number `num_courses` and a list `prerequisites`. The courses are numbered from 0 to `num_courses - 1`, and `num_courses` is between 1 and 500. Each pair `[course, before]` in `prerequisites` means that course `before` must be finished before course `course` can be taken. There are at most 5000 pairs, and every number in them is a valid course number.

Return one order in which every course can be taken, so that each course comes after all of its prerequisites. If no such order exists, because the prerequisites contain a cycle, return an empty list. When several orders work, any of them is accepted.

::exercise
---
id: iv-medium-078
prompt: Write a function find_order(num_courses, prerequisites) that returns a valid order for taking every course, or an empty list if no valid order exists.
starter: |
  # write your code below
  def find_order(num_courses, prerequisites):
      pass
hints:
  - Count how many prerequisites each course still waits for, and start with the courses that wait for none.
  - When you finish a course, lower the count of every course that was waiting for it.
tests:
  - check: assert find_order(2, [[1, 0]]) == [0, 1]
  - check: assert find_order(2, [[1, 0], [0, 1]]) == []
  - check: assert find_order(1, []) == [0]
  - check: assert sorted(find_order(2, [])) == [0, 1]
  - check: assert sorted(find_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]])) == [0, 1, 2, 3]
  - check: assert find_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]])[0] == 0
  - check: assert find_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]])[-1] == 3
  - check: assert find_order(3, [[0, 1], [1, 2], [2, 0]]) == []
  - check: assert find_order(2, [[0, 0]]) == []
  - check: assert find_order(3, [[1, 2], [2, 1]]) == []
  - check: assert find_order(3, [[0, 1], [1, 2]]) == [2, 1, 0]
  - check: assert sorted(find_order(3, [[1, 2]])) == [0, 1, 2]
big: assert find_order(500, [[((i + 1) * 37) % 500, (i * 37) % 500] for i in range(499)] + [[((i + 2) * 37) % 500, (i * 37) % 500] for i in range(498)]) == [(i * 37) % 500 for i in range(500)] and find_order(500, [[((i + 1) * 37) % 500, (i * 37) % 500] for i in range(499)] + [[0, (499 * 37) % 500]]) == []
solution: |
  def find_order(num_courses, prerequisites):
      after = [[] for _ in range(num_courses)]
      needs = [0] * num_courses
      for course, before in prerequisites:
          after[before].append(course)
          needs[course] += 1
      ready = [c for c in range(num_courses) if needs[c] == 0]
      order = []
      while ready:
          c = ready.pop()
          order.append(c)
          for nxt in after[c]:
              needs[nxt] -= 1
              if needs[nxt] == 0:
                  ready.append(nxt)
      return order if len(order) == num_courses else []
brute: |
  def find_order(num_courses, prerequisites):
      done = []
      taken = set()
      while len(done) < num_courses:
          progress = False
          for c in range(num_courses):
              if c in taken:
                  continue
              if all(b in taken for a, b in prerequisites if a == c):
                  done.append(c)
                  taken.add(c)
                  progress = True
                  break
          if not progress:
              return []
      return done
slow:
  - |
    def find_order(num_courses, prerequisites):
        done = []
        taken = set()
        while len(done) < num_courses:
            progress = False
            for c in range(num_courses):
                if c in taken:
                    continue
                if all(b in taken for a, b in prerequisites if a == c):
                    done.append(c)
                    taken.add(c)
                    progress = True
                    break
            if not progress:
                return []
        return done
random:
  call: find_order
  gen: |
    def gen(rng, size):
        num = rng.randint(1, max(size, 1) + 3)
        prereqs = []
        for _ in range(rng.randint(0, 2 * num)):
            a, b = rng.randrange(num), rng.randrange(num)
            if rng.random() < 0.8 and a < b:
                a, b = b, a
            prereqs.append([a, b])
        return (num, prereqs)
  same: |
    def same(args, got, want):
        num, prereqs = args
        if want == []:
            return got == []
        if not isinstance(got, list) or sorted(got) != list(range(num)):
            return False
        position = {course: i for i, course in enumerate(got)}
        return all(position[a] > position[b] for a, b in prereqs)
wrong:
  - |
    def find_order(num_courses, prerequisites):
        after = [[] for _ in range(num_courses)]
        needs = [0] * num_courses
        for course, before in prerequisites:
            after[course].append(before)
            needs[before] += 1
        ready = [c for c in range(num_courses) if needs[c] == 0]
        order = []
        while ready:
            c = ready.pop()
            order.append(c)
            for nxt in after[c]:
                needs[nxt] -= 1
                if needs[nxt] == 0:
                    ready.append(nxt)
        return order if len(order) == num_courses else []
  - |
    def find_order(num_courses, prerequisites):
        after = [[] for _ in range(num_courses)]
        needs = [0] * num_courses
        for course, before in prerequisites:
            after[before].append(course)
            needs[course] += 1
        ready = [c for c in range(num_courses) if needs[c] == 0]
        order = []
        while ready:
            c = ready.pop()
            order.append(c)
            for nxt in after[c]:
                needs[nxt] -= 1
                if needs[nxt] == 0:
                    ready.append(nxt)
        return order
  - |
    def find_order(num_courses, prerequisites):
        waiting = [0] * num_courses
        for course, _ in prerequisites:
            waiting[course] += 1
        return sorted(range(num_courses), key=lambda c: waiting[c])
---
::
