import { enableGoogleCloudTelemetry } from '@genkit-ai/google-cloud'
import { googleAI } from '@genkit-ai/googleai'
import { vertexAI } from '@genkit-ai/vertexai'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { defineSecret } from 'firebase-functions/params'
import { genkit } from 'genkit'
import { logger } from 'genkit/logging'

logger.setLogLevel(`debug`)
initializeApp()
enableGoogleCloudTelemetry()

export const db = getFirestore()
export const googleAIapiKey = defineSecret(`GOOGLE_GENAI_API_KEY`)
export const ai = genkit({
  plugins: [googleAI(), vertexAI({ location: `asia-northeast1` })],
})

export { analyzeImageFlow } from './genkit-functions/analyzeImageFlow'
export { analyzeWebContentsFlow } from './genkit-functions/analyzeWebContentsFlow'
export { generateChatMessage } from './genkit-functions/generateChatMessageFlow'
export { generateImageFlow } from './genkit-functions/generateImageFlow'
