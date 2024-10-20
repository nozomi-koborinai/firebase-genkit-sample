import { prompt } from '@genkit-ai/dotprompt'
import { firebaseAuth } from '@genkit-ai/firebase/auth'
import * as genkitFunctions from '@genkit-ai/firebase/functions'
import * as z from 'zod'
import { db, googleAIapiKey } from '../config/firebase'
import { chatbotInputSchema } from '../schemas/chatbotInputSchema'
import { chatbotOutputSchema } from '../schemas/chatbotOutputSchema'
import { createChatbotInput } from '../utils/genkitUtils'

export const anonymousFirestoreChatbot = genkitFunctions.onFlow(
  {
    name: `anonymousFirestoreChatbot`,
    httpsOptions: {
      cors: true,
      secrets: [googleAIapiKey],
    },
    inputSchema: z.object({
      userId: z.string(),
      chatId: z.string(),
      currentQuery: z.string(),
    }),
    outputSchema: chatbotOutputSchema,
    authPolicy: firebaseAuth((user) => {
      if (user.firebase?.sign_in_provider !== `anonymous`) {
        throw new Error(`Only anonymously authenticated users can access this function`)
      }
    }),
  },
  async (input) => {
    try {
      const userDoc = await db.collection(`users`).doc(input.userId).get()
      const userData = userDoc.data()

      const chatHistoryDoc = await db.collection(`users/${input.userId}/chatHistory`).doc(input.chatId).get()
      const chatData = chatHistoryDoc.data()

      const productDoc = await db.collection(`productCatalog`).doc(chatData?.productId).get()
      const productData = productDoc.data()

      const chatbotPrompt = await prompt<z.infer<typeof chatbotInputSchema>>(`chatbot`)
      const chatbotInput = createChatbotInput(input.userId, input.currentQuery, userData, chatData, productData)

      const result = await chatbotPrompt.generate({ input: chatbotInput })

      return result.output()
    } catch (error) {
      console.error(`Error in anonymousFirestoreChatbot:`, error)
      throw error
    }
  }
)
