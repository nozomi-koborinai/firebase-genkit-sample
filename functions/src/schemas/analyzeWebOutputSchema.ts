import * as z from 'zod'

export const analyzeWebOutputSchema = z.object({
  analysis: z.string(),
})
