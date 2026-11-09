---
title: Remove Duplicates from Sorted List
tier: easy
order: 99
leetcode: 83
url: https://leetcode.com/problems/remove-duplicates-from-sorted-list/
companies: [Google, Amazon, Meta]
topic: Linked list
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/07-linked-lists]
---

You get the first node of a singly linked list, or `None` when the list is empty. The list has between 0 and 300 nodes, each `val` is a whole number from -100 to 100, and the values are sorted from smallest to largest.

Remove every node whose value already appeared before it, so each value is kept once. Return the first node of the updated list. The order of the values stays the same.

The tests build a list with `to_nodes([1, 1, 2])`, which lists the values in order, and read the answer back with `from_nodes(node)`. Both are already defined for you, along with `ListNode`.

::exercise
---
id: iv-easy-099
prompt: Write a function delete_duplicates(head) that removes repeated values from the sorted linked list and returns its first node.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class ListNode:
  #     def __init__(self, val=0, next=None): ...
  def delete_duplicates(head):
      pass
hints:
  - Since the list is sorted, a repeat always sits right after its first copy. Compare each node with the one after it.
  - When the values match, skip the second node by pointing past it. When they differ, move forward.
tests:
  - check: assert from_nodes(delete_duplicates(to_nodes([1, 1, 2]))) == [1, 2]
  - check: assert from_nodes(delete_duplicates(to_nodes([1, 1, 2, 3, 3]))) == [1, 2, 3]
  - check: assert from_nodes(delete_duplicates(to_nodes([]))) == []
  - check: assert from_nodes(delete_duplicates(to_nodes([1]))) == [1]
  - check: assert from_nodes(delete_duplicates(to_nodes([1, 1]))) == [1]
  - check: assert from_nodes(delete_duplicates(to_nodes([1, 1, 1, 1]))) == [1]
  - check: assert from_nodes(delete_duplicates(to_nodes([0, 0, 1, 1, 1, 2, 2, 3, 3, 3, 4]))) == [0, 1, 2, 3, 4]
big: assert from_nodes(delete_duplicates(to_nodes([j for j in range(-60, 60) for _ in range(j % 4 + 1)]))) == [j for j in range(-60, 60)]
solution: |
  def delete_duplicates(head):
      node = head
      while node is not None and node.next is not None:
          if node.val == node.next.val:
              node.next = node.next.next
          else:
              node = node.next
      return head
brute: |
  def delete_duplicates(head):
      values = []
      node = head
      while node is not None:
          if not values or values[-1] != node.val:
              values.append(node.val)
          node = node.next
      return to_nodes(values)
# why: at most 300 nodes, so a builtin list-membership scan finishes in well under a second and is not a real trap at this size.
random:
  call: delete_duplicates
  gen: |
    def gen(rng, size):
        return (sorted(rng.randint(0, 5) for _ in range(min(size, 300))),)
  wrap:
    args: [nodes]
    result: nodes
wrong:
  - |
    def delete_duplicates(head):
        node = head
        while node is not None and node.next is not None:
            if node.val == node.next.val:
                node.next = node.next.next
            node = node.next
        return head
  - |
    def delete_duplicates(head):
        if head is not None and head.next is not None and head.val == head.next.val:
            head.next = head.next.next
        return head
  - |
    def delete_duplicates(head):
        node = head
        while node is not None and node.next is not None:
            if node.next.val == head.val:
                node.next = node.next.next
            else:
                node = node.next
        return head
---
::
