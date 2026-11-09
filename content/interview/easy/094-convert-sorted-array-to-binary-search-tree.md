---
title: Convert Sorted Array to Binary Search Tree
tier: easy
order: 94
leetcode: 108
url: https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/
companies: [Amazon, Apple, Google]
topic: Divide and conquer
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/08-trees]
---

You get a list `nums` of between 0 and 1000 whole numbers, sorted from smallest to largest. Each value is from -10000 to 10000.

Build a height-balanced binary search tree from these values. Use this rule so the answer is always the same: the root is the value at index `len(nums) // 2`, the left subtree is built from the values before that index, and the right subtree is built from the values after it. A height-balanced tree is one where the two sides of every node differ in depth by at most 1.

Return the root. The tests read the answer back with `from_tree(root)`, which lists the nodes level by level with `None` for a missing child. `TreeNode` is already defined for you. An empty list gives an empty tree, which is `None`.

::exercise
---
id: iv-easy-094
prompt: Write a function sorted_array_to_bst(nums) that builds a height-balanced binary search tree from the sorted list, using the middle index as the root each time.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class TreeNode:
  #     def __init__(self, val=0, left=None, right=None): ...
  def sorted_array_to_bst(nums):
      pass
hints:
  - The middle value of the list is the root. Build the left side from the values before it, and the right side from the values after it.
  - Use an empty list as the base case, which gives None.
tests:
  - check: assert from_tree(sorted_array_to_bst([-10, -3, 0, 5, 9])) == [0, -3, 9, -10, None, 5]
  - check: assert from_tree(sorted_array_to_bst([1])) == [1]
  - check: assert from_tree(sorted_array_to_bst([])) == []
  - check: assert from_tree(sorted_array_to_bst([1, 2])) == [2, 1]
  - check: assert from_tree(sorted_array_to_bst([1, 2, 3])) == [2, 1, 3]
  - check: assert from_tree(sorted_array_to_bst([1, 2, 3, 4])) == [3, 2, 4, 1]
  - check: assert from_tree(sorted_array_to_bst([1, 2, 3, 4, 5, 6, 7])) == [4, 2, 6, 1, 3, 5, 7]
solution: |
  def sorted_array_to_bst(nums):
      if not nums:
          return None
      mid = len(nums) // 2
      return TreeNode(nums[mid], sorted_array_to_bst(nums[:mid]), sorted_array_to_bst(nums[mid + 1:]))
brute: |
  def sorted_array_to_bst(nums):
      def build(lo, hi):
          if lo >= hi:
              return None
          mid = (lo + hi) // 2
          node = TreeNode(nums[mid])
          node.left = build(lo, mid)
          node.right = build(mid + 1, hi)
          return node
      return build(0, len(nums))
random:
  call: sorted_array_to_bst
  gen: |
    def gen(rng, size):
        return (sorted(rng.randint(-20, 20) for _ in range(size)),)
  wrap:
    args: [null]
    result: tree
wrong:
  - |
    def sorted_array_to_bst(nums):
        if not nums:
            return None
        return TreeNode(nums[0], None, sorted_array_to_bst(nums[1:]))
  - |
    def sorted_array_to_bst(nums):
        if not nums:
            return None
        mid = (len(nums) - 1) // 2
        return TreeNode(nums[mid], sorted_array_to_bst(nums[:mid]), sorted_array_to_bst(nums[mid + 1:]))
  - |
    def sorted_array_to_bst(nums):
        if not nums:
            return None
        mid = len(nums) // 2
        return TreeNode(nums[mid], sorted_array_to_bst(nums[mid + 1:]), sorted_array_to_bst(nums[:mid]))
---
::
