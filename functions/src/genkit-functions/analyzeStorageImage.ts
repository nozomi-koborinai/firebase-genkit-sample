import { prompt } from '@genkit-ai/dotprompt'
import * as genkitFunctions from '@genkit-ai/firebase/functions'
import * as z from 'zod'
import { analyzeStorageInputSchema } from '../schemas/analyzeStorageInputSchema'
import { analyzeStorageOutputSchema } from '../schemas/analyzeStorageOutputSchema'

export const analyzeStorageImage = genkitFunctions.onFlow(
  {
    name: `analyzeStorageImage`,
    httpsOptions: {
      cors: true,
    },
    inputSchema: analyzeStorageInputSchema,
    outputSchema: analyzeStorageOutputSchema,
    authPolicy: genkitFunctions.noAuth(),
  },
  async (input) => {
    const analyzeFilePrompt = await prompt<z.infer<typeof analyzeStorageInputSchema>>(`analyze`)
    const result = await analyzeFilePrompt.generate({ input })

    return result.output()
  }
)
