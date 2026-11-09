---
title: Serialize and Deserialize Binary Tree
tier: hard
order: 51
leetcode: 297
url: https://leetcode.com/problems/serialize-and-deserialize-binary-tree/
companies: [Google, Amazon, Meta]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/08-trees]
---

You write two functions that a program can use to save a binary tree to text and load it back. `serialize(root)` takes the root node, or `None` for an empty tree, and returns a string. `deserialize(data)` takes that string and rebuilds the tree, so the rebuilt tree has the same shape and the same values as the original. The format is up to you, but it must hold every shape, including trees where a node has only one child. A tree has up to 10000 nodes, each `val` is a whole number from -1000 to 1000, and the height is at most 500.

Any format that records each node's value along with where its missing children are will do. Writing a marker for each missing child is one way to make the shape unambiguous. Pick one traversal order and read the values back in exactly that order.

::exercise
---
id: iv-hard-051
prompt: Write serialize(root), which returns a string describing the tree, and deserialize(data), which rebuilds the tree from that string. The tests and checks compare the shape and values after a round trip.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def serialize(root):
      pass

  def deserialize(data):
      pass
hints:
  - Write a marker for each missing child, so the reader knows where each subtree ends.
  - Read the values back in the same order you wrote them, and keep one position in the text that moves forward.
tests:
  - check: assert isinstance(serialize(to_tree([1, 2, 3])), str)
  - check: assert deserialize(serialize(to_tree([]))) is None
  - check: assert from_tree(deserialize(serialize(to_tree([0])))) == [0]
  - check: assert from_tree(deserialize(serialize(to_tree([1, 2, 3])))) == [1, 2, 3]
  - check: assert from_tree(deserialize(serialize(to_tree([1, None, 2])))) == [1, None, 2]
  - check: assert from_tree(deserialize(serialize(to_tree([7, None, 8])))) == [7, None, 8]
  - check: assert from_tree(deserialize(serialize(to_tree([-1, -1, 0, None, 3])))) == [-1, -1, 0, None, 3]
  - check: assert from_tree(deserialize(serialize(to_tree([1, 2, 3, 4, 5, None, None, 6])))) == [1, 2, 3, 4, 5, None, None, 6]
  - check: assert from_tree(deserialize(serialize(to_tree([5, 4, 8, 11, None, 13, 4])))) == [5, 4, 8, 11, None, 13, 4]
solution: |
  def serialize(root):
      out = []
      queue = [root]
      for node in queue:
          if node is None:
              out.append('#')
          else:
              out.append(str(node.val))
              queue.append(node.left)
              queue.append(node.right)
      return ','.join(out)

  def deserialize(data):
      parts = data.split(',')
      if parts[0] == '#':
          return None
      root = TreeNode(int(parts[0]))
      queue = [root]
      i = 1
      for node in queue:
          if parts[i] != '#':
              node.left = TreeNode(int(parts[i]))
              queue.append(node.left)
          i += 1
          if parts[i] != '#':
              node.right = TreeNode(int(parts[i]))
              queue.append(node.right)
          i += 1
      return root
brute: |
  def serialize(root):
      out = []

      def walk(node):
          if node is None:
              out.append('N')
              return
          out.append(str(node.val))
          walk(node.left)
          walk(node.right)

      walk(root)
      return ' '.join(out)

  def deserialize(data):
      tokens = iter(data.split())

      def build():
          tok = next(tokens)
          if tok == 'N':
              return None
          node = TreeNode(int(tok))
          node.left = build()
          node.right = build()
          return node

      return build()
random:
  call: _pf_rt
  driver: |
    def _pf_rt(root):
        return deserialize(serialize(root))
  gen: |
    def gen(rng, size):
        n = rng.randint(1, min(size + 3, 8))
        return ([rng.randint(-3, 3)] + [rng.choice([None, rng.randint(-3, 3)]) for _ in range(n - 1)],)
  wrap:
    args: [tree]
    result: tree
big: 'assert from_tree(deserialize(serialize(to_tree([(i * 7919) % 2001 - 1000 for i in range(10000)])))) == from_tree(to_tree([(i * 7919) % 2001 - 1000 for i in range(10000)]))'
no_slow: The tree has at most 10000 nodes, so a single pass over the nodes finishes at once. Any slower way to write or read the text gives the same answer at this size.
wrong:
  - |
    def serialize(root):
        out = []
        queue = [root]
        for node in queue:
            if node is not None:
                out.append(str(node.val))
                queue.append(node.left)
                queue.append(node.right)
        return ','.join(out)

    def deserialize(data):
        vals = data.split(',') if data else []
        if not vals:
            return None
        root = TreeNode(int(vals[0]))
        queue = [root]
        i = 1
        for node in queue:
            if i < len(vals):
                node.left = TreeNode(int(vals[i]))
                queue.append(node.left)
                i += 1
            if i < len(vals):
                node.right = TreeNode(int(vals[i]))
                queue.append(node.right)
                i += 1
        return root
  - |
    def serialize(root):
        out = []

        def walk(node):
            if node is None:
                out.append('N')
                return
            out.append(str(node.val))
            walk(node.left)
            walk(node.right)

        walk(root)
        return ' '.join(out)

    def deserialize(data):
        tokens = iter(data.split())

        def build():
            tok = next(tokens)
            if tok == 'N':
                return None
            node = TreeNode(int(tok))
            node.right = build()
            node.left = build()
            return node

        return build()
  - |
    def serialize(root):
        out = []
        queue = [root]
        for node in queue:
            if node is None:
                out.append('#')
            else:
                out.append(str(node.val))
                queue.append(node.left)
                queue.append(node.right)
        return out

    def deserialize(data):
        parts = data
        if parts[0] == '#':
            return None
        root = TreeNode(int(parts[0]))
        queue = [root]
        i = 1
        for node in queue:
            if parts[i] != '#':
                node.left = TreeNode(int(parts[i]))
                queue.append(node.left)
            i += 1
            if parts[i] != '#':
                node.right = TreeNode(int(parts[i]))
                queue.append(node.right)
            i += 1
        return root
---
::
