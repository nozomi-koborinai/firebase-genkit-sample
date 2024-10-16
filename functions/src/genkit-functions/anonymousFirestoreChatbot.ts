import { prompt } from '@genkit-ai/dotprompt'
import { firebaseAuth } from '@genkit-ai/firebase/auth'
import * as genkitFunctions from '@genkit-ai/firebase/functions'
import * as z from 'zod'
import * as config from '../config/firebase'
import { db } from '../config/firebase'
import { chatbotInputSchema } from '../schemas/chatbotInputSchema'
import { chatbotOutputSchema } from '../schemas/chatbotOutputSchema'
import { isGenkitEnabled } from '../utils/genkitUtils'

export const anonymousFirestoreChatbot = genkitFunctions.onFlow(
  {
    name: `anonymousFirestoreChatbot`,
    httpsOptions: {
      cors: true,
      secrets: [config.googleAIapiKey],
    },
    inputSchema: z.object({
      userId: z.string(),
      chatId: z.string(),
      currentQuery: z.string(),
    }),
    outputSchema: chatbotOutputSchema,
    authPolicy: firebaseAuth((user) => {
      if (user.firebase?.sign_in_provider !== `anonymous`) {
        throw new Error(`匿名認証されたユーザーのみがアクセスできます`)
      }
    }),
  },
  async (input) => {
    if (!(await isGenkitEnabled())) throw new Error(`Genkit が無効になっています。`)

    const userDoc = await db.collection(`users`).doc(input.userId).get()
    const userData = userDoc.data()

    const chatHistoryDoc = await db.collection(`users/${input.userId}/chatHistory`).doc(input.chatId).get()
    const chatData = chatHistoryDoc.data()

    const productDoc = await db.collection(`productCatalog`).doc(chatData?.productId).get()
    const productData = productDoc.data()

    const chatbotPrompt = await prompt<z.infer<typeof chatbotInputSchema>>(`chatbot`)

    try {
      const chatbotInput = createChatbotInput(input.userId, input.currentQuery, userData, chatData, productData)

      const result = await chatbotPrompt.generate({ input: chatbotInput })

      return result.output()
    } catch (error) {
      console.error(`Error in anonymousFirestoreChatbot:`, error)
      throw error
    }
  }
)

function createChatbotInput(
  userId: string,
  currentQuery: string,
  userData: any,
  chatData: any,
  productData: any
): z.infer<typeof chatbotInputSchema> {
  return {
    userId,
    currentQuery,
    chatHistory:
      chatData?.messages?.map((message: any) => ({
        role: message.role as `user` | `assistant`,
        content: message.content,
        timestamp: message.timestamp,
      })) || [],
    userProfile: {
      name: userData?.userProfile?.name || ``,
      preferredLanguage: userData?.userProfile?.preferredLanguage || ``,
      accountType: userData?.userProfile?.accountType || ``,
    },
    productCatalog: productData
      ? [
          {
            id: productData.id || ``,
            name: productData.name || ``,
            details: productData.details || ``,
            price: productData.price || 0,
          },
        ]
      : [],
  }
}
