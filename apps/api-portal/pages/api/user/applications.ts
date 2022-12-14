import { NextApiRequest, NextApiResponse } from 'next'
import { getToken, JWT } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'

const NEXT_PUBLIC_API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY

export interface GFWJWT extends JWT {
  gfw?: {
    accessToken?: string
    refreshToken?: string
  }
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token: GFWJWT | null = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const session = await getSession()
  console.log(session)
  const { query } = req

  if (token?.gfw?.accessToken) {
    try {
      const url = new URL(
        `${NEXT_PUBLIC_API_GATEWAY}/v2/auth/user-applications?${new URLSearchParams(<any>query)}`
      )
      const results = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token?.gfw?.accessToken}`,
        },
      })
      const data = await results.json()
      return res.status(results.status).json(data)
    } catch (e: any) {
      return res.status(400).json({
        status: e.message,
      })
    }
  }

  return res.status(401).json({
    error: 'You must be sign in to view the protected content on this page.',
  })
}
