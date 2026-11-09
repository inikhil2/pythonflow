---
title: Palindrome Linked List
tier: easy
order: 92
leetcode: 234
url: https://leetcode.com/problems/palindrome-linked-list/
companies: [Amazon, Google, Meta]
topic: Linked list
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week8-objects/01-classes, /learn/week10-algorithms/07-linked-lists]
---

You get the first node of a singly linked list, or `None` when the list is empty. The list has between 0 and 10000 nodes, and each `val` is a whole number from 0 to 9.

Return `True` if the values read the same forwards and backwards, and `False` if not. A list with no nodes or one node is a palindrome.

The tests build a list with `to_nodes([1, 2, 1])`, which is already defined for you, along with `ListNode`.

::exercise
---
id: iv-easy-092
prompt: Write a function is_palindrome(head) that returns True if the linked list reads the same forwards and backwards.
prelude: nodes
starter: |
  # write your code below
  # Already defined for you:
  # class ListNode:
  #     def __init__(self, val=0, next=None): ...
  def is_palindrome(head):
      pass
hints:
  - Find the middle with a fast and a slow name, then reverse the second half in place.
  - Walk the first half and the reversed second half together and compare the values.
tests:
  - check: assert is_palindrome(to_nodes([1, 2, 2, 1])) == True
  - check: assert is_palindrome(to_nodes([1, 2])) == False
  - check: assert is_palindrome(to_nodes([])) == True
  - check: assert is_palindrome(to_nodes([1])) == True
  - check: assert is_palindrome(to_nodes([1, 2, 1])) == True
  - check: assert is_palindrome(to_nodes([1, 2, 3, 1])) == False
  - check: assert is_palindrome(to_nodes([1, 2, 3, 2, 1])) == True
  - check: assert is_palindrome(to_nodes([1, 0, 0])) == False
big: assert is_palindrome(to_nodes([i % 10 for i in range(5000)] + [i % 10 for i in reversed(range(5000))])) == True
solution: |
  def is_palindrome(head):
      slow = head
      fast = head
      while fast is not None and fast.next is not None:
          slow = slow.next
          fast = fast.next.next
      prev = None
      while slow is not None:
          after = slow.next
          slow.next = prev
          prev = slow
          slow = after
      left = head
      right = prev
      while right is not None:
          if left.val != right.val:
              return False
          left = left.next
          right = right.next
      return True
brute: |
  def is_palindrome(head):
      values = []
      node = head
      while node is not None:
          values.append(node.val)
          node = node.next
      return values == values[::-1]
random:
  call: is_palindrome
  gen: |
    def gen(rng, size):
        return ([rng.randint(0, 1) for _ in range(size)],)
  wrap:
    args: [nodes]
slow:
  - |
    def is_palindrome(head):
        n = 0
        node = head
        while node is not None:
            n += 1
            node = node.next
        for i in range(n):
            a = head
            for _ in range(i):
                a = a.next
            b = head
            for _ in range(n - 1 - i):
                b = b.next
            if a.val != b.val:
                return False
        return True
wrong:
  - |
    def is_palindrome(head):
        if head is None:
            return True
        node = head
        while node.next is not None:
            node = node.next
        return head.val == node.val
  - |
    def is_palindrome(head):
        values = []
        node = head
        while node is not None:
            values.append(node.val)
            node = node.next
        return values[: len(values) // 2] == values[len(values) // 2 :]
  - |
    def is_palindrome(head):
        values = []
        node = head
        while node is not None:
            values.append(node.val)
            node = node.next
        for i in range(len(values) // 2):
            if values[i] != values[-i]:
                return False
        return True
---
::
