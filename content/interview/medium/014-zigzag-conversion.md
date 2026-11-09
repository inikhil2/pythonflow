---
title: Zigzag Conversion
tier: medium
order: 14
leetcode: 6
url: https://leetcode.com/problems/zigzag-conversion/
companies: [Google, Amazon, Meta]
topic: String
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string `s` of uppercase and lowercase English letters, where 1 <= len(s) <= 1000, and a whole number `num_rows`, where 1 <= num_rows <= 1000. Imagine writing `s` in a zigzag: start at the top row and move down one row per letter, then move back up one row per letter, and keep going down and up until the letters run out. Read the result one row at a time, from the top row to the bottom row, and return the letters as one string.

With one row, the zigzag is a straight line, so the string is unchanged. Letters are never moved sideways, only between rows, so the order inside each row is the order the letters were written.

::exercise
---
id: iv-medium-014
prompt: Write a function convert(s, num_rows) that writes s in a zigzag over num_rows rows and returns the rows read one after another.
starter: |
  # write your code below
  def convert(s, num_rows):
      pass
hints:
  - Keep a list of letters for each row, and a row number that moves by one each step.
  - The direction changes when the row number reaches the top row or the bottom row.
tests:
  - check: assert convert("PAYPALISHIRING", 3) == "PAHNAPLSIIGYIR"
  - check: assert convert("PAYPALISHIRING", 4) == "PINALSIGYAHRPI"
  - check: assert convert("A", 1) == "A"
  - check: assert convert("AB", 1) == "AB"
  - check: assert convert("ABC", 2) == "ACB"
  - check: assert convert("ABCD", 2) == "ACBD"
  - check: assert convert("ABC", 5) == "ABC"
  - check: assert convert("ABCDE", 4) == "ABCED"
  - check: assert convert("ABCDEFG", 3) == "AEBDFCG"
no_slow: "The string is at most 1000 letters, so every method finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def convert(s, num_rows):
      if num_rows == 1:
          return s
      rows = [[] for _ in range(num_rows)]
      row, step = 0, 1
      for ch in s:
          rows[row].append(ch)
          if row == 0:
              step = 1
          elif row == num_rows - 1:
              step = -1
          row += step
      return "".join("".join(r) for r in rows)
brute: |
  def convert(s, num_rows):
      if num_rows == 1:
          return s
      n = len(s)
      grid = [[""] * n for _ in range(num_rows)]
      row = col = 0
      down = True
      for ch in s:
          grid[row][col] = ch
          if row == num_rows - 1:
              down = False
          elif row == 0:
              down = True
          if down:
              row += 1
          else:
              row -= 1
              col += 1
      return "".join(ch for line in grid for ch in line if ch)
random:
  call: convert
  gen: |
    def gen(rng, size):
        letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        s = "".join(rng.choice(letters) for _ in range(rng.randint(1, 12)))
        return (s, rng.randint(1, 6))
wrong:
  - |
    def convert(s, num_rows):
        if num_rows == 1:
            return s
        rows = [[] for _ in range(num_rows)]
        for i, ch in enumerate(s):
            rows[i % num_rows].append(ch)
        return "".join("".join(r) for r in rows)
  - |
    def convert(s, num_rows):
        rows = [[] for _ in range(num_rows)]
        row, step = 0, 1
        for ch in s:
            rows[row].append(ch)
            if row == 0:
                step = 1
            elif row == num_rows - 1:
                step = -1
            row += step
        return "".join("".join(r) for r in rows)
  - |
    def convert(s, num_rows):
        if num_rows == 1:
            return s
        rows = [[] for _ in range(num_rows)]
        row, step = 0, 1
        for ch in s:
            rows[row].append(ch)
            if row == 0:
                step = 1
            elif row == num_rows - 2:
                step = -1
            row += step
        return "".join("".join(r) for r in rows)
equivalent:
  - "row, step = (0, 2)"  # why: the first letter sits in row 0, which sets step to 1 before the row moves
  - "row, step = (0, 0)"  # why: the first letter sits in row 0, which sets step to 1 before the row moves
---
::
