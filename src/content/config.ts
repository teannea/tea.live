import { z, defineCollection } from "astro:content"

const streamCollection = defineCollection({
  type: "data",
  schema: z.object({
    short_name: z.string(),
    title: z.string(),
    date: z.string(),
    url: z.string(),
  }),
})

export const collections = {
  stream: streamCollection,
}
