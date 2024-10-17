import * as z from 'zod'

export const analyzeStorageOutputSchema = z.object({
  analysis: z.string(),
})
