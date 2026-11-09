---
title: All Nodes Distance K in Binary Tree
tier: medium
order: 86
leetcode: 863
url: https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/
companies: [Amazon, Microsoft, Google]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/04-dictionaries, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/09-graphs]
---

You get the root of a binary tree, a whole number `target` that is the value of one node in the tree, and a whole number `k`. The tree has between 1 and 500 nodes, every value is different and from 0 to 499, and `k` is from 0 to 1000.

Return the values of all nodes that are exactly `k` edges away from the node holding `target`. An edge is a link from a node to its parent or to one of its children, so a node's parent counts as one edge away. Return the values sorted from smallest to largest, or an empty list if there are none.

The tests build a tree with `to_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4])`, which uses the LeetCode level order form, and `to_tree` returns the root. The node builders are already defined for you, along with `TreeNode`.

::exercise
---
id: iv-medium-086
prompt: Write a function all_distance_k(root, target, k) that returns the sorted values of all nodes exactly k edges away from the node whose value is target.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def all_distance_k(root, target, k):
      pass
hints:
  - A node's parent is not stored in the tree, so record each node's parent with one walk over the tree first.
  - Then search outward from the target one step at a time, moving to the children and to the parent, and keep a set of nodes already reached so you do not step back.
tests:
  - check: assert all_distance_k(to_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]), 5, 2) == [1, 4, 7]
  - check: assert all_distance_k(to_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]), 5, 0) == [5]
  - check: assert all_distance_k(to_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]), 3, 1) == [1, 5]
  - check: assert all_distance_k(to_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]), 1, 2) == [5]
  - check: assert all_distance_k(to_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]), 7, 4) == [1]
  - check: assert all_distance_k(to_tree([0]), 0, 3) == []
  - check: assert all_distance_k(to_tree([1, 2]), 2, 1) == [1]
  - check: assert all_distance_k(to_tree([0, 1, 2, 3, 4, 5, 6]), 0, 2) == [3, 4, 5, 6]
big: assert all_distance_k(to_tree([None if i % 11 == 10 else (i * 419) % 500 for i in range(500)]), 81, 7) == [56, 63, 95, 320, 401, 482] and all_distance_k(to_tree([None if i % 11 == 10 else (i * 419) % 500 for i in range(500)]), 81, 8) == [109, 274, 338, 355]
solution: |
  def all_distance_k(root, target, k):
      parent = {}
      start = None
      stack = [root]
      while stack:
          node = stack.pop()
          if node.val == target:
              start = node
          for child in (node.left, node.right):
              if child is not None:
                  parent[child] = node
                  stack.append(child)
      frontier = [start]
      visited = {start}
      for _ in range(k):
          nxt = []
          for node in frontier:
              for other in (node.left, node.right, parent.get(node)):
                  if other is not None and other not in visited:
                      visited.add(other)
                      nxt.append(other)
          frontier = nxt
      return sorted(node.val for node in frontier)
brute: |
  def all_distance_k(root, target, k):
      graph = {}
      def add(a, b):
          graph.setdefault(a, []).append(b)
          graph.setdefault(b, []).append(a)
      def walk(node):
          if node is None:
              return
          for child in (node.left, node.right):
              if child is not None:
                  add(node.val, child.val)
          walk(node.left)
          walk(node.right)
      walk(root)
      dist = {target: 0}
      queue = [target]
      for v in queue:
          for w in graph.get(v, []):
              if w not in dist:
                  dist[w] = dist[v] + 1
                  queue.append(w)
      return sorted(v for v, d in dist.items() if d == k)
slow:
  - |
    def all_distance_k(root, target, k):
        nodes = []
        stack = [root]
        while stack:
            node = stack.pop()
            nodes.append(node)
            for child in (node.left, node.right):
                if child is not None:
                    stack.append(child)
        start = next(n for n in nodes if n.val == target)
        answer = []
        for node in nodes:
            adjacency = {}
            for n in nodes:
                for child in (n.left, n.right):
                    if child is not None:
                        adjacency.setdefault(n, []).append(child)
                        adjacency.setdefault(child, []).append(n)
            dist = {start: 0}
            queue = [start]
            for cur in queue:
                for nxt in adjacency.get(cur, []):
                    if nxt not in dist:
                        dist[nxt] = dist[cur] + 1
                        queue.append(nxt)
            if dist.get(node) == k:
                answer.append(node.val)
        return sorted(answer)
random:
  call: all_distance_k
  gen: |
    def gen(rng, size):
        vals = rng.sample(range(500), max(1, min(size, 400)))
        tree = [vals[0]] + [v if rng.random() < 0.8 else None for v in vals[1:]]
        placed, i = [0], 1
        for index in placed:
            for _ in range(2):
                if i < len(tree):
                    if tree[i] is not None:
                        placed.append(i)
                    i += 1
        return (tree, tree[rng.choice(placed)], rng.randint(0, 8))
  wrap:
    args: [tree]
wrong:
  - |
    def all_distance_k(root, target, k):
        def below(node, depth):
            if node is None:
                return []
            if depth == 0:
                return [node.val]
            return below(node.left, depth - 1) + below(node.right, depth - 1)
        def find(node):
            if node is None:
                return None
            if node.val == target:
                return node
            return find(node.left) or find(node.right)
        return sorted(below(find(root), k))
  - |
    def all_distance_k(root, target, k):
        parent = {}
        start = None
        stack = [root]
        while stack:
            node = stack.pop()
            if node.val == target:
                start = node
            for child in (node.left, node.right):
                if child is not None:
                    parent[child] = node
                    stack.append(child)
        frontier = [start]
        visited = {start}
        for _ in range(k - 1):
            nxt = []
            for node in frontier:
                for other in (node.left, node.right, parent.get(node)):
                    if other is not None and other not in visited:
                        visited.add(other)
                        nxt.append(other)
            frontier = nxt
        return sorted(node.val for node in frontier)
  - |
    def all_distance_k(root, target, k):
        parent = {}
        start = None
        stack = [root]
        while stack:
            node = stack.pop()
            if node.val == target:
                start = node
            for child in (node.left, node.right):
                if child is not None:
                    parent[child] = node
                    stack.append(child)
        frontier = [start]
        for _ in range(k):
            visited = set()
            nxt = []
            for node in frontier:
                for other in (node.left, node.right, parent.get(node)):
                    if other is not None and other not in visited:
                        visited.add(other)
                        nxt.append(other)
            frontier = nxt
        return sorted(node.val for node in frontier)
---
::
