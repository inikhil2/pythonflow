---
title: K-th Smallest in Lexicographical Order
tier: hard
order: 65
leetcode: 440
url: https://leetcode.com/problems/k-th-smallest-in-lexicographical-order/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/01-while-loops, /learn/week2-loops/02-for-and-range, /learn/week10-algorithms/04-sorting-and-heaps]
---

You get two whole numbers n and k, with 1 at most k, and k at most n, and n at most 1000000000. Think of the whole numbers 1 through n, each written as text, and put them in order as text. That order puts 10 before 2, because "1" comes before "2". Return the k-th number in that order, counting from 1. You can assume k is never larger than n.

Going through the whole list is too slow when n is large. Instead, build the answer one digit at a time. Start at 1. Count how many numbers from 1 to n share the current prefix in order; if there are at most k minus 1 of them, move to the next number at the same length, otherwise move down one digit by multiplying by 10. Repeat until k reaches 0.

::exercise
---
id: iv-hard-065
prompt: Write a function kth_lexical(n, k) that returns the k-th number from 1 to n when the numbers are sorted as text, counting from 1.
starter: |
  # write your code below
  def kth_lexical(n, k):
      pass
hints:
  - Count how many numbers in the range start with a given prefix by walking down the powers of ten.
  - Subtract one from k at the start, and stop when k reaches zero.
tests:
  - check: assert kth_lexical(13, 2) == 10
  - check: assert kth_lexical(1, 1) == 1
  - check: assert kth_lexical(10, 3) == 2
  - check: assert kth_lexical(100, 10) == 17
  - check: assert kth_lexical(13, 13) == 9
  - check: assert kth_lexical(9, 9) == 9
  - check: assert kth_lexical(25, 12) == 2
  - check: assert kth_lexical(500, 250) == 323
  - check: assert kth_lexical(1000, 1000) == 999
  - check: assert kth_lexical(2000, 1234) == 308
# why: 100588884 comes from walking the lexicographic order one number at a time (k-1 steps, independent of the counting solution), which agreed with brute for every n below 300
big: assert kth_lexical(1000000000, 654321) == 100588884
solution: |
  def kth_lexical(n, k):
      cur = 1
      k -= 1
      while k > 0:
          steps = 0
          first, last = cur, cur + 1
          while first <= n:
              steps += min(last, n + 1) - first
              first *= 10
              last *= 10
          if steps <= k:
              cur += 1
              k -= steps
          else:
              cur *= 10
              k -= 1
      return cur
brute: |
  def kth_lexical(n, k):
      cur = 1
      for _ in range(k - 1):
          if cur * 10 <= n:
              cur *= 10
          else:
              while cur % 10 == 9 or cur + 1 > n:
                  cur //= 10
              cur += 1
      return cur
random:
  call: kth_lexical
  gen: |
    def gen(rng, size):
        n = rng.randint(1, max(size, 1) * 5)
        k = rng.randint(1, n)
        return (n, k)
slow:
  - |
    def kth_lexical(n, k):
        words = []
        for i in range(1, n + 1):
            words.append(str(i))
        words.sort()
        return int(words[k - 1])
wrong:
  - |
    def kth_lexical(n, k):
        return k
  - |
    def kth_lexical(n, k):
        return sorted(range(1, n + 1), key=lambda x: (len(str(x)), x))[k - 1]
  - |
    def kth_lexical(n, k):
        cur = 1
        while k > 0:
            steps = 0
            first, last = cur, cur + 1
            while first <= n:
                steps += min(last, n + 1) - first
                first *= 10
                last *= 10
            if steps <= k:
                cur += 1
                k -= steps
            else:
                cur *= 10
                k -= 1
        return cur
equivalent: []
---
::
