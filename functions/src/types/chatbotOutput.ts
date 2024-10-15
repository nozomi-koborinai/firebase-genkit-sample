import { z } from 'zod';
import { chatbotOutputSchema } from '../schemas/chatbotOutputSchema';

export type ChatbotInput = z.infer<typeof chatbotOutputSchema>;