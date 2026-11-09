---
title: Substring with Concatenation of All Words
tier: hard
order: 12
leetcode: 30
url: https://leetcode.com/problems/substring-with-concatenation-of-all-words/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week0-functions/04-strings]
---

You get a string s of 0 to 10000 lowercase letters, and a list words of 1 to 5000 words. Every word in the list has the same length, from 1 to 3 letters. A word may appear more than once in the list. Return a sorted list of every index i where s[i:] starts with all the words joined together, in any order, using each word from the list exactly once. If there are none, return an empty list.

::exercise
---
id: iv-hard-012
prompt: Write a function find_substring(s, words) that returns the sorted list of starting indices where the words, joined in some order, appear in s. Each word in the list is used exactly once.
starter: |
  # write your code below
  def find_substring(s, words):
      pass
hints:
  - Every word has the same length, so a window that holds all the words is a fixed number of characters long. Try each starting index.
  - Checking each starting index from scratch costs O(n·m) and is too slow in an interview. A sliding window that moves one word at a time is what an interviewer wants.
  - Count how many times each word should appear, then slide a window one word at a time. A word that is not in the list breaks the window, and a word that appears too often means you must move the left edge forward.
tests:
  - check: assert find_substring("xaybzc", ["ay", "bz"]) == [1]
  - check: assert find_substring("abab", ["ab", "ab"]) == [0]
  - check: assert find_substring("ababab", ["ab", "ab"]) == [0, 2]
  - check: assert find_substring("", ["a"]) == []
  - check: assert find_substring("a", ["b"]) == []
  - check: assert find_substring("ab", ["ab"]) == [0]
  - check: assert find_substring("abcxyz", ["xyz", "abc"]) == [0]
  - check: assert find_substring("aaa", ["a", "a"]) == [0, 1]
  - check: assert find_substring("abaaba", ["aba", "bab"]) == []
  - check: assert find_substring("aab", ["a", "b"]) == [1]
solution: |
  from collections import Counter

  def find_substring(s, words):
      L = len(words[0])
      m = len(words)
      need = Counter(words)
      res = []
      for offset in range(L):
          left = offset
          seen = Counter()
          count = 0
          for right in range(offset, len(s) - L + 1, L):
              w = s[right:right + L]
              if w not in need:
                  seen = Counter()
                  count = 0
                  left = right + L
                  continue
              seen[w] += 1
              count += 1
              while seen[w] > need[w]:
                  seen[s[left:left + L]] -= 1
                  count -= 1
                  left += L
              if count == m:
                  res.append(left)
                  seen[s[left:left + L]] -= 1
                  count -= 1
                  left += L
      return sorted(res)
brute: |
  def find_substring(s, words):
      L = len(words[0])
      m = len(words)
      out = []
      for i in range(len(s) - L * m + 1):
          if sorted(s[i + j * L:i + j * L + L] for j in range(m)) == sorted(words):
              out.append(i)
      return out
random:
  call: find_substring
  gen: |
    def gen(rng, size):
        L = rng.randint(1, 3)
        words = ["".join(rng.choice("ab") for _ in range(L)) for _ in range(rng.randint(1, 2))]
        s = "".join(rng.choice("ab") for _ in range(rng.randint(0, size + 4)))
        return (s, words)
big: assert [len(R := find_substring((rng := __import__("random").Random(12)) and (TBL := bytes(97 + i % 26 for i in range(256))) and (W := (T := rng.randbytes(3000).translate(TBL).decode()) and [T[i:i + 3] for i in range(0, 3000, 3)]) and (S := rng.randbytes(200).translate(TBL).decode() + ((L1 := W[:]) and (rng.shuffle(L1) or "".join(L1))) + rng.randbytes(300).translate(TBL).decode() + ((L2 := W[:]) and (rng.shuffle(L2) or L2.__setitem__(0, L2[1]) or "".join(L2))) + rng.randbytes(200).translate(TBL).decode() + ((L3 := W[:]) and (rng.shuffle(L3) or "".join(L3))) + rng.randbytes(300).translate(TBL).decode()), W)), sum(R), sum(i * i for i in R) % 1000003] == [2, 6900, 929868]
# why: the builtin per-start version (re.findall on each window, then compare sorted pieces) runs at C speed and stays under the time limit even at LeetCode's maximum (about 1.9 s at s of 10000 with 5000 words), so it cannot be separated from a correct solution and is not included as a slow
slow:
  - |
    def find_substring(s, words):
        L = len(words[0])
        m = len(words)
        out = []
        for i in range(len(s) - L * m + 1):
            if sorted(s[i + j * L:i + j * L + L] for j in range(m)) == sorted(words):
                out.append(i)
        return out
  - |
    def find_substring(s, words):
        L = len(words[0])
        m = len(words)
        out = []
        for i in range(len(s) - L * m + 1):
            rest = list(words)
            for j in range(m):
                w = s[i + j * L:i + j * L + L]
                if w in rest:
                    rest.remove(w)
                else:
                    break
            else:
                out.append(i)
        return out
equivalent:
  - "4: L = len(words[-1])"  # why: the statement says every word has the same length, so words[-1] and words[0] have equal length
  - "12: for right in range(offset, len(s) + L + 1, L):"  # why: extra starts past the last full window give slices shorter than L, which are never in need; the branch only resets state and nothing is recorded after it
  - "12: for right in range(offset, len(s) - L + 2, L):"  # why: the only extra start is len(s) - L + 1, whose slice has length L - 1, so it is never in need and nothing is recorded
wrong:
  - |
    def find_substring(s, words):
        total = len(words[0]) * len(words)
        joined = "".join(words)
        return [i for i in range(len(s) - total + 1) if s[i:i + total] == joined]
  - |
    from collections import Counter
    def find_substring(s, words):
        L = len(words[0])
        m = len(words)
        need = Counter(words)
        res = []
        for offset in range(L):
            left = offset
            seen = Counter()
            count = 0
            for right in range(offset, len(s) - L + 1, L):
                w = s[right:right + L]
                if w not in need:
                    seen = Counter()
                    count = 0
                    left = right + L
                    continue
                seen[w] += 1
                count += 1
                if seen[w] > need[w]:
                    seen = Counter()
                    count = 0
                    left = right + L
                    continue
                if count == m:
                    res.append(left)
                    seen[s[left:left + L]] -= 1
                    count -= 1
                    left += L
        return sorted(res)
  - |
    from collections import Counter
    def find_substring(s, words):
        L = len(words[0])
        m = len(words)
        need = Counter(words)
        res = []
        for offset in range(L):
            left = offset
            seen = Counter()
            count = 0
            for right in range(offset, len(s) - L + 1, L):
                w = s[right:right + L]
                if w not in need:
                    seen = Counter()
                    count = 0
                    left = right + L
                    continue
                seen[w] += 1
                count += 1
                while seen[w] > need[w]:
                    seen[s[left:left + L]] -= 1
                    count -= 1
                    left += L
                if count == m:
                    res.append(left + 1)
                    seen[s[left:left + L]] -= 1
                    count -= 1
                    left += L
        return sorted(res)
---
::
