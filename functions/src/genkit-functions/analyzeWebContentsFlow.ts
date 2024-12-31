import { firebaseAuth } from '@genkit-ai/firebase/auth'
import { onFlow } from '@genkit-ai/firebase/functions'
import { gemini20FlashExp } from '@genkit-ai/googleai'
import * as cheerio from 'cheerio'
import { z } from 'genkit'
import { ai, googleAIapiKey } from '../index'

export const analyzeWebContentsFlow = onFlow(
  ai,
  {
    name: `analyzeWebContentsFlow`,
    inputSchema: z.object({
      url: z.string(),
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
    const result = await ai.generate({
      prompt: `Analyze the content of the following webpage: ${input.url}`,
      config: { temperature: 1.0 },
      tools: [webLoader],
      model: gemini20FlashExp,
    })
    return result.output()
  }
)

const webLoader = ai.defineTool(
  {
    name: `webLoader`,
    description: `Accesses the specified URL and retrieves the content of the webpage.`,
    inputSchema: z.object({ url: z.string().url() }),
    outputSchema: z.string(),
  },
  async ({ url }) => {
    const res = await fetch(url)
    const html = await res.text()
    const $ = cheerio.load(html)
    $(`script, style, noscript`).remove()
    if ($(`article`).length) {
      return $(`article`).text()
    }
    return $(`body`).text()
  }
)
