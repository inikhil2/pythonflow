---
title: Critical Connections in a Network
tier: hard
order: 62
leetcode: 1192
url: https://leetcode.com/problems/critical-connections-in-a-network/
companies: [Google, Amazon, Meta]
topic: Graph
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/09-graphs]
---

You get a network of n servers, numbered from 0 up to n minus 1, where n is between 2 and 300. You also get a list of connections, each a pair [a, b] that joins two different servers. Each pair of servers is joined by at most one connection, and the whole network is connected, so every server can reach every other. The list has at least n minus 1 connections and at most 1000.

A critical connection is one that, if removed, leaves some pair of servers with no path between them. Return every critical connection, each as a pair [a, b] with a smaller than b. You may return the pairs in any order.

One way to find them is to remove each connection in turn and test whether the network is still connected. That works, but it repeats the search for every connection. A single depth-first walk can find them all: a connection is critical when the subtree below it has no link back to a server above it.

::exercise
---
id: iv-hard-062
prompt: Write a function critical_connections(n, connections) that returns every connection whose removal disconnects the network, each as [a, b] with a less than b, in any order.
starter: |
  # write your code below
  def critical_connections(n, connections):
      pass
hints:
  - Walk from server 0, numbering servers in the order you first reach them, and track the lowest number each server can reach by going down and then one back edge.
  - A link from a server to a child is critical when the child cannot reach any server numbered at or before the parent.
tests:
  - check: assert sorted(critical_connections(4, [[0, 1], [1, 2], [2, 0], [1, 3]])) == [[1, 3]]
  - check: assert sorted(critical_connections(2, [[0, 1]])) == [[0, 1]]
  - check: assert sorted(critical_connections(3, [[0, 1], [1, 2]])) == [[0, 1], [1, 2]]
  - check: assert sorted(critical_connections(3, [[0, 1], [1, 2], [2, 0]])) == []
  - check: assert sorted(critical_connections(5, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 2]])) == [[0, 1], [1, 2]]
  - check: assert sorted(critical_connections(6, [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4], [4, 5], [5, 3]])) == [[2, 3]]
  - check: assert sorted(critical_connections(4, [[0, 1], [0, 2], [0, 3]])) == [[0, 1], [0, 2], [0, 3]]
  - check: assert sorted(critical_connections(7, [[0, 1], [1, 2], [2, 0], [0, 3], [3, 4], [4, 5], [5, 6], [6, 3]])) == [[0, 3]]
  - check: assert sorted(critical_connections(4, [[1, 0], [3, 2], [2, 1], [0, 2]])) == [[2, 3]]
  - check: assert sorted(critical_connections(5, [[4, 0], [0, 1], [1, 2], [2, 0], [2, 3]])) == [[0, 4], [2, 3]]
  - check: assert sorted(critical_connections(6, [[2, 4], [1, 3], [3, 4], [0, 4], [0, 2], [1, 4], [0, 1], [3, 5]])) == [[3, 5]]
big: assert sorted(critical_connections(300, [[10 * b + i, 10 * b + (i + k) % 10] for b in range(30) for i in range(10) for k in (1, 2, 3)] + [[10 * b, 10 * b + 5] for b in range(30)] + [[10 * b + 2, 10 * b + 7] for b in range(30)] + [[10 * b + 9, 10 * b + 10] for b in range(29)])) == [[10 * b + 9, 10 * b + 10] for b in range(29)]
solution: |
  def critical_connections(n, connections):
      graph = [[] for _ in range(n)]
      for a, b in connections:
          graph[a].append(b)
          graph[b].append(a)
      disc = [-1] * n
      low = [0] * n
      bridges = []
      timer = [0]
      def dfs(u, parent):
          disc[u] = low[u] = timer[0]
          timer[0] += 1
          for v in graph[u]:
              if v == parent:
                  continue
              if disc[v] == -1:
                  dfs(v, u)
                  low[u] = min(low[u], low[v])
                  if low[v] > disc[u]:
                      bridges.append([min(u, v), max(u, v)])
              else:
                  low[u] = min(low[u], disc[v])
      dfs(0, -1)
      return bridges
brute: |
  def critical_connections(n, connections):
      def connected(skip):
          seen = {0}
          stack = [0]
          while stack:
              u = stack.pop()
              for a, b in connections:
                  if (a, b) == skip or (b, a) == skip:
                      continue
                  for x, y in ((a, b), (b, a)):
                      if x == u and y not in seen:
                          seen.add(y)
                          stack.append(y)
          return len(seen) == n
      return [sorted(pair) for pair in connections if not connected(tuple(pair))]
