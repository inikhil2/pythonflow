# 014: Fix three inaccurate or confusing sentences in the Hello, world lesson
Files: content/week0-functions/01-hello.md
Severity: low

## Problem
In `content/week0-functions/01-hello.md`:
1. Line 11 says a function takes "ingredients (input)" and "produces a result
   (output)". `input` is the name of a Python function taught in this same week,
   so this confuses the word. The correct term for the values in the parentheses
   is "arguments". `print` also does not produce a result value; it shows text.
2. Line 34 says "Python will complain. It's waiting for the quote to end the
   text." Python does not wait. It stops at once with
   `SyntaxError: unterminated string literal (detected at line 1)` (checked in
   Pyodide 0.29.5, which this app runs).
3. Line 36 says "Open the exercise below". The exercise box is already open on the page.

## Required change
1. Replace this whole line:
```
In programming, a **function** is a block of code that does something specific. Think of it like a recipe: you give it ingredients (input), it follows steps, and produces a result (output).
```
   with exactly:
```
In programming, a **function** is a named piece of code that does one specific job. You hand it values inside its parentheses, called **arguments**, and it does its job with them.
```
2. Replace this whole line:
```
Python will complain. It's waiting for the quote to end the text. Always match your opening and closing quotes.
```
   with exactly:
```
Python stops before running anything and shows `SyntaxError: unterminated string literal`. The text has no closing quote, so Python can't tell where it ends. Always match your opening and closing quotes.
```
3. Replace this text:
```
Now it's your turn. Open the exercise below and type your first program.
```
   with exactly:
```
Now it's your turn. Type your first program in the box below.
```
Change nothing else in the file.

## Acceptance gates
- `grep -c 'ingredients' content/week0-functions/01-hello.md` prints `0`
- `grep -c 'unterminated string literal' content/week0-functions/01-hello.md` prints `1`
- `grep -c 'Open the exercise' content/week0-functions/01-hello.md` prints `0`
- `grep -c '::exercise' content/week0-functions/01-hello.md` prints `1`
