import assert from 'node:assert/strict'
import { milestonesPassed, projectStatus } from '../app/utils/projectStatus.ts'

type Exercises = Record<string, { code: string; passedAt?: string; hintsUsed: number }>
const p = (exercises: Exercises) => ({ exercises })

const IDS = ['calculator-1', 'calculator-2']
const T1 = '2026-10-01T10:00:00.000Z'
const passed = { code: 'print(1)', passedAt: T1, hintsUsed: 0 }

assert.equal(milestonesPassed(p({}), IDS), 0)
assert.equal(milestonesPassed(p({ 'calculator-1': passed }), IDS), 1)
// Saved code without a pass is not a passed milestone.
assert.equal(milestonesPassed(p({ 'calculator-1': { code: 'x', hintsUsed: 1 } }), IDS), 0)
// Passes in other projects or lessons do not count.
assert.equal(milestonesPassed(p({ 'w0-l1-ex1': passed }), IDS), 0)

assert.equal(projectStatus(p({}), IDS), 'not-started')
assert.equal(projectStatus(p({ 'w0-l1-ex1': passed }), IDS), 'not-started')
assert.equal(projectStatus(p({ 'calculator-2': { code: 'x', hintsUsed: 0 } }), IDS), 'in-progress')
assert.equal(projectStatus(p({ 'calculator-1': passed }), IDS), 'in-progress')
assert.equal(projectStatus(p({ 'calculator-1': passed, 'calculator-2': passed }), IDS), 'completed')
assert.equal(projectStatus(p({}), []), 'not-started')

console.log('project status ok')
