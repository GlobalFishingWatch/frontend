import { UserData } from '@globalfishingwatch/api-types'
import { useSession } from '@tanstack/react-start/server'

export function getAppSession() {
  return useSession<{ user: UserData & { accessToken: string; refreshToken: string } }>({
    name: 'app-session',
    password: process.env.SESSION_SECRET!,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
    },
  })
}
