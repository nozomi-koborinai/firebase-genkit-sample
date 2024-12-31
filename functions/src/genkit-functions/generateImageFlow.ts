import { firebaseAuth } from '@genkit-ai/firebase/auth'
import { onFlow } from '@genkit-ai/firebase/functions'
import * as z from 'zod'
import { ai } from '..'

export const generateImageFlow = onFlow(
  ai,
  {
    name: `generateImageFlow`,
    httpsOptions: {
      cors: true,
    },
    inputSchema: z.object({
      prompt: z.string(),
    }),
    authPolicy: firebaseAuth((user) => {
      if (user.firebase?.sign_in_provider !== `anonymous`) {
        throw new Error(`Only anonymously authenticated users can access this function`)
      }
    }),
  },
  async (input) => {
    const generateImagePrompt = ai.prompt<z.ZodTypeAny, z.ZodTypeAny>(`analyzeImage`)
    const result = await generateImagePrompt(input)
    return result.media
  }
)
