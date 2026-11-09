---
title: Text Justification
tier: hard
order: 2
leetcode: 68
url: https://leetcode.com/problems/text-justification/
companies: [Uber, Google, Meta]
topic: Simulation
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a list of words and a width. Arrange the words into lines that are each exactly that many characters long. Take words in order and put as many on a line as fit, with at least one space between neighbors. On every line except the last, spread the spare spaces across the gaps between words as evenly as possible. When the spaces do not divide evenly, the extra spaces go to the gaps on the left. The last line, and any line holding a single word, is left-justified with one space between words and padded with spaces on the right.

There are between 1 and 300 words, each one has between 1 and the width letters, and the width is between 1 and 100. Return the lines as a list of strings, each exactly the width long.

::exercise
---
id: iv-hard-002
prompt: Write a function full_justify(words, max_width) that returns the lines of text, each padded to exactly max_width characters.
starter: |
  # write your code below
  def full_justify(words, max_width):
      pass
hints:
  - Decide how many words fit on a line before you build any spaces, by adding each word's length plus one space per gap.
  - The spare spaces are the width minus the letters on the line. Divide them by the number of gaps, then give one extra space to the first few gaps.
tests:
  - check: assert full_justify(["This", "is", "an", "example", "of", "text", "justification."], 16) == ["This    is    an", "example  of text", "justification.  "]
  - check: assert full_justify(["What", "must", "be", "acknowledgment", "shall", "be"], 16) == ["What   must   be", "acknowledgment  ", "shall be        "]
  - check: assert full_justify(["a"], 5) == ["a    "]
  - check: assert full_justify(["ab", "cd"], 5) == ["ab cd"]
  - check: assert full_justify(["ab", "cd", "ef"], 6) == ["ab  cd", "ef    "]
  - check: assert full_justify(["a", "b", "c"], 3) == ["a b", "c  "]
  - check: assert full_justify(["a", "b", "c", "d", "efghi"], 8) == ["a  b c d", "efghi   "]
  - check: assert full_justify(["a", "b"], 1) == ["a", "b"]
  - check: assert full_justify(["a", "b", "c"], 5) == ["a b c"]
solution: |
  def full_justify(words, max_width):
      lines = []
      i = 0
      while i < len(words):
          j = i
          letters = 0
          while j < len(words) and letters + len(words[j]) + (j - i) <= max_width:
              letters += len(words[j])
              j += 1
          row = words[i:j]
          gaps = len(row) - 1
          if j == len(words) or gaps == 0:
              text = " ".join(row)
              lines.append(text + " " * (max_width - len(text)))
          else:
              spare = max_width - letters
              each, extra = divmod(spare, gaps)
              text = ""
              for k, w in enumerate(row[:-1]):
                  text += w + " " * (each + (1 if k < extra else 0))
              lines.append(text + row[-1])
          i = j
      return lines
brute: |
  def full_justify(words, max_width):
      rows = []
      current = []
      for w in words:
          if current and len(" ".join(current + [w])) > max_width:
              rows.append(current)
              current = []
          current.append(w)
      rows.append(current)
      out = []
      for idx, row in enumerate(rows):
          if idx == len(rows) - 1 or len(row) == 1:
              text = " ".join(row)
              out.append(text + " " * (max_width - len(text)))
          else:
              spaces = max_width - sum(len(w) for w in row)
              gaps = [spaces // (len(row) - 1)] * (len(row) - 1)
              for k in range(spaces % (len(row) - 1)):
                  gaps[k] += 1
              text = row[0]
              for k, w in enumerate(row[1:]):
                  text += " " * gaps[k] + w
              out.append(text)
      return out
random:
  call: full_justify
  gen: |
    def gen(rng, size):
        max_width = rng.randint(3, 10)
        words = ["".join(rng.choice("abc") for _ in range(rng.randint(1, max_width))) for _ in range(rng.randint(1, size + 3))]
        return (words, max_width)
big: assert len(full_justify(["w" * ((i * 7919) % 9 + 1) for i in range(300)], 100)) == 19
no_slow: "the input is capped at 300 words of at most 100 letters each, so a correct method does a few hundred thousand steps at most, and no input can make a correct version too slow"
wrong:
  - |
    def full_justify(words, max_width):
        lines = []
        i = 0
        while i < len(words):
            j = i
            letters = 0
            while j < len(words) and letters + len(words[j]) + (j - i) <= max_width:
                letters += len(words[j])
                j += 1
            row = words[i:j]
            gaps = len(row) - 1
            if j == len(words) or gaps == 0:
                lines.append(" ".join(row))
            else:
                spare = max_width - letters
                each, extra = divmod(spare, gaps)
                text = ""
                for k, w in enumerate(row[:-1]):
                    text += w + " " * (each + (1 if k < extra else 0))
                lines.append(text + row[-1])
            i = j
        return lines
  - |
    def full_justify(words, max_width):
        lines = []
        i = 0
        while i < len(words):
            j = i
            letters = 0
            while j < len(words) and letters + len(words[j]) + (j - i) <= max_width:
                letters += len(words[j])
                j += 1
            row = words[i:j]
            gaps = len(row) - 1
            if j == len(words) or gaps == 0:
                text = " ".join(row)
                lines.append(text + " " * (max_width - len(text)))
            else:
                spare = max_width - letters
                each, extra = divmod(spare, gaps)
                text = ""
                for k, w in enumerate(row[:-1]):
                    text += w + " " * (each + (1 if k >= gaps - extra else 0))
                lines.append(text + row[-1])
            i = j
        return lines
  - |
    def full_justify(words, max_width):
        lines = []
        i = 0
        while i < len(words):
            j = i
            letters = 0
            while j < len(words) and letters + len(words[j]) <= max_width:
                letters += len(words[j])
                j += 1
            row = words[i:j]
            text = " ".join(row)
            lines.append(text + " " * (max_width - len(text)))
            i = j
        return lines
---
::
