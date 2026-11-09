---
title: Lowest Common Ancestor of a Binary Tree
tier: medium
order: 73
leetcode: 236
url: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/
companies: [Meta, Amazon, Google]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees, /learn/week10-algorithms/09-graphs]
---

You get the root node of a binary tree, plus two values p and q that are both in the tree. The tree has between 2 and 20000 nodes, it is at most 400 levels tall, every value is different from every other value, and each value is from 0 to 20000. p and q may be the same value. Return the value of the lowest node that has both p and q somewhere below it. A node counts as below itself, so if p is an ancestor of q, the answer is p.

Ask each subtree whether it holds p, whether it holds q, or neither. If both the left and the right subtree hold one of them, the current node is the answer. Otherwise the answer is inside whichever side holds something.

::exercise
---
id: iv-medium-073
prompt: Write a function lowest_common_ancestor(root, p, q) that returns the value of the lowest node that has both p and q at or below it.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def lowest_common_ancestor(root, p, q):
      pass
hints:
  - Return the node's value as soon as it equals p or q.
  - If the left and right answers are both found, this node is the lowest common ancestor.
tests:
  - check: assert lowest_common_ancestor(to_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]), 5, 1) == 3
  - check: assert lowest_common_ancestor(to_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]), 5, 4) == 5
  - check: assert lowest_common_ancestor(to_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]), 7, 4) == 2
  - check: assert lowest_common_ancestor(to_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]), 0, 8) == 1
  - check: assert lowest_common_ancestor(to_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]), 6, 6) == 6
  - check: assert lowest_common_ancestor(to_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]), 3, 7) == 3
  - check: assert lowest_common_ancestor(to_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]), 2, 1) == 3
  - check: assert lowest_common_ancestor(to_tree([1, 2]), 2, 1) == 1
big: assert lowest_common_ancestor(to_tree(list(range(20000))), 19999, 19998) == 311
solution: |
  def lowest_common_ancestor(root, p, q):
      if root is None:
          return None
      if root.val in (p, q):
          return root.val
      left = lowest_common_ancestor(root.left, p, q)
      right = lowest_common_ancestor(root.right, p, q)
      if left is not None and right is not None:
          return root.val
      return left if left is not None else right
brute: |
  def lowest_common_ancestor(root, p, q):
      def path(node, target):
          if node is None:
              return None
          if node.val == target:
              return [node.val]
          for child in (node.left, node.right):
              rest = path(child, target)
              if rest is not None:
                  return [node.val] + rest
          return None
      a = path(root, p)
      b = path(root, q)
      answer = None
      for x, y in zip(a, b):
          if x != y:
              break
          answer = x
      return answer
valid: |
  def valid(root, p, q):
      vals, height, level = [], 0, [root] if root is not None else []
      while level:
          height += 1
          vals += [n.val for n in level]
          level = [c for n in level for c in (n.left, n.right) if c is not None]
      if height > 400 or not 2 <= len(vals) <= 20000 or len(set(vals)) != len(vals):
          return False
      return all(0 <= v <= 20000 for v in vals) and p in vals and q in vals
random:
  call: lowest_common_ancestor
  gen: |
    def gen(rng, size):
        m = max(2, min(size, 12))
        vals = rng.sample(range(1, 40), m)
        left, right = [None] * m, [None] * m
        for k in range(1, m):
            free = [(p, side) for p in range(k) for side in (left, right) if side[p] is None]
            p, side = rng.choice(free)
            side[p] = k
        out, queue = [], [0]
        for i in queue:
            out.append(None if i is None else vals[i])
            if i is not None:
                queue += [left[i], right[i]]
        while out and out[-1] is None:
            out.pop()
        p, q = rng.sample(vals, 2)
        return (out, p, q)
  wrap:
    args: [tree, null, null]
slow:
  - |
    def lowest_common_ancestor(root, p, q):
        def path(node, target):
            if node is None:
                return None
            if node.val == target:
                return [node]
            for child in (node.left, node.right):
                rest = path(child, target)
                if rest is not None:
                    return [node] + rest
            return None
        def all_nodes(node):
            out, stack = [], [node]
            while stack:
                cur = stack.pop()
                if cur is None:
                    continue
                out.append(cur)
                stack.append(cur.left)
                stack.append(cur.right)
            return out
        best, best_depth = None, -1
        for node in all_nodes(root):
            if node in path(root, p) and node in path(root, q):
                depth = len(path(root, node.val))
                if depth > best_depth:
                    best, best_depth = node, depth
        return best.val
wrong:
  - |
    def lowest_common_ancestor(root, p, q):
        return root.val
  - |
    def lowest_common_ancestor(root, p, q):
        if root is None:
            return None
        if root.val in (p, q):
            return root.val
        left = lowest_common_ancestor(root.left, p, q)
        if left is not None:
            return left
        return lowest_common_ancestor(root.right, p, q)
  - |
    def lowest_common_ancestor(root, p, q):
        while root is not None:
            if p < root.val and q < root.val:
                root = root.left
            elif p > root.val and q > root.val:
                root = root.right
            else:
                return root.val
---
::
