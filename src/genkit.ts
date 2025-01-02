import { genkit } from 'genkit'
import googleAI from '@genkit-ai/googleai'
import vertexAI from '@genkit-ai/vertexai'
import { defineSecret } from 'firebase-functions/params'
import { enableGoogleCloudTelemetry } from '@genkit-ai/google-cloud'
import { logger } from 'genkit/logging'

// Set logging level to debug for detailed operation logs
logger.setLogLevel(`debug`)

// Enable telemetry for Google Cloud monitoring and debugging
enableGoogleCloudTelemetry()

// Get Google AI's API key stored in Google Cloud Secret Manager
export const googleAIapiKey = defineSecret(`GOOGLE_GENAI_API_KEY`)

// Initialize Genkit with Google AI and VertexAI plugin
export const ai = genkit({
  plugins: [googleAI(), vertexAI()],
})
