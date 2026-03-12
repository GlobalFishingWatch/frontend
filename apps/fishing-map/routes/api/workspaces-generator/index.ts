import { MastraClient } from '@mastra/client-js'
import type { StorageThreadType } from '@mastra/core'
import { createFileRoute } from '@tanstack/react-router'
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
      error: ''
    }
  | {
      success: false
      message?: undefined
      links?: undefined
      threadId?: undefined
      error: string
    }

export const Route = createFileRoute('/api/workspaces-generator/')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        if (!WORKSPACES_AGENT_ID) {
          console.error('WORKSPACES_AGENT_ID environment variable is not set')
          return Response.json(
            { success: false, error: 'Agent ID not configured' },
            { status: 500 }
          )
        }

        if (!MASTRA_API_URL) {
          console.error('NEXT_MASTRA_API_URL environment variable is not set')
          return Response.json(
            { success: false, error: 'Mastra API URL not configured' },
            { status: 500 }
          )
        }

        if (!workspacesAgent) {
          console.error('Failed to initialize workspaces agent with ID:', WORKSPACES_AGENT_ID)
          return Response.json(
            { success: false, error: 'Failed to initialize agent' },
            { status: 500 }
          )
        }

        const body = await request.json().catch(() => ({}))
        const { message, threadId, userId }: Message = body || {}

        if (!message) {
          return Response.json(
            { success: false, error: 'Message data is required' },
            { status: 400 }
          )
        }

        try {
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
            } catch {
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
          } catch {
            apiResponse.links = undefined
          }
          return Response.json(apiResponse)
        } catch (error: any) {
          console.log('error:', error)
          return Response.json(
            {
              success: false,
              error: error?.message || error || 'Internal server error',
            },
            { status: 500 }
          )
        }
      },
    },
  },
})
