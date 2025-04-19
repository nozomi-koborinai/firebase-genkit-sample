import { onCallGenkit } from 'firebase-functions/https'
import { analyzeImageFlow } from './genkit-flows/analyzeImageFlow'
import { analyzeWebContentsFlow } from './genkit-flows/analyzeWebContentsFlow'
import { generateChatMessageFlow } from './genkit-flows/generateChatMessageFlow'
import { generateImageFlow } from './genkit-flows/generateImageFlow'
import { googleAIapiKey } from './genkit'

/**
 * Export Cloud Run functions (2nd generation)
 * These functions are deployed to Cloud Run and accessible via HTTPS endpoints
 *
 * Functions:
 * ├── analyzeImageFlow: Analyzes images using Google AI
 * ├── analyzeWebContentsFlow: Analyzes web content using Google AI
 * ├── generateChatMessageFlow: Generates chat responses using Google AI and Firestore
 * └── generateImageFlow: Generates images using Vertex AI
 */

export const analyzeImage = onCallGenkit(
  {
    secrets: [googleAIapiKey],
  },
  analyzeImageFlow
)

export const analyzeWebContents = onCallGenkit(
  {
    secrets: [googleAIapiKey],
  },
  analyzeWebContentsFlow
)

export const generateChatMessage = onCallGenkit(
  {
    secrets: [googleAIapiKey],
  },
  generateChatMessageFlow
)

export const generateImage = onCallGenkit(
  {
    secrets: [googleAIapiKey],
  },
  generateImageFlow
)
