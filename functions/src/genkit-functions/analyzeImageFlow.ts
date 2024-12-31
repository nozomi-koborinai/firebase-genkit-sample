import { firebaseAuth } from '@genkit-ai/firebase/auth'
import { onFlow } from '@genkit-ai/firebase/functions'
import { z } from 'genkit'
import { ai, googleAIapiKey } from '../index'

export const analyzeImageFlow = onFlow(
  ai,
  {
    name: `analyzeImageFlow`,
    inputSchema: z.object({
      storageFileUrl: z.string(),
    }),
    outputSchema: z.object({
      analysis: z.string(),
    }),
    authPolicy: firebaseAuth((user) => {
      if (user.firebase?.sign_in_provider !== `anonymous`) {
        throw new Error(`Only anonymously authenticated users can access this function`)
      }
    }),
    httpsOptions: {
      secrets: [googleAIapiKey],
      cors: true,
    },
  },
  async (input) => {
    const analyzeImagePrompt = ai.prompt<z.ZodTypeAny, z.ZodTypeAny>(`analyzeImage`)
    const result = await analyzeImagePrompt(input)

    return result.output()
  }
)
