import type { NextApiRequest, NextApiResponse } from 'next'

import type {
  TrackCorrection,
  TrackCorrectionComment,
} from 'features/track-correction/track-correction.slice'

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

  if (req.method === 'POST') {
    const body = req.body

    const requiredFields = [
      'issueId',
      'comment',
      'user',
      'date',
      'datasetVersion',
      'marksAsResolved',
    ]

    const missingFields = requiredFields.filter((field) => !(field in body))

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      })
    }

    await addCommentToIssue(issueId, body.commentBody as TrackCorrectionComment, workspaceId)
    // await getWorkspaceIssueDetail(workspaceId, issueId)

    return res.status(200).json({
      success: true,
      message: 'Comment added successfully',
    } as ErrorAPIResponse)
  } else {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' })
  }
}
