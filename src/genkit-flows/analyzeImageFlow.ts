import { z } from 'genkit'
import { ai } from '../genkit'

/**
 * Define image analysis prompt using template from /prompts/analyzeImage.prompt
 * Template location: functions/prompts/analyzeImage.prompt
 *
 * Prompt configuration:
 * - Model: googleai/gemini-2.0-flash-exp
 * ├── input
 * │   └── storageFileUrl: string
 * └── output
 *     └── format: json
 *         └── analysis: string
 */
const analyzeImagePrompt = ai.prompt<z.ZodTypeAny, z.ZodTypeAny>(`analyzeImage`)

/**
 * Genkit function running on Cloud Run functions (2nd generation)
 * Only anonymously authenticated users via Firebase Authentication are authorized to execute this function
 *
 * Example Request (Client-side code_Flutter/Dart):
 * final response = await dio.post(
 *   'https://analyzeimageflow-[region]-[project].a.run.app',
 *   options: Options(
 *     headers: {
 *       'Authorization': 'Bearer ${idToken}',
 *       'Content-Type': 'application/json',
 *     }
 *   ),
 *   data: {
 *     'data': {
 *       'storageFileUrl': 'fileUrl',
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
export const analyzeImageFlow = ai.defineFlow(
  {
    name: `analyze-image-flow`,
    inputSchema: z.object({
      storageFileUrl: z.string(),
    }),
    outputSchema: z.object({
      analysis: z.string(),
    }),
  },
  async (input) => {
    const { output } = await analyzeImagePrompt(input)
    return output
  }
)
