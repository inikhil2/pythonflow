---
title: Range Sum of BST
tier: easy
order: 96
leetcode: 938
url: https://leetcode.com/problems/range-sum-of-bst/
companies: [Meta, Google, Amazon]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get the root node of a binary search tree, or `None` when the tree is empty. Every value in a binary search tree is larger than every value in its left subtree and smaller than every value in its right subtree. The tree has between 0 and 500 nodes, and each `val` is a whole number from -10000 to 10000. You also get two whole numbers `low` and `high`, where `low <= high`.

Return the sum of the values of all nodes whose value is between `low` and `high`, including `low` and `high` themselves. An empty tree sums to 0.

The tests build a tree with `to_tree([10, 5, 15, 3, 7, None, 18])`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you.

::exercise
---
id: iv-easy-096
prompt: Write a function range_sum_bst(root, low, high) that returns the sum of the node values in the binary search tree that lie between low and high, inclusive.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def range_sum_bst(root, low, high):
      pass
hints:
  - If a node's value is below low, every value in its left subtree is too small as well, so skip that side.
  - If a node's value is above high, skip its right subtree in the same way.
tests:
  - check: assert range_sum_bst(to_tree([10, 5, 15, 3, 7, None, 18]), 7, 15) == 32
  - check: assert range_sum_bst(to_tree([10, 5, 15, 3, 7, 13, 18, 1, None, 6]), 6, 10) == 23
  - check: assert range_sum_bst(to_tree([]), 1, 5) == 0
  - check: assert range_sum_bst(to_tree([5]), 5, 5) == 5
  - check: assert range_sum_bst(to_tree([5]), 6, 9) == 0
  - check: assert range_sum_bst(to_tree([3, 1, 4]), 1, 4) == 8
  - check: assert range_sum_bst(to_tree([2, None, 4]), 3, 3) == 0
solution: |
  def range_sum_bst(root, low, high):
      if root is None:
          return 0
      if root.val < low:
          return range_sum_bst(root.right, low, high)
      if root.val > high:
          return range_sum_bst(root.left, low, high)
      return root.val + range_sum_bst(root.left, low, high) + range_sum_bst(root.right, low, high)
brute: |
  def range_sum_bst(root, low, high):
      values = []
      stack = [root] if root is not None else []
      while stack:
          node = stack.pop()
          values.append(node.val)
          for child in (node.left, node.right):
              if child is not None:
                  stack.append(child)
      total = 0
      for v in values:
          if low <= v <= high:
              total += v
      return total
random:
  call: range_sum_bst
  gen: |
    def gen(rng, size):
        vals = sorted(rng.sample(range(-50, 51), min(max(size, 1), 60)))
        out = []
        queue = [(0, len(vals))]
        while queue:
            lo, hi = queue.pop(0)
            if lo >= hi:
                out.append(None)
                continue
            mid = (lo + hi) // 2
            out.append(vals[mid])
            queue.append((lo, mid))
            queue.append((mid + 1, hi))
        while out and out[-1] is None:
            out.pop()
        low, high = sorted([rng.randint(-60, 60), rng.randint(-60, 60)])
        return (out, low, high)
  wrap:
    args: [tree, null, null]
wrong:
  - |
    def range_sum_bst(root, low, high):
        if root is None:
            return 0
        if root.val > high:
            return range_sum_bst(root.left, low, high)
        return root.val + range_sum_bst(root.left, low, high) + range_sum_bst(root.right, low, high)
  - |
    def range_sum_bst(root, low, high):
        if root is None:
            return 0
        total = root.val if low < root.val < high else 0
        return total + range_sum_bst(root.left, low, high) + range_sum_bst(root.right, low, high)
  - |
    def range_sum_bst(root, low, high):
        if root is None:
            return 0
        if root.val < low:
            return range_sum_bst(root.left, low, high)
        if root.val > high:
            return range_sum_bst(root.left, low, high)
        return root.val + range_sum_bst(root.left, low, high) + range_sum_bst(root.right, low, high)
---
::
