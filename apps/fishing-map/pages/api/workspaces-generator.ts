import { MastraClient } from '@mastra/client-js'
import type { StorageThreadType } from '@mastra/core'
import type { NextApiRequest, NextApiResponse } from 'next'

const MASTRA_API_URL = process.env.NEXT_MASTRA_API_URL
const WORKSPACES_AGENT_ID = process.env.NEXT_WORKSPACES_AGENT_ID

export const mastra = new MastraClient({
  baseUrl: MASTRA_API_URL || 'http://localhost:4111',
})

const workspacesAgent = mastra.getAgent(WORKSPACES_AGENT_ID!)

export type Message = {
  message: string
  threadId?: string
  userId: number
}

export type ResponseMessage = {
  message: string
  threadId?: string
}

type ApiError = {
  success: false
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseMessage | ApiError>
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
    const { message, threadId, userId }: Message = req.body || {}

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message data is required',
      })
    }

    let thread: StorageThreadType
    const resourceId = `workspace-generator-${userId}`
    if (!threadId) {
      thread = await mastra.createMemoryThread({
        title: `New Conversation with ${userId}`,
        metadata: { category: 'support' },
        resourceId,
        agentId: WORKSPACES_AGENT_ID,
        threadId: Date.now().toString(),
      })
    } else {
      const memoryThread = mastra.getMemoryThread(threadId, WORKSPACES_AGENT_ID!)
      thread = await memoryThread.get()
    }

    const response = await workspacesAgent.generate({
      messages: [message],
      threadId: thread.id,
      resourceId,
    })

    return res.status(200).json({
      error: '',
      message: response.text,
      threadId: thread.id,
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
}
