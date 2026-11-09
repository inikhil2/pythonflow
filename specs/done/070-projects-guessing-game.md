# 070: The guessing game and API client projects (shell step, tasks D4 to D7)
Files: content/projects/02-guessing-game.yml, content/projects/03-api-client.yml
Severity: med

## Why a shell step
These files are long YAML with Python inside, so heredocs write them exactly. The
format and checker are described in shell step 066.

- Guessing game (after Week 4). The last milestone uses `random`. Its check case seeds
  `random.seed(1)`, and Pyodide 0.29.5 then gives `random.randint(1, 10) == 3`.
- API client (after Week 4). Its note says Python here cannot reach the internet. The starter
  defines `get(path)`, which returns saved JSON, so the learner parses real JSON text with
  `json.loads` without a network.

Do this after shell step 066.

## Steps
Run from `~/Desktop/AiderThings/cs50p-tutor`:

```sh
cat > 'content/projects/02-guessing-game.yml' <<'EOF_YML'
slug: guessing-game
title: Number guessing game
summary: Guess a secret number with "Too low" and "Too high" clues, count the guesses, then let random pick the secret.
icon: dices
requires: [functions, return-values, conditionals, while-loops, random]
afterWeek: 4
milestones:
  - id: guessing-game-1
    title: Compare a guess
    prompt: >-
      Write a function check_guess(secret, guess) that returns "Too low" when the guess
      is smaller than the secret, "Too high" when it is bigger, and "Correct" when they
      are equal. It returns the text and prints nothing.
    starter: |
      def check_guess(secret, guess):
          ...
    tests:
      - check: assert check_guess(50, 10) == "Too low", 'check_guess(50, 10) should return "Too low"'
      - check: assert check_guess(50, 90) == "Too high", 'check_guess(50, 90) should return "Too high"'
      - check: assert check_guess(7, 7) == "Correct", 'check_guess(7, 7) should return "Correct"'
    hints:
      - Use if, elif and else to pick one of the three answers.
      - return hands the text back to the caller. print would only show it.
    solution: |
      def check_guess(secret, guess):
          if guess < secret:
              return "Too low"
          elif guess > secret:
              return "Too high"
          else:
              return "Correct"
  - id: guessing-game-2
    title: Keep guessing
    prompt: >-
      Write a function play(secret). In a loop, ask for a guess with
      int(input("Guess: ")), print what check_guess says, and stop when the guess is
      correct. End the program with play(42).
    starter: |
      def check_guess(secret, guess):
          if guess < secret:
              return "Too low"
          elif guess > secret:
              return "Too high"
          else:
              return "Correct"


      def play(secret):
          ...


      play(42)
    tests:
      - stdin: "10\n90\n42"
        stdout: "Guess: Too low\nGuess: Too high\nGuess: Correct"
      - stdin: "42"
        stdout: "Guess: Correct"
    hints:
      - while True repeats forever, and break leaves the loop.
      - Keep the answer in a variable, so you can print it and then compare it with "Correct".
    solution: |
      def check_guess(secret, guess):
          if guess < secret:
              return "Too low"
          elif guess > secret:
              return "Too high"
          else:
              return "Correct"


      def play(secret):
          while True:
              answer = check_guess(secret, int(input("Guess: ")))
              print(answer)
              if answer == "Correct":
                  break


      play(42)
  - id: guessing-game-3
    title: Count the guesses
    prompt: >-
      Count every guess. After the correct one, print the count, for example:
      Guesses: 3
    starter: |
      def check_guess(secret, guess):
          if guess < secret:
              return "Too low"
          elif guess > secret:
              return "Too high"
          else:
              return "Correct"


      def play(secret):
          while True:
              answer = check_guess(secret, int(input("Guess: ")))
              print(answer)
              if answer == "Correct":
                  break


      play(42)
    tests:
      - stdin: "10\n90\n42"
        stdout: "Guess: Too low\nGuess: Too high\nGuess: Correct\nGuesses: 3"
      - stdin: "42"
        stdout: "Guess: Correct\nGuesses: 1"
    hints:
      - Set a counter to 0 before the loop and add 1 each time you ask for a guess.
      - Print the count after the loop ends.
    solution: |
      def check_guess(secret, guess):
          if guess < secret:
              return "Too low"
          elif guess > secret:
              return "Too high"
          else:
              return "Correct"


      def play(secret):
          guesses = 0
          while True:
              guesses += 1
              answer = check_guess(secret, int(input("Guess: ")))
              print(answer)
              if answer == "Correct":
                  break
          print(f"Guesses: {guesses}")


      play(42)
  - id: guessing-game-4
    title: Pick a random secret
    prompt: >-
      Import random and write pick_secret(level), which returns random.randint(1, level).
      Ask for the level first with int(input("Level: ")), then end the program with
      play(pick_secret(level)) instead of play(42).
    starter: |
      def check_guess(secret, guess):
          if guess < secret:
              return "Too low"
          elif guess > secret:
              return "Too high"
          else:
              return "Correct"


      def play(secret):
          guesses = 0
          while True:
              guesses += 1
              answer = check_guess(secret, int(input("Guess: ")))
              print(answer)
              if answer == "Correct":
                  break
          print(f"Guesses: {guesses}")


      play(42)
    tests:
      # Each case plays a level 3 game by guessing 1, 2 and 3, so any secret is found.
      - stdin: "3\n1\n2\n3"
        check: |-
          random.seed(1)
          assert pick_secret(10) == 3, "with random.seed(1), pick_secret(10) should return 3"
      - stdin: "3\n1\n2\n3"
        check: |-
          numbers = {pick_secret(3) for _ in range(200)}
          assert numbers == {1, 2, 3}, "pick_secret(3) should return 1, 2 or 3, and each of them sometimes"
    hints:
      - random.randint(1, level) includes both 1 and level.
      - Read the level before you call play, and pass the secret into it.
    solution: |
      import random


      def check_guess(secret, guess):
          if guess < secret:
              return "Too low"
          elif guess > secret:
              return "Too high"
          else:
              return "Correct"


      def play(secret):
          guesses = 0
          while True:
              guesses += 1
              answer = check_guess(secret, int(input("Guess: ")))
              print(answer)
              if answer == "Correct":
                  break
          print(f"Guesses: {guesses}")


      def pick_secret(level):
          return random.randint(1, level)


      level = int(input("Level: "))
      play(pick_secret(level))
EOF_YML
cat > 'content/projects/03-api-client.yml' <<'EOF_YML'
slug: api-client
title: API client with mocked data
summary: Read JSON from a pretend web API, pick out the fields you need, and print a tidy report.
icon: cloud
requires: [functions, dictionaries, exceptions, modules]
afterWeek: 4
note: Python here runs in your browser and cannot reach the internet, so get(path) returns saved JSON instead of calling a real API.
milestones:
  - id: api-client-1
    title: Parse the JSON
    prompt: >-
      The function get(path) in the editor returns JSON text, as a web API would. Call
      get("/users/1"), turn the text into a dictionary named user with json.loads, and
      print the user's name.
    starter: |
      import json

      # A pretend web API: get(path) returns JSON text for that path.
      RESPONSES = {
          "/users/1": '{"name": "Ada Lovelace", "email": "ada@example.com", "city": "London"}',
          "/users/2": '{"name": "Alan Turing", "email": "alan@example.com"}',
      }


      def get(path):
          return RESPONSES.get(path, '{"error": "Not found"}')


      # Your code here
    tests:
      - stdout: "Ada Lovelace"
      - check: assert user["email"] == "ada@example.com", "user should be the dictionary that json.loads returns"
    hints:
      - json.loads takes a string and returns a dictionary.
      - Read a value with its key, for example user["name"].
    solution: |
      import json

      # A pretend web API: get(path) returns JSON text for that path.
      RESPONSES = {
          "/users/1": '{"name": "Ada Lovelace", "email": "ada@example.com", "city": "London"}',
          "/users/2": '{"name": "Alan Turing", "email": "alan@example.com"}',
      }


      def get(path):
          return RESPONSES.get(path, '{"error": "Not found"}')


      user = json.loads(get("/users/1"))
      print(user["name"])
  - id: api-client-2
    title: Pick fields
    prompt: >-
      Write a function contact(user) that returns the name and the email in one string,
      for example: Ada Lovelace <ada@example.com>. Print contact(user) instead of the
      name.
    starter: |
      import json

      # A pretend web API: get(path) returns JSON text for that path.
      RESPONSES = {
          "/users/1": '{"name": "Ada Lovelace", "email": "ada@example.com", "city": "London"}',
          "/users/2": '{"name": "Alan Turing", "email": "alan@example.com"}',
      }


      def get(path):
          return RESPONSES.get(path, '{"error": "Not found"}')


      user = json.loads(get("/users/1"))
      print(user["name"])
    tests:
      - stdout: "Ada Lovelace <ada@example.com>"
      - check: |-
          got = contact({"name": "Grace Hopper", "email": "grace@example.com"})
          assert got == "Grace Hopper <grace@example.com>", f"contact() returned {got!r}"
    hints:
      - Inside an f-string with double quotes, use single quotes for the keys, for example {user['name']}.
    solution: |
      import json

      # A pretend web API: get(path) returns JSON text for that path.
      RESPONSES = {
          "/users/1": '{"name": "Ada Lovelace", "email": "ada@example.com", "city": "London"}',
          "/users/2": '{"name": "Alan Turing", "email": "alan@example.com"}',
      }


      def get(path):
          return RESPONSES.get(path, '{"error": "Not found"}')


      def contact(user):
          return f"{user['name']} <{user['email']}>"


      user = json.loads(get("/users/1"))
      print(contact(user))
  - id: api-client-3
    title: Handle a missing key
    prompt: >-
      User 2 has no city, so user["city"] stops the program with KeyError. Write
      city(user), which returns the city, or "Unknown" when the key is missing. Use try
      and except KeyError. Then loop over "/users/1" and "/users/2" and print each
      contact and city, for example: Ada Lovelace <ada@example.com>, London
    starter: |
      import json

      # A pretend web API: get(path) returns JSON text for that path.
      RESPONSES = {
          "/users/1": '{"name": "Ada Lovelace", "email": "ada@example.com", "city": "London"}',
          "/users/2": '{"name": "Alan Turing", "email": "alan@example.com"}',
      }


      def get(path):
          return RESPONSES.get(path, '{"error": "Not found"}')


      def contact(user):
          return f"{user['name']} <{user['email']}>"


      user = json.loads(get("/users/1"))
      print(contact(user))
    tests:
      - stdout: "Ada Lovelace <ada@example.com>, London\nAlan Turing <alan@example.com>, Unknown"
      - check: |-
          assert city({"city": "Paris"}) == "Paris", 'city({"city": "Paris"}) should return "Paris"'
          assert city({}) == "Unknown", 'city({}) should return "Unknown"'
    hints:
      - Put the line that can fail inside try, and the fallback inside except KeyError.
      - A for loop over a list of paths runs the same code for each user.
    solution: |
      import json

      # A pretend web API: get(path) returns JSON text for that path.
      RESPONSES = {
          "/users/1": '{"name": "Ada Lovelace", "email": "ada@example.com", "city": "London"}',
          "/users/2": '{"name": "Alan Turing", "email": "alan@example.com"}',
      }


      def get(path):
          return RESPONSES.get(path, '{"error": "Not found"}')


      def contact(user):
          return f"{user['name']} <{user['email']}>"


      def city(user):
          try:
              return user["city"]
          except KeyError:
              return "Unknown"


      for path in ["/users/1", "/users/2"]:
          user = json.loads(get(path))
          print(f"{contact(user)}, {city(user)}")
  - id: api-client-4
    title: Format a report
    prompt: >-
      Add "/users/3", which the API does not have: for that path get returns
      {"error": "Not found"}. Print a report: the line Users report, one line per user,
      the path and the error for a missing user (/users/3: Not found), and a last line
      that counts the users found, for example: Found 2 of 3 users
    starter: |
      import json

      # A pretend web API: get(path) returns JSON text for that path.
      RESPONSES = {
          "/users/1": '{"name": "Ada Lovelace", "email": "ada@example.com", "city": "London"}',
          "/users/2": '{"name": "Alan Turing", "email": "alan@example.com"}',
      }


      def get(path):
          return RESPONSES.get(path, '{"error": "Not found"}')


      def contact(user):
          return f"{user['name']} <{user['email']}>"


      def city(user):
          try:
              return user["city"]
          except KeyError:
              return "Unknown"


      for path in ["/users/1", "/users/2"]:
          user = json.loads(get(path))
          print(f"{contact(user)}, {city(user)}")
    tests:
      - stdout: "Users report\nAda Lovelace <ada@example.com>, London\nAlan Turing <alan@example.com>, Unknown\n/users/3: Not found\nFound 2 of 3 users"
    hints:
      - '"error" in user is True when the dictionary has that key.'
      - Keep a counter that goes up only for the users you find.
    solution: |
      import json

      # A pretend web API: get(path) returns JSON text for that path.
      RESPONSES = {
          "/users/1": '{"name": "Ada Lovelace", "email": "ada@example.com", "city": "London"}',
          "/users/2": '{"name": "Alan Turing", "email": "alan@example.com"}',
      }


      def get(path):
          return RESPONSES.get(path, '{"error": "Not found"}')


      def contact(user):
          return f"{user['name']} <{user['email']}>"


      def city(user):
          try:
              return user["city"]
          except KeyError:
              return "Unknown"


      paths = ["/users/1", "/users/2", "/users/3"]
      found = 0
      print("Users report")
      for path in paths:
          user = json.loads(get(path))
          if "error" in user:
              print(f"{path}: {user['error']}")
          else:
              found += 1
              print(f"{contact(user)}, {city(user)}")
      print(f"Found {found} of {len(paths)} users")
EOF_YML
node scripts/check-projects.ts
```

## Acceptance gates
1. Sizes:
   wc -c "content/projects/02-guessing-game.yml"   # expect 6240
   wc -c "content/projects/03-api-client.yml"   # expect 7995
2. `node scripts/check-projects.ts` prints `projects ok: 3 projects, 12 milestones`.
3. `git status --short` shows only the two new files.
4. `npm run generate` exits 0, and its log lists `/projects/<slug>` and every
   `/projects/<slug>/<milestone id>` for the new projects.
5. Commit as "Shell 070: guessing game and API client projects".
