import { prompt } from '@genkit-ai/dotprompt'
import * as genkitFunctions from '@genkit-ai/firebase/functions'
import * as z from 'zod'
import * as config from '../config/firebase'
import { noAuthInputSchema } from '../schemas/noAuthInputSchema'
import { noAuthOutputSchema } from '../schemas/noAuthOutputSchema'

export const noAuthFunction = genkitFunctions.onFlow(
  {
    name: `noAuthFunction`,
    httpsOptions: {
      cors: true,
      secrets: [config.googleAIapiKey],
    },
    authPolicy: genkitFunctions.noAuth(),
    inputSchema: noAuthInputSchema,
    outputSchema: noAuthOutputSchema,
  },
  async (input) => {
    const chatbotPrompt = await prompt<z.infer<typeof noAuthInputSchema>>(`chatbot`)
    const result = await chatbotPrompt.generate({ input })
    return result.output()
  }
)
