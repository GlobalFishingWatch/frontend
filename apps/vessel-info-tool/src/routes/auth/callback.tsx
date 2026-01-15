import { createFileRoute, redirect } from '@tanstack/react-router'
import { loginFn } from '@/server/auth'
import { getAppSession } from '@/server/session'

export const Route = createFileRoute('/auth/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const authorizationCode = url.searchParams.get('access-token')
        console.log('🚀 ~ authorizationCode:', authorizationCode)

        if (authorizationCode == null) {
          throw redirect({ to: '/login-error', replace: true })
        }

        const session = await getAppSession()

        try {
          const sessionData = await loginFn({
            data: { accessToken: authorizationCode },
          })
          await session.clear()
          await session.update(sessionData)
        } catch (error) {
          console.log('🚀 ~ error:', error)
          await session.clear()
          throw redirect({ to: '/login-error', replace: true })
        }

        throw redirect({ to: '/', replace: true })
      },
    },
  },
})
