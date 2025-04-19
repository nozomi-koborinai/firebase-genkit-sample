/**
 * This code is inspired by tanabee/genkit-summarize-webpage
 * Repository: https://github.com/tanabee/genkit-summarize-webpage
 */
import { z } from 'genkit'
import { ai } from '../genkit'
import * as cheerio from 'cheerio'

/**
 * Define web contents analysis prompt using template from /prompts/analyzeWebContents.prompt
 * Template location: functions/prompts/analyzeWebContents.prompt
 *
 * Prompt configuration:
 * - Model: googleai/gemini-2.0-flash-exp
 * ├── input
 * │   └── url: string
 * └── output
 *     └── format: json
 *         └── analysis: string
 */
const analyzeWebContentsPrompt = ai.prompt<z.ZodTypeAny, z.ZodTypeAny>(`analyzeWebContents`)

/**
 * Custom tool for web content extraction
 * Fetches webpage content and cleans up HTML, focusing on main content
 */
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

/**
 * Genkit function running on Cloud Run functions (2nd generation)
 * Only anonymously authenticated users via Firebase Authentication are authorized to execute this function
 *
 * Example Request (Client-side code_Flutter/Dart):
 * final response = await dio.post(
 *   'https://analyzewebcontentsflow-[region]-[project].a.run.app',
 *   options: Options(
 *     headers: {
 *       'Authorization': 'Bearer ${idToken}',
 *       'Content-Type': 'application/json',
 *     }
 *   ),
 *   data: {
 *     'data': {
 *       'url': 'https://example.com/article',
 *     }
 *   }
 * );
 *
 * Example Response:
 * {
 *   "result": {
 *     "analysis": "AI generated response text here..."
 *   },
 * }
 */
export const analyzeWebContentsFlow = ai.defineFlow(
  {
    name: `analyzeWebContentsFlow`,
    inputSchema: z.object({
      url: z.string(),
    }),
    outputSchema: z.object({
      analysis: z.string(),
    }),
  },
  async (input) => {
    const { output } = await analyzeWebContentsPrompt(input, { tools: [webLoader] })
    return output
  }
)
