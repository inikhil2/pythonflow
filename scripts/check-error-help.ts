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
