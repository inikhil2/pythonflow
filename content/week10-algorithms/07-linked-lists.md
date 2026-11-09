---
title: Linked lists
week: 10
order: 7
minutes: 14
concepts: [classes, lists, while-loops]
---

A Python list keeps its values side by side, so adding to the front means moving every value along. A **linked list** works differently. It is a chain of **nodes**, and each node holds one value and a reference to the next node. The last node's `next` is `None`.

Here is a node class. The `next` default lets you leave it out at the end of the chain:

```python
class ListNode:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next
```

To build `1 -> 2 -> 3`, start from the back, so each new node points at the chain you already have:

```python
head = None
for v in [3, 2, 1]:
    head = ListNode(v, head)
```

`head` is the first node. You reach every other node by following `next`. Walking the list means starting at `head` and stopping when you reach `None`:

::trace
---
code: |
  class ListNode:
      def __init__(self, val, next=None):
          self.val = val
          self.next = next

  head = None
  for v in [3, 2, 1]:
      head = ListNode(v, head)

  node = head
  while node is not None:
      print(node.val)
      node = node.next
---
::

A common mistake is writing `while node.next is not None` and forgetting the last node. Then you stop one node early. Also remember that an empty list is just `head = None`, so check for it first.

## Reversing

To reverse the list, walk through it once and turn each arrow around. Three names do the work. `prev` is the node already reversed, `cur` is the node you are on, and `nxt` saves the rest of the chain before you change anything:

```python
prev = None
cur = head
while cur is not None:
    nxt = cur.next
    cur.next = prev
    prev = cur
    cur = nxt
head = prev
```

If you set `cur.next = prev` before saving `nxt`, you lose every node after `cur`. At the end, `prev` is the new head.

## Fast and slow pointers

Sometimes you need the middle of a list, and you cannot count the nodes first. Move two pointers at once. The slow one takes one step at a time, and the fast one takes two. When the fast one runs out, the slow one is in the middle:

```python
slow = fast = head
while fast is not None and fast.next is not None:
    slow = slow.next
    fast = fast.next.next
```

## A dummy head

Removing a node means changing the `next` of the node before it. The first node has no node before it, which is a special case. A **dummy head** solves this. It is an extra node placed in front of `head`, so every real node has one before it. At the end, return `dummy.next`.

Your turn: reverse a list.

::exercise
---
id: w10-l7-ex1
prompt: Read a line of whole numbers, which may be empty. Build a linked list with those numbers in the same order, reverse it, and print the values in the new order, separated by spaces.
starter: |
  class ListNode:
      def __init__(self, val, next=None):
          self.val = val
          self.next = next

  def build(values):
      head = None
      for v in reversed(values):
          head = ListNode(v, head)
      return head

  values = [int(n) for n in input().split()]
  head = build(values)
  node = head
  out = []
  while node is not None:
      out.append(str(node.val))
      node = node.next
  print(" ".join(out))
hints:
  - The starter prints the list in its original order. Reverse it before the walk.
  - Use three names. prev starts as None, and cur starts as head. Save cur.next in nxt before changing it.
  - Return prev at the end, because it is the new head. If you return head, the output is only the first value.
tests:
  - stdin: "1 2 3\n"
    stdout: "3 2 1"
  - stdin: "\n"
    stdout: ""
  - stdin: "7\n"
    stdout: "7"
  - stdin: "5 5 9 1\n"
    stdout: "1 9 5 5"
solution: |
  class ListNode:
      def __init__(self, val, next=None):
          self.val = val
          self.next = next

  def build(values):
      head = None
      for v in reversed(values):
          head = ListNode(v, head)
      return head

  def reverse(head):
      prev = None
      cur = head
      while cur is not None:
          nxt = cur.next
          cur.next = prev
          prev = cur
          cur = nxt
      return prev

  values = [int(n) for n in input().split()]
  head = reverse(build(values))
  node = head
  out = []
  while node is not None:
      out.append(str(node.val))
      node = node.next
  print(" ".join(out))
---
::

Now remove values with a dummy head.

::exercise
---
id: w10-l7-ex2
prompt: Read a line of whole numbers, which may be empty, then a whole number k on the next line. Remove every node whose value is k, then print the values that are left, separated by spaces. Print an empty line if none are left.
starter: |
  class ListNode:
      def __init__(self, val, next=None):
          self.val = val
          self.next = next

  def build(values):
      head = None
      for v in reversed(values):
          head = ListNode(v, head)
      return head

  values = [int(n) for n in input().split()]
  k = int(input())
  node = build(values)
  out = []
  while node is not None:
      out.append(str(node.val))
      node = node.next
  print(" ".join(out))
hints:
  - Put a dummy node in front of the list with dummy = ListNode(0, head). Then the first real node is never a special case.
  - Walk with prev, starting at dummy. If prev.next.val is k, skip that node with prev.next = prev.next.next. Otherwise move prev forward.
  - Return dummy.next. Without the dummy, removing the first node needs its own code.
tests:
  - stdin: "1 2 3 2\n2\n"
    stdout: "1 3"
  - stdin: "2 2 3\n2\n"
    stdout: "3"
  - stdin: "2 2\n2\n"
    stdout: ""
  - stdin: "5\n9\n"
    stdout: "5"
  - stdin: "\n3\n"
    stdout: ""
solution: |
  class ListNode:
      def __init__(self, val, next=None):
          self.val = val
          self.next = next

  def build(values):
      head = None
      for v in reversed(values):
          head = ListNode(v, head)
      return head

  def remove_all(head, k):
      dummy = ListNode(0, head)
      prev = dummy
      while prev.next is not None:
          if prev.next.val == k:
              prev.next = prev.next.next
          else:
              prev = prev.next
      return dummy.next

  values = [int(n) for n in input().split()]
  k = int(input())
  node = remove_all(build(values), k)
  out = []
  while node is not None:
      out.append(str(node.val))
      node = node.next
  print(" ".join(out))
---
::
