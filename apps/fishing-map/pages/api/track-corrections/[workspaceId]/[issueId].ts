import type { NextApiRequest, NextApiResponse } from 'next'

import type { TrackCorrection } from 'features/track-correction/track-correction.slice'
import { getWorkspaceIssueDetail } from 'pages/api/track-corrections/[workspaceId]/_issues/get-one'

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
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const issue = await getWorkspaceIssueDetail(workspaceId, issueId)
  return res.status(200).json(issue)
}
