import { onCallGenkit } from 'firebase-functions/https'
import { analyzeImageFlow } from './genkit-flows/analyzeImageFlow'
import { analyzeWebContentsFlow } from './genkit-flows/analyzeWebContentsFlow'
import { generateChatMessageFlow } from './genkit-flows/generateChatMessageFlow'
import { generateImageFlow } from './genkit-flows/generateImageFlow'
import { googleAIapiKey } from './genkit'
import { googleMapsFlow } from './genkit-flows/googleMapsFlow'
import { helloGenkitFlow } from './genkit-flows/helloGenkitFlow'
// import { genkitMCP } from './mcp/server/genkit-mcp-server'
// import { getCurrentTime } from './tools/get-current-time'

/**
 * Export Cloud Run functions (2nd generation)
 * These functions are deployed to Cloud Run and accessible via HTTPS endpoints
 *
 * Functions:
 * ├── analyzeImageFlow: Analyzes images using Google AI
 * ├── analyzeWebContentsFlow: Analyzes web content using Google AI
 * ├── generateChatMessageFlow: Generates chat responses using Google AI and Firestore
 * ├── generateImageFlow: Generates images using Vertex AI
 * └── googleMapsFlow: Uses Google Maps Platform via MCP client
 */

const opts = { secrets: [googleAIapiKey], region: `asia-northeast1`, cors: true }

export const analyzeImage = onCallGenkit(opts, analyzeImageFlow)

export const analyzeWebContents = onCallGenkit(opts, analyzeWebContentsFlow)

export const generateChatMessage = onCallGenkit(opts, generateChatMessageFlow)

export const generateImage = onCallGenkit(opts, generateImageFlow)

export const callGoogleMaps = onCallGenkit(opts, googleMapsFlow)

export const helloGenkit = onCallGenkit(opts, helloGenkitFlow)

// export { getCurrentTime }

// export { genkitMCP }
