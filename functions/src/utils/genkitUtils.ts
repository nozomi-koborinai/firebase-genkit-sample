import * as z from 'zod'
import { db } from '../config/firebase'
import { chatbotInputSchema } from '../schemas/chatbotInputSchema'

export async function isGenkitEnabled(): Promise<boolean> {
  const appConfDoc = await db.collection(`appConf`).doc(`config`).get()
  return appConfDoc.data()?.genkitEnabled ?? false
}

export function createChatbotInput(
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
