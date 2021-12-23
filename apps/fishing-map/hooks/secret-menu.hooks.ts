import { useEffect, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isGFWUser } from 'features/user/user.slice'
import { RootState } from 'store'

type DebugMenu = [boolean, () => void]

type SecretMenuProps = {
  key: string
  repeatNumber?: number
  selectMenuActive: (state: RootState) => boolean
  onToggle: () => void
}

const useSecretMenu = ({
  key,
  onToggle,
  repeatNumber = 7,
  selectMenuActive,
}: SecretMenuProps): DebugMenu => {
  const dispatch = useDispatch()
  const gfwUser = useSelector(isGFWUser)
  const menuActive = useSelector(selectMenuActive)
  const numTimesDebugKeyDown = useRef(0)
  const debugKeyDownInterval = useRef<number>(0)

  const dispatchToggleMenu = useCallback(() => {
    dispatch(onToggle())
  }, [dispatch, onToggle])

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key.toLocaleLowerCase() === key.toLocaleLowerCase()) {
        window.clearTimeout(debugKeyDownInterval.current)
        numTimesDebugKeyDown.current++
        debugKeyDownInterval.current = window.setTimeout(() => {
          numTimesDebugKeyDown.current = 0
        }, 2000)
      }
      if (numTimesDebugKeyDown.current === repeatNumber) {
        dispatchToggleMenu()
        numTimesDebugKeyDown.current = 0
      }
    },
    [dispatchToggleMenu, key, repeatNumber]
  )

  useEffect(() => {
    if (gfwUser) {
      document.addEventListener('keydown', onKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [gfwUser, onKeyDown])

  return [menuActive, dispatchToggleMenu]
}

export default useSecretMenu
