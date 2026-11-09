export interface CourseLesson {
  path: string
  title: string
  week: number
  order: number
  minutes?: number
  concepts: string[] // concept ids from the lesson frontmatter
  exercises: string[] // ::exercise ids, in page order
}

export interface CourseWeek {
  week: number
  title: string
  summary: string
  lessons: CourseLesson[]
}

// The course outline: every week from content/weeks.yml with its lessons in order.
export async function useCourse() {
  const { data } = await useAsyncData('course', async (): Promise<CourseWeek[]> => {
    const [outline, lessons] = await Promise.all([
      queryCollection('weeks').first(),
      queryCollection('lessons')
        .select('path', 'title', 'week', 'order', 'minutes', 'concepts', 'body')
        .order('week', 'ASC')
        .order('order', 'ASC')
        .all(),
    ])
    // The body is read only for its exercise ids, so it stays out of the page payload.
    const all = lessons.map(({ body, concepts, ...lesson }) => ({
      ...lesson,
      concepts: concepts ?? [],
      exercises: exerciseIds(body),
    }))
    return (outline?.weeks ?? []).map((w) => ({ ...w, lessons: all.filter((l) => l.week === w.week) }))
  })
  return computed(() => data.value ?? [])
}

// Every concept from content/concepts.yml, in file order.
export async function useConcepts() {
  const { data } = await useAsyncData('concepts', async () => (await queryCollection('concepts').first())?.concepts ?? [])
  return computed(() => data.value ?? [])
}
