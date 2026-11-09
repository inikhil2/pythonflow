---
title: Same Tree
tier: easy
order: 87
leetcode: 100
url: https://leetcode.com/problems/same-tree/
companies: [Google, Amazon, Meta]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get the roots of two binary trees, `p` and `q`. Each tree has between 0 and 100 nodes, and each `val` is a whole number from -10 to 10. A root may be `None` for an empty tree.

Return `True` if the two trees are the same, meaning they have the same shape and the same value at every matching position. Return `False` if not.

The tests build trees with `to_tree([1, 2, 3])`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you.

::exercise
---
id: iv-easy-087
prompt: Write a function is_same_tree(p, q) that returns True if the two binary trees have the same shape and values, and False otherwise.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def is_same_tree(p, q):
      pass
hints:
  - If both positions are empty, they match. If only one is empty, they do not.
  - Otherwise compare the values, then compare the left sides and the right sides.
tests:
  - check: assert is_same_tree(to_tree([1, 2, 3]), to_tree([1, 2, 3])) == True
  - check: assert is_same_tree(to_tree([1, 2]), to_tree([1, None, 2])) == False
  - check: assert is_same_tree(to_tree([]), to_tree([])) == True
  - check: assert is_same_tree(to_tree([]), to_tree([1])) == False
  - check: assert is_same_tree(to_tree([1, 2, 1]), to_tree([1, 1, 2])) == False
  - check: assert is_same_tree(to_tree([0]), to_tree([0])) == True
  - check: assert is_same_tree(to_tree([1, 2, None, 3]), to_tree([1, 2, None, 3])) == True
  - check: assert is_same_tree(to_tree([1, None, 2]), to_tree([1, 2])) == False
solution: |
  def is_same_tree(p, q):
      if p is None or q is None:
          return p is q
      return p.val == q.val and is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)
brute: |
  def is_same_tree(p, q):
      return from_tree(p) == from_tree(q)
random:
  call: is_same_tree
  gen: |
    def gen(rng, size):
        p = [rng.randint(-2, 2)] + [rng.choice([None, rng.randint(-2, 2)]) for _ in range(size)]
        q = list(p)
        if rng.random() < 0.5:
            i = rng.randrange(len(q))
            q[i] = rng.choice([None, rng.randint(-2, 2)])
        return (p, q)
  wrap:
    args: [tree, tree]
wrong:
  - |
    def is_same_tree(p, q):
        if p is None or q is None:
            return p is q
        return p.val == q.val and is_same_tree(p.left, q.right) and is_same_tree(p.right, q.left)
  - |
    def is_same_tree(p, q):
        if p is None or q is None:
            return True
        return p.val == q.val and is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)
  - |
    def is_same_tree(p, q):
        if p is None and q is None:
            return True
        if p is None or q is None:
            return False
        return p.val == q.val
---
::
