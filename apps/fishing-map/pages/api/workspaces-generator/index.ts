import { MastraClient } from '@mastra/client-js'
import type { StorageThreadType } from '@mastra/core'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getWorkspaceConfig } from 'server/api/workspaces-generator'

const MASTRA_API_URL = process.env.NEXT_MASTRA_API_URL
const WORKSPACES_AGENT_ID = process.env.NEXT_WORKSPACES_AGENT_ID

export const mastra = new MastraClient({
  baseUrl: MASTRA_API_URL || 'http://localhost:4111',
})

const workspacesAgent = mastra.getAgent(WORKSPACES_AGENT_ID!)

export type Message = {
  message: string
  threadId: string
  userId: number
}

export type WorkspaceGeneratorResponse =
  | {
      success: true
      message: string
      links?: { url: string; message: string }[]
      threadId: string
      error: '' // always empty string on success
    }
  | {
      success: false
      message?: undefined
      links?: undefined
      threadId?: undefined
      error: string
    }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WorkspaceGeneratorResponse>
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

    let thread: StorageThreadType | undefined
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
      try {
        thread = await memoryThread.get()
      } catch (e) {
        thread = { id: threadId } as StorageThreadType
      }
    }

    const response = await workspacesAgent.generate({
      messages: [message],
      threadId: thread?.id,
      resourceId,
    })

    const apiResponse: WorkspaceGeneratorResponse = {
      success: true,
      message: response.text,
      threadId: thread?.id,
      error: '',
    }
    try {
      if (response.text.startsWith('```json')) {
        const jsonString = response.text.replace('```json\n', '').replace('\n```', '').trim()
        const parsedResponse = JSON.parse(jsonString)
        const { label, links } = (await getWorkspaceConfig(parsedResponse)) || {}
        if (links) {
          apiResponse.links = links
        }
        if (label) {
          apiResponse.message = label
        } else {
          apiResponse.message = 'Please be more specific'
        }
      }
    } catch (_: any) {
      apiResponse.links = undefined
    }
    return res.status(200).json(apiResponse)
  } catch (error: any) {
    console.log('error:', error)
    return res.status(500).json({
      success: false,
      error: error?.message || error || 'Internal server error',
    })
  }
}
