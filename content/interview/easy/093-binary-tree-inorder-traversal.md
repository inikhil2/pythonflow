---
title: Binary Tree Inorder Traversal
tier: easy
order: 93
leetcode: 94
url: https://leetcode.com/problems/binary-tree-inorder-traversal/
companies: [Google, Amazon, Meta]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get the root node of a binary tree, or `None` when the tree is empty. The tree has between 0 and 100 nodes, and each `val` is a whole number from -100 to 100.

Return the values in inorder order. Inorder means the left subtree first, then the node itself, then the right subtree.

The tests build a tree with `to_tree([1, None, 2, 3])`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you.

::exercise
---
id: iv-easy-093
prompt: Write a function inorder_traversal(root) that returns the node values in inorder order as a list.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def inorder_traversal(root):
      pass
hints:
  - Inorder means left, then this node, then right. A recursive helper matches that order exactly.
  - An explicit stack also works. Walk as far left as you can while pushing nodes, then pop one, record it, and move to its right side.
tests:
  - check: assert inorder_traversal(to_tree([1, None, 2, 3])) == [1, 3, 2]
  - check: assert inorder_traversal(to_tree([])) == []
  - check: assert inorder_traversal(to_tree([1])) == [1]
  - check: assert inorder_traversal(to_tree([1, 2, 3, 4, 5])) == [4, 2, 5, 1, 3]
  - check: assert inorder_traversal(to_tree([1, None, 2])) == [1, 2]
  - check: assert inorder_traversal(to_tree([2, 1, 3])) == [1, 2, 3]
  - check: assert inorder_traversal(to_tree([1, 2, None, 3])) == [3, 2, 1]
solution: |
  def inorder_traversal(root):
      if root is None:
          return []
      return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right)
brute: |
  def inorder_traversal(root):
      result = []
      stack = []
      node = root
      while stack or node is not None:
          while node is not None:
              stack.append(node)
              node = node.left
          node = stack.pop()
          result.append(node.val)
          node = node.right
      return result
random:
  call: inorder_traversal
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
    def inorder_traversal(root):
        if root is None:
            return []
        return [root.val] + inorder_traversal(root.left) + inorder_traversal(root.right)
  - |
    def inorder_traversal(root):
        if root is None:
            return []
        return inorder_traversal(root.left) + [root.val]
  - |
    def inorder_traversal(root):
        if root is None:
            return []
        return inorder_traversal(root.left) + inorder_traversal(root.right) + [root.val]
---
::
