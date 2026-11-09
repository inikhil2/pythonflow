---
title: Middle of the Linked List
tier: easy
order: 84
leetcode: 876
url: https://leetcode.com/problems/middle-of-the-linked-list/
companies: [Amazon, Google, Meta]
topic: Linked list
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/07-linked-lists]
---

You get the first node of a singly linked list. The list has between 1 and 100 nodes, and each `val` is a whole number from 1 to 100. Return the middle node. When the list has an even number of nodes, return the second of the two middle nodes.

The tests build a list with `to_nodes([1, 2, 3])` and read the answer back with `from_nodes(node)`, which gives the values from that node to the end. Both are already defined for you, along with `ListNode`.

::exercise
---
id: iv-easy-084
prompt: Write a function middle_node(head) that returns the middle node of a linked list, or the second middle node when there are two.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class ListNode:
  #     def __init__(self, val=0, next=None): ...
  def middle_node(head):
      pass
hints:
  - Walk two names through the list, one step at a time and the other two steps at a time.
  - When the fast name reaches the end, the slow name is on the middle node.
tests:
  - check: assert from_nodes(middle_node(to_nodes([1, 2, 3, 4, 5]))) == [3, 4, 5]
  - check: assert from_nodes(middle_node(to_nodes([1, 2, 3, 4, 5, 6]))) == [4, 5, 6]
  - check: assert from_nodes(middle_node(to_nodes([1]))) == [1]
  - check: assert from_nodes(middle_node(to_nodes([1, 2]))) == [2]
  - check: assert from_nodes(middle_node(to_nodes([1, 2, 3]))) == [2, 3]
  - check: assert from_nodes(middle_node(to_nodes([9, 8, 7, 6]))) == [7, 6]
  - check: assert from_nodes(middle_node(to_nodes([5, 5, 5, 5, 5, 5, 5]))) == [5, 5, 5, 5]
big: assert from_nodes(middle_node(to_nodes(list(range(1, 101))))) == list(range(51, 101))
solution: |
  def middle_node(head):
      slow = head
      fast = head
      while fast is not None and fast.next is not None:
          slow = slow.next
          fast = fast.next.next
      return slow
brute: |
  def middle_node(head):
      nodes = []
      node = head
      while node is not None:
          nodes.append(node)
          node = node.next
      return nodes[len(nodes) // 2]
random:
  call: middle_node
  gen: |
    def gen(rng, size):
        return ([rng.randint(1, 100) for _ in range(max(size, 1))],)
  wrap:
    args: [nodes]
    result: nodes
wrong:
  - |
    def middle_node(head):
        slow = head
        fast = head
        while fast is not None and fast.next is not None:
            slow = slow.next
            fast = fast.next.next
        return slow.next
  - |
    def middle_node(head):
        slow = head
        fast = head
        while fast is not None and fast.next is not None:
            slow = slow.next
            fast = fast.next.next
        return head
  - |
    def middle_node(head):
        slow = head
        fast = head
        while fast is not None and fast.next is not None:
            slow = slow.next
            fast = fast.next
        return slow
---
::
