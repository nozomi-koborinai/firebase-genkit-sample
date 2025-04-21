import { ai } from '../genkit'
import { z } from 'zod'
import * as cheerio from 'cheerio'

export const webLoader = ai.defineTool(
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
