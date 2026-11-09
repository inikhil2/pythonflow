---
title: Reorder List
tier: medium
order: 41
leetcode: 143
url: https://leetcode.com/problems/reorder-list/
companies: [Google, Amazon, Microsoft]
topic: Linked list
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/07-linked-lists]
---

You get the first node `head` of a singly linked list, or `None` when the list is empty. The list has between 0 and 50000 nodes, and each `val` is a whole number from -100 to 100. Return the head of the list reordered so that it reads: first node, last node, second node, second-to-last node, and so on, until every node is used.

For example, 1, 2, 3, 4 becomes 1, 4, 2, 3, and 1, 2, 3, 4, 5 becomes 1, 5, 2, 4, 3.

The tests build a list with `to_nodes([1, 2, 3])` and read the answer back with `from_nodes(head)`; both are already defined for you, along with `ListNode`.

::exercise
---
id: iv-medium-041
prompt: Write a function reorder_list(head) that reorders a linked list as described above and returns its head.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class ListNode:
  #     def __init__(self, val=0, next=None): ...
  def reorder_list(head):
      pass
hints:
  - Find the middle with two pointers, one moving twice as fast as the other. Cut the list there.
  - Reverse the second half, then take nodes alternately from the front half and the reversed half. Relink the nodes rather than swapping their values.
tests:
  - check: 'assert from_nodes(reorder_list(to_nodes([1, 2, 3, 4]))) == [1, 4, 2, 3]'
  - check: 'assert from_nodes(reorder_list(to_nodes([1, 2, 3, 4, 5]))) == [1, 5, 2, 4, 3]'
  - check: 'assert from_nodes(reorder_list(to_nodes([1]))) == [1]'
  - check: 'assert from_nodes(reorder_list(to_nodes([]))) == []'
  - check: 'assert from_nodes(reorder_list(to_nodes([1, 2]))) == [1, 2]'
  - check: 'assert from_nodes(reorder_list(to_nodes([1, 2, 3]))) == [1, 3, 2]'
  - check: 'assert from_nodes(reorder_list(to_nodes([5, 6, 7, 8, 9, 10]))) == [5, 10, 6, 9, 7, 8]'
  - check: 'assert from_nodes(reorder_list(to_nodes([9, 8, 7, 6, 5, 4, 3]))) == [9, 3, 8, 4, 7, 5, 6]'
big: 'assert (lambda r: r[:6] == [-100, 60, -63, 23, -26, -14] and sum(i * v for i, v in enumerate(r)) == 13212)(from_nodes(reorder_list(to_nodes([(i * 37) % 201 - 100 for i in range(50000)]))))'
solution: |
  def reorder_list(head):
      if head is None or head.next is None:
          return head
      slow, fast = head, head
      while fast.next is not None and fast.next.next is not None:
          slow = slow.next
          fast = fast.next.next
      second = slow.next
      slow.next = None
      prev = None
      while second is not None:
          nxt = second.next
          second.next = prev
          prev = second
          second = nxt
      first, second = head, prev
      while second is not None:
          n1, n2 = first.next, second.next
          first.next = second
          second.next = n1
          first, second = n1, n2
      return head
brute: |
  def reorder_list(head):
      values = []
      node = head
      while node is not None:
          values.append(node.val)
          node = node.next
      order = []
      lo, hi = 0, len(values) - 1
      while lo <= hi:
          order.append(values[lo])
          if lo != hi:
              order.append(values[hi])
          lo += 1
          hi -= 1
      return to_nodes(order)
random:
  call: reorder_list
  gen: |
    def gen(rng, size):
        return ([rng.randint(-5, 5) for _ in range(rng.randint(0, size + 4))],)
  wrap:
    args: [nodes]
    result: nodes
slow:
  - |
    def reorder_list(head):
        first = head
        while first is not None and first.next is not None and first.next.next is not None:
            prev = first.next
            last = prev.next
            while last.next is not None:
                prev = last
                last = last.next
            prev.next = None
            last.next = first.next
            first.next = last
            first = last.next
        return head
wrong:
  - |
    def reorder_list(head):
        values = []
        node = head
        while node is not None:
            values.append(node.val)
            node = node.next
        result = None
        for v in values:
            result = ListNode(v, result)
        return result
  - |
    def reorder_list(head):
        if head is None or head.next is None:
            return head
        slow, fast = head, head
        while fast.next is not None and fast.next.next is not None:
            slow = slow.next
            fast = fast.next.next
        second = slow.next
        slow.next = None
        first = head
        while second is not None:
            n1, n2 = first.next, second.next
            first.next = second
            second.next = n1
            first, second = n1, n2
        return head
  - |
    def reorder_list(head):
        values = []
        node = head
        while node is not None:
            values.append(node.val)
            node = node.next
        order = []
        lo, hi = 0, len(values) - 1
        while lo <= hi:
            order.append(values[hi])
            if lo != hi:
                order.append(values[lo])
            lo += 1
            hi -= 1
        result = None
        for v in reversed(order):
            result = ListNode(v, result)
        return result
---
::
