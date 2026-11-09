# 071: The expense tracker and text analyser projects (shell step, tasks D4 to D7)
Files: content/projects/04-expense-tracker.yml, content/projects/05-text-analyser.yml
Severity: med

## Why a shell step
These files are long YAML with Python inside, so heredocs write them exactly. The
format and checker are described in shell step 066.

- Expense tracker (after Week 6). Its note says files live in browser memory and are gone on
  reload. Milestone 4 writes and reads `expenses.csv` with the `csv` module.
- Text analyser (after Week 7). It counts words and lines, finds the most common word, and
  uses `re.findall` for email addresses. All addresses use example.com or example.org.

Do this after shell step 066 and step 070.

## Steps
Run from `~/Desktop/AiderThings/cs50p-tutor`:

```sh
cat > 'content/projects/04-expense-tracker.yml' <<'EOF_YML'
slug: expense-tracker
title: Expense tracker
summary: Turn lines like "12.50,food" into totals per category, save them to a CSV file, and find where the money goes.
icon: wallet
requires: [for-loops, dictionaries, files, csv]
afterWeek: 6
note: Files you write here live in your browser's memory and are gone when you reload the page.
milestones:
  - id: expense-tracker-1
    title: Parse a line
    prompt: >-
      Each line in LINES is an amount and a category with a comma between them. Write
      parse(line), which returns a tuple of the amount as a float and the category
      without spaces, for example parse("12.50,food") returns (12.5, "food"). Then
      print the list of all parsed lines.
    starter: |
      import csv

      LINES = ["12.50,food", "3.20,transport", "40.00,food", "9.99,books"]


      def parse(line):
          ...
    tests:
      - stdout: "[(12.5, 'food'), (3.2, 'transport'), (40.0, 'food'), (9.99, 'books')]"
      - check: |-
          got = parse("7.25, rent")
          assert got == (7.25, "rent"), f'parse("7.25, rent") returned {got!r}'
    hints:
      - line.split(",") returns the two parts as a list of strings.
      - .strip() removes spaces from both ends of a string.
    solution: |
      import csv

      LINES = ["12.50,food", "3.20,transport", "40.00,food", "9.99,books"]


      def parse(line):
          amount, category = line.split(",")
          return float(amount), category.strip()


      expenses = [parse(line) for line in LINES]
      print(expenses)
  - id: expense-tracker-2
    title: Add them up
    prompt: >-
      Write total(expenses), which returns the sum of the amounts. Instead of the list,
      print the total with two decimals, for example: Total: 65.69
    starter: |
      import csv

      LINES = ["12.50,food", "3.20,transport", "40.00,food", "9.99,books"]


      def parse(line):
          amount, category = line.split(",")
          return float(amount), category.strip()


      expenses = [parse(line) for line in LINES]
      print(expenses)
    tests:
      - stdout: "Total: 65.69"
      - check: |-
          assert total([(1.5, "a"), (2.0, "b")]) == 3.5, "total() of 1.5 and 2.0 should be 3.5"
          assert total([]) == 0, "total([]) should be 0"
    hints:
      - Loop over the tuples and add each amount, or pass a generator to sum().
      - f"{x:.2f}" shows a number with two decimals.
    solution: |
      import csv

      LINES = ["12.50,food", "3.20,transport", "40.00,food", "9.99,books"]


      def parse(line):
          amount, category = line.split(",")
          return float(amount), category.strip()


      def total(expenses):
          return sum(amount for amount, category in expenses)


      expenses = [parse(line) for line in LINES]
      print(f"Total: {total(expenses):.2f}")
  - id: expense-tracker-3
    title: Totals by category
    prompt: >-
      Write by_category(expenses), which returns a dictionary from each category to the
      sum of its amounts. After the total, print one line per category in the order
      they first appear, for example: food: 52.50
    starter: |
      import csv

      LINES = ["12.50,food", "3.20,transport", "40.00,food", "9.99,books"]


      def parse(line):
          amount, category = line.split(",")
          return float(amount), category.strip()


      def total(expenses):
          return sum(amount for amount, category in expenses)


      expenses = [parse(line) for line in LINES]
      print(f"Total: {total(expenses):.2f}")
    tests:
      - stdout: "Total: 65.69\nfood: 52.50\ntransport: 3.20\nbooks: 9.99"
      - check: |-
          got = by_category([(1.0, "a"), (2.0, "b"), (3.0, "a")])
          assert got == {"a": 4.0, "b": 2.0}, f"by_category() returned {got!r}"
    hints:
      - totals.get(category, 0) returns 0 for a category you have not seen yet.
      - Dictionaries keep keys in the order you first add them.
    solution: |
      import csv

      LINES = ["12.50,food", "3.20,transport", "40.00,food", "9.99,books"]


      def parse(line):
          amount, category = line.split(",")
          return float(amount), category.strip()


      def total(expenses):
          return sum(amount for amount, category in expenses)


      def by_category(expenses):
          totals = {}
          for amount, category in expenses:
              totals[category] = totals.get(category, 0) + amount
          return totals


      expenses = [parse(line) for line in LINES]
      print(f"Total: {total(expenses):.2f}")
      for category, amount in by_category(expenses).items():
          print(f"{category}: {amount:.2f}")
  - id: expense-tracker-4
    title: Save and load a CSV file
    prompt: >-
      Write save(expenses, path), which writes one row per expense with csv.writer, and
      load(path), which reads the file back into a list of (float, str) tuples. Save the
      parsed lines to expenses.csv, load them again, and print the same report from the
      loaded list.
    starter: |
      import csv

      LINES = ["12.50,food", "3.20,transport", "40.00,food", "9.99,books"]


      def parse(line):
          amount, category = line.split(",")
          return float(amount), category.strip()


      def total(expenses):
          return sum(amount for amount, category in expenses)


      def by_category(expenses):
          totals = {}
          for amount, category in expenses:
              totals[category] = totals.get(category, 0) + amount
          return totals


      expenses = [parse(line) for line in LINES]
      print(f"Total: {total(expenses):.2f}")
      for category, amount in by_category(expenses).items():
          print(f"{category}: {amount:.2f}")
    tests:
      - stdout: "Total: 65.69\nfood: 52.50\ntransport: 3.20\nbooks: 9.99"
      - check: |-
          save([(1.5, "tea"), (20.0, "rent")], "check.csv")
          got = load("check.csv")
          assert got == [(1.5, "tea"), (20.0, "rent")], f"load() returned {got!r} after save()"
    hints:
      - Open the file with open(path, "w", newline="") to write and open(path, newline="") to read.
      - csv.reader gives each row as a list of strings, so turn the amount back into a float.
    solution: |
      import csv

      LINES = ["12.50,food", "3.20,transport", "40.00,food", "9.99,books"]


      def parse(line):
          amount, category = line.split(",")
          return float(amount), category.strip()


      def total(expenses):
          return sum(amount for amount, category in expenses)


      def by_category(expenses):
          totals = {}
          for amount, category in expenses:
              totals[category] = totals.get(category, 0) + amount
          return totals


      def save(expenses, path):
          with open(path, "w", newline="") as file:
              writer = csv.writer(file)
              for amount, category in expenses:
                  writer.writerow([amount, category])


      def load(path):
          with open(path, newline="") as file:
              return [(float(amount), category) for amount, category in csv.reader(file)]


      save([parse(line) for line in LINES], "expenses.csv")
      expenses = load("expenses.csv")
      print(f"Total: {total(expenses):.2f}")
      for category, amount in by_category(expenses).items():
          print(f"{category}: {amount:.2f}")
  - id: expense-tracker-5
    title: Find the top category
    prompt: >-
      Write top_category(totals), which returns the category with the largest total.
      End the report with it, for example: Top category: food
    starter: |
      import csv

      LINES = ["12.50,food", "3.20,transport", "40.00,food", "9.99,books"]


      def parse(line):
          amount, category = line.split(",")
          return float(amount), category.strip()


      def total(expenses):
          return sum(amount for amount, category in expenses)


      def by_category(expenses):
          totals = {}
          for amount, category in expenses:
              totals[category] = totals.get(category, 0) + amount
          return totals


      def save(expenses, path):
          with open(path, "w", newline="") as file:
              writer = csv.writer(file)
              for amount, category in expenses:
                  writer.writerow([amount, category])


      def load(path):
          with open(path, newline="") as file:
              return [(float(amount), category) for amount, category in csv.reader(file)]


      save([parse(line) for line in LINES], "expenses.csv")
      expenses = load("expenses.csv")
      print(f"Total: {total(expenses):.2f}")
      for category, amount in by_category(expenses).items():
          print(f"{category}: {amount:.2f}")
    tests:
      - stdout: "Total: 65.69\nfood: 52.50\ntransport: 3.20\nbooks: 9.99\nTop category: food"
      - check: |-
          got = top_category({"a": 1.0, "b": 5.0, "c": 2.0})
          assert got == "b", f"top_category() returned {got!r}"
    hints:
      - max(totals, key=totals.get) compares the keys by their values.
    solution: |
      import csv

      LINES = ["12.50,food", "3.20,transport", "40.00,food", "9.99,books"]


      def parse(line):
          amount, category = line.split(",")
          return float(amount), category.strip()


      def total(expenses):
          return sum(amount for amount, category in expenses)


      def by_category(expenses):
          totals = {}
          for amount, category in expenses:
              totals[category] = totals.get(category, 0) + amount
          return totals


      def save(expenses, path):
          with open(path, "w", newline="") as file:
              writer = csv.writer(file)
              for amount, category in expenses:
                  writer.writerow([amount, category])


      def load(path):
          with open(path, newline="") as file:
              return [(float(amount), category) for amount, category in csv.reader(file)]


      def top_category(totals):
          return max(totals, key=totals.get)


      save([parse(line) for line in LINES], "expenses.csv")
      expenses = load("expenses.csv")
      print(f"Total: {total(expenses):.2f}")
      for category, amount in by_category(expenses).items():
          print(f"{category}: {amount:.2f}")
      print(f"Top category: {top_category(by_category(expenses))}")
EOF_YML
cat > 'content/projects/05-text-analyser.yml' <<'EOF_YML'
slug: text-analyser
title: Text analyser
summary: Count the words and lines in a text, find its most common word, and pick out every email address with a regular expression.
icon: file-text
requires: [strings, for-loops, dictionaries, regex]
afterWeek: 7
milestones:
  - id: text-analyser-1
    title: Count the words
    prompt: >-
      Write word_count(text), which returns how many words the text has. A word is
      anything between spaces or line breaks. Print the count for TEXT, for example:
      Words: 31
    starter: |
      import re

      TEXT = """Python reads the text one line at a time.
      Each word in the text counts, and the lines count too.
      Write to ada@example.com or help@example.org with questions, or ask ada@example.com again."""


      def word_count(text):
          ...
    tests:
      - stdout: "Words: 31"
      - check: |-
          assert word_count("one two  three") == 3, 'word_count("one two  three") should be 3'
          assert word_count("") == 0, 'word_count("") should be 0'
    hints:
      - text.split() with no argument splits on any run of spaces and line breaks.
    solution: |
      import re

      TEXT = """Python reads the text one line at a time.
      Each word in the text counts, and the lines count too.
      Write to ada@example.com or help@example.org with questions, or ask ada@example.com again."""


      def word_count(text):
          return len(text.split())


      print(f"Words: {word_count(TEXT)}")
  - id: text-analyser-2
    title: Count the lines
    prompt: >-
      Write line_count(text), which returns how many lines the text has. Print it after
      the words, for example: Lines: 3
    starter: |
      import re

      TEXT = """Python reads the text one line at a time.
      Each word in the text counts, and the lines count too.
      Write to ada@example.com or help@example.org with questions, or ask ada@example.com again."""


      def word_count(text):
          return len(text.split())


      print(f"Words: {word_count(TEXT)}")
    tests:
      - stdout: "Words: 31\nLines: 3"
      - check: |-
          assert line_count("a\nb") == 2, "line_count of two lines should be 2"
          assert line_count("one line") == 1, 'line_count("one line") should be 1'
    hints:
      - text.splitlines() returns a list with one string per line.
    solution: |
      import re

      TEXT = """Python reads the text one line at a time.
      Each word in the text counts, and the lines count too.
      Write to ada@example.com or help@example.org with questions, or ask ada@example.com again."""


      def word_count(text):
          return len(text.split())


      def line_count(text):
          return len(text.splitlines())


      print(f"Words: {word_count(TEXT)}")
      print(f"Lines: {line_count(TEXT)}")
  - id: text-analyser-3
    title: Find the most common word
    prompt: >-
      Write most_common(text). Make each word lowercase and strip . , ! and ? from its
      ends, count the words in a dictionary, and return the word with the highest count.
      If two words tie, return the one that comes first in the text. Print it, for
      example: Most common: the
    starter: |
      import re

      TEXT = """Python reads the text one line at a time.
      Each word in the text counts, and the lines count too.
      Write to ada@example.com or help@example.org with questions, or ask ada@example.com again."""


      def word_count(text):
          return len(text.split())


      def line_count(text):
          return len(text.splitlines())


      print(f"Words: {word_count(TEXT)}")
      print(f"Lines: {line_count(TEXT)}")
    tests:
      - stdout: "Words: 31\nLines: 3\nMost common: the"
      - check: |-
          got = most_common("Cat cat, dog.")
          assert got == "cat", f'most_common("Cat cat, dog.") returned {got!r}'
          got = most_common("b a b a c")
          assert got == "b", f'most_common("b a b a c") returned {got!r}, and b comes first'
    hints:
      - word.strip(".,!?") removes those characters from both ends only.
      - max(counts, key=counts.get) returns the first key with the biggest value.
    solution: |
      import re

      TEXT = """Python reads the text one line at a time.
      Each word in the text counts, and the lines count too.
      Write to ada@example.com or help@example.org with questions, or ask ada@example.com again."""


      def word_count(text):
          return len(text.split())


      def line_count(text):
          return len(text.splitlines())


      def most_common(text):
          counts = {}
          for word in text.split():
              word = word.strip(".,!?").lower()
              counts[word] = counts.get(word, 0) + 1
          return max(counts, key=counts.get)


      print(f"Words: {word_count(TEXT)}")
      print(f"Lines: {line_count(TEXT)}")
      print(f"Most common: {most_common(TEXT)}")
  - id: text-analyser-4
    title: Find the email addresses
    prompt: >-
      Write emails(text), which uses re.findall to find every email address and returns
      each address once, in the order they first appear. Print the list for TEXT.
    starter: |
      import re

      TEXT = """Python reads the text one line at a time.
      Each word in the text counts, and the lines count too.
      Write to ada@example.com or help@example.org with questions, or ask ada@example.com again."""


      def word_count(text):
          return len(text.split())


      def line_count(text):
          return len(text.splitlines())


      def most_common(text):
          counts = {}
          for word in text.split():
              word = word.strip(".,!?").lower()
              counts[word] = counts.get(word, 0) + 1
          return max(counts, key=counts.get)


      print(f"Words: {word_count(TEXT)}")
      print(f"Lines: {line_count(TEXT)}")
      print(f"Most common: {most_common(TEXT)}")
    tests:
      - stdout: "Words: 31\nLines: 3\nMost common: the\n['ada@example.com', 'help@example.org']"
      - check: |-
          got = emails("x@a.io, y@b.co. x@a.io")
          assert got == ["x@a.io", "y@b.co"], f"emails() returned {got!r}"
          assert emails("no address here") == [], "emails() should return [] when there are none"
    hints:
      - An address is name characters, then @, then a domain with at least one dot, such as r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+".
      - Keep a list and add an address only if it is not in the list yet.
    solution: |
      import re

      TEXT = """Python reads the text one line at a time.
      Each word in the text counts, and the lines count too.
      Write to ada@example.com or help@example.org with questions, or ask ada@example.com again."""


      def word_count(text):
          return len(text.split())


      def line_count(text):
          return len(text.splitlines())


      def most_common(text):
          counts = {}
          for word in text.split():
              word = word.strip(".,!?").lower()
              counts[word] = counts.get(word, 0) + 1
          return max(counts, key=counts.get)


      def emails(text):
          found = []
          for address in re.findall(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+", text):
              if address not in found:
                  found.append(address)
          return found


      print(f"Words: {word_count(TEXT)}")
      print(f"Lines: {line_count(TEXT)}")
      print(f"Most common: {most_common(TEXT)}")
      print(emails(TEXT))
  - id: text-analyser-5
    title: Print a summary
    prompt: >-
      Replace the printed list with one line that joins the addresses with a comma and
      a space, so the program ends with: Emails: ada@example.com, help@example.org
    starter: |
      import re

      TEXT = """Python reads the text one line at a time.
      Each word in the text counts, and the lines count too.
      Write to ada@example.com or help@example.org with questions, or ask ada@example.com again."""


      def word_count(text):
          return len(text.split())


      def line_count(text):
          return len(text.splitlines())


      def most_common(text):
          counts = {}
          for word in text.split():
              word = word.strip(".,!?").lower()
              counts[word] = counts.get(word, 0) + 1
          return max(counts, key=counts.get)


      def emails(text):
          found = []
          for address in re.findall(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+", text):
              if address not in found:
                  found.append(address)
          return found


      print(f"Words: {word_count(TEXT)}")
      print(f"Lines: {line_count(TEXT)}")
      print(f"Most common: {most_common(TEXT)}")
      print(emails(TEXT))
    tests:
      - stdout: "Words: 31\nLines: 3\nMost common: the\nEmails: ada@example.com, help@example.org"
    hints:
      - '", ".join(items) puts ", " between the strings in a list.'
    solution: |
      import re

      TEXT = """Python reads the text one line at a time.
      Each word in the text counts, and the lines count too.
      Write to ada@example.com or help@example.org with questions, or ask ada@example.com again."""


      def word_count(text):
          return len(text.split())


      def line_count(text):
          return len(text.splitlines())


      def most_common(text):
          counts = {}
          for word in text.split():
              word = word.strip(".,!?").lower()
              counts[word] = counts.get(word, 0) + 1
          return max(counts, key=counts.get)


      def emails(text):
          found = []
          for address in re.findall(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+", text):
              if address not in found:
                  found.append(address)
          return found


      print(f"Words: {word_count(TEXT)}")
      print(f"Lines: {line_count(TEXT)}")
      print(f"Most common: {most_common(TEXT)}")
      print(f"Emails: {', '.join(emails(TEXT))}")
EOF_YML
node scripts/check-projects.ts
```

## Acceptance gates
1. Sizes:
   wc -c "content/projects/04-expense-tracker.yml"   # expect 10357
   wc -c "content/projects/05-text-analyser.yml"   # expect 9957
2. `node scripts/check-projects.ts` prints `projects ok: 5 projects, 22 milestones`.
3. `git status --short` shows only the two new files.
4. `npm run generate` exits 0, and its log lists `/projects/<slug>` and every
   `/projects/<slug>/<milestone id>` for the new projects.
5. Commit as "Shell 071: expense tracker and text analyser projects".
