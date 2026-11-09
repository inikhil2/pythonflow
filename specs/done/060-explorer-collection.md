# 060: Explorer collection in content.config.ts (task C6)
Files: content.config.ts
Severity: med

## Problem
Shell step 059 adds `content/explorer/*.yml`. Nuxt Content needs a data collection for
them: `{ topic, title, summary, week, code }`. Pages order topics by file name.

Do this after shell step 059.

## Required change
1. **Replace the whole of `content.config.ts`** with exactly this content. Delete everything in the file first.
```ts
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // content/week0-functions/01-hello.md is served at /learn/week0-functions/01-hello
    lessons: defineCollection({
      type: 'page',
      // Every lesson lives in a week folder; root files belong to pages.
      source: { include: '**/*.md', exclude: ['*.md'], prefix: '/learn' },
      schema: z.object({
        week: z.number(),
        order: z.number(),
        minutes: z.number().optional(),
        concepts: z.array(z.string()).optional(), // ids from content/concepts.yml
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
  },
})
```

## Acceptance gates
- `git diff --stat HEAD` lists only `content.config.ts`, with 6 lines added and 0 removed.
- `wc -c < content.config.ts` prints `1530`.
- `grep -c "^import" content.config.ts` prints `1`.
- `npm run generate` exits 0.
- If this spec fails the way 044 did, Orca can run it as a shell step: write the block
  with `cat > content.config.ts <<'END'`.
