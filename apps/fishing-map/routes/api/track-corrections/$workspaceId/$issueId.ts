import { createFileRoute } from '@tanstack/react-router'

import type {
  TrackCorrection,
  TrackCorrectionComment,
} from 'features/track-correction/track-correction.slice'

export type ErrorAPIResponse = {
  success: boolean
  message: string
}

export type GetIssueDetailAPIResponse = TrackCorrection

export type APIResponse = ErrorAPIResponse | GetIssueDetailAPIResponse

export const Route = createFileRoute('/api/track-corrections/$workspaceId/$issueId')({
  server: {
    handlers: {
      POST: async ({
        request,
        params,
      }: {
        request: Request
        params: { workspaceId: string; issueId: string }
      }) => {
        const { workspaceId, issueId } = params
        const body = await request.json()

        const requiredFields = [
          'issueId',
          'comment',
          'user',
          'date',
          'datasetVersion',
          'marksAsResolved',
        ]

        const missingFields = requiredFields.filter((field) => !(field in body.commentBody))

        if (missingFields.length > 0) {
          return Response.json(
            {
              success: false,
              message: `Missing required fields: ${missingFields.join(', ')}`,
            },
            { status: 400 }
          )
        }

        const { addCommentToIssue } = await import('server/api/track-corrections/post-comment')
        const { getWorkspaceIssueDetail } = await import('server/api/track-corrections/get-one')
        await addCommentToIssue(issueId, body.commentBody as TrackCorrectionComment, workspaceId)
        await getWorkspaceIssueDetail(workspaceId, issueId)

        return Response.json({
          success: true,
          message: 'Comment added successfully',
        })
      },
    },
  },
})
