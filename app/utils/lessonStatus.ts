import type { Progress } from '~/utils/progress'

export type Status = 'not-started' | 'in-progress' | 'completed'

// Only the lessons map is read, so readonly progress from useProgress() fits.
type Lessons = Pick<Progress, 'lessons'>

// Opening a lesson starts it; passing every exercise completes it.
export function lessonStatus(p: Lessons, path: string): Status {
  const lesson = p.lessons[path]
  if (lesson?.completedAt) return 'completed'
  return lesson ? 'in-progress' : 'not-started'
}

// A week is completed when every lesson is, and in progress once any lesson is opened.
export function weekStatus(p: Lessons, paths: string[]): Status {
  const statuses = paths.map((path) => lessonStatus(p, path))
  if (statuses.length > 0 && statuses.every((s) => s === 'completed')) return 'completed'
  return statuses.some((s) => s !== 'not-started') ? 'in-progress' : 'not-started'
}

export function completedCount(p: Lessons, paths: string[]): number {
  return paths.filter((path) => lessonStatus(p, path) === 'completed').length
}

// The most recently opened unfinished lesson (resume), else the first unfinished one in course order.
export function nextLesson(p: Lessons, paths: string[]): { path: string; resume: boolean } | null {
  let resume: string | null = null
  let resumeAt = ''
  for (const path of paths) {
    const lesson = p.lessons[path]
    if (lesson && !lesson.completedAt && lesson.openedAt > resumeAt) {
      resume = path
      resumeAt = lesson.openedAt
    }
  }
  if (resume) return { path: resume, resume: true }
  const first = paths.find((path) => lessonStatus(p, path) !== 'completed')
  return first ? { path: first, resume: false } : null
}
