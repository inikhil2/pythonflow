import assert from 'node:assert/strict'
import { failureCategory, normalizeOutput, sameOutput } from '../app/utils/compareOutput.ts'

// Output comparison.
assert.ok(sameOutput('hello, world', 'hello, world\n'))
assert.ok(sameOutput('a\nb', 'a  \nb\n\n'))
assert.ok(sameOutput('a\nb', 'a\r\nb\r\n'))
assert.ok(!sameOutput('hello, world', 'Hello, world'))
assert.ok(!sameOutput('a b', 'a  b'))
assert.ok(!sameOutput('a\nb', 'a\n\nb'))
assert.ok(!sameOutput('x', ' x'))
assert.equal(normalizeOutput('Name: hi Bob \n'), 'Name: hi Bob')

// Failure category.
const pass = { passed: true, error: null, timedOut: false }
assert.equal(failureCategory([]), null)
assert.equal(failureCategory([pass, pass]), null)
assert.equal(failureCategory([pass, { passed: false, error: null, timedOut: false }]), 'Wrong output')
assert.equal(failureCategory([{ passed: false, error: "NameError: name 'x' is not defined", timedOut: false }]), 'NameError')
assert.equal(failureCategory([{ passed: false, error: 'AssertionError', timedOut: false }]), 'AssertionError')
assert.equal(failureCategory([{ passed: false, error: 'Your program ran for more than 10 seconds and was stopped. Is there an infinite loop?', timedOut: true }]), 'Timeout')

console.log('ok')
