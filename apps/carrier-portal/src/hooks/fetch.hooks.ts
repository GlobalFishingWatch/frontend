import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import GFWAPI from '@globalfishingwatch/api-client'
import { userLogout } from 'redux-modules/user/user.actions'
import usePrevious from './previous.hooks'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: { status: number; message: string } | null
}
const defaultOptions = { debounce: 100 }
function useAbortableFetch<T>(url: string, options: any = defaultOptions): FetchState<T> {
  const prevUrl = usePrevious(url)
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  })
  const isMounted = useRef(false)
  const dispatch = useDispatch()
  useLayoutEffect(() => {
    isMounted.current = true
    return (): void => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (url && url !== prevUrl) {
      const controller = new AbortController()
      setState((state) => ({ ...state, loading: true }))

      GFWAPI.fetch<T>(url, { signal: controller.signal, ...options })
        .then((data) => {
          if (isMounted.current) {
            setState({ data, loading: false, error: null })
          }
        })
        .catch((error) => {
          if (isMounted.current && error.name !== 'AbortError') {
            setState((state) => ({ ...state, loading: false, error }))
          }
          if (error && error.status > 400 && error.status < 401) {
            dispatch(userLogout())
          }
        })
      return () => controller.abort()
    }
    // Only wants to update when url or options changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, options])

  return state
}

export default useAbortableFetch
