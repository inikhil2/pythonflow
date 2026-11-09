---
title: Binary Tree Right Side View
tier: medium
order: 76
leetcode: 199
url: https://leetcode.com/problems/binary-tree-right-side-view/
companies: [Meta, Amazon, Google]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees, /learn/week10-algorithms/09-graphs]
---

You get the root node of a binary tree, or `None` when the tree is empty. The tree has between 0 and 500 nodes, and each `val` is a whole number from -1000 to 1000.

Stand on the right side of the tree and look at it. For each level, from the top down, the node you can see is the rightmost node on that level, even when it sits at the end of a shorter branch. Return the values you can see, one per level, from the top level down.

The tests build a tree with `to_tree([1, 2, 3, None, 5, None, 4])`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you.

::exercise
---
id: iv-medium-076
prompt: Write a function right_side_view(root) that returns the value of the rightmost node on each level, from the top level down.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def right_side_view(root):
      pass
hints:
  - Walk the tree one full level at a time, keeping the nodes of the current level in a list.
  - The last node in each level's list is the one you see from the right.
tests:
  - check: assert right_side_view(to_tree([1, 2, 3, None, 5, None, 4])) == [1, 3, 4]
  - check: assert right_side_view(to_tree([1, None, 3])) == [1, 3]
  - check: assert right_side_view(to_tree([])) == []
  - check: assert right_side_view(to_tree([1])) == [1]
  - check: assert right_side_view(to_tree([1, 2])) == [1, 2]
  - check: assert right_side_view(to_tree([1, 2, 3, 4])) == [1, 3, 4]
  - check: assert right_side_view(to_tree([1, 2, 3, 4, None, None, None, 5])) == [1, 3, 4, 5]
  - check: assert right_side_view(to_tree([1, 2, 3, None, 4])) == [1, 3, 4]
big: assert right_side_view(to_tree(list(range(1, 501)))) == [min(2 ** (k + 1) - 1, 500) for k in range(9)]
solution: |
  def right_side_view(root):
      if root is None:
          return []
      view = []
      level = [root]
      while level:
          view.append(level[-1].val)
          next_level = []
          for node in level:
              if node.left is not None:
                  next_level.append(node.left)
              if node.right is not None:
                  next_level.append(node.right)
          level = next_level
      return view
brute: |
  def right_side_view(root):
      seen = {}
      def walk(node, depth):
          if node is None:
              return
          seen[depth] = node.val
          walk(node.left, depth + 1)
          walk(node.right, depth + 1)
      walk(root, 0)
      return [seen[d] for d in sorted(seen)]
random:
  call: right_side_view
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
no_slow: "The tree has at most 500 nodes, so even a method that rescans the whole tree for every level stays well inside the step limit."
wrong:
  - |
    def right_side_view(root):
        if root is None:
            return []
        view = []
        level = [root]
        while level:
            view.append(level[0].val)
            next_level = []
            for node in level:
                if node.left is not None:
                    next_level.append(node.left)
                if node.right is not None:
                    next_level.append(node.right)
            level = next_level
        return view
  - |
    def right_side_view(root):
        view = []
        node = root
        while node is not None:
            view.append(node.val)
            node = node.right
        return view
  - |
    def right_side_view(root):
        if root is None:
            return []
        view = []
        level = [root]
        while level:
            view.append(level[-1].val)
            level = [node.left for node in level if node.left is not None]
        return view
---
::
