import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import { GFW, GFWProvider } from '@globalfishingwatch/authjs-client'
import { BASE_PATH } from 'data/config'

const GFW_API_GATEWAY =
  process.env.NEXT_PUBLIC_API_GATEWAY ?? 'https://gateway.api.dev.globalfishingwatch.org'

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const callbackUrl = new URL(process.env.NEXTAUTH_URL ?? `http://localhost:3003/${BASE_PATH}`)

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers
    providers: [
      GFWProvider({
        gfw: {
          callbackUrl,
          gatewayUrl: new URL(GFW_API_GATEWAY),
          req,
        },
      }),
    ],
    // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
    // https://next-auth.js.org/configuration/databases
    //
    // Notes:
    // * You must install an appropriate node_module for your database
    // * The Email provider requires a database (OAuth providers do not)
    // database: process.env.DATABASE_URL,

    // The secret should be set to a reasonably long random string.
    // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
    // a separate secret is defined explicitly for encrypting the JWT.
    secret: process.env.NEXTAUTH_SECRET,

    session: {
      // Use JSON Web Tokens for session instead of database sessions.
      // This option can be used with or without a database for users/accounts.
      // Note: `strategy` should be set to 'jwt' if no database is used.
      strategy: 'jwt',

      // Seconds - How long until an idle session expires and is no longer valid.
      // maxAge: 30 * 24 * 60 * 60, // 30 days

      // Seconds - Throttle how frequently to write to database to extend a session.
      // Use it to limit write operations. Set to 0 to always update the database.
      // Note: This option is ignored if using JSON Web Tokens
      // updateAge: 24 * 60 * 60, // 24 hours
    },

    // JSON Web tokens are only used for sessions if the `strategy: 'jwt'` session
    // option is set - or by default if no database is specified.
    // https://next-auth.js.org/configuration/options#jwt
    jwt: {
      // A secret to use for key generation (you should set this explicitly)
      secret: process.env.NEXTAUTH_SECRET,
      // Set to true to use encryption (default: false)
      // encryption: true,
      // You can define your own encode/decode functions for signing and encryption
      // if you want to override the default behaviour.
      // encode: async ({ secret, token, maxAge }) => {},
      // decode: async ({ secret, token, maxAge }) => {},
    },

    // You can define custom pages to override the built-in ones. These will be regular Next.js pages
    // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
    // The routes shown here are the default URLs that will be used when a custom
    // pages is not specified for that route.
    // https://next-auth.js.org/configuration/pages
    pages: {
      // signIn: '/auth/signin',  // Displays signin buttons
      // signOut: '/auth/signout', // Displays form with sign out button
      // error: '/auth/error', // Error code passed in query string as ?error=
      // verifyRequest: '/auth/verify-request', // Used for check email page
      // newUser: null // If set, new users will be directed here on first sign in
    },

    // Callbacks are asynchronous functions you can use to control what happens
    // when an action is performed.
    // https://next-auth.js.org/configuration/callbacks
    callbacks: {
      // async signIn({ user, account, profile, email, credentials }) { return true },
      // async redirect({ url, baseUrl }) { return baseUrl },
      async session({ session, token, user }) {
        // console.log({ session })
        return {
          ...session,
          bearerToken: token.bearerToken,
          refreshToken: token.refreshToken,
          exp: token.exp,
          gfwuser: token.user ?? null,
        }
      },
      async jwt({ token, user, account = {}, profile, isNewUser }: any) {
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
      signOut: ({ session, token }) => {
        if (token.refreshToken) {
          // Logout from GFW Api too when the user closes the session
          GFW.logout(`${GFW_API_GATEWAY}`, `${token.refreshToken}`)
        }
      },
    },

    // Enable debug messages in the console if you are having problems
    debug: true,
  })
}
