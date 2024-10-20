import { defineTool } from '@genkit-ai/ai'
import * as cheerio from 'cheerio'
import * as z from 'zod'
import { chatbotInputSchema } from '../schemas/chatbotInputSchema'

export const webLoader = defineTool(
  {
    name: `webLoader`,
    description: `Accesses the specified URL and retrieves the content of the webpage.`,
    inputSchema: z.object({ url: z.string().url() }),
    outputSchema: z.string(),
  },
  async ({ url }) => {
    const res = await fetch(url)
    const html = await res.text()
    const $ = cheerio.load(html)
    $(`script, style, noscript`).remove()
    if ($(`article`).length) {
      return $(`article`).text()
    }
    return $(`body`).text()
  }
)

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
