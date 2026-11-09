---
title: Binary Search Tree Iterator
tier: medium
order: 44
leetcode: 173
url: https://leetcode.com/problems/binary-search-tree-iterator/
companies: [Meta, Amazon, Google]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/02-stacks-and-queues, /learn/week10-algorithms/08-trees]
---

Write a class `BSTIterator` that walks a binary search tree from its smallest value to its largest. The tree has between 0 and 10000 nodes, it is at most 400 levels tall, and no two nodes have the same value.

- `BSTIterator(root)` starts an iterator before the smallest value. `root` is the top node of the tree, or `None` for an empty tree.
- `next()` moves to the next larger value and returns it. It is only called when a value is left.
- `has_next()` returns `True` if a value is left to visit and `False` otherwise. Asking does not move the iterator.

There are at most 20000 calls in all, and the biggest tests call `next` thousands of times on a large tree, so a `next` that starts over from the root each time takes too long.

The tests build the tree with `to_tree([2, 1, 3])`, which reads the values level by level with `None` for a missing child. `TreeNode` and `to_tree` are already defined for you.

::exercise
---
id: iv-medium-044
prompt: Write a class BSTIterator(root) with next() and has_next() that visits the values of a binary search tree from smallest to largest, without starting over on every call.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  class BSTIterator:
      pass
hints:
  - Keep a stack of the nodes still to visit. At the start, push the root and keep pushing its left child until there is none.
  - When next takes a node off the stack, push that node's right child and then that child's left edge. has_next is True exactly when the stack is not empty.
tests:
  - check: it = BSTIterator(to_tree([1])); assert it.has_next(); assert it.next() == 1; assert not it.has_next()
  - check: it = BSTIterator(to_tree([2, 1, 3])); assert [it.next(), it.next(), it.next()] == [1, 2, 3]; assert not it.has_next()
  - check: assert not BSTIterator(to_tree([])).has_next()
  - check: it = BSTIterator(to_tree([2, 1, 4, None, None, 3])); assert [it.next(), it.next(), it.next(), it.next()] == [1, 2, 3, 4]
  - check: it = BSTIterator(to_tree([7, 3, 15, None, None, 9, 20])); assert it.next() == 3; assert it.next() == 7; assert it.has_next(); assert it.next() == 9; assert it.next() == 15; assert it.next() == 20; assert not it.has_next()
  - check: it = BSTIterator(to_tree([4, 3, None, 2, None, 1])); assert [it.next(), it.next(), it.next(), it.next()] == [1, 2, 3, 4]
  - check: it = BSTIterator(to_tree([1, None, 2, None, 3])); assert [it.next(), it.next(), it.next()] == [1, 2, 3]
  - check: it = BSTIterator(to_tree([5, 3, 8])); assert it.has_next() and it.has_next(); assert it.next() == 3; assert it.has_next() and it.next() == 5
big: 'build = lambda lo, hi: None if lo > hi else TreeNode(3 * ((lo + hi) // 2), build(lo, (lo + hi) // 2 - 1), build((lo + hi) // 2 + 1, hi)); it = BSTIterator(build(0, 9999)); out, ok = [], []; [(ok.append(it.has_next()), out.append(it.next())) for _ in range(9999)]; assert all(ok) and out == [3 * i for i in range(9999)] and it.has_next()'
solution: |
  class BSTIterator:
      def __init__(self, root):
          self.stack = []
          self._push_left(root)

      def _push_left(self, node):
          while node is not None:
              self.stack.append(node)
              node = node.left

      def next(self):
          node = self.stack.pop()
          self._push_left(node.right)
          return node.val

      def has_next(self):
          return len(self.stack) > 0
brute: |
  class BSTIterator:
      def __init__(self, root):
          self.values = []
          todo = [root]
          while todo:
              node = todo.pop()
              if node is not None:
                  self.values.append(node.val)
                  todo.append(node.left)
                  todo.append(node.right)
          self.values.sort()
          self.pos = 0

      def next(self):
          self.pos += 1
          return self.values[self.pos - 1]

      def has_next(self):
          return self.pos < len(self.values)
