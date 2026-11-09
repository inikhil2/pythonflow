---
title: Symmetric Tree
tier: easy
order: 90
leetcode: 101
url: https://leetcode.com/problems/symmetric-tree/
companies: [Google, Amazon, Meta]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get the root node of a binary tree, or `None` when the tree is empty. The tree has between 0 and 500 nodes, and each `val` is a whole number from -10 to 10.

A tree is symmetric when its left side is a mirror image of its right side. The left child of the root must match the right child of the root, and so on inward, so the left subtree and the right subtree have the same shape and values, reflected. An empty tree is symmetric.

The tests build a tree with `to_tree([1, 2, 2, 3, 4, 4, 3])`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you.

::exercise
---
id: iv-easy-090
prompt: Write a function is_symmetric(root) that returns True if the binary tree is a mirror image of itself, and False otherwise.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def is_symmetric(root):
      pass
hints:
  - Compare the left side of the root with the right side, but cross the children, so the left side's left child meets the right side's right child.
  - Recurse on that crossed pair, and treat two missing positions as a match.
tests:
  - check: assert is_symmetric(to_tree([1, 2, 2, 3, 4, 4, 3])) == True
  - check: assert is_symmetric(to_tree([1, 2, 2, None, 3, None, 3])) == False
  - check: assert is_symmetric(to_tree([])) == True
  - check: assert is_symmetric(to_tree([1])) == True
  - check: assert is_symmetric(to_tree([1, 2])) == False
  - check: assert is_symmetric(to_tree([1, 2, 2])) == True
  - check: assert is_symmetric(to_tree([1, 2, 3])) == False
  - check: assert is_symmetric(to_tree([5, 1, 1, None, 2, 2, None])) == True
solution: |
  def is_symmetric(root):
      def mirror(a, b):
          if a is None or b is None:
              return a is b
          return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)
      return root is None or mirror(root.left, root.right)
brute: |
  def is_symmetric(root):
      level = [root]
      while any(node is not None for node in level):
          values = [node.val if node is not None else None for node in level]
          if values != values[::-1]:
              return False
          below = []
          for node in level:
              if node is None:
                  below.append(None)
                  below.append(None)
              else:
                  below.append(node.left)
                  below.append(node.right)
          level = below
      return True
random:
  call: is_symmetric
  gen: |
    def gen(rng, size):
        size = min(size, 500)
        vals = [rng.randint(-1, 1) for _ in range(size)]
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
    def is_symmetric(root):
        if root is None:
            return True
        return (root.left is None) == (root.right is None)
  - |
    def is_symmetric(root):
        def same(a, b):
            if a is None or b is None:
                return a is b
            return a.val == b.val and same(a.left, b.left) and same(a.right, b.right)
        return root is None or same(root.left, root.right)
  - |
    def is_symmetric(root):
        if root is None:
            return True
        return root.left.val == root.right.val
---
::
