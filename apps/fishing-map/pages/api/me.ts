import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { GFW, withException, withGFWAuth } from '@globalfishingwatch/authjs-client'

export default withException(withGFWAuth(handler))

async function handler(_req: NextApiRequest, res: NextApiResponse, client: GFW) {
  try {
    const data = await client.get(`/auth/me`)
    res.status(200).json(data)
  } catch (e: any) {
    throw new ApiError(e.status, await e.message)
  }
}
