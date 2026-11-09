---
title: Bus Routes
tier: hard
order: 53
leetcode: 815
url: https://leetcode.com/problems/bus-routes/
companies: [Amazon, Google, Microsoft]
topic: Hash Table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week10-algorithms/02-stacks-and-queues]
---

A city has bus routes. Each route is a loop that visits a list of stop numbers in order, and a bus on a route can take you to any stop on it. You start at a source stop and want to reach a target stop. Changing buses is allowed. There are up to 2000 routes, each with 1 to 20 stops, and stop numbers go from 0 to 10^6.

Return the fewest buses you must ride to get from the source to the target. If the two stops are the same, you ride no buses and the answer is 0. If the target cannot be reached, return -1. A route can be ridden more than once, but riding it again never helps.

::exercise
---
id: iv-hard-053
prompt: Write a function num_buses(routes, source, target) that returns the fewest buses needed to travel from source to target, where routes is a list of stop lists, or -1 if the target cannot be reached.
starter: |
  # write your code below
  def num_buses(routes, source, target):
      pass
hints:
  - Build a map from each stop to the routes that pass through it. Search by number of buses: from a stop you can board any route through it, and every stop on that route is one more bus away.
  - Once you have boarded a route, mark it used so you never scan it again. A stop seen earlier with fewer buses is never worse, so keep a set of stops already reached.
tests:
  - check: assert num_buses([[1, 4, 9], [4, 6], [9, 2]], 1, 2) == 2
  - check: assert num_buses([[1, 2]], 1, 1) == 0
  - check: assert num_buses([[1, 2], [3, 4]], 1, 4) == -1
  - check: assert num_buses([[5, 6, 7]], 5, 7) == 1
  - check: assert num_buses([[3, 4], [2, 3], [1, 2], [0, 1]], 0, 4) == 4
  - check: assert num_buses([[1, 1, 2], [2, 2, 3]], 1, 3) == 2
  - check: assert num_buses([[1, 2], [2, 3], [3, 4]], 1, 4) == 3
  - check: assert num_buses([[1, 5, 6], [1, 2, 3], [3, 9]], 1, 9) == 2
  - check: assert num_buses([], 1, 2) == -1
  - check: assert num_buses([[2, 3]], 1, 3) == -1
  - check: assert num_buses([[1, 2], [1, 2], [2, 1]], 2, 1) == 1
solution: |
  from collections import deque

  def num_buses(routes, source, target):
      if source == target:
          return 0
      stop_to_routes = {}
      for i, route in enumerate(routes):
          for stop in route:
              stop_to_routes.setdefault(stop, []).append(i)
      used_routes = set()
      reached = {source}
      queue = deque([(source, 0)])
      while queue:
          stop, buses = queue.popleft()
          for r in stop_to_routes.get(stop, []):
              if r in used_routes:
                  continue
              used_routes.add(r)
              for nxt in routes[r]:
                  if nxt == target:
                      return buses + 1
                  if nxt not in reached:
                      reached.add(nxt)
                      queue.append((nxt, buses + 1))
      return -1
slow:
  - |
    def num_buses(routes, source, target):
        if source == target:
            return 0
        best = {source: 0}
        changed = True
        while changed:
            changed = False
            for route in routes:
                reached = [best[s] for s in route if s in best]
                if not reached:
                    continue
                cost = min(reached) + 1
                for s in route:
                    if cost < best.get(s, cost + 1):
                        best[s] = cost
                        changed = True
        return best.get(target, -1)
brute: |
  def num_buses(routes, source, target):
      if source == target:
          return 0
      frontier = {source}
      visited = {source}
      used = set()
      buses = 0
      while frontier:
          buses += 1
          following = set()
          for i, route in enumerate(routes):
              if i in used or not frontier.intersection(route):
                  continue
              used.add(i)
              if target in route:
                  return buses
              following.update(route)
          following -= visited
          visited |= following
          frontier = following
      return -1
big: 'assert num_buses([[i, i + 1] for i in reversed(range(2000))], 0, 2000) == 2000'
random:
  call: num_buses
  gen: |
    def gen(rng, size):
        routes = [rng.sample(range(6), rng.randint(1, 4)) for _ in range(rng.randint(0, 4))]
        return (routes, rng.randint(0, 5), rng.randint(0, 5))
wrong:
  - |
    from collections import deque

    def num_buses(routes, source, target):
        if source == target:
            return 0
        stop_to_routes = {}
        for i, route in enumerate(routes):
            for stop in route:
                stop_to_routes.setdefault(stop, []).append(i)
        used_routes = set()
        reached = {source}
        queue = deque([(source, 0)])
        while queue:
            stop, buses = queue.popleft()
            for r in stop_to_routes.get(stop, []):
                if r in used_routes:
                    continue
                used_routes.add(r)
                for nxt in routes[r]:
                    if nxt == target:
                        return buses
                    if nxt not in reached:
                        reached.add(nxt)
                        queue.append((nxt, buses + 1))
        return -1
  - |
    from collections import deque

    def num_buses(routes, source, target):
        if source == target:
            return 0
        stop_to_routes = {}
        for i, route in enumerate(routes):
            for stop in route:
                stop_to_routes.setdefault(stop, []).append(i)
        used_routes = set()
        reached = {source}
        queue = deque([(source, 0)])
        while queue:
            stop, buses = queue.popleft()
            for r in stop_to_routes.get(stop, []):
                if r in used_routes:
                    continue
                used_routes.add(r)
                for nxt in routes[r]:
                    if nxt == target:
                        return buses + 1
                    if nxt not in reached:
                        reached.add(nxt)
                        queue.append((nxt, buses))
        return -1
  - |
    def num_buses(routes, source, target):
        for route in routes:
            if source in route and target in route:
                return 1
        return -1
---
::