random:
  call: critical_connections
  gen: |
    def gen(rng, size):
        n = rng.randint(2, min(max(size, 2), 8))
        edges = set()
        for v in range(1, n):
            u = rng.randrange(v)
            edges.add((u, v))
        for _ in range(rng.randint(0, 4)):
            a, b = rng.sample(range(n), 2)
            if (a, b) not in edges and (b, a) not in edges:
                edges.add((a, b))
        connections = [list(e) for e in edges]
        rng.shuffle(connections)
        return (n, connections)
  same: |
    def same(args, got, want):
        return sorted(sorted(p) for p in got) == sorted(sorted(p) for p in want)
slow:
  - |
    def critical_connections(n, connections):
        def connected(skip):
            seen = {0}
            stack = [0]
            while stack:
                u = stack.pop()
                for a, b in connections:
                    if (a, b) == skip or (b, a) == skip:
                        continue
                    for x, y in ((a, b), (b, a)):
                        if x == u and y not in seen:
                            seen.add(y)
                            stack.append(y)
            return len(seen) == n
        return [sorted(pair) for pair in connections if not connected(tuple(pair))]
wrong:
  - |
    def critical_connections(n, connections):
        graph = [[] for _ in range(n)]
        for a, b in connections:
            graph[a].append(b)
            graph[b].append(a)
        disc = [-1] * n
        low = [0] * n
        bridges = []
        timer = [0]
        def dfs(u, parent):
            disc[u] = low[u] = timer[0]
            timer[0] += 1
            for v in graph[u]:
                if v == parent:
                    continue
                if disc[v] == -1:
                    dfs(v, u)
                    low[u] = min(low[u], low[v])
                    if low[v] >= disc[u]:
                        bridges.append([min(u, v), max(u, v)])
                else:
                    low[u] = min(low[u], disc[v])
        dfs(0, -1)
        return bridges
  - |
    def critical_connections(n, connections):
        graph = [[] for _ in range(n)]
        for a, b in connections:
            graph[a].append(b)
            graph[b].append(a)
        disc = [-1] * n
        low = [0] * n
        bridges = []
        timer = [0]
        def dfs(u, parent):
            disc[u] = low[u] = timer[0]
            timer[0] += 1
            for v in graph[u]:
                if v == parent:
                    continue
                if disc[v] == -1:
                    dfs(v, u)
                    low[u] = min(low[u], low[v])
                    if low[v] > disc[u]:
                        bridges.append([min(u, v), max(u, v)])
                else:
                    low[u] = disc[v]
        dfs(0, -1)
        return bridges
  - |
    def critical_connections(n, connections):
        graph = [[] for _ in range(n)]
        for a, b in connections:
            graph[a].append(b)
            graph[b].append(a)
        disc = [-1] * n
        low = [0] * n
        bridges = []
        timer = [0]
        def dfs(u, parent):
            disc[u] = low[u] = timer[0]
            timer[0] += 1
            for v in graph[u]:
                if disc[v] == -1:
                    dfs(v, u)
                    low[u] = min(low[u], low[v])
                    if low[v] > disc[u]:
                        bridges.append([min(u, v), max(u, v)])
                else:
                    low[u] = min(low[u], disc[v])
        dfs(0, -1)
        return bridges
equivalent:
  - "9: timer = [1]"   # why: discovery numbers are only compared with each other, and starting at 1 keeps them clear of the -1 sentinel
  - "9: timer = [-1]"   # why: disc[0] stays -1, the unvisited marker, so a back edge to server 0 re-enters it; no bridge differs from the solution on 23000 random connected graphs of 2 to 30 servers, checked offline, so this rests on that evidence rather than a proof
  - "12: disc[u] = low[u] = timer[-1]"   # why: timer has one slot, so index -1 is the same slot as index 0
  - "13: timer[-1] += 1"   # why: same single slot as above
  - "13: timer[0] += 2"   # why: discovery numbers only need to keep their order, and doubling the step keeps it
  - "24: dfs(1, -1)"   # why: the graph is connected, so any starting server gives the same set of bridges
  - "24: dfs(0, -2)"   # why: no server is numbered -2, so the parent check behaves the same as with -1
  - "24: dfs(0, -0)"   # why: a server is never its own neighbour, so a parent of 0 at the root skips nothing
  - "7: low = [1] * n"   # why: every server's low value is set when it is first visited, before anything reads it, so the starting value never matters
  - "7: low = [-1] * n"   # why: same as above, the starting value is always overwritten on the first visit
---
::
