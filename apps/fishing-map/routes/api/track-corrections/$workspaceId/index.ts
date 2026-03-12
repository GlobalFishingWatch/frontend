import { createFileRoute } from '@tanstack/react-router'

import type {
  TrackCorrection,
  TrackCorrectionComment,
} from 'features/track-correction/track-correction.slice'

export type ErrorAPIResponse = {
  success: boolean
  message: string
}

export type CreateIssueAPIResponse = TrackCorrection
export type GetAllIssuesAPIResponse = TrackCorrection[]

export type APIResponse = ErrorAPIResponse | GetAllIssuesAPIResponse | CreateIssueAPIResponse

export const Route = createFileRoute('/api/track-corrections/$workspaceId/')({
  server: {
    handlers: {
      GET: async ({ params }: { params: { workspaceId: string } }) => {
        const { workspaceId } = params
        const { getWorkspaceIssues } = await import('server/api/track-corrections/get-all')
        const issues = await getWorkspaceIssues(workspaceId)
        return Response.json(issues)
      },
      POST: async ({ request, params }: { request: Request; params: { workspaceId: string } }) => {
        const { workspaceId } = params
        try {
          const body = await request.json()
          const { createNewIssue } = await import('server/api/track-corrections/post-new')
          await createNewIssue(
            body.issueBody as TrackCorrection,
            body.commentBody as TrackCorrectionComment,
            workspaceId
          )
          return Response.json(body.issueBody as TrackCorrection, { status: 201 })
        } catch (error) {
          console.error('Error processing request:', error)
          return Response.json(
            {
              success: false,
              message: error instanceof Error ? error.message : 'An unknown error occurred',
            },
            { status: 500 }
          )
        }
      },
    },
  },
})
