import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector, useStore } from 'react-redux'

import type { RootState } from 'reducers'
import type { AppDispatch, AppStore } from 'store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppStore = useStore.withTypes<AppStore>()
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
