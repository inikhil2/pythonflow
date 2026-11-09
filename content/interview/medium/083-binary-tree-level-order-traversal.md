---
title: Binary Tree Level Order Traversal
tier: medium
order: 83
leetcode: 102
url: https://leetcode.com/problems/binary-tree-level-order-traversal/
companies: [Google, Amazon, Microsoft]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get the root node of a binary tree, or `None` when the tree is empty. The tree has between 0 and 500 nodes, and each `val` is a whole number from -1000 to 1000.

Return the values of the tree grouped by level. The first list holds the root, the next list holds its children from left to right, and so on down to the deepest level. An empty tree returns an empty list.

The tests build a tree with `to_tree([3, 9, 20, None, None, 15, 7])`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you.

::exercise
---
id: iv-medium-083
prompt: Write a function level_order(root) that returns a list with one list of values per level of the binary tree, from the top level down, each read from left to right.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def level_order(root):
      pass
hints:
  - Keep the nodes of the current level in a list, and build the next level from their children.
  - Read each level's values left to right before moving down, so the order inside a level stays correct.
tests:
  - check: assert level_order(to_tree([3, 9, 20, None, None, 15, 7])) == [[3], [9, 20], [15, 7]]
  - check: assert level_order(to_tree([1])) == [[1]]
  - check: assert level_order(to_tree([])) == []
  - check: assert level_order(to_tree([1, 2])) == [[1], [2]]
  - check: assert level_order(to_tree([1, None, 2])) == [[1], [2]]
  - check: assert level_order(to_tree([1, 2, 3, 4, 5, 6, 7])) == [[1], [2, 3], [4, 5, 6, 7]]
  - check: assert level_order(to_tree([1, 2, 3, None, 4, 5])) == [[1], [2, 3], [4, 5]]
  - check: assert level_order(to_tree([1, 2, None, 3, None, 4])) == [[1], [2], [3], [4]]
big: assert level_order(to_tree(list(range(1, 501)))) == [list(range(2 ** k, min(2 ** (k + 1), 501))) for k in range(9)]
solution: |
  def level_order(root):
      if root is None:
          return []
      levels = []
      queue = [root]
      start = 0
      while start < len(queue):
          end = len(queue)
          levels.append([])
          for i in range(start, end):
              node = queue[i]
              levels[-1].append(node.val)
              if node.left is not None:
                  queue.append(node.left)
              if node.right is not None:
                  queue.append(node.right)
          start = end
      return levels
brute: |
  def level_order(root):
      rows = {}
      def walk(node, depth):
          if node is None:
              return
          rows.setdefault(depth, []).append(node.val)
          walk(node.left, depth + 1)
          walk(node.right, depth + 1)
      walk(root, 0)
      return [rows[d] for d in sorted(rows)]
no_slow: "The tree has at most 500 nodes and each method reads every node once, so any correct method stays well inside the step limit."
random:
  call: level_order
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
    def level_order(root):
        levels = []
        level = [root] if root is not None else []
        while level:
            levels.append([node.val for node in level])
            level = [node.left for node in level if node.left is not None]
        return levels
  - |
    def level_order(root):
        levels = []
        level = [root] if root is not None else []
        while level:
            levels.append([node.val for node in level])
            level = [child for node in level for child in (node.left, node.right) if child is not None]
        return levels[::-1]
  - |
    def level_order(root):
        levels = []
        level = [root] if root is not None else []
        while level:
            levels.append([node.val for node in level])
            level = [child for node in level for child in (node.left, node.right)]
        return levels
---
::
