import * as z from 'zod'

export const analyzeStorageInputSchema = z.object({
  storageFileUrl: z.string(),
})
