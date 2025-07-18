import { useEffect, useRef } from 'react'

import { ROOT_DOM_ELEMENT } from 'data/config'

export const useDOMElement = (id = ROOT_DOM_ELEMENT) => {
  const domElement = useRef<HTMLElement>(undefined)

  useEffect(() => {
    domElement.current = document.getElementById(id) as HTMLElement
  }, [id])

  return domElement.current
}
