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

export { analyzeImageFlow } from './genkit-functions/analyzeImageFlow'
export { analyzeWebContentsFlow } from './genkit-functions/analyzeWebContentsFlow'
export { generateChatMessageFlow } from './genkit-functions/generateChatMessageFlow'
export { generateImageFlow } from './genkit-functions/generateImageFlow'
