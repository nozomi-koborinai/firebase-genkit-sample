import { firebaseAuth } from '@genkit-ai/firebase/auth'
import { onFlow } from '@genkit-ai/firebase/functions'
import { z } from 'genkit'
import { ai, googleAIapiKey } from '../genkit'

/**
 * Define image generation prompt using template from /prompts/generateImage.prompt
 * Template location: functions/prompts/generateImage.prompt
 *
 * Prompt configuration:
 * - Model: vertexai/imagen3
 * ├── input
 * │   └── prompt: string
 * └── output
 *     └── format: media
 */
const generateImagePrompt = ai.prompt<z.ZodTypeAny, z.ZodTypeAny>(`generateImage`)

/**
 * Genkit function running on Cloud Run functions (2nd generation)
 * Only anonymously authenticated users via Firebase Authentication are authorized to execute this function
 *
 * Example Request (Client-side code_Flutter/Dart):
 * final response = await dio.post(
 *   'https://generateimageflow-[region]-[project].a.run.app',
 *   options: Options(
 *     headers: {
 *       'Authorization': 'Bearer ${idToken}',
 *       'Content-Type': 'application/json',
 *     }
 *   ),
 *   data: {
 *     'data': {
 *       'prompt': 'A beautiful sunset over mountains'
 *     }
 *   }
 * );
 *
 * Example Response:
 * ```json
 * {
 *   "result": {
 *     "media": "base64_encoded_image_data..."
 *   }
 * }
 * ```
 */
export const generateImageFlow = onFlow(
  ai,
  {
    name: `generateImageFlow`,
    inputSchema: z.object({
      prompt: z.string(),
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
    const { media } = await generateImagePrompt(input)
    return media
  }
)
