import * as z from 'zod'

export const generateImageInputSchema = z.object({
  prompt: z.string(),
})
