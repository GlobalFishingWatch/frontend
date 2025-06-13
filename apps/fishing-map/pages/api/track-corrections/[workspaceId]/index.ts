import type { NextApiRequest, NextApiResponse } from 'next'

import type { InfoCorrectionSendFormat } from 'features/vessel/vesselCorrection/VesselCorrection.types'
import { loadSpreadsheetDoc } from 'pages/api/_utils/spreadsheets'

export type ApiResponse = {
  success: boolean
  message: string
  data?: InfoCorrectionSendFormat
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === 'POST') {
    return res.status(200).json({
      success: false,
      message: 'TODO: form submit',
    })
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: false,
      message: 'TODO: get issues',
    })
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
  })
}
