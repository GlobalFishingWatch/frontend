import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { useAppSession } from '@/server/session'

// Login server function
export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    // Verify credentials (replace with your auth logic)
    const user = await authenticateUser(data.email, data.password)

    if (!user) {
      return { error: 'Invalid credentials' }
    }

    // Create session
    const session = await useAppSession()
    await session.update({
      userId: user.id,
      email: user.email,
    })

    // Redirect to protected area
    throw redirect({ to: '/dashboard' })
  })

// Logout server function
export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()
  await session.clear()
  throw redirect({ to: '/' })
})

// Get current user
export const getTokens = createServerFn({ method: 'GET' })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession(data)
    const userId = session.get('userId')

    if (!accessToken) {
      return null
    }

    if (!userId) {
      return null
    }

    return await getUserById(userId)
  })
