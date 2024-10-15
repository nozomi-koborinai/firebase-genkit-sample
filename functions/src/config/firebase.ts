import { configureGenkit } from '@genkit-ai/core'
import { dotprompt } from '@genkit-ai/dotprompt'
import { firebase } from '@genkit-ai/firebase'
import { googleCloud } from '@genkit-ai/google-cloud'
import { googleAI } from '@genkit-ai/googleai'
import { vertexAI } from '@genkit-ai/vertexai'
import * as admin from 'firebase-admin'
import { defineSecret } from 'firebase-functions/params'
import * as z from 'zod'

configureGenkit({
  plugins: [firebase(), vertexAI(), googleAI({ apiVersion: `v1beta` }), dotprompt(), googleCloud()],
  logLevel: `debug`,
  enableTracingAndMetrics: true,
  telemetry: {
    instrumentation: `googleCloud`,
    logger: `googleCloud`,
  },
})

admin.initializeApp()

export const getPunishmentSchema = z.object({
  existingPunishments: z.array(z.string()),
})

export const db = admin.firestore()

export const googleAIapiKey = defineSecret(`GOOGLE_GENAI_API_KEY`)
