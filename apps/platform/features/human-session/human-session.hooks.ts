import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { atom, useAtom } from 'jotai'

import { selectUserData } from 'features/_user/selectors/user.selectors'
import { getHumanSessionServerFn, startHumanSessionServerFn } from 'server/human-session.serverfn'

export type HumanSessionStatus = 'unknown' | 'checking' | 'verified' | 'failed'

// Keyed by user so a login with another account checks again
const humanSessionAtom = atom<{ userId?: number; status: HumanSessionStatus }>({
  status: 'unknown',
})

// Shared by every gate mounted at once, and by StrictMode's double effect
let pending: Promise<boolean> | null = null

// Cookie probe first, the captcha only runs when this browser session has not passed one yet
const verifyHumanSession = () => {
  pending ??= (async () => {
    try {
      return (await getHumanSessionServerFn()) || (await startHumanSessionServerFn())
    } catch (e) {
      console.warn('Human session verification failed', e)
      return false
    } finally {
      pending = null
    }
  })()
  return pending
}

/** Whether the logged user passed the captcha in this browser session, once for every feature */
export function useHumanSession() {
  const userId = useSelector(selectUserData)?.id
  const [session, setSession] = useAtom(humanSessionAtom)
  const status = session.userId === userId ? session.status : 'unknown'

  const ensure = useCallback(async () => {
    setSession({ userId, status: 'checking' })
    const verified = await verifyHumanSession()
    setSession({ userId, status: verified ? 'verified' : 'failed' })
    return verified
  }, [userId, setSession])

  return { status, ensure }
}
