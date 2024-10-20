import { generate } from '@genkit-ai/ai'
import * as genkitFunctions from '@genkit-ai/firebase/functions'
import { gemini15Flash } from '@genkit-ai/googleai'
import * as z from 'zod'
import { googleAIapiKey } from '../config/firebase'
import { webLoader } from '../utils/genkitUtils'

export const analyzeWebContents = genkitFunctions.onFlow(
  {
    name: `analyzeWebContents`,
    httpsOptions: {
      cors: true,
      secrets: [googleAIapiKey],
    },
    inputSchema: z.string(),
    outputSchema: z.string(),
    authPolicy: genkitFunctions.noAuth(),
  },
  async (input) => {
    const result = await generate({
      model: gemini15Flash,
      prompt: `Analyze the content of the following webpage: ${input}`,
      tools: [webLoader],
    })

    return result.text()
  }
)
