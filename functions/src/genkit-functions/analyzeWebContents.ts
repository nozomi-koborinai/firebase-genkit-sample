import { generate } from '@genkit-ai/ai'
import * as genkitFunctions from '@genkit-ai/firebase/functions'
import { gemini15Flash } from '@genkit-ai/googleai'
import { googleAIapiKey } from '../config/firebase'
import { analyzeWebInputSchema } from '../schemas/analyzeWebInputSchema'
import { webLoader } from '../utils/genkitUtils'

export const analyzeWebContents = genkitFunctions.onFlow(
  {
    name: `analyzeWebContents`,
    httpsOptions: {
      cors: true,
      secrets: [googleAIapiKey],
    },
    inputSchema: analyzeWebInputSchema,
    authPolicy: genkitFunctions.noAuth(),
  },
  async (input) => {
    const result = await generate({
      model: gemini15Flash,
      prompt: `Analyze the content of the following webpage: ${input}`,
      tools: [webLoader],
      output: {
        format: `text`,
      },
    })

    return result.text()
  }
)
