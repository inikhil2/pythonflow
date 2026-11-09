---
title: Maximum Depth of Binary Tree
tier: easy
order: 83
leetcode: 104
url: https://leetcode.com/problems/maximum-depth-of-binary-tree/
companies: [Google, Meta, Amazon]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get the root node of a binary tree, or `None` when the tree is empty. The tree has between 0 and 500 nodes, and each `val` is a whole number from -100 to 100. Return how many levels the tree has, where the root alone counts as one level. An empty tree has 0 levels.

Each node has `val`, `left` and `right`, and a missing child is `None`. The tests build a tree with `to_tree([3, 9, 20, None, None, 15, 7])`, which lists the nodes level by level with `None` for a missing child, and `TreeNode` is already defined for you.

::exercise
---
id: iv-easy-083
prompt: Write a function max_depth(root) that returns how many levels the tree has.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def max_depth(root):
      pass
hints:
  - An empty tree has depth 0. Handle that first.
  - Ask the same question of the left child and of the right child, then keep the larger answer and add 1 for this node.
tests:
  - check: assert max_depth(to_tree([3, 9, 20, None, None, 15, 7])) == 3
  - check: assert max_depth(to_tree([1, None, 2])) == 2
  - check: assert max_depth(to_tree([])) == 0
  - check: assert max_depth(to_tree([0])) == 1
  - check: assert max_depth(to_tree([1, 2])) == 2
  - check: assert max_depth(to_tree([1, 2, 3, 4, None, None, 5])) == 3
  - check: assert max_depth(to_tree([1, 2, None, 3, None, 4])) == 4
  - check: assert max_depth(to_tree([1, None, 2, None, 3])) == 3
solution: |
  def max_depth(root):
      if root is None:
          return 0
      return 1 + max(max_depth(root.left), max_depth(root.right))
brute: |
  def max_depth(root):
      level = [root] if root is not None else []
      depth = 0
      while level:
          depth += 1
          below = []
          for node in level:
              if node.left is not None:
                  below.append(node.left)
              if node.right is not None:
                  below.append(node.right)
          level = below
      return depth
random:
  call: max_depth
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
    def max_depth(root):
        depth = 0
        while root is not None:
            depth += 1
            root = root.left
        return depth
  - |
    def max_depth(root):
        if root is None:
            return 0
        return 1 + max_depth(root.left) + max_depth(root.right)
  - |
    def max_depth(root):
        if root is None:
            return 0
        return 1 + min(max_depth(root.left), max_depth(root.right))
---
::
