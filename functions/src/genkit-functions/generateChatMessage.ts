import { prompt } from '@genkit-ai/dotprompt'
import { firebaseAuth } from '@genkit-ai/firebase/auth'
import * as genkitFunctions from '@genkit-ai/firebase/functions'
import { Timestamp } from 'firebase-admin/firestore'
import * as z from 'zod'
import { db, googleAIapiKey } from '../config/firebase'

const chatInputSchema = z.object({
  messages: z.array(
    z.object({
      createdAt: z.string(),
      isUser: z.boolean(),
      text: z.string(),
    })
  ),
})

export const generateChatMessage = genkitFunctions.onFlow(
  {
    name: `generateChatMessage`,
    httpsOptions: {
      cors: true,
      secrets: [googleAIapiKey],
    },
    inputSchema: z.object({
      userId: z.string(),
      chatId: z.string(),
    }),
    authPolicy: firebaseAuth((user) => {
      if (user.firebase?.sign_in_provider !== `anonymous`) {
        throw new Error(`Only anonymously authenticated users can access this function`)
      }
    }),
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

      const chatbotPrompt = await prompt<z.infer<typeof chatInputSchema>>(`chat`)
      const result = await chatbotPrompt.generate({ input: { messages } })

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
