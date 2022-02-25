import { useEffect, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isGFWUser } from 'features/user/user.slice'
import { RootState } from 'store'

type DebugMenu = [boolean, () => void]

type SecretMenuProps = {
  key: string
  onToggle: () => void
  repeatNumber?: number
  selectMenuActive?: (state: RootState) => boolean
}

export const useSecretKeyboardCombo = ({
  key,
  onToggle,
  repeatNumber = 7,
}: SecretMenuProps) => {
  const gfwUser = useSelector(isGFWUser)
  const numTimesDebugKeyDown = useRef(0)
  const debugKeyDownInterval = useRef<number>(0)


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
        onToggle()
        numTimesDebugKeyDown.current = 0
      }
    },
    [onToggle, key, repeatNumber]
  )

  useEffect(() => {
    if (gfwUser) {
      document.addEventListener('keydown', onKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [gfwUser, onKeyDown])
}


const useSecretMenu = ({
  key,
  onToggle,
  repeatNumber,
  selectMenuActive = (state: RootState) => false,
}: SecretMenuProps): DebugMenu => {
  const dispatch = useDispatch()
  const dispatchToggleMenu = useCallback(() => {
    dispatch(onToggle())
  }, [dispatch, onToggle])
  useSecretKeyboardCombo({ key, onToggle: dispatchToggleMenu, repeatNumber })
  const menuActive = useSelector(selectMenuActive)
  return [menuActive, dispatchToggleMenu]
}

export default useSecretMenu 
