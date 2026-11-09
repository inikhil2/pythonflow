export type Tier = 'easy' | 'medium' | 'hard'

export const TIERS: Tier[] = ['easy', 'medium', 'hard']

export interface Problem {
  path: string
  title: string
  tier: Tier
  order: number
  leetcode: number
  url: string
  companies: string[]
  topic: string
  needs: string[] // lesson paths, e.g. /learn/week2-loops/04-dictionaries
  exerciseId: string
}

// Anything that is not a tier name falls back to easy.
export function parseTier(value: unknown): Tier {
  return TIERS.find((t) => t === value) ?? 'easy'
}

export function tierProblems(all: Problem[], tier: Tier): Problem[] {
  return all.filter((p) => p.tier === tier)
}

export function isSolved(progress: { exercises: Record<string, { passedAt?: string }> }, exerciseId: string): boolean {
  return !!progress.exercises[exerciseId]?.passedAt
}

export function problemsNeeding(all: Problem[], lessonPath: string): Problem[] {
  return all.filter((p) => p.needs.includes(lessonPath))
}

export async function useInterview() {
  const { data } = await useAsyncData('interview', async (): Promise<Problem[]> => {
    const rows = await queryCollection('interview')
      .select('path', 'title', 'tier', 'order', 'leetcode', 'url', 'companies', 'topic', 'needs', 'body')
      .all()
    // The body is read only for its exercise id, so it stays out of the page payload.
    return rows
      .map(({ body, ...problem }) => ({ ...problem, exerciseId: exerciseIds(body)[0] ?? '' }))
      .sort((a, b) => TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier) || a.order - b.order)
  })
  return computed(() => data.value ?? [])
}
