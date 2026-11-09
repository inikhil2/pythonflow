---
title: Validate Binary Search Tree
tier: medium
order: 84
leetcode: 98
url: https://leetcode.com/problems/validate-binary-search-tree/
companies: [Google, Amazon, Meta]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get the root node of a binary tree, or `None` when the tree is empty. The tree has between 0 and 500 nodes, and each `val` is a whole number from -1000 to 1000.

A binary search tree is valid when every node's value is strictly greater than every value in its left subtree and strictly smaller than every value in its right subtree. An empty tree is valid. Return `True` if the tree is a valid binary search tree, and `False` otherwise. Duplicate values are not allowed.

The tests build a tree with `to_tree([2, 1, 3])`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you.

::exercise
---
id: iv-medium-084
prompt: Write a function is_valid_bst(root) that returns True if the binary tree is a valid binary search tree, and False otherwise.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def is_valid_bst(root):
      pass
hints:
  - Each node must fall inside a range of allowed values, and that range shrinks as you go down.
  - A left child is limited by its parent's value from above, and a right child is limited from below.
tests:
  - check: assert is_valid_bst(to_tree([2, 1, 3])) == True
  - check: assert is_valid_bst(to_tree([5, 1, 4, None, None, 3, 6])) == False
  - check: assert is_valid_bst(to_tree([])) == True
  - check: assert is_valid_bst(to_tree([1])) == True
  - check: assert is_valid_bst(to_tree([2, 2])) == False
  - check: assert is_valid_bst(to_tree([2, 1, 2])) == False
  - check: assert is_valid_bst(to_tree([10, 5, 15, None, None, 6, 20])) == False
  - check: assert is_valid_bst(to_tree([3, 1, 5, 0, 2, 4, 6])) == True
  - check: assert is_valid_bst(to_tree([1, None, 2, None, 3])) == True
  - check: assert is_valid_bst(to_tree([5, None, 8, 6, None, 5])) == False
big: assert is_valid_bst(to_tree([(2 * (i + 1 - 2 ** ((i + 1).bit_length() - 1)) + 1) * 2 ** (8 - (i + 1).bit_length()) for i in range(255)])) == True and is_valid_bst(to_tree([0 if i == 191 else (2 * (i + 1 - 2 ** ((i + 1).bit_length() - 1)) + 1) * 2 ** (8 - (i + 1).bit_length()) for i in range(255)])) == False
solution: |
  def is_valid_bst(root):
      def check(node, low, high):
          if node is None:
              return True
          if not (low < node.val < high):
              return False
          return check(node.left, low, node.val) and check(node.right, node.val, high)
      return check(root, float("-inf"), float("inf"))
brute: |
  def is_valid_bst(root):
      values = []
      def walk(node):
          if node is None:
              return
          walk(node.left)
          values.append(node.val)
          walk(node.right)
      walk(root)
      return all(a < b for a, b in zip(values, values[1:]))
no_slow: "A valid check needs one pass over the nodes, and any slower correct method still stays within the step limit at 500 nodes."
random:
  call: is_valid_bst
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
wrong:
  - |
    def is_valid_bst(root):
        def ok(node):
            if node is None:
                return True
            if node.left is not None and node.left.val >= node.val:
                return False
            if node.right is not None and node.right.val <= node.val:
                return False
            return ok(node.left) and ok(node.right)
        return ok(root)
  - |
    def is_valid_bst(root):
        def check(node, low, high):
            if node is None:
                return True
            if not (low <= node.val <= high):
                return False
            return check(node.left, low, node.val) and check(node.right, node.val, high)
        return check(root, float("-inf"), float("inf"))
  - |
    def is_valid_bst(root):
        values = []
        def walk(node):
            if node is None:
                return
            walk(node.left)
            values.append(node.val)
            walk(node.right)
        walk(root)
        return values == sorted(values)
---
::
