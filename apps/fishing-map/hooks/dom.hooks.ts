import { useEffect, useState } from 'react'

import { ROOT_DOM_ELEMENT } from 'data/config'

export const useDOMElement = (id = ROOT_DOM_ELEMENT) => {
  const [element, setElement] = useState<HTMLElement | undefined>(undefined)

  useEffect(() => {
    setElement(document.getElementById(id) as HTMLElement)
  }, [id])

  return element
}
