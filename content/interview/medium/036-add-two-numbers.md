---
title: Add Two Numbers
tier: medium
order: 36
leetcode: 2
url: https://leetcode.com/problems/add-two-numbers/
companies: [Google, Amazon, Meta]
topic: Linked list
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/07-linked-lists]
---

You get two linked lists, `l1` and `l2`. Each node holds one digit, from 0 to 9, and the digits are stored in reverse order, so the first node is the ones digit. Each list has between 1 and 100 nodes. A list has no leading zeros, except that the number 0 is written as a single node with the digit 0.

Add the two numbers and return the sum as a new linked list in the same reverse order.

For example, 342 is stored as 2, 4, 3, and 465 is stored as 5, 6, 4. Their sum, 807, is stored as 7, 0, 8.

The tests build lists with `to_nodes([2, 4, 3])` and read the answer back with `from_nodes(head)`; both are already defined for you, along with `ListNode`.

::exercise
---
id: iv-medium-036
prompt: Write a function add_two_numbers(l1, l2) that adds two numbers stored as reversed digit linked lists and returns the sum as a new reversed linked list.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class ListNode:
  #     def __init__(self, val=0, next=None): ...
  def add_two_numbers(l1, l2):
      pass
hints:
  - Walk both lists together, add the two digits and the carry from the last step, and write the ones digit into a new node.
  - Keep going while either list still has a digit or a carry is left over, because the sum can be one digit longer than both.
  - Build the answer from new nodes and leave l1 and l2 unchanged, so the inputs can be reused.
tests:
  - check: 'assert from_nodes(add_two_numbers(to_nodes([2, 4, 3]), to_nodes([5, 6, 4]))) == [7, 0, 8]'
  - check: 'assert from_nodes(add_two_numbers(to_nodes([0]), to_nodes([0]))) == [0]'
  - check: 'assert from_nodes(add_two_numbers(to_nodes([9, 9, 9, 9, 9, 9, 9]), to_nodes([9, 9, 9, 9]))) == [8, 9, 9, 9, 0, 0, 0, 1]'
  - check: 'assert from_nodes(add_two_numbers(to_nodes([5]), to_nodes([5]))) == [0, 1]'
  - check: 'assert from_nodes(add_two_numbers(to_nodes([1]), to_nodes([9, 9]))) == [0, 0, 1]'
  - check: 'assert from_nodes(add_two_numbers(to_nodes([0, 1]), to_nodes([0, 1]))) == [0, 2]'
  - check: 'assert from_nodes(add_two_numbers(to_nodes([1, 8]), to_nodes([0]))) == [1, 8]'
  - check: 'assert from_nodes(add_two_numbers(to_nodes([2]), to_nodes([0]))) == [2]'
no_slow: "The lists have at most 100 digits each, so every method that reads each list once finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def add_two_numbers(l1, l2):
      dummy = ListNode()
      tail = dummy
      carry = 0
      while l1 is not None or l2 is not None or carry:
          total = carry
          if l1 is not None:
              total += l1.val
              l1 = l1.next
          if l2 is not None:
              total += l2.val
              l2 = l2.next
          carry, digit = divmod(total, 10)
          tail.next = ListNode(digit)
          tail = tail.next
      return dummy.next
brute: |
  def add_two_numbers(l1, l2):
      def digits(node):
          out = []
          while node is not None:
              out.append(node.val)
              node = node.next
          return out
      a = digits(l1)
      b = digits(l2)
      total = sum(d * 10 ** i for i, d in enumerate(a)) + sum(d * 10 ** i for i, d in enumerate(b))
      return to_nodes([int(ch) for ch in str(total)[::-1]])
random:
  call: add_two_numbers
  gen: |
    def gen(rng, size):
        def number():
            n = rng.randint(1, size + 2)
            digits = [rng.randint(0, 9) for _ in range(n)]
            if n > 1:
                digits[-1] = rng.randint(1, 9)
            return digits
        return (number(), number())
  wrap:
    args: [nodes, nodes]
    result: nodes
wrong:
  - |
    def add_two_numbers(l1, l2):
        dummy = ListNode()
        tail = dummy
        carry = 0
        while l1 is not None or l2 is not None:
            total = carry
            if l1 is not None:
                total += l1.val
                l1 = l1.next
            if l2 is not None:
                total += l2.val
                l2 = l2.next
            carry, digit = divmod(total, 10)
            tail.next = ListNode(digit)
            tail = tail.next
        return dummy.next
  - |
    def add_two_numbers(l1, l2):
        dummy = ListNode()
        tail = dummy
        carry = 0
        while l1 is not None and l2 is not None or carry:
            total = carry
            total += l1.val if l1 is not None else 0
            total += l2.val if l2 is not None else 0
            l1 = l1.next if l1 is not None else None
            l2 = l2.next if l2 is not None else None
            carry, digit = divmod(total, 10)
            tail.next = ListNode(digit)
            tail = tail.next
        return dummy.next
  - |
    def add_two_numbers(l1, l2):
        dummy = ListNode()
        tail = dummy
        carry = 0
        while l1 is not None or l2 is not None or carry:
            total = carry
            if l1 is not None:
                total += l1.val
                l1 = l1.next
            if l2 is not None:
                total += l2.val
                l2 = l2.next
            carry, digit = divmod(total, 10)
            tail.next = ListNode(digit)
            tail = tail.next
        return dummy
---
::
