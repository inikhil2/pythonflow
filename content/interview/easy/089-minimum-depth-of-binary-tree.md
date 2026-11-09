---
title: Minimum Depth of Binary Tree
tier: easy
order: 89
leetcode: 111
url: https://leetcode.com/problems/minimum-depth-of-binary-tree/
companies: [Google, Meta, Amazon]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get the root node of a binary tree, or `None` when the tree is empty. The tree has between 0 and 500 nodes, and each `val` is a whole number from -100 to 100.

The minimum depth is the number of nodes on the shortest path from the root down to a leaf. A leaf is a node with no children. The root alone counts as depth 1. An empty tree has depth 0.

The tests build a tree with `to_tree([3, 9, 20, None, None, 15, 7])`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you.

::exercise
---
id: iv-easy-089
prompt: Write a function min_depth(root) that returns the number of nodes on the shortest path from the root to a leaf.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def min_depth(root):
      pass
hints:
  - A node with only one child cannot be a leaf, so do not let its missing side count as depth 0.
  - Handle the case of one missing child separately from the case where both children exist.
tests:
  - check: assert min_depth(to_tree([3, 9, 20, None, None, 15, 7])) == 2
  - check: assert min_depth(to_tree([2, None, 3, None, 4, None, 5, None, 6])) == 5
  - check: assert min_depth(to_tree([])) == 0
  - check: assert min_depth(to_tree([1])) == 1
  - check: assert min_depth(to_tree([1, 2])) == 2
  - check: assert min_depth(to_tree([1, None, 2])) == 2
  - check: assert min_depth(to_tree([1, 2, 3, 4, None, None, 5])) == 3
solution: |
  def min_depth(root):
      if root is None:
          return 0
      if root.left is None:
          return 1 + min_depth(root.right)
      if root.right is None:
          return 1 + min_depth(root.left)
      return 1 + min(min_depth(root.left), min_depth(root.right))
brute: |
  def min_depth(root):
      if root is None:
          return 0
      level = [root]
      depth = 1
      while True:
          for node in level:
              if node.left is None and node.right is None:
                  return depth
          below = []
          for node in level:
              if node.left is not None:
                  below.append(node.left)
              if node.right is not None:
                  below.append(node.right)
          level = below
          depth += 1
random:
  call: min_depth
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
    def min_depth(root):
        if root is None:
            return 0
        return 1 + min(min_depth(root.left), min_depth(root.right))
  - |
    def min_depth(root):
        if root is None:
            return 0
        return 1 + max(min_depth(root.left), min_depth(root.right))
  - |
    def min_depth(root):
        if root is None:
            return 0
        if root.left is None and root.right is None:
            return 1
        return 1 + min_depth(root.left) + min_depth(root.right)
---
::
