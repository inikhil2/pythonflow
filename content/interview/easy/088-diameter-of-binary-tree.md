---
title: Diameter of Binary Tree
tier: easy
order: 88
leetcode: 543
url: https://leetcode.com/problems/diameter-of-binary-tree/
companies: [Google, Meta, Amazon]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get the root node of a binary tree, or `None` when the tree is empty. The tree has between 0 and 500 nodes, and each `val` is a whole number from -100 to 100.

The diameter is the length of the longest path between any two nodes, where the length counts the edges on the path. The path may or may not pass through the root. Return the diameter. An empty tree and a tree with one node both have diameter 0.

The tests build a tree with `to_tree([1, 2, 3, 4, 5])`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you.

::exercise
---
id: iv-easy-088
prompt: Write a function diameter(root) that returns the number of edges on the longest path between two nodes of the binary tree.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def diameter(root):
      pass
hints:
  - For each node, the longest path through it is the depth of its left side plus the depth of its right side.
  - Keep the best value in a name outside the helper, and let the helper return the depth of each side.
tests:
  - check: assert diameter(to_tree([1, 2, 3, 4, 5])) == 3
  - check: assert diameter(to_tree([1, 2])) == 1
  - check: assert diameter(to_tree([])) == 0
  - check: assert diameter(to_tree([1])) == 0
  - check: assert diameter(to_tree([1, 2, 3])) == 2
  - check: assert diameter(to_tree([1, None, 2, None, 3, None, 4])) == 3
  - check: assert diameter(to_tree([1, 2, 3, 4, None, None, 5, 6])) == 5
  - check: assert diameter(to_tree([1, 2, None, 3, 4, 5, None, 6])) == 4
solution: |
  def diameter(root):
      best = 0
      def depth(node):
          nonlocal best
          if node is None:
              return 0
          left = depth(node.left)
          right = depth(node.right)
          best = max(best, left + right)
          return 1 + max(left, right)
      depth(root)
      return best
brute: |
  def diameter(root):
      nodes = []
      stack = [root] if root is not None else []
      while stack:
          node = stack.pop()
          nodes.append(node)
          for child in (node.left, node.right):
              if child is not None:
                  stack.append(child)
      def height(node):
          if node is None:
              return 0
          return 1 + max(height(node.left), height(node.right))
      best = 0
      for node in nodes:
          best = max(best, height(node.left) + height(node.right))
      return best
random:
  call: diameter
  gen: |
    def gen(rng, size):
        size = min(size, 500)
        vals = [rng.randint(-5, 5) for _ in range(size)]
        left, right = [None] * size, [None] * size
        for k in range(1, size):
            free = [(p, side) for p in range(k) for side in (left, right) if side[p] is None]
            p, side = rng.choice(free)
            side[p] = k
        out, queue = [], [0] if size else []
        for i in queue:
            out.append(None if i is None else vals[i])
            if i is not None:
                queue += [left[i], right[i]]
        while out and out[-1] is None:
            out.pop()
        return (out,)
  wrap:
    args: [tree]
wrong:
  - |
    def diameter(root):
        if root is None:
            return 0
        return max(diameter(root.left), diameter(root.right))
  - |
    def diameter(root):
        best = 0
        def depth(node):
            nonlocal best
            if node is None:
                return 0
            left = depth(node.left)
            right = depth(node.right)
            best = max(best, left + right + 1)
            return 1 + max(left, right)
        depth(root)
        return best
  - |
    def diameter(root):
        if root is None:
            return 0
        def height(node):
            if node is None:
                return 0
            return 1 + max(height(node.left), height(node.right))
        return height(root.left) + height(root.right)
---
::
