import { mcpClient } from 'genkitx-mcp'
import { mapsApiKey } from '../../genkit'

export const mapsClient = mcpClient({
  name: 'maps',
  serverProcess: {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-google-maps'],
    env: {
      ...process.env as Record<string, string>,
      GOOGLE_MAPS_API_KEY: mapsApiKey.value(),
    },
  },
})