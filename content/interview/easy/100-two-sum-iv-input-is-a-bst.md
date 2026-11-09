---
title: Two Sum IV - Input Is a BST
tier: easy
order: 100
leetcode: 653
url: https://leetcode.com/problems/two-sum-iv-input-is-a-bst/
companies: [Amazon, Google, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get the root node of a binary search tree, or `None` when the tree is empty, and a whole number `k`. The tree has between 0 and 500 nodes, each `val` is a whole number from -1000 to 1000, and `k` is from -2000 to 2000.

Return `True` if there are two different nodes in the tree whose values add up to `k`, and `False` otherwise. The two nodes must be different nodes, so one value cannot be used twice just because it is there. An empty tree returns `False`. Every value in the tree is different, so each value sits in exactly one node.

The tests build a tree with `to_tree([5, 3, 6, 2, 4, None, 7])`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you.

::exercise
---
id: iv-easy-100
prompt: Write a function find_target(root, k) that returns True if two different nodes in the binary search tree have values that add up to k, and False otherwise.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def find_target(root, k):
      pass
hints:
  - Visit each node and remember the values you have already seen. For each node, ask whether k minus its value was seen before.
  - Check for a match before you record the current value, so a node never pairs with itself.
tests:
  - check: assert find_target(to_tree([5, 3, 6, 2, 4, None, 7]), 9) == True
  - check: assert find_target(to_tree([5, 3, 6, 2, 4, None, 7]), 28) == False
  - check: assert find_target(to_tree([2, 1, 3]), 4) == True
  - check: assert find_target(to_tree([2, 1, 3]), 1) == False
  - check: assert find_target(to_tree([2, 1, 3]), 6) == False
  - check: assert find_target(to_tree([1]), 2) == False
  - check: assert find_target(to_tree([]), 0) == False
solution: |
  def find_target(root, k):
      seen = {}
      def walk(node):
          if node is None:
              return False
          if seen.get(k - node.val):
              return True
          seen[node.val] = True
          return walk(node.left) or walk(node.right)
      return walk(root)
brute: |
  def find_target(root, k):
      values = []
      stack = [root] if root is not None else []
      while stack:
          node = stack.pop()
          values.append(node.val)
          for child in (node.left, node.right):
              if child is not None:
                  stack.append(child)
      for i in range(len(values)):
          for j in range(len(values)):
              if i != j and values[i] + values[j] == k:
                  return True
      return False
random:
  call: find_target
  gen: |
    def gen(rng, size):
        vals = sorted(rng.sample(range(-30, 31), min(max(size, 1), 60)))
        out = []
        queue = [(0, len(vals))]
        while queue:
            lo, hi = queue.pop(0)
            if lo >= hi:
                out.append(None)
                continue
            mid = (lo + hi) // 2
            out.append(vals[mid])
            queue.append((lo, mid))
            queue.append((mid + 1, hi))
        while out and out[-1] is None:
            out.pop()
        if rng.random() < 0.5:
            k = rng.choice(vals) + rng.choice(vals)
        else:
            k = rng.randint(-60, 60)
        return (out, k)
  wrap:
    args: [tree, null]
wrong:
  - |
    def find_target(root, k):
        seen = {}
        def walk(node):
            if node is None:
                return False
            seen[node.val] = True
            if seen.get(k - node.val):
                return True
            return walk(node.left) or walk(node.right)
        return walk(root)
  - |
    def find_target(root, k):
        if root is None:
            return False
        return any(c is not None and c.val + root.val == k for c in (root.left, root.right))
---
::
