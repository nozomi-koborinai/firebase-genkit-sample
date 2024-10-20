import * as z from 'zod'

export const chatbotInputSchema = z.object({
  userId: z.string(),
  chatId: z.string(),
  currentQuery: z.string(),
})
