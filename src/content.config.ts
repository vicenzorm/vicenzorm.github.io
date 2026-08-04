import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    role: z.string(),
    year: z.string(),
    order: z.number(),
    stack: z.array(z.string()).nonempty(),
    summary: z.string(),
    metrics: z.array(z.string()).optional(),
    links: z
      .object({
        appStore: z.string().url().optional(),
        github: z.string().url().optional(),
      })
      .default({}),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
