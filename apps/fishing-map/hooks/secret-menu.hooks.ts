import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from 'reducers'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'

type DebugMenu = [boolean, () => void]

type SecretMenuProps =
  | {
      keys: string // sequence of keys, e.g., 'iaiaia'
      onToggle: () => any
      key?: never
      repeatNumber?: never
      selectMenuActive?: (state: RootState) => boolean
    }
  | {
      key: string
      repeatNumber?: number
      onToggle: () => any
      keys?: never
      selectMenuActive?: (state: RootState) => boolean
    }

export const useSecretKeyboardCombo = ({
  key,
  keys,
  onToggle,
  repeatNumber = 7,
}: SecretMenuProps) => {
  const gfwUser = useSelector(selectIsGFWUser)

  // Sequence mode
  const sequence = keys?.toLocaleLowerCase().split('') || null
  const currentIndex = useRef(0)
  const sequenceTimeout = useRef<number>(0)

  // Repeated key mode
  const repeatKey = key?.toLocaleLowerCase() || null
  const numTimesDebugKeyDown = useRef(0)
  const debugKeyDownInterval = useRef<number>(0)

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (sequence) {
        // Sequence mode
        if (event?.key?.toLocaleLowerCase() === sequence[currentIndex.current]) {
          window.clearTimeout(sequenceTimeout.current)
          currentIndex.current++
          if (currentIndex.current === sequence.length) {
            onToggle()
            currentIndex.current = 0
          } else {
            sequenceTimeout.current = window.setTimeout(() => {
              currentIndex.current = 0
            }, 2000)
          }
        } else {
          currentIndex.current = 0
        }
      } else if (repeatKey) {
        // Repeated key mode
        if (event?.key?.toLocaleLowerCase() === repeatKey) {
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
      }
    },
    [sequence, repeatKey, repeatNumber, onToggle]
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

const useSecretMenu = (props: SecretMenuProps): DebugMenu => {
  const dispatch = useAppDispatch()
  const dispatchToggleMenu = useCallback(() => {
    dispatch(props.onToggle())
  }, [dispatch, props])
  useSecretKeyboardCombo({ ...props, onToggle: dispatchToggleMenu })
  const menuActive = useSelector(props.selectMenuActive ?? (() => false))
  return useMemo(() => [menuActive, dispatchToggleMenu], [dispatchToggleMenu, menuActive])
}

export default useSecretMenu
