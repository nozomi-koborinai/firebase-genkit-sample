import { z } from 'genkit'
import { ai } from '../genkit'
import vertexAI from '@genkit-ai/vertexai'

export const helloGenkitFlow = ai.defineFlow(
  {
    name: `hello-genkit-flow`,
    outputSchema: z.string(),
  },
  async () => {
    const { text } = await ai.generate({
      model: vertexAI.model(`gemini-2.5-pro-preview-05-06`, {
        temperature: 1,
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_LOW_AND_ABOVE',
          }
        ]
      }),
      prompt: `Why is Genkit awesome?`
    })
    return text
  }
)