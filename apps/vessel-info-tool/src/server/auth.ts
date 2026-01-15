import { redirect } from '@tanstack/react-router'
import type { UserData } from '@globalfishingwatch/api-types'
import { getAppSession } from '@/server/session'
import { API_VERSION, GFWAPI } from '@globalfishingwatch/api-client'
import { API_GATEWAY } from '@globalfishingwatch/api-client'
import { AUTH_PATH } from '../../../../libs/api-client/src/config'
import { createServerFn } from '@tanstack/react-start'

interface LoginParams {
  accessToken?: string | null
  refreshToken?: string | null
}

export function loginRedirect() {
  const baseUrl = process.env.BASE_URL || 'http://local.globalfishingwatch.org:3000'
  const callback = `${baseUrl}/auth/callback`
  const loginUrl = GFWAPI.getLoginUrl(callback)

  throw redirect({
    href: loginUrl,
    replace: true,
  })
  // throw new Response(null, {
  //   status: 302,
  //   headers: {
  //     Location: loginUrl,
  //   },
  // })
}

async function fetchUser(token: string): Promise<UserData> {
  const res = await fetch(`${API_GATEWAY}/${API_VERSION}/${AUTH_PATH}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error('Error fetching user data')
  }

  return res.json()
}

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((data: LoginParams) => data)
  .handler(async ({ data }) => {
    const { accessToken } = data
    if (!accessToken) {
      throw new Error('Access token is required for login')
    }

    const user = await GFWAPI.login({ accessToken })

    const session = await getAppSession()
    await session.update({
      accessToken: accessToken,
      refreshToken: '',
      id: user.id,
      email: user.email,
      type: user.type,
    })

    return user
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await getAppSession()

  if (session.data.refreshToken) {
    try {
      await GFWAPI.logout()
    } catch (e) {
      console.warn('Error invalidating session on API', e)
    }
  }

  await session.clear()
  throw redirect({ to: '/' })
})

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getAppSession()
  console.log('🚀 ~ session:', session.data)

  if (!session.data.accessToken) {
    return null
  }

  try {
    const user = await GFWAPI.fetchUser()
    console.log('🚀 ~ fetched user in getCurrentUserFn:', user)
    return user
  } catch (e) {
    console.error(e)
    if (session.data.refreshToken) {
      try {
        const token = GFWAPI.refreshToken
        await session.update({
          refreshToken: token,
        })

        const user = await fetchUser(token)
        await session.update({
          id: user.id,
          email: user.email,
          type: user.type,
        })
        return user
      } catch (e) {
        console.error(e)
        await session.clear()
        return null
      }
    }

    await session.clear()
    return null
  }
})
