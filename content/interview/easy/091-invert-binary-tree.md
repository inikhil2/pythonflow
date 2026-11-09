---
title: Invert Binary Tree
tier: easy
order: 91
leetcode: 226
url: https://leetcode.com/problems/invert-binary-tree/
companies: [Amazon, Google, Meta]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get the root node of a binary tree, or `None` when the tree is empty. The tree has between 0 and 100 nodes, and each `val` is a whole number from -100 to 100.

Invert the tree by swapping the left and right children of every node, so the result is a mirror image of the original. Return the root of the inverted tree.

The tests build a tree with `to_tree([4, 2, 7, 1, 3, 6, 9])`, which lists the nodes level by level with `None` for a missing child, and read the answer back with `from_tree(root)`. Both are already defined for you, along with `TreeNode`.

::exercise
---
id: iv-easy-091
prompt: Write a function invert_tree(root) that swaps the left and right children of every node and returns the root.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def invert_tree(root):
      pass
hints:
  - Swap the two children of the root, then do the same for each child.
  - A helper that works on each node on its own is enough, since the same step repeats all the way down.
tests:
  - check: assert from_tree(invert_tree(to_tree([4, 2, 7, 1, 3, 6, 9]))) == [4, 7, 2, 9, 6, 3, 1]
  - check: assert from_tree(invert_tree(to_tree([2, 1, 3]))) == [2, 3, 1]
  - check: assert from_tree(invert_tree(to_tree([]))) == []
  - check: assert from_tree(invert_tree(to_tree([1]))) == [1]
  - check: assert from_tree(invert_tree(to_tree([1, 2]))) == [1, None, 2]
  - check: assert from_tree(invert_tree(to_tree([1, None, 2]))) == [1, 2]
  - check: assert from_tree(invert_tree(to_tree([1, 2, 3, 4, None, None, 5]))) == [1, 3, 2, 5, None, None, 4]
solution: |
  def invert_tree(root):
      if root is None:
          return None
      root.left, root.right = invert_tree(root.right), invert_tree(root.left)
      return root
brute: |
  def invert_tree(root):
      if root is None:
          return None
      new_root = TreeNode(root.val)
      queue = [(root, new_root)]
      while queue:
          src, dst = queue.pop(0)
          if src.right is not None:
              dst.left = TreeNode(src.right.val)
              queue.append((src.right, dst.left))
          if src.left is not None:
              dst.right = TreeNode(src.left.val)
              queue.append((src.left, dst.right))
      return new_root
random:
  call: invert_tree
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
    result: tree
wrong:
  - |
    def invert_tree(root):
        if root is None:
            return None
        root.left, root.right = root.right, root.left
        return root
  - |
    def invert_tree(root):
        if root is None:
            return None
        root.left = invert_tree(root.left)
        root.right = invert_tree(root.right)
        return root
  - |
    def invert_tree(root):
        if root is None:
            return None
        if root.left is not None and root.right is not None:
            root.left.val, root.right.val = root.right.val, root.left.val
        return root
---
::
