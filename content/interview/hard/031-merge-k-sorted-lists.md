---
title: Merge k Sorted Lists
tier: hard
order: 31
leetcode: 23
url: https://leetcode.com/problems/merge-k-sorted-lists/
companies: [Amazon, Google, Apple]
topic: Linked list
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week8-objects/01-classes, /learn/week10-algorithms/04-sorting-and-heaps, /learn/week10-algorithms/07-linked-lists]
---

You get a Python list called `lists`. Each item is the first node of a singly linked list whose values are already in ascending order, or `None` for an empty list. Join all the linked lists into one linked list that is also in ascending order, and return its first node, or `None` if there are no values at all.

There are between 0 and 5000 linked lists, together they hold at most 50000 nodes, and each `val` is a whole number from -10000 to 10000. Equal values can appear in several lists and all of them must be kept.

The tests build each linked list with `to_nodes([1, 4, 5])` and read the answer back with `from_nodes(head)`; both are already defined for you, along with `ListNode`.

::exercise
---
id: iv-hard-031
prompt: Write a function merge_k_lists(lists) that merges the sorted linked lists in lists into one sorted linked list and returns its head.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class ListNode:
  #     def __init__(self, val=0, next=None): ...
  def merge_k_lists(lists):
      pass
hints:
  - At any moment the next value to output is the smallest of the current first nodes of the lists. A heap finds it without looking at every list.
  - ListNode objects cannot be compared with each other, so put a list number in the heap tuple between the value and the node.
tests:
  - check: assert from_nodes(merge_k_lists([to_nodes(x) for x in ([1, 4, 5], [1, 3, 4], [2, 6])])) == [1, 1, 2, 3, 4, 4, 5, 6]
  - check: assert from_nodes(merge_k_lists([])) == []
  - check: assert from_nodes(merge_k_lists([to_nodes([])])) == []
  - check: assert from_nodes(merge_k_lists([to_nodes(x) for x in ([], [])])) == []
  - check: assert from_nodes(merge_k_lists([to_nodes([1])])) == [1]
  - check: assert from_nodes(merge_k_lists([to_nodes(x) for x in ([], [3], [])])) == [3]
  - check: assert from_nodes(merge_k_lists([to_nodes(x) for x in ([5], [1])])) == [1, 5]
  - check: assert from_nodes(merge_k_lists([to_nodes(x) for x in ([1, 2, 3], [4, 5, 6])])) == [1, 2, 3, 4, 5, 6]
  - check: assert from_nodes(merge_k_lists([to_nodes(x) for x in ([-3, -1], [-2, 0])])) == [-3, -2, -1, 0]
  - check: assert from_nodes(merge_k_lists([to_nodes(x) for x in ([2, 2], [2])])) == [2, 2, 2]
  - check: assert from_nodes(merge_k_lists([to_nodes(x) for x in ([7, 8, 9], [1], [3, 4], [2, 10])])) == [1, 2, 3, 4, 7, 8, 9, 10]
solution: |
  import heapq

  def merge_k_lists(lists):
      heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
      heapq.heapify(heap)
      dummy = tail = ListNode(0)
      while heap:
          val, i, node = heapq.heappop(heap)
          tail.next = node
          tail = node
          if node.next:
              heapq.heappush(heap, (node.next.val, i, node.next))
      return dummy.next
brute: |
  def merge_k_lists(lists):
      values = []
      for node in lists:
          while node:
              values.append(node.val)
              node = node.next
      values.sort()
      dummy = tail = ListNode(0)
      for v in values:
          tail.next = ListNode(v)
          tail = tail.next
      return dummy.next
valid: |
  def valid(lists):
      if not 0 <= len(lists) <= 5000 or sum(len(x) for x in lists) > 50000:
          return False
      return all(-10000 <= v <= 10000 for x in lists for v in x) and all(x == sorted(x) for x in lists)
random:
  call: _pf_drive
  driver: |
    def _pf_drive(lists):
        return from_nodes(merge_k_lists([to_nodes(x) for x in lists]))
  gen: |
    def gen(rng, size):
        k = rng.randint(0, size // 2 + 2)
        return ([sorted(rng.randint(-6, 6) for _ in range(rng.randint(0, size // 3 + 2))) for _ in range(k)],)
big: assert (data := [[] if i % 20 == 0 else sorted((i * 31 + j * 17 + (i * j) % 13) % 20001 - 10000 for j in range(10)) for i in range(5000)]) and from_nodes(merge_k_lists([to_nodes(x) for x in data])) == sorted(v for x in data for v in x)
slow:
  - |
    def merge_k_lists(lists):
        def merge(a, b):
            dummy = tail = ListNode(0)
            while a and b:
                if a.val <= b.val:
                    tail.next = a
                    a = a.next
                else:
                    tail.next = b
                    b = b.next
                tail = tail.next
            tail.next = a or b
            return dummy.next

        acc = None
        for node in lists:
            acc = merge(acc, node)
        return acc
  - |
    def merge_k_lists(lists):
        heads = [n for n in lists if n]
        dummy = tail = ListNode(0)
        while heads:
            best = 0
            for i in range(1, len(heads)):
                if heads[i].val < heads[best].val:
                    best = i
            tail.next = heads[best]
            tail = tail.next
            if heads[best].next:
                heads[best] = heads[best].next
            else:
                heads.pop(best)
        return dummy.next
equivalent:
  - "dummy = tail = ListNode(1)"  # why: the dummy node only holds the place of the head; its val is never read, since the answer starts at dummy.next
  - "dummy = tail = ListNode(-1)"  # why: same as above, the dummy's val is never read
wrong:
  - |
    import heapq

    def merge_k_lists(lists):
        heap = [(node.val, i, node) for i, node in enumerate(lists)]
        heapq.heapify(heap)
        dummy = tail = ListNode(0)
        while heap:
            val, i, node = heapq.heappop(heap)
            tail.next = node
            tail = node
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next
  - |
    import heapq

    def merge_k_lists(lists):
        heap = [(node.val, node) for node in lists if node]
        heapq.heapify(heap)
        dummy = tail = ListNode(0)
        while heap:
            val, node = heapq.heappop(heap)
            tail.next = node
            tail = node
            if node.next:
                heapq.heappush(heap, (node.next.val, node.next))
        return dummy.next
  - |
    import heapq

    def merge_k_lists(lists):
        heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
        heapq.heapify(heap)
        dummy = tail = ListNode(0)
        while heap:
            val, i, node = heapq.heappop(heap)
            tail.next = node
            tail = node
        return dummy.next
  - |
    def merge_k_lists(lists):
        a = lists[0] if lists else None
        b = lists[1] if len(lists) > 1 else None
        dummy = tail = ListNode(0)
        while a and b:
            if a.val <= b.val:
                tail.next = a
                a = a.next
            else:
                tail.next = b
                b = b.next
            tail = tail.next
        tail.next = a or b
        return dummy.next
---
::
