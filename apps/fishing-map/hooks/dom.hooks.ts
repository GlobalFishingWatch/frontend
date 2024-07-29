import { useEffect, useRef } from 'react'
import { ROOT_DOM_ELEMENT } from 'data/config'

export const useRootElement = () => {
  const domElement = useRef<HTMLElement>()
  useEffect(() => {
    if (!domElement.current) {
      domElement.current = document.getElementById(ROOT_DOM_ELEMENT) as HTMLElement
    }
  }, [])

  return domElement.current
}
