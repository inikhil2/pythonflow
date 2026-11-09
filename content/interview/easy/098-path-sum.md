---
title: Path Sum
tier: easy
order: 98
leetcode: 112
url: https://leetcode.com/problems/path-sum/
companies: [Apple, Google, Amazon]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get the root node of a binary tree, or `None` when the tree is empty, and a whole number `target`. The tree has between 0 and 500 nodes, and each `val` is a whole number from -1000 to 1000. The target is from -1000 to 1000.

A root-to-leaf path starts at the root and goes down to a leaf, which is a node with no children. The sum of a path is the total of the values on it. Return `True` if the tree has a root-to-leaf path whose sum equals `target`, and `False` otherwise. An empty tree has no paths, so it returns `False`.

The tests build a tree with `to_tree([5, 4, 8, 11, None, 13, 4, 7, 2, None, None, None, 1])`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you.

::exercise
---
id: iv-easy-098
prompt: Write a function has_path_sum(root, target) that returns True if some root-to-leaf path adds up to target, and False otherwise.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def has_path_sum(root, target):
      pass
hints:
  - Subtract each node's value from the target as you go down. At a leaf, check whether what is left is exactly zero.
  - A node with only one child is not a leaf, so do not check the sum there.
tests:
  - check: assert has_path_sum(to_tree([5, 4, 8, 11, None, 13, 4, 7, 2, None, None, None, 1]), 22) == True
  - check: assert has_path_sum(to_tree([1, 2, 3]), 5) == False
  - check: assert has_path_sum(to_tree([]), 0) == False
  - check: assert has_path_sum(to_tree([1]), 1) == True
  - check: assert has_path_sum(to_tree([1, 2]), 1) == False
  - check: assert has_path_sum(to_tree([1, 2]), 3) == True
  - check: assert has_path_sum(to_tree([1, -2, -3, 1, 3, -2, None, -1]), -1) == True
  - check: assert has_path_sum(to_tree([1, 2]), 2) == False
solution: |
  def has_path_sum(root, target):
      if root is None:
          return False
      if root.left is None and root.right is None:
          return root.val == target
      rest = target - root.val
      return has_path_sum(root.left, rest) or has_path_sum(root.right, rest)
brute: |
  def has_path_sum(root, target):
      if root is None:
          return False
      sums = []
      stack = [(root, root.val)]
      while stack:
          node, total = stack.pop()
          if node.left is None and node.right is None:
              sums.append(total)
          if node.left is not None:
              stack.append((node.left, total + node.left.val))
          if node.right is not None:
              stack.append((node.right, total + node.right.val))
      return target in sums
random:
  call: has_path_sum
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
        return (out, rng.randint(-10, 10))
  wrap:
    args: [tree, null]
wrong:
  - |
    def has_path_sum(root, target):
        if root is None:
            return False
        if root.left is None and root.right is None:
            return root.val == target
        rest = target - root.val
        return has_path_sum(root.left, rest) and has_path_sum(root.right, rest)
  - |
    def has_path_sum(root, target):
        if root is None:
            return target == 0
        if root.left is None and root.right is None:
            return root.val == target
        rest = target - root.val
        return has_path_sum(root.left, rest) or has_path_sum(root.right, rest)
  - |
    def has_path_sum(root, target):
        if root is None:
            return False
        if root.left is None and root.right is None:
            return root.val == target
        rest = target - root.val
        return has_path_sum(root.left, rest) or has_path_sum(root.right, target)
---
::
