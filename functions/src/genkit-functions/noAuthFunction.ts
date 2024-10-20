import { prompt } from '@genkit-ai/dotprompt'
import * as genkitFunctions from '@genkit-ai/firebase/functions'
import * as z from 'zod'
import { googleAIapiKey } from '../config/firebase'
import { chatbotInputSchema } from '../schemas/chatbotInputSchema'
import { chatbotOutputSchema } from '../schemas/chatbotOutputSchema'

export const noAuthFunction = genkitFunctions.onFlow(
  {
    name: `noAuthFunction`,
    httpsOptions: {
      cors: true,
      secrets: [googleAIapiKey],
    },
    authPolicy: genkitFunctions.noAuth(),
    inputSchema: chatbotInputSchema,
    outputSchema: chatbotOutputSchema,
  },
  async (input) => {
    const chatbotPrompt = await prompt<z.infer<typeof chatbotInputSchema>>(`chatbot`)
    const result = await chatbotPrompt.generate({ input })
    return result.output()
  }
)
