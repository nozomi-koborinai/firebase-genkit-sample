import { mcpServer } from 'genkitx-mcp'
import { ai } from '../../genkit'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import express from 'express'

export const genkitMCP = mcpServer(ai, { name: `genkitMCP`, version: `0.0.1` })

const app = express()

let transport: SSEServerTransport | null = null

app.get(`/sse`, (req, res) => {
  transport = new SSEServerTransport(`/messages`, res)
  genkitMCP.server!.connect(transport)
})

app.post(`/messages`, (req, res) => {
  if (transport) {
    transport.handlePostMessage(req, res)
  }
})

app.listen(3000)
