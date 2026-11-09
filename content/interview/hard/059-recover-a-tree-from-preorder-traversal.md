---
title: Recover a Tree From Preorder Traversal
tier: hard
order: 59
leetcode: 1028
url: https://leetcode.com/problems/recover-a-tree-from-preorder-traversal/
companies: [Amazon, Google, Meta]
topic: Tree
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/08-trees]
---

You get a text string that describes a binary tree written in preorder: visit the node, then its left subtree, then its right subtree. Each node is written as dashes followed by its value. The number of dashes is the node's depth, so the root has no dashes, its children have one dash, and so on. Values are whole numbers from 1 to 99, written in digits with no dashes inside. The string is never empty. It has at most 300 nodes, and the string is at most 50000 characters long. Every node has at most two children, and the string always describes a valid tree.

Build the tree and return its root, which is a TreeNode from the prelude. Each node's left child comes before its right child in the string. A node's depth is one more than its parent's depth, and a node's parent is the most recent earlier node whose depth is one less.

Keep the nodes that are still open on a stack, one per depth. When a new node arrives with depth d, drop every stack entry at depth d or deeper. The node left on top is its parent. Attaching the node to the parent's left slot first, and to the right slot if the left is taken, is enough.

::exercise
---
id: iv-hard-059
prompt: Write a function recover_from_preorder(traversal) that rebuilds the binary tree described by the string and returns its root as a TreeNode.
prelude: nodes
starter: |
  # write your code below
  def recover_from_preorder(traversal):
      pass
hints:
  - Read each dash run as a depth, then read the digits that follow as the value.
  - Keep a stack of open nodes indexed by depth, and cut it back to the new node's depth before you attach it.
tests:
  - check: assert from_tree(recover_from_preorder("1")) == [1]
  - check: assert from_tree(recover_from_preorder("1-2")) == [1, 2]
  - check: assert from_tree(recover_from_preorder("1-2-3")) == [1, 2, 3]
  - check: assert from_tree(recover_from_preorder("1-2--3-4")) == [1, 2, 4, 3]
  - check: assert from_tree(recover_from_preorder("1-2--3--4-5--6--7")) == [1, 2, 5, 3, 4, 6, 7]
  - check: assert from_tree(recover_from_preorder("5-12--9--7-30")) == [5, 12, 30, 9, 7]
  - check: assert from_tree(recover_from_preorder("10-20--30---40----50")) == [10, 20, None, 30, None, 40, None, 50]
  - check: assert from_tree(recover_from_preorder("100-7--23")) == [100, 7, None, 23]
  - check: assert from_tree(recover_from_preorder("3-4--5")) == [3, 4, None, 5]
  - check: assert from_tree(recover_from_preorder("8-1-2--3")) == [8, 1, 2, None, None, 3]
big: 'assert sum(i * (x or 0) for i, x in enumerate(from_tree(recover_from_preorder("".join("-" * d + str((n * 7919) % 99 + 1) for n, d in sorted(((n, n.bit_length() - 1) for n in range(1, 301)), key=lambda p: (p[0] << (8 - p[1]), p[1]))))))) == 2042860'
solution: |
  def recover_from_preorder(traversal):
      stack = []
      i = 0
      while i < len(traversal):
          depth = 0
          while traversal[i] == "-":
              depth += 1
              i += 1
          j = i
          while j < len(traversal) and traversal[j] != "-":
              j += 1
          node = TreeNode(int(traversal[i:j]))
          del stack[depth:]
          if stack:
              if stack[-1].left is None:
                  stack[-1].left = node
              else:
                  stack[-1].right = node
          stack.append(node)
          i = j
      return stack[0]
brute: |
  def recover_from_preorder(traversal):
      nodes = []
      i = 0
      while i < len(traversal):
          depth = 0
          while traversal[i] == "-":
              depth += 1
              i += 1
          j = i
          while j < len(traversal) and traversal[j] != "-":
              j += 1
          node = TreeNode(int(traversal[i:j]))
          if nodes:
              parent = None
              for d, cand in reversed(nodes):
                  if d == depth - 1:
                      parent = cand
                      break
              if parent.left is None:
                  parent.left = node
              else:
                  parent.right = node
          nodes.append((depth, node))
          i = j
      return nodes[0][1]
random:
  call: recover_from_preorder
  gen: |
    def gen(rng, size):
        n = min(max(size, 1), 60)
        vals = [rng.randint(1, 99) for _ in range(n)]
        left, right, depth = [None] * n, [None] * n, [0] * n
        for k in range(1, n):
            free = [(p, side) for p in range(k) for side in (0, 1) if (left, right)[side][p] is None]
            p, side = rng.choice(free)
            (left, right)[side][p] = k
            depth[k] = depth[p] + 1
        out, stack = [], [0]
        while stack:
            i = stack.pop()
            out.append("-" * depth[i] + str(vals[i]))
            if right[i] is not None:
                stack.append(right[i])
            if left[i] is not None:
                stack.append(left[i])
        return ("".join(out),)
  wrap:
    result: tree
no_slow: the stack method is linear, and the obvious slower version (scanning back for the parent) is only quadratic on 300 nodes, far below the step limit, so no slow version can fail the big check honestly
wrong:
  - |
    def recover_from_preorder(traversal):
        stack = []
        i = 0
        while i < len(traversal):
            depth = 0
            while traversal[i] == "-":
                depth += 1
                i += 1
            j = i
            while j < len(traversal) and traversal[j] != "-":
                j += 1
            node = TreeNode(int(traversal[i:j]))
            del stack[depth:]
            if stack:
                stack[-1].left = node
            stack.append(node)
            i = j
        return stack[0]
  - |
    def recover_from_preorder(traversal):
        stack = []
        i = 0
        while i < len(traversal):
            depth = 0
            while traversal[i] == "-":
                depth += 1
                i += 1
            j = i
            while j < len(traversal) and traversal[j] != "-":
                j += 1
            node = TreeNode(int(traversal[i:j]))
            del stack[depth:]
            if stack:
                if stack[-1].right is None:
                    stack[-1].right = node
                else:
                    stack[-1].left = node
            stack.append(node)
            i = j
        return stack[0]
  - |
    def recover_from_preorder(traversal):
        stack = []
        i = 0
        while i < len(traversal):
            depth = 0
            while traversal[i] == "-":
                depth += 1
                i += 1
            j = i
            while j < len(traversal) and traversal[j] != "-":
                j += 1
            node = TreeNode(int(traversal[i:j]))
            del stack[depth + 1:]
            if stack:
                if stack[-1].left is None:
                    stack[-1].left = node
                else:
                    stack[-1].right = node
            stack.append(node)
            i = j
        return stack[0]
equivalent: []
---
::
