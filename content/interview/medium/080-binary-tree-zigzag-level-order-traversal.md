---
title: Binary Tree Zigzag Level Order Traversal
tier: medium
order: 80
leetcode: 103
url: https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/
companies: [Meta, Amazon, Google]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get the root node of a binary tree, or `None` when the tree is empty. The tree has between 0 and 500 nodes, and each `val` is a whole number from -1000 to 1000.

Walk the tree one level at a time, from the top down. The top level is read from left to right, the next level is read from right to left, and the two directions keep alternating. Return a list with one list of values for each level, in that order. An empty tree returns an empty list.

The tests build a tree with `to_tree([3, 9, 20, None, None, 15, 7])`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you.

::exercise
---
id: iv-medium-080
prompt: Write a function zigzag_levels(root) that returns the values of each level of the binary tree, with the direction alternating from level to level, starting left to right.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def zigzag_levels(root):
      pass
hints:
  - Build each level the normal way, from left to right, and then reverse it on every other level.
  - Keep a flag that flips after each level, so you know which direction the current level uses.
tests:
  - check: assert zigzag_levels(to_tree([3, 9, 20, None, None, 15, 7])) == [[3], [20, 9], [15, 7]]
  - check: assert zigzag_levels(to_tree([1])) == [[1]]
  - check: assert zigzag_levels(to_tree([])) == []
  - check: assert zigzag_levels(to_tree([1, 2])) == [[1], [2]]
  - check: assert zigzag_levels(to_tree([1, 2, 3, 4, 5])) == [[1], [3, 2], [4, 5]]
  - check: assert zigzag_levels(to_tree([1, None, 2, None, 3])) == [[1], [2], [3]]
  - check: assert zigzag_levels(to_tree([1, 2, 3, 4, None, None, 5])) == [[1], [3, 2], [4, 5]]
big: assert zigzag_levels(to_tree(list(range(1, 501)))) == [list(range(2 ** k, min(2 ** (k + 1), 501)))[::-1] if k % 2 else list(range(2 ** k, min(2 ** (k + 1), 501))) for k in range(9)]
solution: |
  def zigzag_levels(root):
      levels = []
      level = [root] if root is not None else []
      left_to_right = True
      while level:
          values = [node.val for node in level]
          levels.append(values if left_to_right else values[::-1])
          left_to_right = not left_to_right
          level = [child for node in level for child in (node.left, node.right) if child is not None]
      return levels
brute: |
  def zigzag_levels(root):
      rows = {}
      def walk(node, depth):
          if node is None:
              return
          rows.setdefault(depth, []).append(node.val)
          walk(node.left, depth + 1)
          walk(node.right, depth + 1)
      walk(root, 0)
      return [rows[d] if d % 2 == 0 else rows[d][::-1] for d in sorted(rows)]
random:
  call: zigzag_levels
  gen: |
    def gen(rng, size):
        out = []
        pending = 1
        count = 0
        limit = rng.randint(0, size)
        while pending > 0 and count < limit:
            if rng.random() < 0.7:
                out.append(rng.randint(-5, 5))
                count += 1
                pending += 2
            else:
                out.append(None)
            pending -= 1
        while out and out[-1] is None:
            out.pop()
        return (out,)
  wrap:
    args: [tree]
no_slow: "The tree has at most 500 nodes, so every method, including one that walks the whole tree once per level, finishes well inside the step limit."
wrong:
  - |
    def zigzag_levels(root):
        levels = []
        level = [root] if root is not None else []
        left_to_right = False
        while level:
            values = [node.val for node in level]
            levels.append(values if left_to_right else values[::-1])
            left_to_right = not left_to_right
            level = [child for node in level for child in (node.left, node.right) if child is not None]
        return levels
  - |
    def zigzag_levels(root):
        levels = []
        level = [root] if root is not None else []
        while level:
            levels.append([node.val for node in level])
            level = [child for node in level for child in (node.left, node.right) if child is not None]
        return levels
  - |
    def zigzag_levels(root):
        levels = []
        level = [root] if root is not None else []
        left_to_right = True
        while level:
            values = [node.val for node in level]
            levels.append(values if left_to_right else values[::-1])
            left_to_right = not left_to_right
            level = [node.left for node in level if node.left is not None]
        return levels
---
::
