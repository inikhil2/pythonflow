import type { Status } from '~/utils/lessonStatus'
import type { Progress } from '~/utils/progress'

// Only the exercises map is read, so readonly progress from useProgress() fits.
type Exercises = Pick<Progress, 'exercises'>

// Milestones count as passed only from stored check results.
export function milestonesPassed(p: Exercises, ids: readonly string[]): number {
  return ids.filter((id) => p.exercises[id]?.passedAt).length
}

// A project starts once any milestone has saved code, a hint or an attempt, and completes when all pass.
export function projectStatus(p: Exercises, ids: readonly string[]): Status {
  if (ids.length > 0 && milestonesPassed(p, ids) === ids.length) return 'completed'
  return ids.some((id) => p.exercises[id]) ? 'in-progress' : 'not-started'
}
