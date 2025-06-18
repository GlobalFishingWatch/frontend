import type { NextApiRequest, NextApiResponse } from 'next'

import type {
  TrackCorrection,
  TrackCorrectionComment,
} from 'features/track-correction/track-correction.slice'
import { getWorkspaceIssues } from 'pages/api/track-corrections/[workspaceId]/_issues/get-all'
import { addCommentToIssue } from 'pages/api/track-corrections/[workspaceId]/_issues/post-comment'
import { createNewIssue } from 'pages/api/track-corrections/[workspaceId]/_issues/post-new'

export type ErrorAPIResponse = {
  success: boolean
  message: string
}

export type CreateIssueAPIResponse = TrackCorrection
export type GetAllIssuesAPIResponse = TrackCorrection[]

export type APIResponse = ErrorAPIResponse | GetAllIssuesAPIResponse | CreateIssueAPIResponse

const handlers = {
  GET: async (req: NextApiRequest, res: NextApiResponse<APIResponse>, workspaceId: string) => {
    const issues = await getWorkspaceIssues(workspaceId)
    return res.status(200).json(issues)
  },

  POST: async (req: NextApiRequest, res: NextApiResponse<APIResponse>, workspaceId: string) => {
    try {
      const body = req.body

      await createNewIssue(
        body.issueBody as TrackCorrection,
        body.commentBody as TrackCorrectionComment,
        workspaceId
      )
      return res.status(201).json(body.issueBody as TrackCorrection)
    } catch (error) {
      console.error('Error processing request:', error)
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIResponse>) {
  const { workspaceId } = req.query as { workspaceId: string }
  if (!workspaceId) {
    return res.status(400).json({
      success: false,
      message: 'Workspace ID is required',
    })
  }

  const handler = handlers[req.method as keyof typeof handlers]
  if (!handler) {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    })
  }

  return await handler(req, res, workspaceId)
}
