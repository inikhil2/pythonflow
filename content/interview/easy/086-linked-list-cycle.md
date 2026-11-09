---
title: Linked List Cycle
tier: easy
order: 86
leetcode: 141
url: https://leetcode.com/problems/linked-list-cycle/
companies: [Amazon, Google, Meta]
topic: Linked list
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/07-linked-lists]
---

You get the first node of a singly linked list, or `None` when the list is empty. The list has between 0 and 10000 nodes. A node's `next` may point back to an earlier node in the list, which makes a cycle.

Return `True` if following the `next` links from the first node reaches a node that was already visited, which means the list has a cycle. Return `False` if the walk ends at a node whose `next` is `None`.

The tests build a list with `to_nodes([1, 2, 3])`, which lists the values in order, and `to_cycle([1, 2, 3], 1)`, which builds the same three nodes and links the last node back to the node at index 1. `to_cycle` returns the first node. Both are already defined for you, along with `ListNode`.

::exercise
---
id: iv-easy-086
prompt: Write a function has_cycle(head) that returns True if following the next links from head reaches a node it already visited, and False otherwise.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class ListNode:
  #     def __init__(self, val=0, next=None): ...
  def has_cycle(head):
      pass
hints:
  - Keep a record of the nodes you have already visited, and stop with True as soon as one comes up again.
  - Two walkers can also do it with no record, one moving one step and one moving two steps. If they meet, there is a cycle.
tests:
  - check: assert has_cycle(to_cycle([3, 2, 0, -4], 1)) == True
  - check: assert has_cycle(to_cycle([1, 2], 0)) == True
  - check: assert has_cycle(to_cycle([1], 0)) == True
  - check: assert has_cycle(to_cycle([1, 2, 3], 2)) == True
  - check: assert has_cycle(to_cycle([1, 2, 3, 4], -1)) == False
  - check: assert has_cycle(to_nodes([1, 2, 1])) == False
  - check: assert has_cycle(to_nodes([])) == False
big: assert has_cycle(to_cycle([(i * 7919) % 10007 for i in range(10000)], 9999)) == True and has_cycle(to_cycle([(i * 7919) % 10007 for i in range(10000)], -1)) == False
solution: |
  def has_cycle(head):
      slow = head
      fast = head
      while fast is not None and fast.next is not None:
          slow = slow.next
          fast = fast.next.next
          if slow is fast:
              return True
      return False
brute: |
  def has_cycle(head):
      seen = set()
      node = head
      while node is not None:
          if id(node) in seen:
              return True
          seen.add(id(node))
          node = node.next
      return False
slow:
  - |
    def has_cycle(head):
        seen = []
        node = head
        while node is not None:
            for other in seen:
                if other is node:
                    return True
            seen.append(node)
            node = node.next
        return False
valid: |
  def valid(head):
      seen = set()
      while head is not None and id(head) not in seen:
          seen.add(id(head))
          head = head.next
      return len(seen) <= 10000
random:
  call: has_cycle
  gen: |
    def gen(rng, size):
        n = max(size, 1)
        return ([[rng.randint(0, 9) for _ in range(n)], rng.randint(-1, n - 1)],)
  wrap:
    args: [cycle]
wrong:
  - |
    def has_cycle(head):
        return head is not None and head.next is head
  - |
    def has_cycle(head):
        seen = set()
        node = head
        while node is not None:
            if node.val in seen:
                return True
            seen.add(node.val)
            node = node.next
        return False
  - |
    def has_cycle(head):
        return head is not None and head.next is not None
---
::
