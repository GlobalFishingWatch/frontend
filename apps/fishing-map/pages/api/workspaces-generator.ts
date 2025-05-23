import { MastraClient } from '@mastra/client-js'
import type { NextApiRequest, NextApiResponse } from 'next'

const MASTRA_API_URL = process.env.NEXT_MASTRA_API_URL
const WORKSPACES_AGENT_ID = process.env.NEXT_WORKSPACES_AGENT_ID

export const mastra = new MastraClient({
  baseUrl: MASTRA_API_URL || 'http://localhost:4111',
})

const workspacesAgent = mastra.getAgent(WORKSPACES_AGENT_ID!)

export type Message = {
  message: string
}

type ApiError = {
  success: false
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message | ApiError>
) {
  if (!WORKSPACES_AGENT_ID || !workspacesAgent) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { message }: Message = req.body || {}

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message data is required',
      })
    }

    const response = await workspacesAgent.generate({
      messages: [message],
    })
    console.log('🚀 ~ response:', response)

    return res.status(200).json({
      error: '',
      message: response.text,
    })
  } catch (error: any) {
    console.log('🚀 ~ error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
}
