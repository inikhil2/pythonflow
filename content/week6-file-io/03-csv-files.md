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
