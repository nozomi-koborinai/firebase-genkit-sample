import * as genkitFunctions from '@genkit-ai/firebase/functions'
import * as z from 'zod'
import { isGenkitEnabled } from '../utils/genkitUtils'
import { prompt } from '@genkit-ai/dotprompt'
import { analyzeStorageInputSchema } from '../schemas/analyzeStorageInputSchema'
import { analyzeStorageOutputSchema } from '../schemas/analyzeStorageOutputSchema'

// Cloud Storage からファイルを読み込み、Gemini Flash 1.5 で要約する関数
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
    if (!(await isGenkitEnabled())) throw new Error(`Genkit が無効になっています。`)

    const analyzeFilePrompt = await prompt<z.infer<typeof analyzeStorageInputSchema>>(`analyze`)
    const result = await analyzeFilePrompt.generate({ input })
    
    return result.output()
  }
)
