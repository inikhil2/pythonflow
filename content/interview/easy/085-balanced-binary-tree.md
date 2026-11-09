---
title: Balanced Binary Tree
tier: easy
order: 85
leetcode: 110
url: https://leetcode.com/problems/balanced-binary-tree/
companies: [Google, Amazon, Meta]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get the root node of a binary tree, or `None` when the tree is empty. The tree has between 0 and 500 nodes, and each `val` is a whole number from -100 to 100.

A tree is balanced when, at every node, the depth of the left side and the depth of the right side differ by at most 1. An empty tree is balanced, and a missing child counts as depth 0. Return `True` if the tree is balanced and `False` if not.

The tests build a tree with `to_tree([3, 9, 20, None, None, 15, 7])`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you.

::exercise
---
id: iv-easy-085
prompt: Write a function is_balanced(root) that returns True if the binary tree is balanced and False otherwise.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def is_balanced(root):
      pass
hints:
  - Measure the depth of each side with a helper that also reports when a part is already unbalanced.
  - Use a sentinel value such as -1 to mean unbalanced, so one walk is enough.
tests:
  - check: assert is_balanced(to_tree(list(range(1, 16)))) == True
  - check: assert is_balanced(to_tree([3, 9, 20, None, None, 15, 7])) == True
  - check: assert is_balanced(to_tree([1, 2, 2, 3, 3, None, None, 4, 4])) == False
  - check: assert is_balanced(to_tree([])) == True
  - check: assert is_balanced(to_tree([1])) == True
  - check: assert is_balanced(to_tree([1, None, 2])) == True
  - check: assert is_balanced(to_tree([1, None, 2, None, 3])) == False
  - check: assert is_balanced(to_tree([1, 2, None, 3])) == False
  - check: assert is_balanced(to_tree([1, 2, 3, 4, 5, 6, 7])) == True
solution: |
  def is_balanced(root):
      def height(node):
          if node is None:
              return 0
          left = height(node.left)
          right = height(node.right)
          if left == -1 or right == -1 or abs(left - right) > 1:
              return -1
          return 1 + max(left, right)
      return height(root) != -1
brute: |
  def is_balanced(root):
      def depth(node):
          if node is None:
              return 0
          return 1 + max(depth(node.left), depth(node.right))
      def check(node):
          if node is None:
              return True
          if abs(depth(node.left) - depth(node.right)) > 1:
              return False
          return check(node.left) and check(node.right)
      return check(root)
random:
  call: is_balanced
  gen: |
    def gen(rng, size):
        size = min(size, 500)
        if rng.random() < 0.5:
            return ([rng.randint(-5, 5) for _ in range(size)],)
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
    def is_balanced(root):
        def height(node):
            if node is None:
                return 0
            return 1 + max(height(node.left), height(node.right))
        return height(root) < 4
  - |
    def is_balanced(root):
        def height(node):
            if node is None:
                return 0
            left = height(node.left)
            right = height(node.right)
            if left == -1 or right == -1 or abs(left - right) > 2:
                return -1
            return 1 + max(left, right)
        return height(root) != -1
  - |
    def is_balanced(root):
        if root is None:
            return True
        return abs((1 if root.left else 0) - (1 if root.right else 0)) <= 1
equivalent:
  - return 1  # why: a missing child counting as depth 1 shifts every real subtree height by 1 as well, so every left-right difference and the -1 sentinel stay the same
---
::
