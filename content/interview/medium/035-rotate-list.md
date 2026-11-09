---
title: Rotate List
tier: medium
order: 35
leetcode: 61
url: https://leetcode.com/problems/rotate-list/
companies: [Google, Amazon, Meta]
topic: Linked list
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/07-linked-lists]
---

You get the first node `head` of a singly linked list, or `None` when the list is empty. The list has between 0 and 500 nodes, and each `val` is a whole number from -100 to 100. You also get `k`, a whole number from 0 to 2000. Rotate the list to the right by `k` places: move the last node to the front, and do that `k` times. A `k` larger than the length of the list still works, because rotating a list of length n by n places changes nothing.

Return the new first node. For an empty list, return `None`.

For example, the list 1, 2, 3, 4, 5 rotated by 2 becomes 4, 5, 1, 2, 3.

The tests build a list with `to_nodes([1, 2, 3])` and read the answer back with `from_nodes(head)`; both are already defined for you, along with `ListNode`.

::exercise
---
id: iv-medium-035
prompt: Write a function rotate_right(head, k) that rotates a linked list to the right by k places and returns the new head.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class ListNode:
  #     def __init__(self, val=0, next=None): ...
  def rotate_right(head, k):
      pass
hints:
  - Count the nodes and find the last one. Only k modulo the length matters.
  - Link the last node back to the head, then cut the list after the node that is now n minus k nodes from the start.
tests:
  - check: 'assert from_nodes(rotate_right(to_nodes([1, 2, 3, 4, 5]), 2)) == [4, 5, 1, 2, 3]'
  - check: 'assert from_nodes(rotate_right(to_nodes([0, 1, 2]), 4)) == [2, 0, 1]'
  - check: 'assert from_nodes(rotate_right(to_nodes([1, 2]), 0)) == [1, 2]'
  - check: 'assert from_nodes(rotate_right(to_nodes([]), 3)) == []'
  - check: 'assert from_nodes(rotate_right(to_nodes([1]), 5)) == [1]'
  - check: 'assert from_nodes(rotate_right(to_nodes([1, 2, 3]), 3)) == [1, 2, 3]'
  - check: 'assert from_nodes(rotate_right(to_nodes([1, 2, 3]), 4)) == [3, 1, 2]'
  - check: 'assert from_nodes(rotate_right(to_nodes([1, 2]), 1)) == [2, 1]'
no_slow: "The list has at most 500 nodes, so every method that walks the list a few times finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def rotate_right(head, k):
      if head is None:
          return None
      n = 1
      tail = head
      while tail.next is not None:
          tail = tail.next
          n += 1
      k %= n
      if k == 0:
          return head
      tail.next = head
      new_tail = head
      for _ in range(n - k - 1):
          new_tail = new_tail.next
      new_head = new_tail.next
      new_tail.next = None
      return new_head
brute: |
  def rotate_right(head, k):
      values = []
      node = head
      while node is not None:
          values.append(node.val)
          node = node.next
      if not values:
          return None
      k %= len(values)
      cut = len(values) - k
      return to_nodes(values[cut:] + values[:cut])
random:
  call: rotate_right
  gen: |
    def gen(rng, size):
        values = [rng.randint(-5, 5) for _ in range(rng.randint(0, size + 3))]
        return (values, rng.randint(0, 2 * size + 6))
  wrap:
    args: [nodes, null]
    result: nodes
wrong:
  - |
    def rotate_right(head, k):
        if head is None:
            return None
        n = 1
        tail = head
        while tail.next is not None:
            tail = tail.next
            n += 1
        k %= n
        if k == 0:
            return head
        tail.next = head
        new_tail = head
        for _ in range(k - 1):
            new_tail = new_tail.next
        new_head = new_tail.next
        new_tail.next = None
        return new_head
  - |
    def rotate_right(head, k):
        if head is None:
            return None
        n = 1
        tail = head
        while tail.next is not None:
            tail = tail.next
            n += 1
        if k == 0 or k >= n:
            return head
        tail.next = head
        new_tail = head
        for _ in range(n - k - 1):
            new_tail = new_tail.next
        new_head = new_tail.next
        new_tail.next = None
        return new_head
  - |
    def rotate_right(head, k):
        if head is None:
            return None
        n = 1
        tail = head
        while tail.next is not None:
            tail = tail.next
            n += 1
        k %= n
        if k == 0:
            return head
        tail.next = head
        new_tail = head
        for _ in range(n - k - 1):
            new_tail = new_tail.next
        return new_tail.next
equivalent:
  - "if k == -1:"  # why: k is never -1 after k %= n, and with k == 0 the general path below also returns the list unchanged, so the early return only saves work
---
::
