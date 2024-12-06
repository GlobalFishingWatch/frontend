import { useEffect, useRef } from 'react'
import { ROOT_DOM_ELEMENT } from 'data/config'

export const useDOMElement = (id = ROOT_DOM_ELEMENT) => {
  const domElement = useRef<HTMLElement>()
  useEffect(() => {
    if (!domElement.current) {
      domElement.current = document.getElementById(id) as HTMLElement
    }
  }, [])

  return domElement.current
}
