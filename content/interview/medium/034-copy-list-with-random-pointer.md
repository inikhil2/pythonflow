---
title: Copy List with Random Pointer
tier: medium
order: 34
leetcode: 138
url: https://leetcode.com/problems/copy-list-with-random-pointer/
companies: [Meta, Amazon, Microsoft]
topic: Linked list
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/07-linked-lists]
---

You get the first node of a linked list, or `None` when the list is empty. The list has between 0 and 1000 nodes. Each node has a `val`, a whole number from -100 to 100, a `next` pointer to the following node, and a `random` pointer that is either `None` or points to any node in the same list, before or after it.

Return a deep copy of the list. The copy must have new nodes with the same values, its `next` pointers must follow the copy's order, and each copy's `random` pointer must point to the copy of the node that the original `random` points to.

The tests build a list with `to_random_list(pairs)`, where `pairs` is a list of `[val, random_index]` entries: `random_index` is the position of the node that `random` points to, or `None`. They read the answer back with `from_random_list(head)`, which returns the same form; both are already defined for you, along with `Node`.

::exercise
---
id: iv-medium-034
prompt: Write a function copy_random_list(head) that returns a deep copy of a linked list whose nodes also have random pointers.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class Node:
  #     def __init__(self, val=0, next=None, random=None): ...
  def copy_random_list(head):
      pass
hints:
  - Make one new node for every old node first, and store a dictionary from each old node to its new node.
  - Then set each new node's next and random by looking the old pointers up in that dictionary. A random pointer can point forward or backward, so set the links only after every new node exists.
  - Map None to None, so the last node's next and any missing random pointer stay None.
  - Build the copy from new nodes and leave the original list unchanged.
tests:
  - check: 'assert from_random_list(copy_random_list(to_random_list([[7, None], [13, 0], [11, 4], [10, 2], [1, 0]]))) == [[7, None], [13, 0], [11, 4], [10, 2], [1, 0]]'
  - check: 'assert from_random_list(copy_random_list(to_random_list([[1, 1], [2, 1]]))) == [[1, 1], [2, 1]]'
  - check: 'assert from_random_list(copy_random_list(to_random_list([]))) == []'
  - check: 'assert from_random_list(copy_random_list(to_random_list([[5, None]]))) == [[5, None]]'
  - check: 'assert from_random_list(copy_random_list(to_random_list([[3, 0], [3, 0]]))) == [[3, 0], [3, 0]]'
  - check: 'assert from_random_list(copy_random_list(to_random_list([[1, 2], [2, 0], [3, 1]]))) == [[1, 2], [2, 0], [3, 1]]'
  - check: 'o = to_random_list([[1, 1], [2, None]]); c = copy_random_list(o); assert c is not o and c.next is not o.next and c.random is c.next and c.random is not o.next'
big: 'assert (lambda r: (lambda p: from_random_list(copy_random_list(to_random_list(p))) == p)([[r.randint(-100, 100), r.choice([None] + list(range(1000)))] for _ in range(1000)]))(__import__("random").Random(34))'
solution: |
  def copy_random_list(head):
      copies = {}
      node = head
      while node:
          copies[node] = Node(node.val)
          node = node.next
      node = head
      while node:
          copies[node].next = copies.get(node.next)
          copies[node].random = copies.get(node.random)
          node = node.next
      return copies.get(head)
slow:
  - |
    def copy_random_list(head):
        nodes = []
        node = head
        while node:
            nodes.append(node)
            node = node.next
        copies = [Node(node.val) for node in nodes]
        for i, node in enumerate(nodes):
            if i + 1 < len(nodes):
                copies[i].next = copies[i + 1]
            for j in range(len(nodes)):
                if node.random is not None and nodes[j] is node.random:
                    copies[i].random = copies[j]
        return copies[0] if copies else None
brute: |
  def copy_random_list(head):
      nodes = []
      node = head
      while node:
          nodes.append(node)
          node = node.next
      copies = [Node(node.val) for node in nodes]
      for i, node in enumerate(nodes):
          if i + 1 < len(nodes):
              copies[i].next = copies[i + 1]
          if node.random is not None:
              for j, other in enumerate(nodes):
                  if other is node.random:
                      copies[i].random = copies[j]
      return copies[0] if copies else None
random:
  call: copy_random_list
  gen: |
    def gen(rng, size):
        n = rng.randint(0, size)
        return ([[rng.randint(-5, 5), rng.choice([None] + list(range(n)))] for _ in range(n)],)
  wrap:
    args: [random]
    result: random
wrong:
  - |
    def copy_random_list(head):
        return head
  - |
    def copy_random_list(head):
        copies = {}
        node = head
        while node:
            copies[node] = Node(node.val)
            node = node.next
        node = head
        while node:
            copies[node].next = copies.get(node.next)
            copies[node].random = node.random
            node = node.next
        return copies.get(head)
  - |
    def copy_random_list(head):
        copies = {}
        node = head
        while node:
            copies[node] = Node(node.val)
            node = node.next
        node = head
        while node:
            copies[node].next = copies.get(node.next)
            copies[node].random = copies[node.random]
            node = node.next
        return copies.get(head)
---
::
