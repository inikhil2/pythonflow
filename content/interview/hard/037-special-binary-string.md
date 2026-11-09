---
title: Special Binary String
tier: hard
order: 37
leetcode: 761
url: https://leetcode.com/problems/special-binary-string/
companies: [Google, Adobe, Amazon]
topic: Divide and conquer
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week10-algorithms/04-sorting-and-heaps]
---

A binary string is special when it has the same number of 0s and 1s, and every prefix of it has at least as many 1s as 0s. You get a special string s.

One move picks two neighbouring non-empty parts of s that are each special by themselves, and swaps them. For example, in "11011000" you may swap the parts "10" and "1100", which sit side by side inside, and get "11100100". You may make as many moves as you like, including none.

Return the lexicographically largest string you can reach, where lexicographically largest means the one that would come last in a dictionary (with "1" counted as larger than "0").

The length of s is an even number between 2 and 50. Trying every reachable string is far too slow, even for the longest strings.

::exercise
---
id: iv-hard-037
prompt: Write a function make_largest_special(s) that returns the lexicographically largest string reachable by swapping neighbouring special parts.
starter: |
  # write your code below
  def make_largest_special(s):
      pass
hints:
  - Cut s into pieces that cannot be cut further: walk along with a counter that goes up for 1 and down for 0, and a piece ends each time it returns to 0.
  - Each piece looks like 1, then something special, then 0. Make the inside as large as you can, then put the pieces in descending order and join them.
tests:
  - check: assert make_largest_special("11011000") == "11100100"
  - check: assert make_largest_special("10") == "10"
  - check: assert make_largest_special("1100") == "1100"
  - check: assert make_largest_special("1010") == "1010"
  - check: assert make_largest_special("101100") == "110010"
  - check: assert make_largest_special("10101100") == "11001010"
  - check: assert make_largest_special("11010100") == "11010100"
  - check: assert make_largest_special("110100111000") == "111000110100"
  - check: assert make_largest_special("1010111000") == "1110001010"
  - check: assert make_largest_special("1011010010") == "1101001010"
  - check: assert make_largest_special("101110001100") == "111000110010"
  - check: assert make_largest_special("11100011011000") == "11100100111000"
  - check: assert make_largest_special("11011000111000") == "11100100111000"
  - check: assert make_largest_special("111000") == "111000"
solution: |
  def make_largest_special(s):
      parts = []
      count = start = 0
      for i, c in enumerate(s):
          count += 1 if c == "1" else -1
          if count == 0:
              parts.append("1" + make_largest_special(s[start + 1:i]) + "0")
              start = i + 1
      return "".join(sorted(parts, reverse=True))
brute: |
  def make_largest_special(s):
      def special(t):
          d = 0
          for c in t:
              d += 1 if c == "1" else -1
              if d < 0:
                  return False
          return d == 0

      seen = {s}
      todo = [s]
      while todo:
          cur = todo.pop()
          n = len(cur)
          for i in range(n):
              for j in range(i + 2, n, 2):
                  if not special(cur[i:j]):
                      continue
                  for k in range(j + 2, n + 1, 2):
                      if special(cur[j:k]):
                          nxt = cur[:i] + cur[j:k] + cur[i:j] + cur[k:]
                          if nxt not in seen:
                              seen.add(nxt)
                              todo.append(nxt)
      return max(seen)
valid: |
  def valid(s):
      if not 2 <= len(s) <= 50 or set(s) - {"0", "1"}:
          return False
      d = 0
      for c in s:
          d += 1 if c == "1" else -1
          if d < 0:
              return False
      return d == 0
random:
  call: make_largest_special
  gen: |
    def gen(rng, size):
        def word(m):
            if m == 0:
                return ""
            a = rng.randint(0, m - 1)
            return "1" + word(a) + "0" + word(m - 1 - a)
        return (word(rng.randint(1, min(size + 1, 6))),)
big: 'assert make_largest_special("11101001001101010100110111001001110100001111000010") == "11110100011100100100111100001110100100110101010010"'
slow:
  - |
    def make_largest_special(s):
        def special(t):
            d = 0
            for c in t:
                d += 1 if c == "1" else -1
                if d < 0:
                    return False
            return d == 0

        seen = {s}
        todo = [s]
        while todo:
            cur = todo.pop()
            n = len(cur)
            for i in range(n):
                for j in range(i + 2, n, 2):
                    if not special(cur[i:j]):
                        continue
                    for k in range(j + 2, n + 1, 2):
                        if special(cur[j:k]):
                            nxt = cur[:i] + cur[j:k] + cur[i:j] + cur[k:]
                            if nxt not in seen:
                                seen.add(nxt)
                                todo.append(nxt)
        return max(seen)
equivalent:
  - "count += 1 if c != '1' else -1"  # why: this counts the other way round, so the counter is the negative of the real one and still returns to 0 at exactly the same places
  - "count -= 1 if c == '1' else -1"  # why: this subtracts where the original adds, so the counter is the negative of the real one and still returns to 0 at exactly the same places
wrong:
  - |
    def make_largest_special(s):
        parts = []
        count = start = 0
        for i, c in enumerate(s):
            count += 1 if c == "1" else -1
            if count == 0:
                parts.append("1" + make_largest_special(s[start + 1:i]) + "0")
                start = i + 1
        return "".join(sorted(parts))
  - |
    def make_largest_special(s):
        parts = []
        count = start = 0
        for i, c in enumerate(s):
            count += 1 if c == "1" else -1
            if count == 0:
                parts.append(s[start:i + 1])
                start = i + 1
        return "".join(sorted(parts, reverse=True))
  - |
    def make_largest_special(s):
        parts = []
        count = start = 0
        for i, c in enumerate(s):
            count += 1 if c == "1" else -1
            if count == 0:
                parts.append("1" + make_largest_special(s[start + 1:i]) + "0")
                start = i + 1
        return "".join(sorted(parts, key=len, reverse=True))
  - |
    def make_largest_special(s):
        parts = []
        count = start = 0
        for i, c in enumerate(s):
            count += 1 if c == "1" else -1
            if count == 0:
                inner = s[start:i + 1]
                parts.append((inner, "1" + make_largest_special(s[start + 1:i]) + "0"))
                start = i + 1
        return "".join(best for _, best in sorted(parts, reverse=True))
---
::
