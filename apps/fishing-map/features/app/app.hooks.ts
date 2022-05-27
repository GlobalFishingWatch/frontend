import { useEffect, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export function usePageVisibility() {
  const getIsDocumentVisible = () => document.visibilityState === 'visible'
  const [isVisible, setIsVisible] = useState(getIsDocumentVisible())
  const [firstTimeVisible, setFirstTimeVisible] = useState(false)
  const onVisibilityChange = () => setIsVisible(getIsDocumentVisible())

  useEffect(() => {
    if (isVisible && !firstTimeVisible) {
      setFirstTimeVisible(true)
    }
  }, [isVisible, firstTimeVisible])

  useEffect(() => {
    document.addEventListener('visibilitychange', onVisibilityChange, false)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isVisible, firstTimeVisible }
}