valid: |
  def valid(root, ops, args):
      values, stack, node = [], [], root
      while stack or node is not None:
          while node is not None:
              stack.append(node)
              node = node.left
          node = stack.pop()
          values.append(node.val)
          node = node.right
      if len(values) > 10000 or any(a >= b for a, b in zip(values, values[1:])):
          return False
      height, level = 0, [root] if root is not None else []
      while level:
          height += 1
          level = [c for n in level for c in (n.left, n.right) if c is not None]
      if height > 400:
          return False
      left = len(values)
      for op in ops:
          if op == "next":
              if left == 0:
                  return False
              left -= 1
          elif op != "has_next":
              return False
      return len(ops) == len(args) and len(ops) <= 20000 and all(a == [] for a in args)
random:
  call: _pf_drive
  driver: |
    def _pf_drive(root, ops, args):
        it = BSTIterator(root)
        return [getattr(it, op)(*a) for op, a in zip(ops, args)]
  gen: |
    def gen(rng, size):
        vals = rng.sample(range(-20, 21), rng.randint(0, min(size + 2, 12)))

        def add(t, v):
            if t is None:
                return [v, None, None]
            if v < t[0]:
                t[1] = add(t[1], v)
            else:
                t[2] = add(t[2], v)
            return t

        tree = None
        for v in vals:
            tree = add(tree, v)
        out, queue = [], [tree]
        for t in queue:
            if t is None:
                out.append(None)
            else:
                out.append(t[0])
                queue.append(t[1])
                queue.append(t[2])
        while out and out[-1] is None:
            out.pop()
        ops, args, left = [], [], len(vals)
        for _ in range(rng.randint(1, size + 6)):
            if left and rng.random() < 0.5:
                ops.append("next"); args.append([]); left -= 1
            else:
                ops.append("has_next"); args.append([])
        return (out, ops, args)
  wrap:
    args: [tree, null, null]
wrong:
  - |
    class BSTIterator:
        def __init__(self, root):
            self.stack = [root] if root else []

        def next(self):
            node = self.stack.pop()
            if node.right:
                self.stack.append(node.right)
            if node.left:
                self.stack.append(node.left)
            return node.val

        def has_next(self):
            return len(self.stack) > 0
  - |
    class BSTIterator:
        def __init__(self, root):
            self.stack = []
            node = root
            while node is not None:
                self.stack.append(node)
                node = node.left

        def next(self):
            node = self.stack.pop()
            if node.right is not None:
                self.stack.append(node.right)
            return node.val

        def has_next(self):
            return len(self.stack) > 0
  - |
    class BSTIterator:
        def __init__(self, root):
            self.stack = []
            node = root
            while node is not None:
                self.stack.append(node)
                node = node.left

        def next(self):
            node = self.stack.pop()
            node2 = node.right
            while node2 is not None:
                self.stack.append(node2)
                node2 = node2.left
            return node.val

        def has_next(self):
            return len(self.stack) > 1
  - |
    class BSTIterator:
        def __init__(self, root):
            self.stack = []
            node = root
            while node is not None:
                self.stack.append(node)
                node = node.left

        def next(self):
            node = self.stack.pop()
            node2 = node.right
            while node2 is not None:
                self.stack.append(node2)
                node2 = node2.left
            return node.val

        def has_next(self):
            if self.stack:
                self.next()
            return len(self.stack) > 0
slow:
  - |
    class BSTIterator:
        def __init__(self, root):
            self.root = root
            self.taken = 0
            self.total = len(self._values())

        def _walk(self, node, out):
            if node is not None:
                self._walk(node.left, out)
                out.append(node.val)
                self._walk(node.right, out)

        def _values(self):
            out = []
            self._walk(self.root, out)
            return out

        def next(self):
            self.taken += 1
            return self._values()[self.taken - 1]

        def has_next(self):
            return self.taken < self.total
---
::
