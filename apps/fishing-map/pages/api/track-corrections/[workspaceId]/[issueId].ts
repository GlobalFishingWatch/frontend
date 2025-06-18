import type { NextApiRequest, NextApiResponse } from 'next'

import type {
  TrackCorrection,
  TrackCorrectionComment,
} from 'features/track-correction/track-correction.slice'
import { getWorkspaceIssueDetail } from 'pages/api/track-corrections/[workspaceId]/_issues/get-one'

import { addCommentToIssue } from './_issues/post-comment'

export type ErrorAPIResponse = {
  success: boolean
  message: string
}

export type GetIssueDetailAPIResponse = TrackCorrection

export type APIResponse = ErrorAPIResponse | GetIssueDetailAPIResponse

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIResponse>) {
  const { workspaceId, issueId } = req.query as { workspaceId: string; issueId: string }

  if (!workspaceId || !issueId) {
    return res
      .status(400)
      .json({ success: false, message: 'Workspace ID and issue ID are required' })
  }

  if (req.method !== 'GET') {
    const body = req.body

    await addCommentToIssue(issueId, body.commentBody as TrackCorrectionComment, workspaceId)
    return res.status(200).json({
      success: true,
      message: 'Comment added successfully',
    } as ErrorAPIResponse)
  }

  const issue = await getWorkspaceIssueDetail(workspaceId, issueId)
  return res.status(200).json(issue)
}
