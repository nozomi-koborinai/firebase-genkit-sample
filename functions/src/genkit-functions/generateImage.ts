import { prompt } from '@genkit-ai/dotprompt'
import * as genkitFunctions from '@genkit-ai/firebase/functions'
import * as z from 'zod'
import { generateImageInputSchema } from '../schemas/generateImageInputSchema'

export const generateImage = genkitFunctions.onFlow(
  {
    name: `generateImage`,
    httpsOptions: {
      cors: true,
    },
    inputSchema: generateImageInputSchema,
    authPolicy: genkitFunctions.noAuth(),
  },
  async (input) => {
    const generateImagePrompt = await prompt<z.infer<typeof generateImageInputSchema>>(`generateImage`)
    const result = await generateImagePrompt.generate({ input })
    return result.media()
  }
)
