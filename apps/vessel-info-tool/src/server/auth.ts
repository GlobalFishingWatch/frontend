import { getAppSession } from '@/server/session'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { redirect } from '@tanstack/react-router'
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
      user: {
        ...user,
        accessToken: accessToken,
        refreshToken: '',
      },
    })

    return user
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await getAppSession()

  if (session.data.user?.refreshToken) {
    try {
      await GFWAPI.logout()
    } catch (e) {
      console.warn('Error invalidating session on API', e)
    }
  }

  await session.clear()
  throw redirect({ to: '/' })
})
