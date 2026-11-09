---
title: Binary Tree Maximum Path Sum
tier: hard
order: 69
leetcode: 124
url: https://leetcode.com/problems/binary-tree-maximum-path-sum/
companies: [Amazon, Google, Meta]
topic: Dynamic programming
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees, /learn/week10-algorithms/10-dynamic-programming]
---

You get the root of a binary tree, never empty. The tree has between 1 and 3000 nodes, each value is a whole number from -1000 to 1000, and the tree is at most 500 levels deep. A path is a chain of nodes where each step goes from a node to its parent or to one of its children, and no node is used twice. A path has at least one node, it does not need to start or end at the root, and it does not need to go down only. Its sum is the total of the values of its nodes.

Return the largest sum that any path in the tree has. Some values are negative, and then the best path can be a single node.

::exercise
---
id: iv-hard-069
prompt: Write a function max_path_sum(root) that returns the largest sum of any path in the tree, as a number.
prelude: nodes
starter: |
  # write your code below
  def max_path_sum(root):
      pass
hints:
  - For one node, find the best sum of a path that starts at that node and goes straight down. A path that would only lose value, because its sum is negative, is better dropped.
  - The best path whose highest node is this node uses its value plus the best downward path on each side. Keep the largest of these over all nodes, and give the parent only one side.
tests:
  - check: assert max_path_sum(to_tree([1, 2, 3])) == 6
  - check: assert max_path_sum(to_tree([-10, 9, 20, None, None, 15, 7])) == 42
  - check: assert max_path_sum(to_tree([-3])) == -3
  - check: assert max_path_sum(to_tree([5])) == 5
  - check: assert max_path_sum(to_tree([2, -1])) == 2
  - check: assert max_path_sum(to_tree([-2, -1])) == -1
  - check: assert max_path_sum(to_tree([1, -2, 3])) == 4
  - check: assert max_path_sum(to_tree([-1, -2, -3])) == -1
  - check: assert max_path_sum(to_tree([1, -2, -3, 1, 3, -2, None, -1])) == 3
  - check: assert max_path_sum(to_tree([5, 4, 8, 11, None, 13, 4, 7, 2, None, None, None, 1])) == 48
  - check: assert max_path_sum(to_tree([2, -1, -2])) == 2
  - check: assert max_path_sum(to_tree([-5, 4, None, 3])) == 7
  - check: assert max_path_sum(to_tree([0, -1, -1])) == 0
  - check: assert max_path_sum(to_tree([10, -20, 10, 5, 7, -3, -4])) == 20
  - check: assert max_path_sum(to_tree([1, 2, None, 3, None, 4])) == 10
  - check: assert max_path_sum(to_tree([-4, -5, -6, -7, -8])) == -4
  - check: assert max_path_sum(to_tree([3, -1, 4, None, -5, None, 6])) == 13
  - check: assert max_path_sum(to_tree([9, 6, -3, None, None, -6, 2, None, None, 2, None, -6, -6, -6])) == 16
solution: |
  def max_path_sum(root):
      best = [root.val]

      def gain(node):
          if node is None:
              return 0
          left = max(gain(node.left), 0)
          right = max(gain(node.right), 0)
          best[0] = max(best[0], node.val + left + right)
          return node.val + max(left, right)

      gain(root)
      return best[0]
brute: |
  def max_path_sum(root):
      parent = {}
      nodes = []
      stack = [root]
      parent[root] = None
      while stack:
          node = stack.pop()
          nodes.append(node)
          for child in (node.left, node.right):
              if child is not None:
                  parent[child] = node
                  stack.append(child)

      def up(node):
          chain = []
          while node is not None:
              chain.append(node)
              node = parent[node]
          return chain

      best = None
      for a in nodes:
          chain_a = up(a)
          for b in nodes:
              chain_b = up(b)
              common = set(chain_a) & set(chain_b)
              total = 0
              for node in chain_a:
                  total += node.val
                  if node in common:
                      break
              for node in chain_b:
                  if node in common:
                      if node is not a and node is not b and False:
                          pass
                      break
                  total += node.val
              if best is None or total > best:
                  best = total
      return best
valid: |
  def valid(root):
      if root is None:
          return False
      count = 0
      deepest = 0
      stack = [(root, 1)]
      while stack:
          node, depth = stack.pop()
          count += 1
          deepest = max(deepest, depth)
          if not -1000 <= node.val <= 1000:
              return False
          for child in (node.left, node.right):
              if child is not None:
                  stack.append((child, depth + 1))
      return count <= 3000 and deepest <= 500
random:
  call: max_path_sum
  gen: |
    def gen(rng, size):
        n = max(size, 1)
        lo = rng.choice([-6, -6, -2, 0])
        arr = [rng.randint(lo, 6)] + [rng.choice([None, rng.randint(lo, 6), rng.randint(lo, 6)]) for _ in range(2 * n)]
        return (arr,)
  wrap:
    args: [tree]
big: 'assert max_path_sum(to_tree([x for k in range(450) for x in ((k * 7919) % 2001 - 1000, None)][:-1] + [(j * 7919) % 2001 - 1000 for j in range(450, 3000)])) == 14915'
slow:
  - |
    def max_path_sum(root):
        def down(node):
            if node is None:
                return 0
            return node.val + max(down(node.left), down(node.right), 0)

        def walk(node):
            if node is None:
                return None
            here = node.val + max(down(node.left), 0) + max(down(node.right), 0)
            for other in (walk(node.left), walk(node.right)):
                if other is not None and other > here:
                    here = other
            return here

        return walk(root)
wrong:
  - |
    def max_path_sum(root):
        best = [root.val]

        def gain(node):
            if node is None:
                return 0
            left = gain(node.left)
            right = gain(node.right)
            best[0] = max(best[0], node.val + left + right)
            return node.val + max(left, right)

        gain(root)
        return best[0]
  - |
    def max_path_sum(root):
        def gain(node):
            if node is None:
                return 0
            return node.val + max(gain(node.left), gain(node.right), 0)

        return root.val + max(gain(root.left), 0) + max(gain(root.right), 0)
  - |
    def max_path_sum(root):
        best = [root.val]

        def gain(node):
            if node is None:
                return 0
            left = max(gain(node.left), 0)
            right = max(gain(node.right), 0)
            best[0] = max(best[0], node.val + left + right)
            return node.val + left + right

        gain(root)
        return best[0]
  - |
    def max_path_sum(root):
        best = [0]

        def gain(node):
            if node is None:
                return 0
            left = max(gain(node.left), 0)
            right = max(gain(node.right), 0)
            best[0] = max(best[0], node.val + left + right)
            return node.val + max(left, right)

        gain(root)
        return best[0]
equivalent:
  - "6: return -1"   # why: the caller clamps every child gain with max(gain, 0), so an empty child counts as 0 whether it returns 0 or -1
  - "9: best[-1] = max(best[0], node.val + left + right)"   # why: best holds exactly one item, so index -1 is index 0
  - "9: best[0] = max(best[-1], node.val + left + right)"   # why: best holds exactly one item, so index -1 is index 0
  - "12: return best[-1]"   # why: best holds exactly one item, so index -1 is index 0
---
::
