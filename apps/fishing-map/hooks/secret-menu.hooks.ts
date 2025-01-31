import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from 'reducers'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'

type DebugMenu = [boolean, () => void]

type SecretMenuProps = {
  key: string
  onToggle: () => any
  repeatNumber?: number
  selectMenuActive?: (state: RootState) => boolean
}

export const useSecretKeyboardCombo = ({ key, onToggle, repeatNumber = 7 }: SecretMenuProps) => {
  const gfwUser = useSelector(selectIsGFWUser)
  const numTimesDebugKeyDown = useRef(0)
  const debugKeyDownInterval = useRef<number>(0)

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event?.key?.toLocaleLowerCase() === key.toLocaleLowerCase()) {
        window.clearTimeout(debugKeyDownInterval.current)
        numTimesDebugKeyDown.current++
        debugKeyDownInterval.current = window.setTimeout(() => {
          numTimesDebugKeyDown.current = 0
        }, 2000)
      } else {
        numTimesDebugKeyDown.current = 0
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
  const dispatch = useAppDispatch()
  const dispatchToggleMenu = useCallback(() => {
    dispatch(onToggle())
  }, [dispatch, onToggle])
  useSecretKeyboardCombo({ key, onToggle: dispatchToggleMenu, repeatNumber })
  const menuActive = useSelector(selectMenuActive)
  return useMemo(() => [menuActive, dispatchToggleMenu], [dispatchToggleMenu, menuActive])
}

export default useSecretMenu
