import { NextApiRequest } from 'next'
import { OAuthConfig, OAuthUserConfig, TokenEndpointHandler } from 'next-auth/providers'

interface GFWProfile extends Record<string, any> {
  id: number
  type: string
  groups: string[]
  permissions: any[]
  email?: string
  firstName?: string
  lastName?: string
  photo?: string
  language?: string
  country?: string
  organization?: string
  organizationType?: string
  intendedUse?: any
  whoEndUsers?: string
  problemToResolve?: string
  pullingDataOtherAPIS?: string
  apiTerms?: string
}

export function GFWProvider<P extends GFWProfile>(
  options: Omit<OAuthUserConfig<P>, 'clientSecret' | 'clientId'> & {
    gfw: {
      gatewayUrl: URL
      callbackUrl: URL
      req: NextApiRequest
    }
  }
): OAuthConfig<P> {
  const {
    gfw: { gatewayUrl, callbackUrl, req },
  } = options
  return {
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
        const url = new URL(`${(<TokenEndpointHandler>provider.token).url}`)
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
    userinfo: {
      url: `${gatewayUrl}/auth/me`,
      async request({ tokens, provider }) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const url = new URL(`${(<TokenEndpointHandler>provider.userinfo).url}`)
        return await fetch(url, {
          headers: { Authorization: `Bearer ${tokens['token']}` },
        }).then((res) => res.json())
      },
    },
    async profile(profile) {
      return {
        id: `${profile.id}`,
        name: profile.firstName + ' ' + profile.lastName,
        email: profile.email,
        image: profile.photo,
      }
    },
    ...options,
    clientId: 'gfw',
  }
}
export default GFWProvider
