import { useCallback, useEffect, useState } from 'react'

export const useClickOutside = (callback: any) => {
  const [node, setNode] = useState<HTMLElement | null>(null)

  const ref = useCallback((node: any) => {
    setNode(node)
  }, [])

  const handleClickOutside = (event: MouseEvent) => {
    if (node && !node.contains(event.target as Node)) {
      callback()
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  })

  return ref
}
