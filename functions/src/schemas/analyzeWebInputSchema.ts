import * as z from 'zod'

export const analyzeWebInputSchema = z.object({
  contentsUrl: z.string(),
})
