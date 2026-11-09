---
title: Letter Combinations of a Phone Number
tier: medium
order: 37
leetcode: 17
url: https://leetcode.com/problems/letter-combinations-of-a-phone-number/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week2-loops/04-dictionaries, /learn/week10-algorithms/06-recursion-and-backtracking]
---

An old phone keypad puts letters on the digit keys like this: 2 is abc, 3 is def, 4 is ghi, 5 is jkl, 6 is mno, 7 is pqrs, 8 is tuv and 9 is wxyz. You get a string `digits` of 0 to 4 characters, where each character is a digit from 2 to 9.

Return every word you could make by picking one letter from the keys for each digit, in order. Keep the order of the digits, so the first digit's letter changes the slowest. For example, "23" gives ad, ae, af, bd, be, bf, cd, ce and cf. If `digits` is empty, return an empty list.

::exercise
---
id: iv-medium-037
prompt: Write a function letter_combinations(digits) that returns every letter combination for the digit string, in the order described above.
starter: |
  # write your code below
  def letter_combinations(digits):
      pass
hints:
  - Start with one empty word. For each digit in turn, make a new list where every word so far is followed by each letter of that digit.
  - Remember that an empty input gives an empty list, not a list holding one empty word.
tests:
  - check: 'assert letter_combinations("23") == ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]'
  - check: 'assert letter_combinations("") == []'
  - check: 'assert letter_combinations("2") == ["a", "b", "c"]'
  - check: 'assert letter_combinations("7") == ["p", "q", "r", "s"]'
  - check: 'assert letter_combinations("9") == ["w", "x", "y", "z"]'
  - check: 'assert letter_combinations("78") == ["pt", "pu", "pv", "qt", "qu", "qv", "rt", "ru", "rv", "st", "su", "sv"]'
  - check: 'assert letter_combinations("5") == ["j", "k", "l"]'
  - check: 'assert len(letter_combinations("2222")) == 81'
no_slow: "The input has at most 4 digits, so there are at most 4096 words and every method finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def letter_combinations(digits):
      if not digits:
          return []
      keys = {
          "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
          "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
      }
      result = [""]
      for d in digits:
          result = [word + ch for word in result for ch in keys[d]]
      return result
brute: |
  def letter_combinations(digits):
      from itertools import product
      if digits == "":
          return []
      keys = {
          "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
          "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
      }
      return ["".join(p) for p in product(*[keys[d] for d in digits])]
random:
  call: letter_combinations
  gen: |
    def gen(rng, size):
        return ("".join(rng.choice("23456789") for _ in range(rng.randint(0, 4))),)
wrong:
  - |
    def letter_combinations(digits):
        if not digits:
            return []
        keys = {
            "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
            "6": "mno", "7": "pqr", "8": "tuv", "9": "wxy",
        }
        result = [""]
        for d in digits:
            result = [word + ch for word in result for ch in keys[d]]
        return result
  - |
    def letter_combinations(digits):
        if not digits:
            return []
        keys = {
            "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
            "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
        }
        result = [""]
        for d in digits:
            result = [ch + word for word in result for ch in keys[d]]
        return result
  - |
    def letter_combinations(digits):
        keys = {
            "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
            "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
        }
        result = [""]
        for d in digits:
            result = [word + ch for word in result for ch in keys[d]]
        return result
---
::
