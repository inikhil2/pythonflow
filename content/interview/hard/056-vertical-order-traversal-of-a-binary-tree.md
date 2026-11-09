---
title: Vertical Order Traversal of a Binary Tree
tier: hard
order: 56
leetcode: 987
url: https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/
companies: [Amazon, Microsoft, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/08-trees]
---

You get the root of a binary tree, or `None` for an empty tree. The tree has between 0 and 1000 nodes, each value is a whole number from -1000 to 1000, and the tree is at most 500 levels deep. Picture the tree from above. The root sits in column 0. A left child is one column to the left of its parent, and a right child is one column to the right. Each node's row is its level, with the root on row 0.

Return a list with one list for each column, from the leftmost column to the rightmost. Inside a column, list the values from the top row down. Two nodes can share both a column and a row, and then the smaller value comes first. An empty tree gives an empty list.

A walk that records each node's column and row, followed by one sort, is enough. Sorting a column by row alone is not enough, because two nodes can share a row and a column.

::exercise
---
id: iv-hard-056
prompt: Write a function vertical_order(root) that returns the values of the binary tree grouped by column, from left to right, each column listed top to bottom with ties by value.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def vertical_order(root):
      pass
hints:
  - Give the root column 0 and row 0. A left child gets column minus one and row plus one, and a right child gets column plus one and row plus one.
  - Collect (column, row, value) for every node, then sort. Grouping equal columns after the sort gives the answer.
tests:
  - check: assert vertical_order(to_tree([3, 9, 20, None, None, 15, 7])) == [[9], [3, 15], [20], [7]]
  - check: assert vertical_order(to_tree([1, 2, 3, 4, 5, 6, 7])) == [[4], [2], [1, 5, 6], [3], [7]]
  - check: assert vertical_order(to_tree([])) == []
  - check: assert vertical_order(to_tree([1])) == [[1]]
  - check: assert vertical_order(to_tree([1, 2])) == [[2], [1]]
  - check: assert vertical_order(to_tree([1, None, 2])) == [[1], [2]]
  - check: assert vertical_order(to_tree([1, 2, 3, None, 9, 4, None])) == [[2], [1, 4, 9], [3]]
  - check: assert vertical_order(to_tree([1, 2, 3, None, 4, 9, None])) == [[2], [1, 4, 9], [3]]
  - check: assert vertical_order(to_tree([1, 2, None, 3])) == [[3], [2], [1]]
  - check: assert vertical_order(to_tree([-1, -2, -3])) == [[-2], [-1], [-3]]
  - check: assert vertical_order(to_tree([1, 2, 3, None, 4, None, None, None, 5])) == [[2], [1, 4], [3, 5]]
big: "assert sum((i * 1009 + j + 1) * x for i, col in enumerate(vertical_order((lambda build: build(build, 0))(lambda build, k: None if k == 333 else TreeNode((3 * k * 7919) % 2001 - 1000, TreeNode(((3 * k + 1) * 7919) % 2001 - 1000, None, TreeNode(((3 * k + 2) * 7919) % 2001 - 1000)), build(build, k + 1))))) for j, x in enumerate(col)) == 601503453"
solution: |
  def vertical_order(root):
      if root is None:
          return []
      points = []
      queue = [(root, 0, 0)]
      for node, col, row in queue:
          points.append((col, row, node.val))
          if node.left is not None:
              queue.append((node.left, col - 1, row + 1))
          if node.right is not None:
              queue.append((node.right, col + 1, row + 1))
      points.sort()
      groups = []
      last = None
      for col, row, val in points:
          if col != last:
              groups.append([])
              last = col
          groups[-1].append(val)
      return groups
brute: |
  def vertical_order(root):
      found = []
      def walk(node, col, row):
          if node is None:
              return
          found.append((col, row, node.val))
          walk(node.left, col - 1, row + 1)
          walk(node.right, col + 1, row + 1)
      walk(root, 0, 0)
      result = []
      for c in sorted(set(c for c, _, _ in found)):
          column = sorted((r, v) for cc, r, v in found if cc == c)
          result.append([v for _, v in column])
      return result
random:
  call: vertical_order
  gen: |
    def gen(rng, size):
        n = max(size, 1)
        arr = [rng.randint(-3, 3)] + [rng.choice([None, rng.randint(-3, 3), rng.randint(-3, 3)]) for _ in range(2 * n)]
        return (arr,)
  wrap:
    args: [tree]
slow:
  - |
    def vertical_order(root):
        if root is None:
            return []
        cols, rows = [], []
        def span(node, col, row):
            if node is not None:
                cols.append(col)
                rows.append(row)
                span(node.left, col - 1, row + 1)
                span(node.right, col + 1, row + 1)
        span(root, 0, 0)
        result = []
        for c in range(min(cols), max(cols) + 1):
            column = []
            for r in range(max(rows) + 1):
                cell = []
                def hit(node, col, row):
                    if node is not None:
                        if col == c and row == r:
                            cell.append(node.val)
                        hit(node.left, col - 1, row + 1)
                        hit(node.right, col + 1, row + 1)
                hit(root, 0, 0)
                column += sorted(cell)
            if column:
                result.append(column)
        return result
wrong:
  - |
    def vertical_order(root):
        if root is None:
            return []
        points = []
        queue = [(root, 0, 0)]
        for node, col, row in queue:
            points.append((col, row, node.val))
            if node.left is not None:
                queue.append((node.left, col - 1, row + 1))
            if node.right is not None:
                queue.append((node.right, col + 1, row + 1))
        points.sort(key=lambda p: (p[0], p[1]))
        groups = []
        last = None
        for col, row, val in points:
            if col != last:
                groups.append([])
                last = col
            groups[-1].append(val)
        return groups
  - |
    def vertical_order(root):
        if root is None:
            return []
        found = {}
        def walk(node, col, row):
            if node is None:
                return
            found.setdefault(col, []).append((row, node.val))
            walk(node.left, col - 1, row + 1)
            walk(node.right, col + 1, row + 1)
        walk(root, 0, 0)
        return [[v for _, v in sorted(found[c])] for c in found]
  - |
    def vertical_order(root):
        if root is None:
            return []
        points = []
        queue = [(root, 0, 0)]
        for node, col, row in queue:
            points.append((col, row, node.val))
            if node.left is not None:
                queue.append((node.left, col + 1, row + 1))
            if node.right is not None:
                queue.append((node.right, col - 1, row + 1))
        points.sort()
        groups = []
        last = None
        for col, row, val in points:
            if col != last:
                groups.append([])
                last = col
            groups[-1].append(val)
        return groups
equivalent:
  - "5: queue = [(root, 1, 0)]"   # why: moving every column by the same amount keeps the order and the groups, and the answer holds no column numbers
  - "5: queue = [(root, -1, 0)]"   # why: same shift, to the left
  - "5: queue = [(root, 0, 1)]"   # why: moving every row by the same amount keeps the order inside each column
  - "5: queue = [(root, 0, -1)]"   # why: same shift, upward
  - "9: queue.append((node.left, col - 1, row + 2))"   # why: in one column the number of left steps alone sets the order, and a row step of 2 per left step is still increasing in it, so the order is unchanged
  - "9: queue.append((node.left, col - 1, row + 0))"   # why: same argument, with a row step of 0 per left step, which is still increasing in the number of left steps
  - "11: queue.append((node.right, col + 1, row + 2))"   # why: a column fixes the right steps, so the row is 2c plus 3 times the left steps, still increasing in them
  - "11: queue.append((node.right, col + 1, row + 0))"   # why: same argument, with a row of just the left steps, still increasing in them
---
::
