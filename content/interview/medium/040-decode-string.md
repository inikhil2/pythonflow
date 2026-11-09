---
title: Decode String
tier: medium
order: 40
leetcode: 394
url: https://leetcode.com/problems/decode-string/
companies: [Google, Amazon, Apple]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week10-algorithms/02-stacks-and-queues, /learn/week10-algorithms/06-recursion-and-backtracking]
---

You get a string `s` of 1 to 30 characters. It holds lowercase letters, digits and square brackets. Each number is from 1 to 300, and it can have up to three digits. The string is a valid encoding: a number, then an opening bracket, then some text, then a closing bracket means that text repeated that many times. Every number sits directly before its opening bracket, and every bracket has a matching partner. An encoded part can sit inside another one, so `3[a2[c]]` means "a", then "cc" twice, all repeated three times.

Decode the string and return the result. The result can be longer than the input, but it is never longer than 1000 characters.

For example, `"3[a]2[bc]"` decodes to `"aaabcbc"`, and `"ab2[c]d"` decodes to `"abccd"`.

::exercise
---
id: iv-medium-040
prompt: Write a function decode_string(s) that expands an encoded string such as 3[a2[c]] and returns the decoded text.
starter: |
  # write your code below
  def decode_string(s):
      pass
hints:
  - Keep a stack. When you see an opening bracket, save the text so far and the number before it, then start fresh. At a closing bracket, pop them and join.
  - A number can have more than one digit, so build it up digit by digit.
tests:
  - check: 'assert decode_string("3[a]2[bc]") == "aaabcbc"'
  - check: 'assert decode_string("3[a2[c]]") == "accaccacc"'
  - check: 'assert decode_string("2[abc]3[cd]ef") == "abcabccdcdcdef"'
  - check: 'assert decode_string("abc") == "abc"'
  - check: 'assert decode_string("a") == "a"'
  - check: 'assert decode_string("10[a]") == "aaaaaaaaaa"'
  - check: 'assert decode_string("2[2[2[a]]]") == "aaaaaaaa"'
  - check: 'assert decode_string("ab2[c]d") == "abccd"'
  - check: 'assert decode_string("100[a]") == "a" * 100'
no_slow: "The string has at most 30 characters, so every method that reads it once finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def decode_string(s):
      stack = []
      cur = ""
      num = 0
      for ch in s:
          if ch.isdigit():
              num = num * 10 + int(ch)
          elif ch == "[":
              stack.append((cur, num))
              cur, num = "", 0
          elif ch == "]":
              prev, k = stack.pop()
              cur = prev + cur * k
          else:
              cur += ch
      return cur
brute: |
  def decode_string(s):
      def parse(i):
          out = ""
          while i < len(s) and s[i] != "]":
              if s[i].isdigit():
                  j = i
                  while s[j].isdigit():
                      j += 1
                  k = int(s[i:j])
                  inner, i = parse(j + 1)
                  out += inner * k
                  i += 1
              else:
                  out += s[i]
                  i += 1
          return out, i
      return parse(0)[0]
random:
  call: decode_string
  gen: |
    def gen(rng, size):
        def enc(depth):
            out, length = "", 0
            for _ in range(rng.randint(1, 3)):
                if depth > 0 and rng.random() < 0.4:
                    k = rng.randint(1, 300)
                    inner, n = enc(depth - 1)
                    out += str(k) + "[" + inner + "]"
                    length += k * n
                else:
                    out += rng.choice("abc")
                    length += 1
            return out, length
        while True:
            s, decoded = enc(2)
            if len(s) <= 30 and decoded <= 1000:
                return (s,)
wrong:
  - |
    def decode_string(s):
        stack = []
        cur = ""
        num = 0
        for ch in s:
            if ch.isdigit():
                num = num * 10 + int(ch)
            elif ch == "[":
                stack.append((cur, num))
                cur, num = "", 0
            elif ch == "]":
                prev, k = stack.pop()
                cur = cur * k
            else:
                cur += ch
        return cur
  - |
    def decode_string(s):
        stack = []
        cur = ""
        num = 0
        for ch in s:
            if ch.isdigit():
                num = num * 10 + int(ch)
            elif ch == "[":
                stack.append((cur, num))
                cur = ""
            elif ch == "]":
                prev, k = stack.pop()
                cur = prev + cur * k
            else:
                cur += ch
        return cur
  - |
    def decode_string(s):
        stack = []
        cur = ""
        num = 0
        for ch in s:
            if ch.isdigit():
                num = int(ch)
            elif ch == "[":
                stack.append((cur, num))
                cur, num = "", 0
            elif ch == "]":
                prev, k = stack.pop()
                cur = prev + cur * k
            else:
                cur += ch
        return cur
---
::
