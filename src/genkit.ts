import { genkit } from 'genkit'
import googleAI, { gemini25FlashPreview0417 } from '@genkit-ai/googleai'
import vertexAI from '@genkit-ai/vertexai'
import { defineSecret } from 'firebase-functions/params'
import { enableGoogleCloudTelemetry } from '@genkit-ai/google-cloud'
import { logger } from 'genkit/logging'
import { mapsClient } from './mcp/client/google-maps-client'

// Set logging level to debug for detailed operation logs
logger.setLogLevel(`debug`)

// Enable telemetry for Google Cloud monitoring and debugging
enableGoogleCloudTelemetry()

// API keys stored in Google Cloud Secret Manager
export const googleAIapiKey = defineSecret(`GOOGLE_GENAI_API_KEY`)

// Initialize Genkit
export const ai = genkit({
  plugins: [
    googleAI(),
    vertexAI(),
    mapsClient,
  ],
  model: gemini25FlashPreview0417,
})
