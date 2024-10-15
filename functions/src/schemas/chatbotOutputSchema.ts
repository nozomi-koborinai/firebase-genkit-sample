import * as z from 'zod';

export const chatbotOutputSchema = z.object({
    response: z.string(),
    suggestedActions: z.array(z.string()),
    sentiment: z.enum(['positive', 'neutral', 'negative']),
  });