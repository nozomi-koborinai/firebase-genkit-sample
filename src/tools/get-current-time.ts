import { ai } from '../genkit';
import { z } from 'zod';

export const getCurrentTime = ai.defineTool(
  {
    name: 'getCurrentTime',
    description: 'Get the current time.',
    inputSchema: z.object({
      text: z.string(),
    }),
    outputSchema: z.object({
      time: z.string(),
    }),
  },
  async ({ text }) => {
    const now = new Date();
    return {
      time: now.toLocaleTimeString('ja-JP'),
    };
  }
); 