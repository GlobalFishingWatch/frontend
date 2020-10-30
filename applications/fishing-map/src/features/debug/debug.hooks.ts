import { useEffect, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectActive, toggleDebugMenu } from 'features/debug/debug.slice'

type DebugMenu = {
  debugActive: boolean
  dispatchToggleDebugMenu: () => void
}

const useDebugMenu = (): DebugMenu => {
  const dispatch = useDispatch()
  const numTimesDebugKeyDown = useRef(0)
  const debugKeyDownInterval = useRef<number>(0)
  const dispatchToggleDebugMenu = useCallback(() => {
    dispatch(toggleDebugMenu())
  }, [dispatch])
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'd') {
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
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown])
  const debugActive = useSelector(selectActive)
  return { debugActive, dispatchToggleDebugMenu }
}

export default useDebugMenu
