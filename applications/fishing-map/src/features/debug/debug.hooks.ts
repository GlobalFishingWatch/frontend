import { useEffect, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectDebugActive, toggleDebugMenu } from 'features/debug/debug.slice'
import { isGFWUser } from 'features/user/user.slice'

type DebugMenu = {
  debugActive: boolean
  dispatchToggleDebugMenu: () => void
}

const useDebugMenu = (): DebugMenu => {
  const dispatch = useDispatch()
  const gfwUser = useSelector(isGFWUser)
  const numTimesDebugKeyDown = useRef(0)
  const debugKeyDownInterval = useRef<number>(0)

  const dispatchToggleDebugMenu = useCallback(() => {
    dispatch(toggleDebugMenu())
  }, [dispatch])

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'd' || event.key === 'D') {
        window.clearTimeout(debugKeyDownInterval.current)
        numTimesDebugKeyDown.current++
        debugKeyDownInterval.current = window.setTimeout(() => {
          numTimesDebugKeyDown.current = 0
        }, 2000)
      }
      if (numTimesDebugKeyDown.current === 7) {
        dispatchToggleDebugMenu()
        numTimesDebugKeyDown.current = 0
      }
    },
    [dispatchToggleDebugMenu, numTimesDebugKeyDown]
  )

  useEffect(() => {
    if (gfwUser) {
      document.addEventListener('keydown', onKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [gfwUser, onKeyDown])

  const debugActive = useSelector(selectDebugActive)
  return { debugActive, dispatchToggleDebugMenu }
}

export default useDebugMenu
