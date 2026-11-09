---
title: Graphs
week: 10
order: 9
minutes: 15
concepts: [dictionaries, sets, for-loops]
---

A **graph** is a set of nodes joined by edges. A city map, a friend list and a web of links are all graphs. A simple way to store one is an **adjacency list**: a dict that maps each node to a list of the nodes it connects to.

```python
graph = {
    "a": ["b", "c"],
    "b": ["a"],
    "c": ["a", "d"],
    "d": ["c"],
}
```

Here the edges go both ways, so each edge appears in both lists. In a **directed** graph each edge has one direction, and you list it only once.

## Breadth-first search

**Breadth-first search** (BFS) visits the nodes in rings. It starts at one node, then visits its neighbours, then their neighbours. Use a `deque` as the queue, and a **visited** set so that no node is queued twice. Because it goes ring by ring, BFS finds the fewest steps from the start to every node.

::trace
---
code: |
  from collections import deque

  graph = {0: [1, 2], 1: [3], 2: [3], 3: []}
  seen = {0}
  queue = deque([0])
  order = []
  while queue:
      node = queue.popleft()
      order.append(node)
      for nxt in graph[node]:
          if nxt not in seen:
              seen.add(nxt)
              queue.append(nxt)
  print(order)
---
::

The visited set matters. Without it, a cycle such as `a -> b -> a` puts the same nodes into the queue again and again, and the loop never ends.

## Depth-first search

**Depth-first search** (DFS) goes as deep as it can along one path before it backs up. A recursive function does this naturally. It marks the node, then calls itself on each unvisited neighbour:

```python
def dfs(node, graph, seen):
    seen.add(node)
    for nxt in graph[node]:
        if nxt not in seen:
            dfs(nxt, graph, seen)
```

BFS and DFS both find everything reachable from the start. BFS is the one to use when you need the fewest steps.

## Grids as graphs

A grid is a graph too. Each cell is a node, and its neighbours are the cells above, below, left and right of it. You do not need to build the dict. Just try the four moves and skip the cells that are off the grid or already seen.

## Topological sort

A **topological sort** puts the nodes of a directed graph with no cycles in an order where every edge points forward. Think of course prerequisites, where each course comes after the ones it needs. One method (Kahn's) counts the incoming edges of each node. It takes the nodes with no incoming edges, adds them to the order, and removes their edges. Any node whose count drops to zero is added next.

Your turn: count the pieces of a graph.

::exercise
---
id: w10-l9-ex1
prompt: Read a line with two whole numbers, n and m. n is the number of nodes, numbered 0 to n - 1. m is the number of edges. Then read m lines, each with two node numbers that share an edge. Print the number of connected pieces, where two nodes are in the same piece when a path of edges links them. Print 0 when n is 0.
starter: |
  n, m = map(int, input().split())
  for _ in range(m):
      input()
  print(0)
hints:
  - Start the graph as a dict with one empty list per node, using a dict comprehension over range(n). Add each edge in both directions.
  - Loop over every node. If it is not in seen yet, count a new piece, then run BFS from it with a deque and add every node it reaches to seen.
  - Put a node in seen when you queue it, not when you pop it. Without seen, a cycle makes the search loop forever.
tests:
  - stdin: "0 0\n"
    stdout: "0"
  - stdin: "1 0\n"
    stdout: "1"
  - stdin: "4 2\n0 1\n2 3\n"
    stdout: "2"
  - stdin: "3 0\n"
    stdout: "3"
  - stdin: "4 3\n0 1\n1 2\n2 0\n"
    stdout: "2"
solution: |
  from collections import deque

  n, m = map(int, input().split())
  graph = {i: [] for i in range(n)}
  for _ in range(m):
      a, b = map(int, input().split())
      graph[a].append(b)
      graph[b].append(a)
  seen = set()
  count = 0
  for start in range(n):
      if start in seen:
          continue
      count += 1
      seen.add(start)
      queue = deque([start])
      while queue:
          node = queue.popleft()
          for nxt in graph[node]:
              if nxt not in seen:
                  seen.add(nxt)
                  queue.append(nxt)
  print(count)
---
::

Now a grid. Each `#` is land, and two pieces of land touch only up, down, left or right.

::exercise
---
id: w10-l9-ex2
prompt: Read a whole number rows, then that many lines of text, each made of # (land) and . (water). Each line has the same length. Print the number of islands. An island is a group of # cells that connect up, down, left or right. Cells that touch only at a corner do not connect. Print 0 when rows is 0.
starter: |
  rows = int(input())
  grid = [input() for _ in range(rows)]
  print(0)
hints:
  - Loop over every cell. When you find a # that is not seen yet, count an island and search from that cell.
  - Use the four moves (1, 0), (-1, 0), (0, 1) and (0, -1). Skip a move that goes off the grid, lands on water, or is already seen.
  - A stack, a plain list used with pop(), is enough here. Add each cell to seen when you push it.
tests:
  - stdin: "0\n"
    stdout: "0"
  - stdin: |
      3
      ##.
      ..#
      #..
    stdout: "3"
  - stdin: |
      2
      ##
      ##
    stdout: "1"
  - stdin: |
      2
      #.
      .#
    stdout: "2"
  - stdin: |
      1
      ..
    stdout: "0"
solution: |
  rows = int(input())
  grid = [input() for _ in range(rows)]
  seen = set()
  count = 0
  for r in range(len(grid)):
      for c in range(len(grid[r])):
          if grid[r][c] == "#" and (r, c) not in seen:
              count += 1
              seen.add((r, c))
              stack = [(r, c)]
              while stack:
                  y, x = stack.pop()
                  for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                      ny, nx = y + dy, x + dx
                      if 0 <= ny < len(grid) and 0 <= nx < len(grid[ny]):
                          if grid[ny][nx] == "#" and (ny, nx) not in seen:
                              seen.add((ny, nx))
                              stack.append((ny, nx))
  print(count)
---
::
