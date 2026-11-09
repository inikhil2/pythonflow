import assert from 'node:assert/strict'
import { exerciseIds } from '../app/utils/lessonExercises.ts'

assert.deepEqual(
  exerciseIds({
    value: [
      ['p', {}, 'Intro ', ['code', {}, 'print()']],
      ['exercise', { id: 'w0-l1-ex1', prompt: 'Print hi.' }],
      'stray text',
      ['div', {}, ['exercise', { id: 'w0-l1-ex2' }]],
      ['exercise', {}],
    ],
  }),
  ['w0-l1-ex1', 'w0-l1-ex2'],
)
assert.deepEqual(exerciseIds({ value: [['p', {}, 'No exercises here.']] }), [])
assert.deepEqual(exerciseIds({ value: [] }), [])
assert.deepEqual(exerciseIds(null), [])
assert.deepEqual(exerciseIds(undefined), [])

console.log('ok')
