import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import { AUTH_SECRET, GFW, GFWProvider, GFW_API_GATEWAY } from '@globalfishingwatch/authjs-client'
import { BASE_PATH, IS_PRODUCTION } from 'data/config'

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(
  req: NextApiRequest & { protocol: string },
  res: NextApiResponse
) {
  const callbackUrl = new URL(
    process.env.NEXTAUTH_URL ?? `${req.protocol}://${req.headers.location}${BASE_PATH}`
  )

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers
    providers: [GFWProvider({ gfw: { callbackUrl, req } })],
    // The secret should be set to a reasonably long random string.
    // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
    // a separate secret is defined explicitly for encrypting the JWT.
    secret: AUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
    jwt: {
      // A secret to use for key generation (you should set this explicitly)
      secret: AUTH_SECRET,
      // Set to true to use encryption (default: false)
      // encryption: true,
    },
    // Callbacks are asynchronous functions you can use to control what happens
    // when an action is performed.
    // https://next-auth.js.org/configuration/callbacks
    callbacks: {
      // async signIn({ user, account, profile, email, credentials }) { return true },
      // async redirect({ url, baseUrl }) { return baseUrl },
      async session({ session, token }) {
        // console.log({ session })
        return {
          ...session,
          bearerToken: token.bearerToken,
          refreshToken: token.refreshToken,
          exp: token.exp,
          user: session.user,
        }
      },
      async jwt({ token, user, account = {} }: any) {
        let result: any = token
        if (account && user) {
          if (account?.token) {
            result.bearerToken = account.token
          }

          if (account?.refresh_token) {
            result.refreshToken = account.refresh_token
          }
          result.user = user
        }
        // Access token has expired, try to update it
        if (Date.now() / 1000 >= result.exp) {
          try {
            const client = new GFW({
              gatewayUrl: `${GFW_API_GATEWAY}`,
              bearerToken: `${token?.bearerToken}`,
              refreshToken: `${token?.refreshToken}`,
            })
            const newToken = await client.refreshToken()

            // Decode token to update expiration
            const { exp } = JSON.parse(
              Buffer.from(`${newToken.token}`.split('.')[1], 'base64').toString()
            )
            result = {
              ...result,
              bearerToken: newToken.token,
              refreshToken: newToken.refreshToken ?? result.refreshToken,
              exp,
            }
          } catch (e) {
            console.error(e)
            result = {
              ...result,
              error: 'RefreshAccessTokenError',
            }
          }
        }

        return result
      },
    },
    // Events are useful for logging
    // https://next-auth.js.org/configuration/events
    events: {
      signOut: ({ token }) => {
        if (token.refreshToken) {
          // Logout from GFW Api too when the user closes the session
          GFW.logout(`${GFW_API_GATEWAY}`, `${token.refreshToken}`)
        }
      },
    },
    // Enable debug messages in the console if you are having problems
    debug: !IS_PRODUCTION,
  })
}
