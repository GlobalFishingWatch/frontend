import type { NextApiRequest, NextApiResponse } from 'next'

import type { TrackCorrection } from 'features/track-correction/track-correction.slice'
import { getWorkspaceIssues } from 'pages/api/track-corrections/[workspaceId]/_issues/get-all'

export type ErrorAPIResponse = {
  success: boolean
  message: string
}

export type CreateIssueAPIResponse = TrackCorrection
export type GetAllIssuesAPIResponse = TrackCorrection[]

export type APIResponse = ErrorAPIResponse | GetAllIssuesAPIResponse | CreateIssueAPIResponse

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIResponse>) {
  const { workspaceId } = req.query as { workspaceId: string }
  if (!workspaceId) {
    return res.status(400).json({
      success: false,
      message: 'Workspace ID is required',
    })
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      success: false,
      message: 'TODO: form submit',
    })
  }

  if (req.method === 'GET') {
    const issues = await getWorkspaceIssues(workspaceId as string)
    return res.status(200).json(issues)
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
  })
}
