import { firebaseAuth } from '@genkit-ai/firebase/auth'
import { onFlow } from '@genkit-ai/firebase/functions'
import { Timestamp } from 'firebase-admin/firestore'
import { z } from 'genkit'
import { ai, db, googleAIapiKey } from '../index'

export const generateChatMessage = onFlow(
  ai,
  {
    name: `generateChatMessage`,
    inputSchema: z.object({
      userId: z.string(),
      chatId: z.string(),
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
    try {
      const chatDoc = await db.collection(`chats`).doc(input.chatId).get()

      if (!chatDoc.exists) throw new Error(`Chat document not found`)

      const messagesSnapshot = await chatDoc.ref.collection(`messages`).get()

      const messages = messagesSnapshot.docs.map((doc) => ({
        createdAt: doc.data().createdAt.toDate().toString(),
        isUser: doc.data().isUser,
        text: doc.data().text,
      }))

      const generateChatMessagePrompt = ai.prompt<z.ZodTypeAny, z.ZodTypeAny>(`generateChatMessage`)
      const result = await generateChatMessagePrompt({ input: { messages } })

      await chatDoc.ref.collection(`messages`).add({
        createdAt: Timestamp.now(),
        isUser: false,
        text: result.output().response,
      })

      return result.output()
    } catch (error) {
      console.error(`Error in generateChatMessage:`, error)
      throw error
    }
  }
)
