# 116: Week 6 lessons 03 and 04: CSV files, binary files
Files: content/week6-file-io/03-csv-files.md, content/week6-file-io/04-binary-files.md
Severity: med

## Problem
These are the last two week 6 lessons. Run this spec after 115. Lesson 03 covers
`csv.DictReader` and `csv.writer`, and lesson 04 covers `"rb"`, `"wb"` and `bytes`, with a
PNG signature check.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week6-file-io/03-csv-files.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: CSV files
week: 6
order: 3
minutes: 10
concepts: [csv, dictionaries]
---

A **CSV** file, for comma-separated values, stores a table as text. Each line is a row, and commas separate the columns. The first row often names the columns:

```text
name,city
Ada,London
Bo,Oslo
```

You could split each line at its commas yourself. But what if a value has a comma in it, such as `"Paris, France"`? CSV puts that value in quotes, and splitting at every comma would break it in two. Python's `csv` module knows these rules.

`csv.DictReader` reads each row as a dictionary, using the first row for the keys. Step through this trace:

::trace
---
code: |
  import csv

  with open("people.csv", "w") as file:
      file.write('name,city\nAda,London\nBo,"Paris, France"\n')

  with open("people.csv") as file:
      for row in csv.DictReader(file):
          print(row["name"], "lives in", row["city"])
---
::

`row["city"]` is `Paris, France`, without the quotes. And because rows are dictionaries, your code still works if someone adds a column or moves one.

A common mistake: splitting each line at its commas, as in `name, city = line.split(",")`. It treats the header row as data, it keeps the newline on the last column unless you strip it, and it breaks on any value with a comma in it.

Your turn: read a CSV file into a dictionary.

::exercise
---
id: w6-l3-ex1
prompt: Finish cities so that it reads the CSV file at path, which has a name column and a city column, and returns a dictionary from each name to its city. Use the csv module.
starter: |
  def cities(path):
      result = {}
      with open(path) as file:
          for line in file:
              name, city = line.rstrip().split(",")
              result[name] = city
      return result
hints:
  - The value "Paris, France" has a comma in it, so split gives three parts and the unpacking fails.
  - import csv, then loop over csv.DictReader(file) and use row["name"] and row["city"].
tests:
  - check: |
      with open("w6_cities.csv", "w") as file:
          file.write('name,city\nAda,London\nBo,"Paris, France"\n')
      found = cities("w6_cities.csv")
      assert found == {"Ada": "London", "Bo": "Paris, France"}, f"cities returned {found!r}"
solution: |
  import csv

  def cities(path):
      result = {}
      with open(path) as file:
          for row in csv.DictReader(file):
              result[row["name"]] = row["city"]
      return result
---
::

To write CSV, `csv.writer` turns each list into a row and adds quotes where they're needed. Open the file with `newline=""`, so the `csv` module controls how each row ends:

```python
import csv

with open("people.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["name", "city"])
    writer.writerow(["Bo", "Paris, France"])
```

Now write a table.

::exercise
---
id: w6-l3-ex2
prompt: Finish save_scores so that it writes scores, a dictionary from name to score, to a CSV file at path. The first row is name,score, then there is one row per name.
starter: |
  import csv

  def save_scores(scores, path):
      with open(path, "w", newline="") as file:
          writer = csv.writer(file)
          for name in scores:
              writer.writerow([name, scores[name]])
hints:
  - The tests read the file back with csv.reader and expect the first row to be ["name", "score"].
  - Write that header with writer.writerow before the loop.
tests:
  - check: |
      import csv
      save_scores({"Ada": 90, "Bo": 85}, "w6_scores.csv")
      with open("w6_scores.csv", newline="") as file:
          rows = list(csv.reader(file))
      assert rows == [["name", "score"], ["Ada", "90"], ["Bo", "85"]], f"the file holds the rows {rows!r}"
solution: |
  import csv

  def save_scores(scores, path):
      with open(path, "w", newline="") as file:
          writer = csv.writer(file)
          writer.writerow(["name", "score"])
          for name in scores:
              writer.writerow([name, scores[name]])
---
::
````
2. **Create `content/week6-file-io/04-binary-files.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Binary files
week: 6
order: 4
minutes: 10
concepts: [files]
---

Not every file holds text. Images, sounds and zip files hold **bytes**: numbers from 0 to 255, which don't have to spell out letters at all. Opening one in text mode makes Python try to read letters, which usually stops with `UnicodeDecodeError`.

Add `"b"` to the mode to work with bytes instead. `"rb"` reads bytes, and `"wb"` writes them. What you read is a `bytes` value, which looks like a string with a `b` in front:

::trace
---
code: |
  with open("tiny.bin", "wb") as file:
      file.write(bytes([72, 105, 255]))

  with open("tiny.bin", "rb") as file:
      data = file.read()
  print(data)
  print(len(data), data[0])
---
::

Bytes that happen to be letters show as letters, so `72` and `105` print as `Hi`. Others show as codes, such as `\xff` for 255. Indexing a `bytes` value gives a number, so `data[0]` is `72`.

Many kinds of file start with the same few bytes, called a **signature**. Every PNG image starts with the 8 bytes `b"\x89PNG\r\n\x1a\n"`. A program can check those bytes to tell what a file really is, whatever its name says. `read(8)` reads only the first 8 bytes.

A common mistake: comparing bytes with a string. `b"PNG" == "PNG"` is `False`, because a `bytes` value never equals a `str`. Write the `b` in front.

Your turn: tell whether a file is a PNG image.

::exercise
---
id: w6-l4-ex1
prompt: Finish is_png so that it returns True if the file at path starts with the PNG signature, b"\x89PNG\r\n\x1a\n", and False otherwise.
starter: |
  def is_png(path):
      with open(path) as file:
          return file.read(8) == "\x89PNG\r\n\x1a\n"
hints:
  - The starter opens the file in text mode, so Python tries to read the byte 0x89 as a letter and fails.
  - Open the file with "rb", and compare file.read(8) with b"\x89PNG\r\n\x1a\n".
tests:
  - check: |
      with open("w6_image.png", "wb") as file:
          file.write(b"\x89PNG\r\n\x1a\n" + bytes(20))
      assert is_png("w6_image.png") is True, "is_png should be True for a PNG file"
  - check: |
      with open("w6_photo.jpg", "wb") as file:
          file.write(b"\xff\xd8\xff\xe0" + bytes(20))
      assert is_png("w6_photo.jpg") is False, "is_png should be False for a JPEG file"
solution: |
  def is_png(path):
      with open(path, "rb") as file:
          return file.read(8) == b"\x89PNG\r\n\x1a\n"
---
::
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 32 lessons, 58 exercises`.
2. File sizes match:
```sh
   wc -c "content/week6-file-io/03-csv-files.md"   # expect 3988
   wc -c "content/week6-file-io/04-binary-files.md"   # expect 2385
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week6-file-io/03-csv-files.md" | shasum | cut -c1-12   # expect 6e8285d36843
   awk '/^::exercise$/,/^::$/' "content/week6-file-io/04-binary-files.md" | shasum | cut -c1-12   # expect 3db7c28799e0
```
4. `git status --short` shows only these new lesson files, apart from changes from earlier specs.
