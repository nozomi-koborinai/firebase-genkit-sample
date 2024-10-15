import { z } from 'zod';
import { chatbotInputSchema } from '../schemas/chatbotInputSchema';

export type ChatbotInput = z.infer<typeof chatbotInputSchema>;