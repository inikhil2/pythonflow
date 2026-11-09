---
title: Reverse Linked List
tier: easy
order: 82
leetcode: 206
url: https://leetcode.com/problems/reverse-linked-list/
companies: [Google, Amazon, Meta]
topic: Linked list
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/07-linked-lists]
---

You get the first node of a singly linked list, or `None` when the list is empty. The list has between 0 and 5000 nodes, and each `val` is a whole number from -5000 to 5000. Reverse the list so that the last node comes first, and return the new first node.

The tests build a list with `to_nodes([1, 2, 3])` and read the answer back with `from_nodes(head)`; both are already defined for you, along with `ListNode`.

::exercise
---
id: iv-easy-082
prompt: Write a function reverse_list(head) that reverses a linked list and returns the new head.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class ListNode:
  #     def __init__(self, val=0, next=None): ...
  def reverse_list(head):
      pass
hints:
  - Keep two names while you walk, the node you are on and the node before it.
  - Before you change a node's next, save the old next, or you lose the rest of the list.
  - Changing the next links of the nodes you already have is the usual way to reverse, so walk the list once and keep hold of the node you came from.
tests:
  - check: assert from_nodes(reverse_list(to_nodes([1, 2, 3, 4, 5]))) == [5, 4, 3, 2, 1]
  - check: assert from_nodes(reverse_list(to_nodes([1, 2]))) == [2, 1]
  - check: assert from_nodes(reverse_list(to_nodes([]))) == []
  - check: assert from_nodes(reverse_list(to_nodes([7]))) == [7]
  - check: assert from_nodes(reverse_list(to_nodes([1, 1, 2]))) == [2, 1, 1]
  - check: assert from_nodes(reverse_list(to_nodes([-1, 0, 3]))) == [3, 0, -1]
  - check: assert from_nodes(reverse_list(to_nodes([5, 4, 3, 2, 1, 0]))) == [0, 1, 2, 3, 4, 5]
solution: |
  def reverse_list(head):
      before = None
      node = head
      while node is not None:
          after = node.next
          node.next = before
          before = node
          node = after
      return before
brute: |
  def reverse_list(head):
      values = []
      node = head
      while node is not None:
          values.append(node.val)
          node = node.next
      result = None
      for v in values:
          result = ListNode(v, result)
      return result
random:
  call: reverse_list
  gen: |
    def gen(rng, size):
        return ([rng.randint(-10, 10) for _ in range(size)],)
  wrap:
    args: [nodes]
    result: nodes
wrong:
  - |
    def reverse_list(head):
        before = None
        node = head
        while node is not None and node.next is not None:
            after = node.next
            node.next = before
            before = node
            node = after
        return before
  - |
    def reverse_list(head):
        before = None
        node = head
        while node is not None:
            after = node.next
            node.next = before
            before = node
            node = after
        return head
---
::
