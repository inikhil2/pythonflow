---
title: Trees
week: 10
order: 8
minutes: 14
concepts: [classes, functions, dictionaries]
---

A **tree** is a node with children. A **binary tree** node has at most two children, `left` and `right`. Here is a node class. Leave out a child to mean there is none:

```python
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

The top node is the **root**. A node with no children is a **leaf**. The **depth** of a tree is the number of nodes on the longest path from the root down to a leaf. A tree of one node has depth 1, and an empty tree has depth 0.

Depth is a natural recursive problem. The depth of a tree is 1 plus the larger depth of its two subtrees. An empty subtree is the base case, with depth 0:

```python
def depth(node):
    if node is None:
        return 0
    return 1 + max(depth(node.left), depth(node.right))

root = TreeNode(5, TreeNode(3), TreeNode(8))
print(depth(root))
```

This prints `2`. Step through it:

::trace
---
code: |
  class TreeNode:
      def __init__(self, val, left=None, right=None):
          self.val = val
          self.left = left
          self.right = right

  def depth(node):
      if node is None:
          return 0
      return 1 + max(depth(node.left), depth(node.right))

  root = TreeNode(5, TreeNode(3), TreeNode(8))
  print(depth(root))
---
::

## Binary search trees

A **binary search tree** (BST) follows one rule. Every value in a node's left subtree is smaller than the node's value, and every value in its right subtree is bigger or equal. That rule makes search quick. At each node, go left or right, and throw away the other side. Inserting follows the same path:

```python
def insert(root, val):
    if root is None:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root
```

## Level order with a deque

Recursion goes deep before it goes wide. To visit the tree one level at a time, use a queue. Start with the root. Take a node from the front, record it, and add its children to the back. A `deque` keeps taking from the front fast:

```python
from collections import deque

queue = deque([root])
while queue:
    node = queue.popleft()
    print(node.val)
    if node.left is not None:
        queue.append(node.left)
    if node.right is not None:
        queue.append(node.right)
```

## A short trie

A **trie** stores words one letter at a time, with a dict in each node. Words that share a start share the same path. Each dict maps a letter to the next dict, and the key `"end"` marks the end of a word:

```python
trie = {}
for word in ["cat", "car"]:
    node = trie
    for ch in word:
        node = node.setdefault(ch, {})
    node["end"] = True
```

Both words start with `c`, `a`, so they share two levels. Checking a prefix means following the letters down the dicts and seeing that every step exists.

Your turn: measure a tree built from numbers.

::exercise
---
id: w10-l8-ex1
prompt: Read a line of whole numbers, which may be empty. Insert them into a binary search tree in the order read, with a value smaller than a node going left and any other value going right. Print the depth of the tree. An empty line gives depth 0.
starter: |
  class TreeNode:
      def __init__(self, val, left=None, right=None):
          self.val = val
          self.left = left
          self.right = right

  def insert(root, val):
      if root is None:
          return TreeNode(val)
      if val < root.val:
          root.left = insert(root.left, val)
      else:
          root.right = insert(root.right, val)
      return root

  nums = [int(n) for n in input().split()]
  print(0)
hints:
  - Start with root = None. For each number, set root = insert(root, n).
  - The depth of a tree is 1 plus the larger depth of its left and right subtrees. An empty tree has depth 0.
  - Test one node by hand first. A single number should give depth 1.
tests:
  - stdin: "5 3 8 1 4\n"
    stdout: "3"
  - stdin: "\n"
    stdout: "0"
  - stdin: "1\n"
    stdout: "1"
  - stdin: "1 2 3\n"
    stdout: "3"
  - stdin: "2 1 3\n"
    stdout: "2"
solution: |
  class TreeNode:
      def __init__(self, val, left=None, right=None):
          self.val = val
          self.left = left
          self.right = right

  def insert(root, val):
      if root is None:
          return TreeNode(val)
      if val < root.val:
          root.left = insert(root.left, val)
      else:
          root.right = insert(root.right, val)
      return root

  def depth(node):
      if node is None:
          return 0
      return 1 + max(depth(node.left), depth(node.right))

  nums = [int(n) for n in input().split()]
  root = None
  for n in nums:
      root = insert(root, n)
  print(depth(root))
---
::

Now list the tree one level at a time. Use a queue, not recursion.

::exercise
---
id: w10-l8-ex2
prompt: Read a line of whole numbers, which may be empty. Insert them into a binary search tree in the order read, with a value smaller than a node going left and any other value going right. Print the values level by level, from the root down, separated by spaces, with the values of each level from left to right. An empty line prints an empty line.
starter: |
  class TreeNode:
      def __init__(self, val, left=None, right=None):
          self.val = val
          self.left = left
          self.right = right

  def insert(root, val):
      if root is None:
          return TreeNode(val)
      if val < root.val:
          root.left = insert(root.left, val)
      else:
          root.right = insert(root.right, val)
      return root

  nums = [int(n) for n in input().split()]
  root = None
  for n in nums:
      root = insert(root, n)
  print(" ".join(str(n) for n in nums))
hints:
  - The starter prints the numbers in the order they were read. That is not level order.
  - Use a deque. Start it with the root if there is one. Pop from the front, record the value, and append the left and right children to the back.
  - Level order gives every node of one level before the next. A stack or plain recursion visits a branch to the bottom first, and that is wrong here.
tests:
  - stdin: "5 3 8 1 4\n"
    stdout: "5 3 8 1 4"
  - stdin: "5 3 8 1 4 9 7\n"
    stdout: "5 3 8 1 4 7 9"
  - stdin: "\n"
    stdout: ""
  - stdin: "4\n"
    stdout: "4"
  - stdin: "5 8 3 4 1\n"
    stdout: "5 3 8 1 4"
solution: |
  from collections import deque

  class TreeNode:
      def __init__(self, val, left=None, right=None):
          self.val = val
          self.left = left
          self.right = right

  def insert(root, val):
      if root is None:
          return TreeNode(val)
      if val < root.val:
          root.left = insert(root.left, val)
      else:
          root.right = insert(root.right, val)
      return root

  nums = [int(n) for n in input().split()]
  root = None
  for n in nums:
      root = insert(root, n)
  queue = deque()
  if root is not None:
      queue.append(root)
  out = []
  while queue:
      node = queue.popleft()
      out.append(str(node.val))
      if node.left is not None:
          queue.append(node.left)
      if node.right is not None:
          queue.append(node.right)
  print(" ".join(out))
---
::
