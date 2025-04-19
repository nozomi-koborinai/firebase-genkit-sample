import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { z } from 'genkit'
import { ai } from '../genkit'

/**
 * Define chat message generation prompt using template from /prompts/generateChatMessage.prompt
 * Template location: functions/prompts/generateChatMessage.prompt
 *
 * Prompt configuration:
 * - Model: googleai/gemini-2.0-flash-exp
 * ├── input
 * │   └── messages: array
 * │       ├── createdAt: string
 * │       ├── isUser: boolean
 * │       └── text: string
 * └── output
 *     └── format: json
 *         └── response: string
 */
const generateChatMessagePrompt = ai.prompt<z.ZodTypeAny, z.ZodTypeAny>(`generateChatMessage`)

/**
 * Genkit function running on Cloud Run functions (2nd generation)
 * Only anonymously authenticated users via Firebase Authentication are authorized to execute this function
 *
 * Example Request (Client-side code_Flutter/Dart):
 * final response = await dio.post(
 *   'https://generatechatmessageflow-[region]-[project].a.run.app',
 *   options: Options(
 *     headers: {
 *       'Authorization': 'Bearer ${idToken}',
 *       'Content-Type': 'application/json',
 *     }
 *   ),
 *   data: {
 *     'data': {
 *       'userId': 'user123',
 *       'chatId': 'chat456'
 *     }
 *   }
 * );
 *
 * Example Response:
 * {
 *   "result": {
 *     "response": "AI generated chat message here..."
 *   }
 * }
 */
export const generateChatMessageFlow = ai.defineFlow(
  {
    name: `generateChatMessageFlow`,
    inputSchema: z.object({
      userId: z.string(),
      chatId: z.string(),
    }),
    outputSchema: z.object({
      response: z.string(),
    }),
  },
  async (input) => {
    try {
      // Initialize Firestore
      const db = getFirestore()

      // Retrieve chat document
      const chatDoc = await db.collection(`chats`).doc(input.chatId).get()

      if (!chatDoc.exists) throw new Error(`Chat document not found`)

      // Retrieve message history for context
      const messagesSnapshot = await chatDoc.ref.collection(`messages`).get()

      // Transform Firestore documents into message objects
      const messages = messagesSnapshot.docs.map((doc) => ({
        createdAt: doc.data().createdAt.toDate().toString(),
        isUser: doc.data().isUser,
        text: doc.data().text,
      }))

      // Generate AI response using chat history
      const { output } = await generateChatMessagePrompt({ messages })

      // Store AI response in Firestore
      await chatDoc.ref.collection(`messages`).add({
        createdAt: Timestamp.now(),
        isUser: false,
        text: output.response,
      })

      // Store data in Firestore, but return to client as a response just in case
      return output
    } catch (error) {
      console.error(`Error in generateChatMessage:`, error)
      throw error
    }
  }
)
