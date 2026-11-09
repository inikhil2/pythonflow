---
title: Add Binary
tier: easy
order: 25
leetcode: 67
url: https://leetcode.com/problems/add-binary/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week0-functions/06-numbers]
---

You get two strings, a and b, and each one is a whole number written in binary, using only the characters 0 and 1. Each string has at least one character, and it has no leading zeros unless it is the single character 0. Return the binary string for the sum of the two numbers. Work from the last character of each string toward the first, and carry a 1 when a column adds up to two or more.

::exercise
---
id: iv-easy-025
prompt: Write a function add_binary(a, b) that returns the binary string, made of 0s and 1s, for the sum of the two binary strings a and b.
starter: |
  # write your code below
  def add_binary(a, b):
      pass
hints:
  - Add the digits in each column from the right, plus any carry from the column before, and write down the remainder when you divide by 2.
  - Keep going while either string still has digits or a carry is left, so the last carry is not lost.
tests:
  - check: assert add_binary("0", "0") == "0"
  - check: assert add_binary("1", "1") == "10"
  - check: assert add_binary("11", "1") == "100"
  - check: assert add_binary("1010", "1011") == "10101"
  - check: assert add_binary("1", "111") == "1000"
  - check: assert add_binary("111", "111") == "1110"
  - check: assert add_binary("100", "0") == "100"
  - check: assert add_binary("1" * 20, "1") == "1" + "0" * 20
solution: |
  def add_binary(a, b):
      i = len(a) - 1
      j = len(b) - 1
      carry = 0
      digits = []
      while i >= 0 or j >= 0 or carry:
          total = carry
          if i >= 0:
              total += int(a[i])
              i -= 1
          if j >= 0:
              total += int(b[j])
              j -= 1
          digits.append(str(total % 2))
          carry = total // 2
      return "".join(reversed(digits))
brute: |
  def add_binary(a, b):
      return bin(int(a, 2) + int(b, 2))[2:]
random:
  call: add_binary
  gen: |
    def gen(rng, size):
        return (bin(rng.randint(0, 2 ** (size + 3)))[2:], bin(rng.randint(0, 2 ** (size + 3)))[2:])
wrong:
  - |
    def add_binary(a, b):
        return bin(int(a) + int(b))[2:]
  - |
    def add_binary(a, b):
        a = a.rjust(len(b), "0")
        b = b.rjust(len(a), "0")
        result = ""
        for x, y in zip(a, b):
            result += str(int(x) ^ int(y))
        return result
---
::
