---
title: Check Completeness of a Binary Tree
tier: medium
order: 77
leetcode: 958
url: https://leetcode.com/problems/check-completeness-of-a-binary-tree/
companies: [Meta, Amazon, Microsoft]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees, /learn/week10-algorithms/09-graphs]
---

You get the root node of a binary tree, or `None` when the tree is empty. The tree has between 0 and 500 nodes, and each `val` is a whole number from -1000 to 1000.

A tree is complete when every level is full, except possibly the last level, and the nodes on the last level are packed to the left with no gaps. An empty tree counts as complete. Return `True` if the tree is complete, and `False` otherwise.

The tests build a tree with `to_tree([1, 2, 3, 4, 5, None, 7])`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you.

::exercise
---
id: iv-medium-077
prompt: Write a function is_complete_tree(root) that returns True if the binary tree is complete, and False otherwise.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def is_complete_tree(root):
      pass
hints:
  - Visit the nodes level by level, and treat each missing child as a placeholder you still record.
  - Once you have seen a placeholder, any real node that comes later means the tree is not complete.
tests:
  - check: assert is_complete_tree(to_tree([1, 2, 3, 4, 5, 6])) == True
  - check: assert is_complete_tree(to_tree([1, 2, 3, 4, 5, None, 7])) == False
  - check: assert is_complete_tree(to_tree([])) == True
  - check: assert is_complete_tree(to_tree([1])) == True
  - check: assert is_complete_tree(to_tree([1, 2])) == True
  - check: assert is_complete_tree(to_tree([1, None, 2])) == False
  - check: assert is_complete_tree(to_tree([1, 2, None, 4])) == False
  - check: assert is_complete_tree(to_tree([1, 2, 3, 4, None, None, None, 8])) == False
  - check: assert is_complete_tree(to_tree([1, 2, 3, 4, 5, 6, 7, 8])) == True
big: assert is_complete_tree(to_tree(list(range(1, 501)))) == True and is_complete_tree(to_tree([i + 1 if i != 250 else None for i in range(500)])) == False
solution: |
  def is_complete_tree(root):
      queue = [root]
      seen_gap = False
      i = 0
      while i < len(queue):
          node = queue[i]
          i += 1
          if node is None:
              seen_gap = True
          else:
              if seen_gap:
                  return False
              queue.append(node.left)
              queue.append(node.right)
      return True
brute: |
  def is_complete_tree(root):
      positions = []
      def walk(node, index):
          if node is None:
              return
          positions.append(index)
          walk(node.left, 2 * index)
          walk(node.right, 2 * index + 1)
      walk(root, 1)
      return not positions or max(positions) == len(positions)
random:
  call: is_complete_tree
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
no_slow: "The tree has at most 500 nodes, so every method, including one that rebuilds the level order for each node, finishes well inside the step limit."
wrong:
  - |
    def is_complete_tree(root):
        def ok(node):
            if node is None:
                return True
            if node.right is not None and node.left is None:
                return False
            return ok(node.left) and ok(node.right)
        return ok(root)
  - |
    def is_complete_tree(root):
        queue = [root]
        i = 0
        while i < len(queue):
            node = queue[i]
            i += 1
            if node is None:
                return True
            queue.append(node.left)
            queue.append(node.right)
        return True
  - |
    def is_complete_tree(root):
        count, depth = 0, 0
        level = [root] if root is not None else []
        while level:
            depth += 1
            count += len(level)
            level = [child for node in level for child in (node.left, node.right) if child is not None]
        return count == 2 ** depth - 1
---
::
