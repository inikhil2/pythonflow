# 017: Plain-English explanations for Python errors, with a check script (task A2, part 1)
Files: app/utils/errorHelp.ts, scripts/check-error-help.ts
Severity: med

## Problem
When a program fails, the learner sees only the raw traceback, for example
`NameError: name 'x' is not defined`. Beginners need one plain sentence on what it
means and what to try. Neither file exists yet. This spec adds the pure mapping and a
Node check script; spec 018 shows it on screen.

The input is the `error` field of `RunResult` from `usePython()`: the last line of the
traceback (`"NameError: name 'x' is not defined"`), or one of the runner's own
messages (`"Your program ran for more than 10 seconds and was stopped. Is there an
infinite loop?"`, `"Stopped."`, `"Python could not start. ..."`), or `null`.

## Required change
1. Create `app/utils/errorHelp.ts` with exactly this content:
```ts
export interface ErrorExplanation {
  title: string
  body: string
}

// Keyed by the exception name: the text before the first colon of the error line.
const byName: Record<string, ErrorExplanation> = {
  SyntaxError: {
    title: 'Python could not read your code',
    body: 'Something is typed in a way Python does not understand, so nothing ran. Look at the line in the message and the line just before it for a missing bracket, quote or colon.',
  },
  IndentationError: {
    title: 'The indentation is wrong',
    body: 'Python uses the spaces at the start of a line to group code. After a line that ends in a colon, indent the next lines by 4 spaces, and line up lines that belong together.',
  },
  NameError: {
    title: 'Python does not know that name',
    body: 'You used a name before giving it a value, or the spelling is different. Check the spelling and capital letters. Text needs quotes: "hello", not hello.',
  },
  TypeError: {
    title: 'A value has the wrong type for this',
    body: 'For example, "5" + 1 mixes a string and a number. input() always gives a string, so convert it with int() or float() before doing maths.',
  },
  ValueError: {
    title: 'The type is right but the value is not',
    body: 'For example, int("cat") fails because "cat" is not a number. Check what is in the Input box.',
  },
  IndexError: {
    title: 'That position does not exist',
    body: 'Positions start at 0, so a list of 3 items has positions 0, 1 and 2. Compare the index with len().',
  },
  KeyError: {
    title: 'That key is not in the dictionary',
    body: 'Check the spelling and capital letters of the key, or use .get(key) to get None instead of an error.',
  },
  ZeroDivisionError: {
    title: 'You divided by zero',
    body: 'Dividing by 0 has no answer. Check the number you divide by before you divide.',
  },
  AttributeError: {
    title: 'That value has no such method',
    body: 'For example, numbers have no .upper(). Check the spelling, and check the type of the value with type().',
  },
  ModuleNotFoundError: {
    title: 'Python cannot find that module',
    body: 'Check the spelling after import. Only the Python standard library is available here.',
  },
  EOFError: {
    title: 'Your program asked for more input',
    body: 'input() was called but the Input box has no more lines. Add one line to the Input box for each input() call.',
  },
  RecursionError: {
    title: 'A function called itself too many times',
    body: 'Each call must move towards a base case that returns without calling again. Check that the base case is reached.',
  },
}

const unterminatedString: ErrorExplanation = {
  title: 'A string is missing its closing quote',
  body: 'A string starts with a quote but never ends. Add the matching closing quote, " or \', on the line the message names.',
}

const timeout: ErrorExplanation = {
  title: 'Your program took too long',
  body: 'A while loop whose condition never becomes False runs forever. Check that something inside the loop changes the condition.',
}

export function explainError(error: string | null): ErrorExplanation | null {
  if (!error) return null
  if (error.startsWith('Your program ran for more than')) return timeout
  if (error.startsWith('SyntaxError: unterminated string literal')) return unterminatedString
  return byName[error.split(':')[0].trim()] ?? null
}
```

2. Create `scripts/check-error-help.ts` with exactly this content:
```ts
import assert from 'node:assert/strict'
import { explainError } from '../app/utils/errorHelp.ts'

assert.equal(explainError("NameError: name 'x' is not defined")?.title, 'Python does not know that name')
assert.equal(explainError('SyntaxError: unterminated string literal (detected at line 1)')?.title, 'A string is missing its closing quote')
assert.equal(explainError("SyntaxError: '(' was never closed")?.title, 'Python could not read your code')
assert.equal(explainError("IndentationError: expected an indented block after 'if' statement on line 1")?.title, 'The indentation is wrong')
assert.equal(explainError('EOFError: EOF when reading a line')?.title, 'Your program asked for more input')
assert.equal(explainError('Your program ran for more than 10 seconds and was stopped. Is there an infinite loop?')?.title, 'Your program took too long')

for (const name of ['TypeError', 'ValueError', 'IndexError', 'KeyError', 'ZeroDivisionError', 'AttributeError', 'ModuleNotFoundError', 'RecursionError']) {
  assert.ok(explainError(`${name}: something`), name)
}

assert.equal(explainError(null), null)
assert.equal(explainError(''), null)
assert.equal(explainError('Stopped.'), null)
assert.equal(explainError('Python could not start. Check your internet connection, then press Run again.'), null)
assert.equal(explainError('FooError: not a real error'), null)

console.log('ok')
```

## Acceptance gates
- `node scripts/check-error-help.ts` (run from `cs50p-tutor/`, Node 24) prints exactly `ok`.
- `grep -c "title:" app/utils/errorHelp.ts` prints 15 (14 explanations plus the interface field).
