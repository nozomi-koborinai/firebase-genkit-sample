import { generate } from '@genkit-ai/ai'
import * as genkitFunctions from '@genkit-ai/firebase/functions'
import { gemini15Flash } from '@genkit-ai/googleai'
import * as config from '../config/firebase'
import { analyzeWebInputSchema } from '../schemas/analyzeWebInputSchema'
import { analyzeWebOutputSchema } from '../schemas/analyzeWebOutputSchema'
import { webLoader } from '../utils/genkitUtils'

export const analyzeWebContents = genkitFunctions.onFlow(
  {
    name: `analyzeWebContents`,
    httpsOptions: {
      cors: true,
      secrets: [config.googleAIapiKey],
    },
    inputSchema: analyzeWebInputSchema,
    outputSchema: analyzeWebOutputSchema,
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

    return result.output()
  }
)
