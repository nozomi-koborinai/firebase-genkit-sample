import * as z from 'zod';

export const chatbotInputSchema = z.object({
  userId: z.string(),
  currentQuery: z.string(),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.string(),
  })),
  userProfile: z.object({
    name: z.string(),
    preferredLanguage: z.string(),
    accountType: z.string(),
  }),
  productCatalog: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
  })),
});