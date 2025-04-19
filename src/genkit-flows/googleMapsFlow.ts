import { z } from 'genkit'
import { ai } from "../genkit"

export const googleMapsFlow = ai.defineFlow({
  name: 'google-maps-flow',
  inputSchema: z.string(),
}, async (prompt) => {
  const { text } = await ai.generate({
    prompt,
    tools: [
      'maps/maps_geocode',
      'maps/maps_reverse_geocode',
      'maps/maps_search_places',
      'maps/maps_place_details',
      'maps/maps_distance_matrix',
      'maps/maps_elevation',
      'maps/maps_directions',
    ]
  })
  return text
})