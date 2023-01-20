import { NextApiRequest } from 'next'
import { OAuthConfig, OAuthUserConfig, TokenEndpointHandler } from 'next-auth/providers'

export type OAuthProfileData = {
  id: string
  firstName: string
  lastName: string
  email: string
  photo: string
  language: string
  type: string
}
interface GFWOAuthProfile extends Record<string, any> {
  data: OAuthProfileData
  iat: number
  exp: number
  aud: 'gfw'
  iss: 'gfw'
}
type GFWOAuthConfig = {
  gatewayUrl: URL
  callbackUrl: URL
  req: NextApiRequest
  // requestUserInfo?: boolean
}

export function GFWProvider<P extends GFWOAuthProfile>(
  options: Omit<OAuthUserConfig<P>, 'clientSecret' | 'clientId'> & {
    gfw: GFWOAuthConfig
  }
): OAuthConfig<P> {
  const { gatewayUrl, callbackUrl, req } = options?.gfw || {}
  const config: OAuthConfig<P> = {
    id: 'gfw',
    name: 'GlobalFishingWatch SSO',
    type: 'oauth',
    authorization: {
      url: `${gatewayUrl.toString()}/auth`,
      params: {
        client: 'gfw',
        callback: `${callbackUrl.protocol}//${callbackUrl.host}${callbackUrl.pathname}/api/auth/callback/gfw`,
      },
    },
    idToken: true,
    token: {
      url: `${gatewayUrl}/auth/token`,
      async request({ provider }) {
        const url = new URL(`${(provider.token as TokenEndpointHandler).url}`)
        url.searchParams.append('access-token', `${req.query['access-token']}`)
        const response: any = await fetch(url).then((res) => res.json())
        const tokens: any = {
          token: response?.token,
          refresh_token: response?.refreshToken,
          id_token: response?.token,
        }
        return { tokens }
      },
    },
    async profile(profile) {
      return {
        id: profile.data.id,
        name: profile.data.firstName + ' ' + profile.data.lastName,
        email: profile.data.email ?? '',
        image: profile.data.photo ?? '',
      }
    },
    ...options,
    clientId: 'gfw',
  }
  // if (requestUserInfo) {
  //   config.userinfo = {
  //     url: `${gatewayUrl}/auth/me`,
  //     async request({ tokens, provider }) {
  //       const url = new URL(`${(provider.userinfo as TokenEndpointHandler).url}`)
  //       return await fetch(url, {
  //         headers: { Authorization: `Bearer ${tokens['token']}` },
  //       }).then((res) => res.json())
  //     },
  //   }
  // }
  return config
}
export default GFWProvider
