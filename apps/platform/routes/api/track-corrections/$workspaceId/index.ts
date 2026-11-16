import { createFileRoute } from '@tanstack/react-router'

import type {
  TrackCorrection,
  TrackCorrectionComment,
} from 'features/_vessels/track-correction/track-correction.slice'

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
        const { unauthorizedResponse } = await import('server/api/utils/request')
        const { getRequestUser } = await import('server/user.server')
        if (!(await getRequestUser())) {
          return unauthorizedResponse()
        }
        const { workspaceId } = params
        const { getWorkspaceIssues } = await import('server/api/track-corrections/get-all')
        const issues = await getWorkspaceIssues(workspaceId)
        return Response.json(issues)
      },
      POST: async ({ request, params }: { request: Request; params: { workspaceId: string } }) => {
        const { isSameOrigin, forbiddenResponse, unauthorizedResponse } =
          await import('server/api/utils/request')
        if (!isSameOrigin(request)) {
          return forbiddenResponse()
        }
        const { getRequestUser, getUserFullName } = await import('server/user.server')
        const user = await getRequestUser()
        if (!user) {
          return unauthorizedResponse()
        }
        const { workspaceId } = params
        try {
          const body = await request.json()
          if (!body?.issueBody || !body?.commentBody) {
            return Response.json(
              { success: false, message: 'issueBody and commentBody are required' },
              { status: 400 }
            )
          }
          const { createNewIssue } = await import('server/api/track-corrections/post-new')
          // The verified identity wins over whatever the body claims
          const issueBody: TrackCorrection = { ...body.issueBody, userEmail: user.email }
          const commentBody: TrackCorrectionComment = {
            ...body.commentBody,
            user: getUserFullName(user),
          }
          await createNewIssue(issueBody, commentBody, workspaceId)
          return Response.json(issueBody, { status: 201 })
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
