---
title: Intersection of Two Linked Lists
tier: easy
order: 97
leetcode: 160
url: https://leetcode.com/problems/intersection-of-two-linked-lists/
companies: [Meta, Amazon, Apple]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week8-objects/01-classes, /learn/week10-algorithms/07-linked-lists]
---

You get the first nodes of two singly linked lists. Either one may be `None`, which means that list is empty. Neither list loops, and each has at most 30000 nodes. Two lists can end in the same stretch of nodes, which means the last few nodes are the very same node objects, not copies with equal values.

Return the first node that both lists share, as that same node object. If the lists share no node, return `None`. Equal values do not make two nodes shared; only being the same object does.

The tests build the lists with `to_shared([1, 2], [5], [8, 9])`, which returns `(head_a, head_b)`: a list `1, 2, 8, 9` and a list `5, 8, 9`, where the nodes `8` and `9` are the same objects in both. `ListNode` and `to_nodes` are already defined for you.

::exercise
---
id: iv-easy-097
prompt: Write a function shared_node(head_a, head_b) that returns the first node object that both lists contain, or None if they share no node.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class ListNode:
  #     def __init__(self, val=0, next=None): ...
  def shared_node(head_a, head_b):
      pass
hints:
  - Put every node of the first list in a set, then walk the second list and stop at the first node already in the set. Compare nodes, not values.
  - Without a set, walk one pointer through list A and then list B, and the other through B and then A. Both travel the same total distance, so they land on the shared node together.
tests:
  - check: p = to_shared([1, 2], [5], [8, 9]); assert shared_node(*p) is p[0].next.next
  - check: p = to_shared([4, 1], [5, 6, 1], [8, 4, 5]); assert shared_node(*p) is p[0].next.next
  - check: p = to_shared([1, 2], [2, 1], []); assert shared_node(*p) is None
  - check: p = to_shared([], [3], [7]); assert shared_node(*p) is p[0]
  - check: p = to_shared([1, 2, 3], [], []); assert shared_node(*p) is None
  - check: p = to_shared([1, 2, 3], [9], [4, 5]); assert shared_node(*p) is p[0].next.next.next
  - check: p = to_shared([], [], []); assert shared_node(*p) is None
  - check: p = to_shared([], [], [6]); assert shared_node(*p) is p[0] and shared_node(*p) is p[1]
big: p = to_shared(list(range(29997)), list(range(28000)), [-1, 2, 3]); n = p[1]; [n := n.next for _ in range(28000)]; assert shared_node(*p) is n and n.val == -1
solution: |
  def shared_node(head_a, head_b):
      a = head_a
      b = head_b
      while a is not b:
          a = a.next if a is not None else head_b
          b = b.next if b is not None else head_a
      return a
brute: |
  def shared_node(head_a, head_b):
      in_a = set()
      node = head_a
      while node is not None:
          in_a.add(id(node))
          node = node.next
      node = head_b
      while node is not None:
          if id(node) in in_a:
              return node
          node = node.next
      return None
slow:
  - |
    def shared_node(head_a, head_b):
        a = head_a
        while a is not None:
            b = head_b
            while b is not None:
                if a is b:
                    return a
                b = b.next
            a = a.next
        return None
  - |
    def shared_node(head_a, head_b):
        seen = []
        node = head_a
        while node is not None:
            seen.append(node)
            node = node.next
        node = head_b
        while node is not None:
            if node in seen:
                return node
            node = node.next
        return None
valid: |
  def valid(head_a, head_b):
      for head in (head_a, head_b):
          count = 0
          while head is not None and count <= 30000:
              count += 1
              head = head.next
          if count > 30000:
              return False
      return True
random:
  call: shared_node
  gen: |
    def gen(rng, size):
        n = max(size, 1)
        part = lambda: [rng.randint(0, 5) for _ in range(rng.randint(0, n))]
        return ([part(), part(), part()],)
  wrap:
    args: [shared]
    result: index
wrong:
  - |
    def shared_node(head_a, head_b):
        a = head_a
        while a is not None:
            b = head_b
            while b is not None:
                if a.val == b.val:
                    return a
                b = b.next
            a = a.next
        return None
  - |
    def shared_node(head_a, head_b):
        a = head_a
        b = head_b
        while a is not None and b is not None:
            if a is b:
                return a
            a = a.next
            b = b.next
        return None
  - |
    def shared_node(head_a, head_b):
        in_a = set()
        node = head_a
        while node is not None:
            in_a.add(id(node))
            node = node.next
        node = head_b
        while node is not None:
            if id(node) in in_a:
                return ListNode(node.val)
            node = node.next
        return None
---
::
