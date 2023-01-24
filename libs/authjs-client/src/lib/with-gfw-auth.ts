import { NextApiRequest, NextApiResponse } from 'next'
import { getToken, JWT } from 'next-auth/jwt'
import { GFW_API_GATEWAY, AUTH_SECRET } from './config'
import GFW from './gfw-client'

declare type GFWHandler<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  client: GFW
) => any | Promise<any>

export const withGFWAuth =
  (handler: GFWHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const token: JWT | null = await getToken({
      req,
      secret: AUTH_SECRET,
    })

    if (token?.bearerToken) {
      const client = new GFW({
        gatewayUrl: GFW_API_GATEWAY,
        bearerToken: token?.bearerToken as string,
        refreshToken: token?.refreshToken as string,
      })
      return handler(req, res, client)
    }

    return res.status(401).json({
      error: 'You must be sign in to view the protected content on this page.',
    })
  }
