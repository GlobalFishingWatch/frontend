import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

export function useQueryParam<Param = unknown>(key: string): [Param, (value: Param) => void] {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const value = searchParams.get(key) as Param

  const setQueryParam = useCallback(
    (value: Param) => {
      router.replace(pathname + '?' + key + '=' + value)
    },
    [key, pathname, router]
  )

  return [value, setQueryParam]
}
