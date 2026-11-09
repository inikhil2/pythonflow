import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // content/week0-functions/01-hello.md is served at /learn/week0-functions/01-hello
    lessons: defineCollection({
      type: 'page',
      // Every lesson lives in a week folder; root files belong to pages.
      source: { include: '**/*.md', exclude: ['*.md', 'interview/**'], prefix: '/learn' },
      schema: z.object({
        week: z.number(),
        order: z.number(),
        minutes: z.number().optional(),
        concepts: z.array(z.string()).optional(), // ids from content/concepts.yml
      }),
    }),
    // content/interview/easy/057-two-sum.md is served at /interview/easy/057-two-sum
    interview: defineCollection({
      type: 'page',
      source: { include: 'interview/**/*.md', prefix: '/interview' },
      schema: z.object({
        tier: z.enum(['easy', 'medium', 'hard']),
        order: z.number(),
        leetcode: z.number(),
        url: z.string(),
        companies: z.array(z.string()),
        topic: z.string(),
        needs: z.array(z.string()), // lesson paths, e.g. /learn/week2-loops/04-dictionaries
      }),
    }),
    pages: defineCollection({
      type: 'page',
      source: '*.md',
    }),
    weeks: defineCollection({
      type: 'data',
      source: 'weeks.yml',
      schema: z.object({
        weeks: z.array(z.object({ week: z.number(), title: z.string(), summary: z.string() })),
      }),
    }),
    concepts: defineCollection({
      type: 'data',
      source: 'concepts.yml',
      schema: z.object({
        concepts: z.array(
          z.object({ id: z.string(), title: z.string(), week: z.number(), group: z.string(), requires: z.array(z.string()) }),
        ),
      }),
    }),
    // One visual explorer topic per file, e.g. content/explorer/01-variables.yml.
    explorer: defineCollection({
      type: 'data',
      source: 'explorer/*.yml',
      schema: z.object({ topic: z.string(), title: z.string(), summary: z.string(), week: z.number(), code: z.string() }),
    }),
    // One project per file, e.g. content/projects/01-calculator.yml; scripts/check-projects.ts runs every solution.
    projects: defineCollection({
      type: 'data',
      source: 'projects/*.yml',
      schema: z.object({
        slug: z.string(),
        title: z.string(),
        summary: z.string(),
        icon: z.string(),
        requires: z.array(z.string()), // ids from content/concepts.yml
        afterWeek: z.number(),
        note: z.string().optional(),
        milestones: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            prompt: z.string(),
            starter: z.string(),
            // Same shape as TestCase in app/composables/useChecker.ts.
            tests: z.array(
              z.union([
                z.object({ stdin: z.string().optional(), stdout: z.string() }),
                z.object({ stdin: z.string().optional(), check: z.string() }),
              ]),
            ),
            hints: z.array(z.string()),
            solution: z.string(),
          }),
        ),
      }),
    }),
  },
})
